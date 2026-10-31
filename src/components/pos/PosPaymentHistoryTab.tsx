import type { PosPaymentHistoryItem } from '../../modules/pos';

interface PosPaymentHistoryTabProps {
  items: PosPaymentHistoryItem[];
  isLoading: boolean;
}

export const PosPaymentHistoryTab = ({ items, isLoading }: PosPaymentHistoryTabProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>تاريخ وساعة السداد</th>
            <th>اسم العميل</th>
            <th>الفاتورة المرتبطة</th>
            <th>المبلغ المحصل</th>
            <th>الخزينة المستلمة</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                  <span>جاري تحميل سجل السداد...</span>
                </div>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={5} className="table-empty-row">
                <span>لا توجد عمليات سداد مسجلة في السجل</span>
              </td>
            </tr>
          ) : (
            items.map((h) => {
              const dateFormatted = new Date(h.paymentDate).toLocaleString('ar-EG', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <tr key={h.id}>
                  <td style={{ fontSize: '0.85rem', color: '#475569' }}>{dateFormatted}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0d1527' }}>{h.payerName}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: '#f1f5f9',
                        color: '#0284c7',
                        fontWeight: 700,
                        border: '1px solid #e0f2fe',
                      }}
                    >
                      فاتورة #{h.saleId}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.95rem' }}>
                      + {h.amountPaid.toLocaleString('ar-EG')} ج.م
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        backgroundColor: '#f8fafc',
                        color: '#334155',
                        fontWeight: 600,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {h.cashboxName || `خزينة #${h.cashboxId}`}
                    </span>
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

