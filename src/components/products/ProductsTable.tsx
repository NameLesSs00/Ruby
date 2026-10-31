import { useState } from 'react';
import {
  Edit2,
  CheckCircle,
  XCircle,
  Trash2,
  AlertCircle,
  Package,
  Tag,
  ZoomIn,
  X,
} from 'lucide-react';
import { getProductImageUrl, type Product } from '../../modules/products';

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
  products,
  isLoading,
  isError,
  debouncedSearch,
  page,
  totalCount,
  pageSize,
  statusMutationPending,
  onEdit,
  onToggleStatus,
  onDelete,
  onPageChange,
}: ProductsTableProps) => {
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<number, boolean>>({});

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const handleImageError = (productId: number) => {
    setImageErrorMap((prev) => ({ ...prev, [productId]: true }));
  };

  return (
    <>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 70, textAlign: 'center' }}>الصورة</th>
              <th>المنتج</th>
              <th>التصنيف</th>
              <th>سعر البيع</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      className="spinner"
                      style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                    />
                    <span>جاري تحميل قائمة المنتجات...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle
                    size={24}
                    style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }}
                  />
                  <span>تعذر تحميل قائمة المنتجات، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty-row">
                  <span>لا توجد منتجات مسجلة حالياً {debouncedSearch ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const fullImageUrl = getProductImageUrl(product.imageUrl);
                const hasValidImage = Boolean(fullImageUrl && !imageErrorMap[product.id]);

                return (
                  <tr key={product.id}>
                    {/* Image Cell */}
                    <td style={{ textAlign: 'center' }}>
                      {hasValidImage ? (
                        <div
                          style={{
                            position: 'relative',
                            width: 44,
                            height: 44,
                            marginInline: 'auto',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)',
                            cursor: 'pointer',
                            backgroundColor: '#ffffff',
                          }}
                          onClick={() => setPreviewProduct(product)}
                          title="انقر لتكبير الصورة"
                        >
                          <img
                            src={fullImageUrl!}
                            alt={product.name}
                            onError={() => handleImageError(product.id)}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.2s ease',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(13, 21, 39, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.2s ease',
                              color: '#ffffff',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                          >
                            <ZoomIn size={16} />
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            marginInline: 'auto',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-bg)',
                            border: '1px dashed var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-light)',
                          }}
                          title="بدون صورة"
                        >
                          <Package size={20} />
                        </div>
                      )}
                    </td>

                    {/* Product Name */}
                    <td>
                      <div className="coach-cell-name">
                        <span style={{ fontWeight: 600 }}>{product.name}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="job-title-badge">
                        <Tag size={13} style={{ marginInlineEnd: '0.35rem' }} />
                        {product.productCategoryName || 'غير مصنف'}
                      </span>
                    </td>

                    {/* Sale Price */}
                    <td>
                      <span className="salary-text">
                        {product.salePrice.toLocaleString('ar-EG')}
                        <span className="currency-unit">ج.م</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                        {product.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="تعديل المنتج"
                          onClick={() => onEdit(product)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className={`btn-icon-action ${
                            product.isActive ? 'toggle-active' : 'toggle-inactive'
                          }`}
                          title={product.isActive ? 'تعطيل المنتج' : 'تفعيل المنتج'}
                          disabled={statusMutationPending}
                          onClick={() => onToggleStatus(product.id, !product.isActive)}
                        >
                          {product.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action delete"
                          title="حذف المنتج"
                          onClick={() => onDelete(product)}
                        >
                          <Trash2 size={16} />
                        </button>
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
              إجمالي المنتجات: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="btn-page"
                disabled={page <= 1}
                onClick={() => onPageChange(Math.max(page - 1, 1))}
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

      {/* Image Lightbox Modal */}
      {previewProduct && previewProduct.imageUrl && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 1100, backgroundColor: 'rgba(13, 21, 39, 0.75)' }}
          onClick={() => setPreviewProduct(null)}
        >
          <div
            className="modal-card"
            style={{
              maxWidth: 500,
              padding: '1.25rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy)' }}>
                {previewProduct.name}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPreviewProduct(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                marginBottom: '1rem',
                maxHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={getProductImageUrl(previewProduct.imageUrl)!}
                alt={previewProduct.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="job-title-badge">
                <Tag size={13} style={{ marginInlineEnd: '0.35rem' }} />
                {previewProduct.productCategoryName || 'غير مصنف'}
              </span>
              <span className="salary-text" style={{ fontSize: '1.1rem' }}>
                {previewProduct.salePrice.toLocaleString('ar-EG')}{' '}
                <span className="currency-unit">ج.م</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
