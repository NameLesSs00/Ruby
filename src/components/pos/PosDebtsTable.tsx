import {
  AlertCircle,
  User,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import type { PosDuePayment, DuePaymentStatus } from '../../modules/pos';

interface PosDebtsTableProps {
  items: PosDuePayment[];
  totalCount: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  onPageChange: (page: number) => void;
  onOpenPaymentModal: (due: PosDuePayment) => void;
}

const getStatusBadge = (status: DuePaymentStatus) => {
  const map: Record<DuePaymentStatus, { bg: string; color: string; border: string; text: string }> = {
    Unpaid: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca', text: 'غير مدفوع' },
    PartiallyPaid: { bg: '#fef3c7', color: '#b45309', border: '#fde68a', text: 'مدفوع جزئياً' },
    Paid: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', text: 'مسدد بالكامل' },
  };
  const style = map[status];
  if (!style) return <span>{status}</span>;
  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        padding: '0.2rem 0.65rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {style.text}
    </span>
  );
};

export const PosDebtsTable = ({
  items,
  totalCount,
  page,
  totalPages,
  isLoading,
  isError,
  searchTerm,
  onPageChange,
  onOpenPaymentModal,
}: PosDebtsTableProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table" style={{ minWidth: 1000 }}>
        <thead>
          <tr>
            <th>اسم المدين</th>
            <th>الفاتورة المرتبطة</th>
            <th>البيان والوصف</th>
            <th>إجمالي المبلغ</th>
            <th>المسدد</th>
            <th>المتبقي</th>
            <th style={{ width: 140 }}>نسبة السداد</th>
            <th>تاريخ الاستحقاق</th>
            <th>الحالة</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="spinner"
                    style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                  />
                  <span>جاري تحميل فواتير الديون...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={10} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل الديون، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={10} className="table-empty-row">
                <span>لا توجد ديون مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
              </td>
            </tr>
          ) : (
            items.map((due) => {
              const itemPercent =
                due.totalAmount > 0
                  ? Math.min(100, Math.round(((due.paidAmount || 0) / due.totalAmount) * 100))
                  : 100;

              return (
                <tr key={due.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          backgroundColor: '#f0fdf4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <User size={14} color="#16a34a" />
                      </div>
                      <span>{due.payerName}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontWeight: 700,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      فاتورة #{due.saleId}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{due.description || '—'}</td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0d1527' }}>
                      {due.totalAmount.toLocaleString('ar-EG')} ج.م
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>
                      {due.paidAmount.toLocaleString('ar-EG')} ج.م
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: due.remainingAmount > 0 ? '#ef4444' : '#16a34a' }}>
                      {due.remainingAmount.toLocaleString('ar-EG')} ج.م
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#64748b',
                        }}
                      >
                        <span>{itemPercent}%</span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: 5,
                          borderRadius: 999,
                          backgroundColor: '#f1f5f9',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${itemPercent}%`,
                            backgroundColor:
                              itemPercent >= 100 ? '#10b981' : itemPercent > 0 ? '#f59e0b' : '#ef4444',
                            borderRadius: 999,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {due.dueDate ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={13} color="#94a3b8" />
                        {new Date(due.dueDate).toLocaleDateString('ar-EG')}
                      </span>
                    ) : (
                      'غير محدد'
                    )}
                  </td>
                  <td>{getStatusBadge(due.status)}</td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      {due.remainingAmount > 0 ? (
                        <button
                          type="button"
                          className="btn-add"
                          style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                          onClick={() => onOpenPaymentModal(due)}
                        >
                          <span>سداد دفعة</span>
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: '#16a34a',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <CheckCircle2 size={14} />
                          تم السداد بالكامل
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

      {!isLoading && totalCount > 0 && (
        <div className="pagination-wrapper">
          <span>
            إجمالي السجلات: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
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

