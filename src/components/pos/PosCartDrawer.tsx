import { ShoppingCart, Trash2, Tag, PauseCircle } from 'lucide-react';
import type { PosCartItem } from './PosProductCatalog';
import { PosPaymentSection } from './PosPaymentSection';
import { PosCartItemRow } from './PosCartItemRow';

interface PosCartDrawerProps {
  referenceNumber: number;
  referenceName: string;
  onReferenceNameChange: (val: string) => void;
  onHoldAndCreateNew: () => void;
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
  referenceNumber,
  referenceName,
  onReferenceNameChange,
  onHoldAndCreateNew,
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
  const totalUnits = cart.reduce((sum, i) => sum + i.quantity, 0);

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
          padding: '0.85rem 1.15rem',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0d1527',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShoppingCart size={19} color="#38bdf8" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
            فاتورة #{referenceNumber}
          </h3>
          <span
            style={{
              fontSize: '0.73rem',
              backgroundColor: '#16223e',
              color: '#38bdf8',
              padding: '0.12rem 0.5rem',
              borderRadius: '999px',
              fontWeight: 800,
              border: '1px solid #1e293b',
            }}
          >
            {totalUnits} قطعة
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {(cart.length > 0 || referenceName.trim()) && (
            <button
              type="button"
              onClick={onHoldAndCreateNew}
              style={{
                background: '#16223e',
                border: '1px solid #38bdf8',
                color: '#38bdf8',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.28rem 0.55rem',
                borderRadius: '6px',
              }}
              title="الاحتفاظ بهذه الفاتورة مفتوحة وبدء فاتورة جديدة لعميل آخر"
            >
              <PauseCircle size={13} />
              <span>تعليق وفتح جديدة</span>
            </button>
          )}

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
                gap: '0.25rem',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
              title="إفراغ أصناف هذه الفاتورة"
            >
              <Trash2 size={14} />
              <span>إفراغ</span>
            </button>
          )}
        </div>
      </div>

      {/* Invoice Reference / Customer Tag Input Bar */}
      <div
        style={{
          padding: '0.6rem 0.85rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: '#0d1527',
            fontSize: '0.78rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
          }}
        >
          <Tag size={14} color="#0284c7" />
          <span>مرجع الفاتورة:</span>
        </div>
        <input
          type="text"
          value={referenceName}
          onChange={(e) => onReferenceNameChange(e.target.value)}
          placeholder="اسم العميل / السباح / رقم الطاولة..."
          style={{
            flex: 1,
            padding: '0.38rem 0.65rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            outline: 'none',
          }}
        />
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
            <ShoppingCart size={46} style={{ marginBottom: '0.75rem', opacity: 0.35 }} />
            <p
              style={{
                margin: '0 0 0.35rem',
                fontWeight: 700,
                color: '#475569',
                fontSize: '0.98rem',
              }}
            >
              الفاتورة #{referenceNumber}{' '}
              {referenceName.trim() ? `(${referenceName.trim()})` : ''} فارغة حالياً
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', maxWidth: 270 }}>
              اكتب اسم العميل في خانة المرجع بالأعلى وانقر على المنتجات لإضافتها، ويمكنك فتح أكثر من فاتورة في نفس الوقت
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {cart.map((item) => (
              <PosCartItemRow
                key={item.product.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveFromCart={onRemoveFromCart}
              />
            ))}
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
