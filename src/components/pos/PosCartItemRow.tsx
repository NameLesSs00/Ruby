import { Trash2, Plus, Minus, Package } from 'lucide-react';
import { getProductImageUrl } from '../../modules/products';
import type { PosCartItem } from './PosProductCatalog';

interface PosCartItemRowProps {
  item: PosCartItem;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveFromCart: (productId: number) => void;
}

export const PosCartItemRow = ({
  item,
  onUpdateQuantity,
  onRemoveFromCart,
}: PosCartItemRowProps) => {
  const imgUrl = getProductImageUrl(item.product.imageUrl);
  const lineTotal = item.product.salePrice * item.quantity;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.6rem',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: '6px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {imgUrl ? (
          <img
            src={imgUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Package size={18} color="#94a3b8" />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--color-navy)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.product.name}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {item.product.salePrice.toLocaleString('ar-EG')} ج.م / قطعة
        </div>
      </div>

      {/* Quantity Steppers */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '0.15rem',
        }}
      >
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.product.id, -1)}
          style={{
            width: 24,
            height: 24,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            borderRadius: '4px',
          }}
        >
          <Minus size={13} />
        </button>
        <span
          style={{
            minWidth: 22,
            textAlign: 'center',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: '#0f172a',
          }}
        >
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => onUpdateQuantity(item.product.id, 1)}
          style={{
            width: 24,
            height: 24,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0d1527',
            borderRadius: '4px',
          }}
        >
          <Plus size={13} />
        </button>
      </div>

      <div style={{ textAlign: 'end', minWidth: 65 }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0f172a' }}>
          {lineTotal.toLocaleString('ar-EG')}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onRemoveFromCart(item.product.id)}
        style={{
          border: '1px solid #fecaca',
          background: '#fee2e2',
          color: '#dc2626',
          borderRadius: '6px',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="حذف الصنف"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
};

