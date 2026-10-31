import { Edit2, CheckCircle, XCircle, Trash2, AlertCircle, Package, Tag } from 'lucide-react';
import type { Product } from '../../modules/products';

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
  debouncedSearch: string;
  page: number;
  totalCount: number;
  pageSize: number;
  statusMutationPending: boolean;
  onEdit: (product: Product) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  onDelete: (product: Product) => void;
  onPageChange: (page: number) => void;
}

export const ProductsTable = ({
  products, isLoading, isError, debouncedSearch,
  page, totalCount, pageSize, statusMutationPending,
  onEdit, onToggleStatus, onDelete, onPageChange,
}: ProductsTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>المنتج</th><th>التصنيف</th><th>سعر البيع</th><th>الحالة</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr><td colSpan={5} className="table-loading-row">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                <span>جاري تحميل قائمة المنتجات...</span>
              </div>
            </td></tr>
          ) : isError ? (
            <tr><td colSpan={5} className="table-empty-row" style={{ color: '#ef4444' }}>
              <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
              <span>تعذر تحميل قائمة المنتجات، يرجى المحاولة لاحقاً</span>
            </td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan={5} className="table-empty-row">
              <span>لا توجد منتجات مسجلة حالياً {debouncedSearch ? 'مطابقة للبحث' : ''}</span>
            </td></tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="coach-cell-name">
                    <div className="coach-avatar" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}><Package size={18} /></div>
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>
                  <span className="job-title-badge">
                    <Tag size={13} style={{ marginInlineEnd: '0.35rem' }} />
                    {product.productCategoryName || 'غير مصنف'}
                  </span>
                </td>
                <td>
                  <span className="salary-text">
                    {product.salePrice.toLocaleString('ar-EG')}
                    <span className="currency-unit">ج.م</span>
                  </span>
                </td>
                <td><span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>{product.isActive ? 'نشط' : 'غير نشط'}</span></td>
                <td>
                  <div className="table-actions" style={{ justifyContent: 'center' }}>
                    <button type="button" className="btn-icon-action" title="تعديل المنتج" onClick={() => onEdit(product)}><Edit2 size={16} /></button>
                    <button type="button" className={`btn-icon-action ${product.isActive ? 'toggle-active' : 'toggle-inactive'}`} title={product.isActive ? 'تعطيل المنتج' : 'تفعيل المنتج'} disabled={statusMutationPending} onClick={() => onToggleStatus(product.id, !product.isActive)}>
                      {product.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button type="button" className="btn-icon-action delete" title="حذف المنتج" onClick={() => onDelete(product)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {!isLoading && totalCount > 0 && (
        <div className="pagination-wrapper">
          <span>إجمالي المنتجات: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})</span>
          <div className="pagination-controls">
            <button type="button" className="btn-page" disabled={page <= 1} onClick={() => onPageChange(Math.max(page - 1, 1))}>السابق</button>
            <button type="button" className="btn-page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>التالي</button>
          </div>
        </div>
      )}
    </div>
  );
};

