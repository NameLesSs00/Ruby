import { useQuery } from '@tanstack/react-query';
import { X, FileText, Calendar, User, Package, Coins, CreditCard, AlertCircle } from 'lucide-react';
import {
  purchaseInvoicesApi,
  purchasePaymentsApi,
  purchaseInvoiceKeys,
  purchasePaymentKeys,
  type PurchaseInvoice,
} from '../../modules/purchases';

interface PurchaseInvoiceDetailsModalProps {
  invoiceId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRecordPayment: (invoice: PurchaseInvoice) => void;
}

export const PurchaseInvoiceDetailsModal = ({
  invoiceId,
  isOpen,
  onClose,
  onOpenRecordPayment,
}: PurchaseInvoiceDetailsModalProps) => {
  const { data: invoice, isLoading, isError } = useQuery({
    queryKey: purchaseInvoiceKeys.detail(invoiceId || 0),
    queryFn: () => purchaseInvoicesApi.getById(invoiceId!),
    enabled: isOpen && Boolean(invoiceId),
  });

  const { data: paymentsData, isLoading: isPaymentsLoading } = useQuery({
    queryKey: purchasePaymentKeys.list({ purchaseInvoiceId: invoiceId || 0 }),
    queryFn: () => purchasePaymentsApi.getAll({ purchaseInvoiceId: invoiceId! }),
    enabled: isOpen && Boolean(invoiceId),
  });

  if (!isOpen || !invoiceId) return null;

  const invoiceItems = invoice?.items || [];
  const payments = paymentsData?.items || [];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 640 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} color="#ff6b22" />
            <h3 className="modal-title">
              تفاصيل فاتورة المشتريات {invoice ? `#${invoice.invoiceNumber}` : ''}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
          {isLoading ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
              <div className="spinner" style={{ margin: '0 auto 0.5rem' }} />
              <span>جاري تحميل تفاصيل الفاتورة...</span>
            </div>
          ) : isError || !invoice ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
              <AlertCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
              <span>تعذر تحميل تفاصيل الفاتورة، يرجى المحاولة لاحقاً</span>
            </div>
          ) : (
            <>
              {/* Header Info Banner */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem 1rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>المورد:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, color: '#0d1527', marginTop: '0.15rem' }}>
                    <User size={14} color="#ff6b22" />
                    <span>{invoice.supplierName}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>تاريخ الفاتورة:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#0d1527', marginTop: '0.15rem' }}>
                    <Calendar size={14} color="#64748b" />
                    <span>{new Date(invoice.invoiceDate).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>الملاحظات:</span>
                  <span style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500 }}>
                    {invoice.notes || 'لا توجد ملاحظات'}
                  </span>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ backgroundColor: '#f1f5f9', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>إجمالي الفاتورة</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0d1527' }}>
                    {invoice.totalAmount.toLocaleString('ar-EG')} ج.م
                  </div>
                </div>
                <div style={{ backgroundColor: '#ecfdf5', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#047857' }}>المدفوع</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#047857' }}>
                    {invoice.paidAmount.toLocaleString('ar-EG')} ج.م
                  </div>
                </div>
                <div style={{ backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>المتبقي المطلوب</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#b91c1c' }}>
                    {invoice.remainingAmount.toLocaleString('ar-EG')} ج.م
                  </div>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: 800, color: '#0d1527', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Package size={16} color="#ff6b22" />
                  <span>الأصناف والبنود المشتراة ({invoiceItems.length})</span>
                </h4>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>اسم الصنف المخزني</th>
                        <th>الكمية</th>
                        <th>سعر الوحدة</th>
                        <th>إجمالي البند</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceItems.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="table-empty-row">
                            <span>لا توجد أصناف مدخلة لهذه الفاتورة</span>
                          </td>
                        </tr>
                      ) : (
                        invoiceItems.map((item) => (
                          <tr key={item.id}>
                            <td style={{ fontWeight: 700, color: '#0d1527' }}>
                              {item.inventoryItemName}
                            </td>
                            <td>
                              <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                            </td>
                            <td>{item.unitCost.toLocaleString('ar-EG')} ج.م</td>
                            <td>
                              <span style={{ fontWeight: 800, color: '#0d1527' }}>
                                {item.totalPrice.toLocaleString('ar-EG')} ج.م
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment History on this Invoice */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0d1527', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Coins size={16} color="#16a34a" />
                    <span>سجل الدفعات المسددة لهذه الفاتورة</span>
                  </h4>
                  {invoice.remainingAmount > 0 && (
                    <button
                      type="button"
                      className="btn-add"
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', gap: '0.3rem' }}
                      onClick={() => {
                        onClose();
                        onOpenRecordPayment(invoice);
                      }}
                    >
                      <CreditCard size={14} />
                      <span>سداد دفعة جديدة</span>
                    </button>
                  )}
                </div>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>تاريخ السداد</th>
                        <th>المبلغ المسدد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isPaymentsLoading ? (
                        <tr>
                          <td colSpan={2} className="table-loading-row">
                            <div className="spinner" style={{ margin: '0 auto' }} />
                          </td>
                        </tr>
                      ) : payments.length === 0 ? (
                        <tr>
                          <td colSpan={2} className="table-empty-row">
                            <span>لم يتم سداد أي دفعات لهذه الفاتورة بعد</span>
                          </td>
                        </tr>
                      ) : (
                        payments.map((p) => (
                          <tr key={p.id}>
                            <td style={{ fontSize: '0.85rem' }}>
                              {new Date(p.paymentDate).toLocaleString('ar-EG', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </td>
                            <td>
                              <span style={{ fontWeight: 800, color: '#16a34a' }}>
                                + {p.amountPaid.toLocaleString('ar-EG')} ج.م
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

