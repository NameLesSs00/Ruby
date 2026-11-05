import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
} from 'lucide-react';
import { getProductImageUrl } from '../../modules/products';
import type { PosCartItem } from './PosProductCatalog';
import { PosPaymentSection } from './PosPaymentSection';

interface PosCartDrawerProps {
  cart: PosCartItem[];
  subtotal: number;
  discountAmount: number;
  setDiscountAmount: (val: number) => void;
  finalAmount: number;
  remainingDebt: number;
  isPayLater: boolean;
  setIsPayLater: (val: boolean) => void;
  payerName: string;
  setPayerName: (val: string) => void;
  debtDescription: string;
  setDebtDescription: (val: string) => void;
  dueDate: string;
  setDueDate: (val: string) => void;
  partialAmountPaid: number;
  setPartialAmountPaid: (val: number) => void;
  saleNotes: string;
  setSaleNotes: (val: string) => void;
  isSubmitting: boolean;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const PosCartDrawer = ({
  cart,
  subtotal,
  discountAmount,
  setDiscountAmount,
  finalAmount,
  remainingDebt,
  isPayLater,
  setIsPayLater,
  payerName,
  setPayerName,
  debtDescription,
  setDebtDescription,
  dueDate,
  setDueDate,
  partialAmountPaid,
  setPartialAmountPaid,
  saleNotes,
  setSaleNotes,
  isSubmitting,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
}: PosCartDrawerProps) => {
  return (
    <div
      style={{
        width: 420,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 10,
        borderInlineStart: '1px solid #e2e8f0',
      }}
    >
      {/* Cart Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0d1527',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShoppingCart size={20} color="#38bdf8" />
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>سلة المبيعات</h3>
          <span
            style={{
              fontSize: '0.75rem',
              backgroundColor: '#16223e',
              color: '#38bdf8',
              padding: '0.15rem 0.55rem',
              borderRadius: '999px',
              fontWeight: 800,
              border: '1px solid #1e293b',
            }}
          >
            {cart.reduce((sum, i) => sum + i.quantity, 0)} قطعة
          </span>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              fontWeight: 600,
            }}
            title="إفراغ السلة بالكامل"
          >
            <Trash2 size={15} />
            <span>إفراغ</span>
          </button>
        )}
      </div>

      {/* Cart Itemized List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem' }}>
        {cart.length === 0 ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <ShoppingCart size={48} style={{ marginBottom: '0.75rem', opacity: 0.35 }} />
            <p style={{ margin: '0 0 0.35rem', fontWeight: 700, color: '#475569', fontSize: '1rem' }}>
              السلة فارغة حالياً
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', maxWidth: 260 }}>
              انقر على أي منتج من القائمة لإضافته إلى الفاتورة وتحديد الكميات المطلوبة
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {cart.map((item) => {
              const imgUrl = getProductImageUrl(item.product.imageUrl);
              const lineTotal = item.product.salePrice * item.quantity;

              return (
                <div
                  key={item.product.id}
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
                      <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    <span style={{ minWidth: 22, textAlign: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
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
                    style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
                    title="حذف الصنف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <PosPaymentSection
        subtotal={subtotal}
        discountAmount={discountAmount}
        setDiscountAmount={setDiscountAmount}
        finalAmount={finalAmount}
        remainingDebt={remainingDebt}
        isPayLater={isPayLater}
        setIsPayLater={setIsPayLater}
        payerName={payerName}
        setPayerName={setPayerName}
        debtDescription={debtDescription}
        setDebtDescription={setDebtDescription}
        dueDate={dueDate}
        setDueDate={setDueDate}
        partialAmountPaid={partialAmountPaid}
        setPartialAmountPaid={setPartialAmountPaid}
        saleNotes={saleNotes}
        setSaleNotes={setSaleNotes}
        isCartEmpty={cart.length === 0}
        isSubmitting={isSubmitting}
        onCheckout={onCheckout}
      />
    </div>
  );
};
