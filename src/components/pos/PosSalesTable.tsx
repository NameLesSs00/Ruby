import { Printer, RotateCcw, AlertCircle } from 'lucide-react';
import type { SaleRecord, SaleStatus } from '../../modules/pos';

interface PosSalesTableProps {
  sales: SaleRecord[];
  totalCount: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  onPageChange: (page: number) => void;
  onViewReceipt: (sale: SaleRecord) => void;
  onOpenReturnModal: (sale: SaleRecord) => void;
}

const getStatusBadge = (status: SaleStatus) => {
  switch (status) {
    case 'NotReturned':
      return (
        <span
          style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#ecfdf5',
            color: '#059669',
            border: '1px solid #a7f3d0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          مدفوعه
        </span>
      );
    case 'PartiallyReturned':
      return (
        <span
          style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#fffbeb',
            color: '#d97706',
            border: '1px solid #fde68a',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          مرتجع جزئياً
        </span>
      );
    case 'FullyReturned':
      return (
        <span
          style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          مرتجع بالكامل
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};

export const PosSalesTable = ({
  sales,
  totalCount,
  page,
  totalPages,
  isLoading,
  isError,
  searchTerm,
  onPageChange,
  onViewReceipt,
  onOpenReturnModal,
}: PosSalesTableProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>رقم الفاتورة</th>
            <th>تاريخ البيع</th>
            <th>الأصناف</th>
            <th>الإجمالي</th>
            <th>الخصم</th>
            <th>الصافي النهائي</th>
            <th>حالة المرتجع</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                  <span>جاري تحميل فواتير المبيعات...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={8} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل المبيعات، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : sales.length === 0 ? (
            <tr>
              <td colSpan={8} className="table-empty-row">
                <span>لا توجد فواتير مبيعات مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
              </td>
            </tr>
          ) : (
            sales.map((sale) => {
              const saleDateFormatted = new Date(sale.saleDate).toLocaleString('ar-EG', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });
              const totalItemsCount = (sale.items || []).reduce((sum, i) => sum + i.quantity, 0);

              return (
                <tr key={sale.id}>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0d1527' }}>{sale.invoiceNumber}</span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{saleDateFormatted}</td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#f1f5f9',
                        fontWeight: 700,
                        color: '#334155',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      {totalItemsCount} قطعة ({sale.items?.length || 0} صنف)
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#475569', fontWeight: 600 }}>
                      {sale.totalAmount.toLocaleString('ar-EG')} ج.م
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        color: sale.discountAmount > 0 ? '#ef4444' : '#94a3b8',
                        fontWeight: sale.discountAmount > 0 ? 700 : 400,
                      }}
                    >
                      {sale.discountAmount > 0 ? `- ${sale.discountAmount.toLocaleString('ar-EG')} ج.م` : '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 900, color: '#ff6b22', fontSize: '1rem' }}>
                      {sale.finalAmount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>
                  <td>{getStatusBadge(sale.status)}</td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center', gap: '0.45rem' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="عرض وطباعة الإيصال"
                        onClick={() => onViewReceipt(sale)}
                        style={{
                          color: '#0284c7',
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bae6fd',
                        }}
                      >
                        <Printer size={16} />
                      </button>

                      {sale.status !== 'FullyReturned' && (
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="إجراء مرتجع لهذه الفاتورة"
                          onClick={() => onOpenReturnModal(sale)}
                          style={{
                            color: '#d97706',
                            backgroundColor: '#fffbeb',
                            border: '1px solid #fde68a',
                          }}
                        >
                          <RotateCcw size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {!isLoading && totalCount > 0 && (
        <div className="pagination-wrapper">
          <span>
            إجمالي الفواتير: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
          </span>
          <div className="pagination-controls">
            <button
              type="button"
              className="btn-page"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              السابق
            </button>
            <button
              type="button"
              className="btn-page"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

