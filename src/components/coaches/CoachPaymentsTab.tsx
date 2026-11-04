import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  Coins,
  CreditCard,
  Plus,
  Layers,
} from 'lucide-react';
import {
  coachPaymentsApi,
  coachPaymentKeys,
  type CoachPaymentType,
} from '../../modules/coachDues';
import { coachesApi } from '../../modules/coaches';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { CoachPaymentsTable } from './CoachPaymentsTable';
import { RecordCoachPaymentModal } from './RecordCoachPaymentModal';

export const CoachPaymentsTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [filterCoach, setFilterCoach] = useState<SelectOption | null>(null);
  const [filterPaymentType, setFilterPaymentType] = useState<CoachPaymentType | ''>('');

  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: coachPaymentKeys.list({
      page,
      pageSize,
      coachId: filterCoach ? filterCoach.id : undefined,
      paymentType: filterPaymentType || undefined,
    }),
    queryFn: () =>
      coachPaymentsApi.getAll({
        page,
        pageSize,
        coachId: filterCoach ? filterCoach.id : undefined,
        paymentType: filterPaymentType || undefined,
      }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const { totalPaidSum, duePaymentSum, advanceSum } = useMemo(() => {
    let tot = 0;
    let dues = 0;
    let adv = 0;
    rawItems.forEach((p) => {
      tot += p.amount || 0;
      if (p.paymentType === 'DuePayment') dues += p.amount || 0;
      if (p.paymentType === 'Advance') adv += p.amount || 0;
    });
    return { totalPaidSum: tot, duePaymentSum: dues, advanceSum: adv };
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

  const hasActiveFilters = Boolean(filterCoach || filterPaymentType);

  const resetFilters = () => {
    setFilterCoach(null);
    setFilterPaymentType('');
    setPage(1);
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
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي المنصرف (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857' }}>
              {totalPaidSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>سداد مستحقات (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0369a1' }}>
              {duePaymentSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#fff7ed',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CreditCard size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>سلف منصرفة (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#c2410c' }}>
              {advanceSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#f1f5f9',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الحركات المسجلة</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
              {totalCount}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>حركة</span>
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
              placeholder="فلترة بالمدرب..."
            />
          </div>

          <div style={{ minWidth: 180 }}>
            <select
              className="form-input"
              value={filterPaymentType}
              onChange={(e) => {
                setFilterPaymentType(e.target.value as CoachPaymentType | '');
                setPage(1);
              }}
            >
              <option value="">جميع أنواع الحركات</option>
              <option value="DuePayment">سداد مستحقات</option>
              <option value="Advance">سلف نقدية</option>
            </select>
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
          onClick={() => setIsRecordModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} />
          <span>صرف سلفة / دفعة</span>
        </button>
      </div>

      {/* Table */}
      <CoachPaymentsTable
        items={rawItems}
        isLoading={isLoading}
        isError={isError}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />

      {/* Record Payment Modal */}
      <RecordCoachPaymentModal
        isOpen={isRecordModalOpen}
        initialCoachId={filterCoach ? filterCoach.id : undefined}
        onClose={() => setIsRecordModalOpen(false)}
        onSuccess={() => setIsRecordModalOpen(false)}
      />
    </>
  );
};

