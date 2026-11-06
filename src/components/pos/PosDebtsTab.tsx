import { useMemo } from 'react';
import {
  Clock,
  Search,
  Coins,
  DollarSign,
  Percent,
} from 'lucide-react';
import type { PosDuePayment, DuePaymentStatus } from '../../modules/pos';
import { PosDebtsTable } from './PosDebtsTable';

interface PosDebtsTabProps {
  items: PosDuePayment[];
  totalCount: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: DuePaymentStatus | '';
  onStatusFilterChange: (status: DuePaymentStatus | '') => void;
  onPageChange: (page: number) => void;
  onOpenPaymentModal: (due: PosDuePayment) => void;
}

export const PosDebtsTab = ({
  items,
  totalCount,
  page,
  totalPages,
  isLoading,
  isError,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onPageChange,
  onOpenPaymentModal,
}: PosDebtsTabProps) => {
  const filteredItems = items.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      item.payerName.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  });

  const { totalRemainingSum, totalPaidSum, unpaidCount, collectionRate } = useMemo(() => {
    let rem = 0;
    let paid = 0;
    let count = 0;
    items.forEach((d) => {
      rem += d.remainingAmount || 0;
      paid += d.paidAmount || 0;
      if (d.status !== 'Paid') count += 1;
    });
    const total = rem + paid;
    const rate = total > 0 ? Math.round((paid / total) * 100) : 100;
    return { totalRemainingSum: rem, totalPaidSum: paid, unpaidCount: count, collectionRate: rate };
  }, [items]);

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
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الديون المتبقية</div>
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
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي المبالغ المسددة</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857' }}>
              {totalPaidSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
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
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>معدل التحصيل</span>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7' }}>
              {collectionRate}%
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: 6,
              borderRadius: 999,
              backgroundColor: '#f1f5f9',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${collectionRate}%`,
                backgroundColor: collectionRate >= 80 ? '#10b981' : collectionRate >= 50 ? '#f59e0b' : '#ef4444',
                borderRadius: 999,
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
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>فواتير غير مسددة بالكامل</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#c2410c' }}>
              {unpaidCount}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>فاتورة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search
              size={16}
              color="#94a3b8"
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                insetInlineEnd: '0.75rem',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="البحث باسم المدين أو البيان..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-input"
              style={{ paddingInlineEnd: '2.25rem' }}
            />
          </div>

          <select
            className="form-input"
            style={{ width: 180 }}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as DuePaymentStatus | '')}
          >
            <option value="">جميع الحالات</option>
            <option value="Unpaid">غير مدفوع</option>
            <option value="PartiallyPaid">مدفوع جزئياً</option>
            <option value="Paid">مسدد بالكامل</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          إجمالي السجلات: <strong>{totalCount}</strong>
        </div>
      </div>

      {/* Due Payments Table */}
      <PosDebtsTable
        items={filteredItems}
        totalCount={totalCount}
        page={page}
        totalPages={totalPages}
        isLoading={isLoading}
        isError={isError}
        searchTerm={searchTerm}
        onPageChange={onPageChange}
        onOpenPaymentModal={onOpenPaymentModal}
      />
    </>
  );
};
