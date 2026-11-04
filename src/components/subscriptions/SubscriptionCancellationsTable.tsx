import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Ticket,
} from 'lucide-react';
import {
  CANCELLATION_STATUS_MAP,
  type SubscriptionCancellation,
  type CancellationPaymentStatus,
} from '../../modules/subscriptionCancellations';

interface SubscriptionCancellationsTableProps {
  items: SubscriptionCancellation[];
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  onOpenRefundModal: (item: SubscriptionCancellation) => void;
}

const getStatusBadge = (status: CancellationPaymentStatus) => {
  const s = CANCELLATION_STATUS_MAP[status] || CANCELLATION_STATUS_MAP.Unpaid;
  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        padding: '0.2rem 0.65rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {s.text}
    </span>
  );
};

export const SubscriptionCancellationsTable = ({
  items,
  isLoading,
  isError,
  searchTerm,
  onOpenRefundModal,
}: SubscriptionCancellationsTableProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ whiteSpace: 'nowrap' }}>الاشتراك الملغي</th>
            <th style={{ whiteSpace: 'nowrap' }}>تاريخ الإلغاء</th>
            <th style={{ minWidth: 150 }}>سبب الإلغاء</th>
            <th style={{ whiteSpace: 'nowrap' }}>مبلغ الاسترداد</th>
            <th style={{ whiteSpace: 'nowrap' }}>المصروف</th>
            <th style={{ whiteSpace: 'nowrap' }}>المتبقي للصرف</th>
            <th style={{ whiteSpace: 'nowrap' }}>حالة الصرف</th>
            <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="spinner"
                    style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                  />
                  <span>جاري تحميل سجل الاشتراكات الملغاة...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={8} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل الإلغاءات، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={8} className="table-empty-row">
                <span>لا توجد اشتراكات ملغاة مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const cancellationDateFormatted = item.cancellationDate
                ? new Date(item.cancellationDate).toLocaleString('ar-EG', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : '—';

              return (
                <tr key={item.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: '6px',
                          backgroundColor: '#fef2f2',
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Ticket size={14} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.88rem' }}>
                          اشتراك #{item.subscriptionId}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          إلغاء قيد #{item.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#334155' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} color="#94a3b8" />
                      {cancellationDateFormatted}
                    </span>
                  </td>

                  <td style={{ fontSize: '0.85rem', color: '#334155', maxWidth: 220 }}>
                    <div style={{ fontWeight: 600 }}>{item.reason}</div>
                    {item.notes && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {item.notes}
                      </div>
                    )}
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 700, color: '#0d1527' }}>
                      {item.refundAmount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>
                      {item.paidRefundAmount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        color: item.remainingRefundAmount > 0 ? '#b91c1c' : '#16a34a',
                      }}
                    >
                      {item.remainingRefundAmount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>{getStatusBadge(item.paymentStatus)}</td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      {item.remainingRefundAmount > 0 ? (
                        <button
                          type="button"
                          className="btn-add"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.8rem',
                            gap: '0.35rem',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onClick={() => onOpenRefundModal(item)}
                        >
                          <DollarSign size={14} />
                          <span>صرف استرداد</span>
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: '#16a34a',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <CheckCircle2 size={14} />
                          <span>تم الصرف بالكامل</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

