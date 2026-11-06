import { User, CreditCard, Banknote } from 'lucide-react';

interface PosPaymentSectionProps {
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
  isCartEmpty: boolean;
  isSubmitting: boolean;
  onCheckout: () => void;
}

export const PosPaymentSection = ({
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
  isCartEmpty,
  isSubmitting,
  onCheckout,
}: PosPaymentSectionProps) => {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
        <span style={{ color: '#64748b' }}>إجمالي الأصناف:</span>
        <span style={{ fontWeight: 700 }}>{subtotal.toLocaleString('ar-EG')} ج.م</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>قيمة الخصم:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', width: 110 }}>
          <input
            type="number"
            min="0"
            max={subtotal}
            step="1"
            placeholder="0"
            value={discountAmount || ''}
            onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
            style={{
              width: '100%',
              padding: '0.25rem 0.5rem',
              fontSize: '0.85rem',
              textAlign: 'center',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              fontWeight: 700,
            }}
          />
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ج.م</span>
        </div>
      </div>

      {/* Segmented Payment Type Selector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.35rem',
          backgroundColor: '#f1f5f9',
          padding: '0.25rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '0.75rem',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setIsPayLater(false);
            setPartialAmountPaid(0);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            padding: '0.45rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: !isPayLater ? '#ffffff' : 'transparent',
            color: !isPayLater ? '#0d1527' : '#64748b',
            boxShadow: !isPayLater ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          <Banknote size={14} color={!isPayLater ? '#16a34a' : '#64748b'} />
          <span>دفع نقدي فوري</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsPayLater(true);
            setPartialAmountPaid(0);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem',
            padding: '0.45rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: isPayLater ? '#ffffff' : 'transparent',
            color: isPayLater ? '#c2410c' : '#64748b',
            boxShadow: isPayLater ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          <CreditCard size={14} color={isPayLater ? '#ea580c' : '#64748b'} />
          <span>دفع آجل / دين</span>
        </button>
      </div>

      {/* Pay Later Debt Form Drawer */}
      {isPayLater && (
        <div
          style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: '#fff7ed',
            border: '1px solid #fdba74',
            marginBottom: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.55rem',
          }}
        >
          <div>
            <label style={{ fontSize: '0.75rem', color: '#9a3412', display: 'block', marginBottom: '0.2rem', fontWeight: 700 }}>
              اسم العميل / المدين <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={14} color="#94a3b8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: 8, pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="اكتب اسم العميل أو المشترك"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                style={{ width: '100%', padding: '0.35rem 0.6rem', paddingInlineEnd: '1.8rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#9a3412', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                المدفوع نقداً (ج.م)
              </label>
              <input
                type="number"
                min="0"
                max={finalAmount}
                value={partialAmountPaid}
                onChange={(e) => setPartialAmountPaid(Math.max(0, Number(e.target.value)))}
                style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: '#9a3412', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                تاريخ الاستحقاق
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: '#9a3412', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
              سبب / وصف الدين
            </label>
            <input
              type="text"
              placeholder="مثال: باقي فاتورة مشتريات"
              value={debtDescription}
              onChange={(e) => setDebtDescription(e.target.value)}
              style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0.65rem', backgroundColor: '#fee2e2', borderRadius: '4px', fontSize: '0.8rem', color: '#991b1b', fontWeight: 800 }}>
            <span>المتبقي كدين آجل:</span>
            <span>{remainingDebt.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '0.75rem' }}>
        <input
          type="text"
          placeholder="ملاحظات اختيارية على الفاتورة..."
          value={saleNotes}
          onChange={(e) => setSaleNotes(e.target.value)}
          style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.65rem',
          borderTop: '2px dashed #e2e8f0',
          marginBottom: '0.85rem',
        }}
      >
        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-navy)' }}>الصافي المطلوب:</span>
        <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ff6b22' }}>
          {finalAmount.toLocaleString('ar-EG')} <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>ج.م</span>
        </span>
      </div>

      <button
        type="button"
        className="btn-add"
        style={{
          width: '100%',
          padding: '0.9rem 1rem',
          fontSize: '1.05rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 14px rgba(13, 21, 39, 0.3)',
        }}
        disabled={isCartEmpty || isSubmitting}
        onClick={onCheckout}
      >
        {isSubmitting ? (
          <>
            <div className="spinner" />
            <span>جاري إتمام الفاتورة...</span>
          </>
        ) : (
          <>
            <CreditCard size={18} />
            <span>
              {isPayLater ? 'اعتماد الفاتورة وتسجيل الدين' : `تحصيل وإصدار الفاتورة (${finalAmount} ج.م)`}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

