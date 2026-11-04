import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Plus,
  DollarSign,
  Coins,
  Clock,
  Percent,
} from 'lucide-react';
import {
  duePaymentsApi,
  duePaymentKeys,
  type DuePayment,
  type DueType,
  type DuePaymentStatus,
} from '../../modules/duePayments';
import { DuePaymentsTable } from './DuePaymentsTable';
import { CreateExternalDebtModal } from './CreateExternalDebtModal';
import { RecordDuePaymentModal } from './RecordDuePaymentModal';

export const DuePaymentsTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');
  const [dueTypeFilter, setDueTypeFilter] = useState<DueType | ''>('');
  const [statusFilter, setStatusFilter] = useState<DuePaymentStatus | ''>('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [payingDue, setPayingDue] = useState<DuePayment | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: duePaymentKeys.list({
      dueType: dueTypeFilter,
      status: statusFilter,
      page,
      pageSize,
    }),
    queryFn: () =>
      duePaymentsApi.getAll({
        dueType: dueTypeFilter,
        status: statusFilter,
        page,
        pageSize,
      }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems;
    const term = searchTerm.toLowerCase().trim();
    return rawItems.filter(
      (item) =>
        item.payerName.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
    );
  }, [rawItems, searchTerm]);

  // Aggregate metrics
  const { totalRemainingSum, totalPaidSum, unpaidCount, collectionRate } = useMemo(() => {
    let rem = 0;
    let paid = 0;
    let unpaid = 0;
    rawItems.forEach((d) => {
      rem += d.remainingAmount || 0;
      paid += d.paidAmount || 0;
      if (d.status !== 'Paid') unpaid += 1;
    });
    const total = rem + paid;
    const rate = total > 0 ? Math.round((paid / total) * 100) : 100;
    return {
      totalRemainingSum: rem,
      totalPaidSum: paid,
      unpaidCount: unpaid,
      collectionRate: rate,
    };
  }, [rawItems]);

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
      {/* Financial Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الديون المتبقية (الصفحة)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b91c1c' }}>
              {totalRemainingSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
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
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي المبالغ المحصلة</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857' }}>
              {totalPaidSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Percent size={16} />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>نسبة التحصيل</span>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7' }}>
              {collectionRate}%
            </span>
          </div>
          <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${collectionRate}%`,
                borderRadius: 999,
                backgroundColor:
                  collectionRate >= 75
                    ? '#10b981'
                    : collectionRate >= 40
                    ? '#f59e0b'
                    : '#ef4444',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#fff7ed',
              color: '#ff6b22',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>السجلات ذات المتبقي</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ff6b22' }}>
              {unpaidCount}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>سجل</span>
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
          <div style={{ position: 'relative', minWidth: 240, flex: 1 }}>
            <Search
              size={16}
              color="#94a3b8"
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '0.75rem' }}
            />
            <input
              type="text"
              placeholder="البحث باسم المدين أو البيان..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingInlineStart: '2.25rem' }}
            />
          </div>

          <select
            className="form-input"
            style={{ width: 160 }}
            value={dueTypeFilter}
            onChange={(e) => {
              setDueTypeFilter(e.target.value as DueType | '');
              setPage(1);
            }}
          >
            <option value="">جميع أنواع الديون</option>
            <option value="Subscription">اشتراكات</option>
            <option value="Sale">مبيعات POS</option>
            <option value="ExternalEntity">جهات خارجية</option>
          </select>

          <select
            className="form-input"
            style={{ width: 160 }}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as DuePaymentStatus | '');
              setPage(1);
            }}
          >
            <option value="">جميع حالات السداد</option>
            <option value="Unpaid">غير مدفوع</option>
            <option value="PartiallyPaid">مدفوع جزئياً</option>
            <option value="Paid">مسدد بالكامل</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-add"
          onClick={() => setIsCreateModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} />
          <span>تسجيل دين خارجي جديد</span>
        </button>
      </div>

      {/* Due Payments Table */}
      <DuePaymentsTable
        items={filteredItems}
        isLoading={isLoading}
        isError={isError}
        searchTerm={searchTerm}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onRecordPayment={(due) => setPayingDue(due)}
      />

      {/* Create External Debt Modal */}
      <CreateExternalDebtModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => setIsCreateModalOpen(false)}
      />

      {/* Record Payment Modal */}
      <RecordDuePaymentModal
        duePayment={payingDue}
        isOpen={Boolean(payingDue)}
        onClose={() => setPayingDue(null)}
        onSuccess={() => setPayingDue(null)}
      />
    </>
  );
};

