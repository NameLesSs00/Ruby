import { Edit2, CheckCircle, XCircle, Trash2, Phone, MapPin, AlertCircle, Building } from 'lucide-react';
import type { Supplier } from '../../modules/suppliers';

interface SuppliersTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  isError: boolean;
  debouncedSearch: string;
  page: number;
  totalCount: number;
  pageSize: number;
  statusMutationPending: boolean;
  onEdit: (supplier: Supplier) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  onDelete: (supplier: Supplier) => void;
  onPageChange: (page: number) => void;
}

export const SuppliersTable = ({
  suppliers, isLoading, isError, debouncedSearch,
  page, totalCount, pageSize, statusMutationPending,
  onEdit, onToggleStatus, onDelete, onPageChange,
}: SuppliersTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>المورد والشركة</th>
            <th>رقم الهاتف</th>
            <th>العنوان</th>
            <th>الملاحظات</th>
            <th>الحالة</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={6} className="table-loading-row">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                <span>جاري تحميل قائمة الموردين...</span>
              </div>
            </td></tr>
          ) : isError ? (
            <tr><td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
              <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
              <span>تعذر تحميل قائمة الموردين، يرجى المحاولة لاحقاً</span>
            </td></tr>
          ) : suppliers.length === 0 ? (
            <tr><td colSpan={6} className="table-empty-row">
              <span>لا يوجد موردون مسجلون حالياً {debouncedSearch ? 'مطابقون للبحث' : ''}</span>
            </td></tr>
          ) : (
            suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>
                  <div className="coach-cell-name">
                    <div className="coach-avatar" style={{ backgroundColor: '#fff3ec', color: '#ea580c' }}>
                      <Building size={18} />
                    </div>
                    <div>
                      <div>{supplier.companyName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{supplier.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                    <Phone size={15} /><span dir="ltr">{supplier.phoneNumber}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                    <MapPin size={15} /><span>{supplier.address || '—'}</span>
                  </div>
                </td>
                <td><span style={{ color: supplier.notes ? '#334155' : '#94a3b8', fontSize: '0.85rem' }}>{supplier.notes || 'لا توجد ملاحظات'}</span></td>
                <td><span className={`status-badge ${supplier.isActive ? 'active' : 'inactive'}`}>{supplier.isActive ? 'نشط' : 'غير نشط'}</span></td>
                <td>
                  <div className="table-actions" style={{ justifyContent: 'center' }}>
                    <button type="button" className="btn-icon-action" title="تعديل بيانات المورد" onClick={() => onEdit(supplier)}><Edit2 size={16} /></button>
                    <button type="button" className={`btn-icon-action ${supplier.isActive ? 'toggle-active' : 'toggle-inactive'}`} title={supplier.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'} disabled={statusMutationPending} onClick={() => onToggleStatus(supplier.id, !supplier.isActive)}>
                      {supplier.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button type="button" className="btn-icon-action delete" title="حذف المورد" onClick={() => onDelete(supplier)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!isLoading && totalCount > 0 && (
        <div className="pagination-wrapper">
          <span>إجمالي الموردين: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})</span>
          <div className="pagination-controls">
            <button type="button" className="btn-page" disabled={page <= 1} onClick={() => onPageChange(Math.max(page - 1, 1))}>السابق</button>
            <button type="button" className="btn-page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>التالي</button>
          </div>
        </div>
      )}
    </div>
  );
};

