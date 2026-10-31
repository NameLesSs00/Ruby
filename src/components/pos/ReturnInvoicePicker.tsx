import { Search, Receipt, ChevronLeft, Lock } from 'lucide-react';
import { getSaleReturnStats, type SaleRecord, type SaleReturnGroup } from '../../modules/pos';

interface ReturnInvoicePickerProps {
  sales: SaleRecord[];
  returnGroups: SaleReturnGroup[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSelectSale: (sale: SaleRecord) => void;
}

export const ReturnInvoicePicker = ({
  sales,
  returnGroups,
  isLoading,
  searchTerm,
  onSearchChange,
  onSelectSale,
}: ReturnInvoicePickerProps) => {
  return (
    <div>
      <label className="form-label" style={{ marginBottom: '0.4rem' }}>
        الخطوة 1: اختر فاتورة المبيعات المراد إرجاع أصناف منها
      </label>

      <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
        <Search
          size={16}
          color="#94a3b8"
          style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '0.75rem' }}
        />
        <input
          type="text"
          placeholder="ابحث برقم الفاتورة (مثال: INV-000002) أو اسم الصنف..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="form-input"
          style={{ paddingInlineStart: '2.25rem' }}
          autoFocus
        />
      </div>

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          <div className="spinner" style={{ margin: '0 auto 0.5rem' }} />
          <span>جاري تحميل فواتير المبيعات...</span>
        </div>
      ) : sales.length === 0 ? (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed #cbd5e1',
            color: '#64748b',
          }}
        >
          <Receipt size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ margin: '0 0 0.25rem', fontWeight: 600 }}>لا توجد فواتير مبيعات مطابقة للبحث</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
            يرجى التأكد من كتابة رقم الفاتورة بشكل صحيح
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            maxHeight: 300,
            overflowY: 'auto',
          }}
        >
          {sales.map((sale) => {
            const stats = getSaleReturnStats(sale, returnGroups);
            const saleDateStr = new Date(sale.saleDate).toLocaleString('ar-EG', {
              dateStyle: 'medium',
              timeStyle: 'short',
            });
            const isEligible = !stats.isFullyReturned;

            return (
              <div
                key={sale.id}
                onClick={() => {
                  if (isEligible) {
                    onSelectSale(sale);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: isEligible ? '#cbd5e1' : '#e2e8f0',
                  backgroundColor: isEligible ? '#ffffff' : '#f8fafc',
                  cursor: isEligible ? 'pointer' : 'not-allowed',
                  opacity: isEligible ? 1 : 0.7,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (isEligible) {
                    e.currentTarget.style.borderColor = '#ff6b22';
                    e.currentTarget.style.backgroundColor = '#fffaf7';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isEligible) {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0d1527' }}>
                      {sale.invoiceNumber}
                    </span>

                    {stats.isFullyReturned ? (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '999px',
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c',
                          fontWeight: 700,
                        }}
                      >
                        مرتجع بالكامل (0 متبقي)
                      </span>
                    ) : stats.totalReturnedPieces > 0 ? (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '999px',
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          fontWeight: 700,
                        }}
                      >
                        مرتجع جزئياً (متبقي {stats.totalRemainingPieces} من {stats.totalSoldPieces} قطعة)
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '999px',
                          backgroundColor: '#ecfdf5',
                          color: '#059669',
                          fontWeight: 700,
                        }}
                      >
                        سليمة (متبقي {stats.totalRemainingPieces} قطعة)
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                    التاريخ: {saleDateStr}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#334155' }}>
                    الرصيد المتبقي المتاح للاسترداد:{' '}
                    <strong style={{ color: '#0f172a' }}>
                      {stats.remainingRefundableAmount.toLocaleString('ar-EG')} ج.م
                    </strong>
                  </div>
                </div>

                <div style={{ textAlign: 'end', marginInlineStart: '1rem', flexShrink: 0 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ff6b22' }}>
                    {sale.finalAmount.toLocaleString('ar-EG')} ج.م
                  </div>

                  {isEligible ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#0284c7',
                        fontWeight: 700,
                        marginTop: '0.25rem',
                      }}
                    >
                      <span>اختيار الفاتورة</span>
                      <ChevronLeft size={14} />
                    </span>
                  ) : (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        fontWeight: 600,
                        marginTop: '0.25rem',
                      }}
                    >
                      <Lock size={12} />
                      <span>غير قابلة للإرجاع</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

