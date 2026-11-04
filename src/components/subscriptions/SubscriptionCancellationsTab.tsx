import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  DollarSign,
  Ban,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import {
  subscriptionCancellationsApi,
  subscriptionCancellationKeys,
  type SubscriptionCancellation,
  type CancellationPaymentStatus,
} from '../../modules/subscriptionCancellations';
import { SubscriptionCancellationsTable } from './SubscriptionCancellationsTable';
import { RecordRefundPaymentModal } from './RecordRefundPaymentModal';

export const SubscriptionCancellationsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CancellationPaymentStatus | ''>('');
  const [refundingCancellation, setRefundingCancellation] =
    useState<SubscriptionCancellation | null>(null);

  const { data: cancellations = [], isLoading, isError } = useQuery({
    queryKey: subscriptionCancellationKeys.lists(),
    queryFn: subscriptionCancellationsApi.getAll,
  });

  const filteredItems = useMemo(() => {
    return cancellations.filter((item) => {
      const matchesStatus = statusFilter ? item.paymentStatus === statusFilter : true;
      if (!matchesStatus) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        item.subscriptionId.toString().includes(term) ||
        (item.reason && item.reason.toLowerCase().includes(term)) ||
        (item.notes && item.notes.toLowerCase().includes(term))
      );
    });
  }, [cancellations, searchTerm, statusFilter]);

  const { totalRefunds, totalPaidRefunds, totalRemainingRefunds, pendingCount } =
    useMemo(() => {
      let refunds = 0;
      let paid = 0;
      let rem = 0;
      let pending = 0;
      cancellations.forEach((c) => {
        refunds += c.refundAmount || 0;
        paid += c.paidRefundAmount || 0;
        rem += c.remainingRefundAmount || 0;
        if (c.remainingRefundAmount > 0) pending += 1;
      });
      return {
        totalRefunds: refunds,
        totalPaidRefunds: paid,
        totalRemainingRefunds: rem,
        pendingCount: pending,
      };
    }, [cancellations]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '1.1rem 1.25rem',
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
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ban size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الاشتراكات الملغاة</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
              {cancellations.length}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>اشتراك</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي التزامات الاسترداد</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#be123c' }}>
              {totalRefunds.toLocaleString('ar-EG')}{' '}
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
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>المبالغ المستردة للعملاء</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857' }}>
              {totalPaidRefunds.toLocaleString('ar-EG')}{' '}
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
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>المتبقي للصرف ({pendingCount})</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#c2410c' }}>
              {totalRemainingRefunds.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: 260, maxWidth: 380, flex: 1 }}>
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
              placeholder="البحث برقم الاشتراك أو السبب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingInlineStart: '2.25rem' }}
            />
          </div>

          <select
            className="form-input"
            style={{ width: 180 }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CancellationPaymentStatus | '')}
          >
            <option value="">جميع حالات الصرف</option>
            <option value="Unpaid">غير مدفوع</option>
            <option value="PartiallyPaid">مدفوع جزئياً</option>
            <option value="Paid">مسدد بالكامل</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          إجمالي السجلات: <strong>{filteredItems.length}</strong>
        </div>
      </div>

      {/* Cancellations Table */}
      <SubscriptionCancellationsTable
        items={filteredItems}
        isLoading={isLoading}
        isError={isError}
        searchTerm={searchTerm}
        onOpenRefundModal={setRefundingCancellation}
      />

      {/* Record Refund Modal */}
      <RecordRefundPaymentModal
        isOpen={Boolean(refundingCancellation)}
        cancellation={refundingCancellation}
        onClose={() => setRefundingCancellation(null)}
        onSuccess={() => setRefundingCancellation(null)}
      />
    </>
  );
};

