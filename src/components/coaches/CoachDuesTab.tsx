import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  Coins,
  DollarSign,
  Plus,
  Layers,
  Search,
} from 'lucide-react';
import {
  coachDuesApi,
  coachDueKeys,
  type CoachDue,
} from '../../modules/coachDues';
import { coachesApi } from '../../modules/coaches';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { CoachDuesTable } from './CoachDuesTable';
import { CreateCoachDueModal } from './CreateCoachDueModal';
import { RecordCoachPaymentModal } from './RecordCoachPaymentModal';

export const CoachDuesTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [filterCoach, setFilterCoach] = useState<SelectOption | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [payingDue, setPayingDue] = useState<CoachDue | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: coachDueKeys.list({
      page,
      pageSize,
      coachId: filterCoach ? filterCoach.id : undefined,
    }),
    queryFn: () =>
      coachDuesApi.getAll({
        page,
        pageSize,
        coachId: filterCoach ? filterCoach.id : undefined,
      }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems;
    const term = searchTerm.toLowerCase().trim();
    return rawItems.filter(
      (item) =>
        item.coachName.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
    );
  }, [rawItems, searchTerm]);

  const { totalAmountSum, totalPaidSum, totalRemainingSum } = useMemo(() => {
    let tot = 0;
    let paid = 0;
    let rem = 0;
    rawItems.forEach((d) => {
      tot += d.amount || 0;
      paid += d.paidAmount || 0;
      rem += d.remainingAmount || 0;
    });
    return { totalAmountSum: tot, totalPaidSum: paid, totalRemainingSum: rem };
  }, [rawItems]);

  const loadCoaches = async (query: string): Promise<SelectOption[]> => {
    const res = await coachesApi.getAll({
      search: query.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((c) => ({
      id: c.id,
      label: c.fullName,
      subLabel: `هاتف: ${c.phoneNumber}`,
      tag: 'مدرب',
    }));
  };

  const hasActiveFilters = Boolean(filterCoach || searchTerm);

  const resetFilters = () => {
    setFilterCoach(null);
    setSearchTerm('');
    setPage(1);
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '1rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  return (
    <>
      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي المستحقات (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#c2410c' }}>
              {totalAmountSum.toLocaleString('ar-EG')} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>المبالغ المسددة (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857' }}>
              {totalPaidSum.toLocaleString('ar-EG')} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>المتبقي قيد الصرف (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#b91c1c' }}>
              {totalRemainingSum.toLocaleString('ar-EG')} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي القيود المسجلة</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
              {totalCount} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>قيد</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '0.85rem 1.1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ minWidth: 220, flex: 1 }}>
            <AsyncSearchableSelect
              selectedItem={filterCoach}
              onChange={(val) => {
                setFilterCoach(val);
                setPage(1);
              }}
              loadOptions={loadCoaches}
              placeholder="فلترة بالمدرب المستحق..."
            />
          </div>

          <div style={{ position: 'relative', minWidth: 220, flex: 1 }}>
            <Search
              size={16}
              color="#94a3b8"
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                insetInlineStart: '0.75rem',
              }}
            />
            <input
              type="text"
              placeholder="البحث في بيان المستحق..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingInlineStart: '2.25rem' }}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-secondary"
              onClick={resetFilters}
              style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
            >
              إعادة تعيين
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn-add"
          onClick={() => setIsCreateModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} />
          <span>تسجيل مستحق جديد</span>
        </button>
      </div>

      {/* Dues Table */}
      <CoachDuesTable
        items={filteredItems}
        isLoading={isLoading}
        isError={isError}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onPayDue={setPayingDue}
      />

      {/* Create Coach Due Modal */}
      <CreateCoachDueModal
        isOpen={isCreateModalOpen}
        defaultCoachId={filterCoach ? filterCoach.id : undefined}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => setIsCreateModalOpen(false)}
      />

      {/* Record Payment Modal */}
      <RecordCoachPaymentModal
        isOpen={Boolean(payingDue)}
        initialCoachId={payingDue?.coachId}
        initialCoachDueId={payingDue?.id}
        initialRemainingAmount={payingDue?.remainingAmount}
        initialPaymentType="DuePayment"
        onClose={() => setPayingDue(null)}
        onSuccess={() => setPayingDue(null)}
      />
    </>
  );
};
