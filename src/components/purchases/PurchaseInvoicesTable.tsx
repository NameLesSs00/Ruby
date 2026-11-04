import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  CreditCard,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import type { PurchaseInvoice } from '../../modules/purchases';
import { PaginationBar } from '../ui/PaginationBar';

interface PurchaseInvoicesTableProps {
  items: PurchaseInvoice[];
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onViewDetails: (invoiceId: number) => void;
  onRecordPayment: (invoice: PurchaseInvoice) => void;
  onEdit: (invoice: PurchaseInvoice) => void;
  onDelete: (invoice: PurchaseInvoice) => void;
}

const getPaymentStatusBadge = (inv: PurchaseInvoice) => {
  if (inv.remainingAmount <= 0) {
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
        <CheckCircle2 size={13} />
        مسدد بالكامل
      </span>
    );
  }
  if (inv.paidAmount > 0) {
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
        <Clock size={13} />
        مدفوع جزئياً
      </span>
    );
  }
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
      }}
    >
      غير مدفوع
    </span>
  );
};

export const PurchaseInvoicesTable = ({
  items,
  isLoading,
  isError,
  searchTerm,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onViewDetails,
  onRecordPayment,
  onEdit,
  onDelete,
}: PurchaseInvoicesTableProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>رقم الفاتورة</th>
            <th>المورد</th>
            <th>تاريخ الفاتورة</th>
            <th>الإجمالي</th>
            <th>المسدد</th>
            <th>المتبقي</th>
            <th>حالة السداد</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                  <span>جاري تحميل فواتير المشتريات...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={8} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل فواتير المشتريات، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={8} className="table-empty-row">
                <span>لا توجد فواتير مشتريات مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
              </td>
            </tr>
          ) : (
            items.map((inv) => (
              <tr key={inv.id}>
                <td>
                  <span style={{ fontWeight: 800, color: '#0d1527' }}>{inv.invoiceNumber}</span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#334155' }}>{inv.supplierName}</span>
                </td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#64748b' }}>
                    <Calendar size={13} color="#94a3b8" />
                    {new Date(inv.invoiceDate).toLocaleDateString('ar-EG')}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#0d1527' }}>
                    {inv.totalAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                </td>
                <td>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>
                    {inv.paidAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: inv.remainingAmount > 0 ? '#b91c1c' : '#16a34a' }}>
                    {inv.remainingAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                </td>
                <td>{getPaymentStatusBadge(inv)}</td>
                <td>
                  <div className="table-actions" style={{ justifyContent: 'center', gap: '0.45rem' }}>
                    <button
                      type="button"
                      className="btn-icon-action"
                      title="معاينة تفاصيل الفاتورة"
                      onClick={() => onViewDetails(inv.id)}
                      style={{ color: '#0284c7', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}
                    >
                      <Eye size={15} />
                    </button>

                    {inv.remainingAmount > 0 && (
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="سداد دفعة للمورد"
                        onClick={() => onRecordPayment(inv)}
                        style={{ color: '#16a34a', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
                      >
                        <CreditCard size={15} />
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-icon-action"
                      title="تعديل الفاتورة"
                      onClick={() => onEdit(inv)}
                      style={{ color: '#64748b', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}
                    >
                      <Edit2 size={15} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon-action"
                      title="حذف الفاتورة"
                      onClick={() => onDelete(inv)}
                      style={{ color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          label="إجمالي فواتير المشتريات"
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

