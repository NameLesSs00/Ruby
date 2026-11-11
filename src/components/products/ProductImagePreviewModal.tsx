import { X, Tag } from 'lucide-react';
import { useModalEscape } from '../../lib/useModalEscape';
import { getProductImageUrl, type Product } from '../../modules/products';

interface ProductImagePreviewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductImagePreviewModal = ({ product, onClose }: ProductImagePreviewModalProps) => {
  useModalEscape(onClose, Boolean(product));

  if (!product || !product.imageUrl) return null;

  return (
    <div
      className="modal-backdrop"
      style={{ zIndex: 1100, backgroundColor: 'rgba(13, 21, 39, 0.75)' }}
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
            {product.name}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
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
            src={getProductImageUrl(product.imageUrl)!}
            alt={product.name}
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
            {product.productCategoryName || 'غير مصنف'}
          </span>
          <span className="salary-text" style={{ fontSize: '1.1rem' }}>
            {(product.customerPrice ?? 0).toLocaleString('ar-EG')}{' '}
            <span className="currency-unit">ج.م</span>
          </span>
        </div>
      </div>
    </div>
  );
};

