import { useState, useEffect } from 'react';
import { User, CreditCard, Banknote, Plus, Trash2, CheckCircle2, Split } from 'lucide-react';
import { blockInvalidNumberKeys } from '../../lib/number-input';
import type { PaymentMethod, PaymentMethodItem } from '../../modules/duePayments';
import type { PosSaleType } from '../../modules/posStore';

interface PosPaymentSectionProps {
  subtotal: number; discountAmount: number; setDiscountAmount: (val: number) => void;
  finalAmount: number; remainingDebt: number; isPayLater: boolean; setIsPayLater: (val: boolean) => void;
  payerName: string; setPayerName: (val: string) => void;
  debtDescription: string; setDebtDescription: (val: string) => void;
  dueDate: string; setDueDate: (val: string) => void;
  partialAmountPaid: number; setPartialAmountPaid: (val: number) => void;
  saleNotes: string; setSaleNotes: (val: string) => void;
  isCartEmpty: boolean; isSubmitting: boolean; saleType?: PosSaleType;
  paymentMethod?: PaymentMethod; onPaymentMethodChange?: (method: PaymentMethod) => void;
  customerPayments?: PaymentMethodItem[]; onCustomerPaymentsChange?: (payments: PaymentMethodItem[]) => void;
  employeePayments?: PaymentMethodItem[]; onEmployeePaymentsChange?: (payments: PaymentMethodItem[]) => void;
  onCheckout: () => void;
}

const PAYMENT_METHODS: { method: PaymentMethod; label: string }[] = [
  { method: 'Cash', label: 'نقداً (Cash)' }, { method: 'Visa', label: 'فيزا (Visa)' },
  { method: 'InstaPay', label: 'إنستاباي' }, { method: 'VodafoneCash', label: 'فودافون كاش' },
];

export const PosPaymentSection = ({
  subtotal, discountAmount, setDiscountAmount, finalAmount, remainingDebt,
  isPayLater, setIsPayLater, payerName, setPayerName, debtDescription, setDebtDescription,
  dueDate, setDueDate, partialAmountPaid, setPartialAmountPaid, saleNotes, setSaleNotes,
  isCartEmpty, isSubmitting, saleType = 'Customer', paymentMethod = 'Cash',
  onPaymentMethodChange, customerPayments, onCustomerPaymentsChange,
  employeePayments, onEmployeePaymentsChange, onCheckout,
}: PosPaymentSectionProps) => {
  const [isSplitMode, setIsSplitMode] = useState(false);

  const isEmployee = saleType === 'Employee';
  const targetAmount = isEmployee
    ? finalAmount
    : isPayLater ? partialAmountPaid : finalAmount;

  // Active payments array based on saleType
  const activePayments = isEmployee
    ? (employeePayments && employeePayments.length > 0
        ? employeePayments
        : [{ paymentMethod: 'Cash' as PaymentMethod, amount: finalAmount }])
    : (customerPayments && customerPayments.length > 0
        ? customerPayments
        : [{ paymentMethod, amount: targetAmount }]);

  const updatePayments = (payments: PaymentMethodItem[]) => {
    if (isEmployee) {
      onEmployeePaymentsChange?.(payments);
    } else {
      onCustomerPaymentsChange?.(payments);
    }
  };

  // If in single mode and targetAmount changes, auto-adjust single payment row amount
  useEffect(() => {
    if (!isSplitMode && !isEmployee) {
      updatePayments([{ paymentMethod, amount: targetAmount }]);
    }
  }, [targetAmount, paymentMethod, isSplitMode, isEmployee]);

  const totalDistributed = activePayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const remainingToDistribute = Math.max(0, targetAmount - totalDistributed);
  const isDistributionMatched = targetAmount === 0 || (totalDistributed === targetAmount && activePayments.every((p) => p.amount > 0));

  const handleSelectSingleMethod = (method: PaymentMethod) => {
    onPaymentMethodChange?.(method);
    updatePayments([{ paymentMethod: method, amount: targetAmount }]);
  };

  const handleUpdatePaymentMethod = (idx: number, method: PaymentMethod) => {
    const next = activePayments.map((p, i) => (i === idx ? { ...p, paymentMethod: method } : p));
    updatePayments(next);
  };

  const handleUpdatePaymentAmount = (idx: number, amount: number) => {
    const next = activePayments.map((p, i) => (i === idx ? { ...p, amount } : p));
    updatePayments(next);
  };

  const handleAddPaymentRow = () => {
    const existing = new Set(activePayments.map((p) => p.paymentMethod));
    const nextMethod = PAYMENT_METHODS.find((m) => !existing.has(m.method))?.method || 'Visa';
    const next = [...activePayments, { paymentMethod: nextMethod, amount: remainingToDistribute }];
    updatePayments(next);
  };

  const handleRemovePaymentRow = (idx: number) => {
    if (activePayments.length <= 1) return;
    const next = activePayments.filter((_, i) => i !== idx);
    updatePayments(next);
  };

  return (
    <div style={{ padding: '0.85rem 1rem', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', boxShadow: '0 -4px 10px rgba(0,0,0,0.03)' }}>
      {/* Subtotal & Discount */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.85rem' }}>
        <span style={{ color: '#64748b' }}>إجمالي الأصناف:</span>
        <span style={{ fontWeight: 700 }}>{subtotal.toLocaleString('ar-EG')} ج.م</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>قيمة الخصم الإضافي:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', width: 110 }}>
          <input
            type="number" min="0" max={subtotal} step="any" placeholder="0" value={discountAmount || ''}
            onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
            onKeyDown={blockInvalidNumberKeys}
            style={{ width: '100%', padding: '0.2rem 0.4rem', fontSize: '0.85rem', textAlign: 'center', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 700 }}
          />
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ج.م</span>
        </div>
      </div>

      {/* Pay Later Toggle for Customers */}
      {!isEmployee && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', backgroundColor: '#f1f5f9', padding: '0.2rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.65rem' }}>
          <button
            type="button" onClick={() => { setIsPayLater(false); setPartialAmountPaid(0); }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.4rem',
              borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              backgroundColor: !isPayLater ? '#ffffff' : 'transparent', color: !isPayLater ? '#0d1527' : '#64748b',
              boxShadow: !isPayLater ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Banknote size={14} color={!isPayLater ? '#16a34a' : '#64748b'} />
            <span>دفع فوري</span>
          </button>
          <button
            type="button" onClick={() => { setIsPayLater(true); setPartialAmountPaid(0); }}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', padding: '0.4rem',
              borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer',
              backgroundColor: isPayLater ? '#ffffff' : 'transparent', color: isPayLater ? '#c2410c' : '#64748b',
              boxShadow: isPayLater ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <CreditCard size={14} color={isPayLater ? '#ea580c' : '#64748b'} />
            <span>دفع آجل / دين</span>
          </button>
        </div>
      )}

      {/* Pay Later Details Form (Customer Only) */}
      {!isEmployee && isPayLater && (
        <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#fff7ed', border: '1px solid #fdba74', marginBottom: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', color: '#9a3412', display: 'block', marginBottom: '0.15rem', fontWeight: 700 }}>
              اسم العميل / المدين <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User size={13} color="#94a3b8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: 8, pointerEvents: 'none' }} />
              <input
                type="text" placeholder="اكتب اسم العميل أو المشترك" value={payerName} onChange={(e) => setPayerName(e.target.value)}
                style={{ width: '100%', padding: '0.3rem 0.5rem', paddingInlineEnd: '1.6rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#9a3412', display: 'block', marginBottom: '0.15rem', fontWeight: 600 }}>المدفوع مقدماً</label>
              <input
                type="number" min="0" max={finalAmount} value={partialAmountPaid || ''} placeholder="0"
                onChange={(e) => setPartialAmountPaid(Math.max(0, Number(e.target.value)))} onKeyDown={blockInvalidNumberKeys}
                style={{ width: '100%', padding: '0.3rem 0.4rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#9a3412', display: 'block', marginBottom: '0.15rem', fontWeight: 600 }}>تاريخ الاستحقاق</label>
              <input
                type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '0.3rem 0.4rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: '#9a3412', display: 'block', marginBottom: '0.15rem', fontWeight: 600 }}>سبب / وصف الدين</label>
            <input
              type="text" placeholder="مثال: باقي فاتورة مشتريات" value={debtDescription} onChange={(e) => setDebtDescription(e.target.value)}
              style={{ width: '100%', padding: '0.3rem 0.5rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0.5rem', backgroundColor: '#fee2e2', borderRadius: '4px', fontSize: '0.78rem', color: '#991b1b', fontWeight: 800 }}>
            <span>المتبقي كدين آجل:</span>
            <span>{remainingDebt.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>
      )}

      {/* Payment Method Selector / Multi-Payment Builder (Shown if targetAmount > 0 or Employee) */}
      {(targetAmount > 0 || isEmployee) && (
        <div style={{ marginBottom: '0.65rem', backgroundColor: '#f8fafc', padding: '0.55rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label style={{ fontSize: '0.74rem', color: isEmployee ? '#c2410c' : '#0d1527', fontWeight: 800 }}>
              طريقة الدفع {targetAmount > 0 ? `(${targetAmount} ج.م)` : ''}:
            </label>

            {!isEmployee && (
              <button
                type="button"
                onClick={() => {
                  const nextSplit = !isSplitMode;
                  setIsSplitMode(nextSplit);
                  if (!nextSplit) {
                    updatePayments([{ paymentMethod, amount: targetAmount }]);
                  }
                }}
                style={{ background: 'none', border: 'none', color: isSplitMode ? '#ff6b22' : '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <Split size={12} />
                <span>{isSplitMode ? 'إلغاء التجزئة (طريقة واحدة)' : 'تجزئة الدفع (أكثر من طريقة)'}</span>
              </button>
            )}

            {(isEmployee || isSplitMode) && (
              remainingToDistribute > 0 ? (
                <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700 }}>
                  متبقي: {remainingToDistribute} ج.م
                </span>
              ) : isDistributionMatched ? (
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <CheckCircle2 size={12} /> تم التوزيع
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700 }}>
                  تجاوز بمقدار {totalDistributed - targetAmount} ج.م
                </span>
              )
            )}
          </div>

          {/* Single Method Buttons (When not in split mode and not employee) */}
          {!isEmployee && !isSplitMode ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem' }}>
              {PAYMENT_METHODS.map((m) => {
                const isSelected = paymentMethod === m.method;
                return (
                  <button
                    key={m.method}
                    type="button"
                    onClick={() => handleSelectSingleMethod(m.method)}
                    style={{
                      padding: '0.35rem 0.2rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: '4px',
                      border: isSelected ? '1px solid #ff6b22' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#fff7ed' : '#ffffff',
                      color: isSelected ? '#c2410c' : '#475569',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Multi-Payment Rows (Split mode or Employee) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {activePayments.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <select
                    className="form-input"
                    style={{ width: '48%', padding: '0.25rem 0.4rem', fontSize: '0.76rem', backgroundColor: '#ffffff' }}
                    value={p.paymentMethod}
                    onChange={(e) => handleUpdatePaymentMethod(idx, e.target.value as PaymentMethod)}
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m.method} value={m.method}>{m.label}</option>
                    ))}
                  </select>

                  <input
                    type="number" min="0" step="any" placeholder="المبلغ" value={p.amount || ''}
                    onChange={(e) => handleUpdatePaymentAmount(idx, Math.max(0, parseFloat(e.target.value) || 0))}
                    onKeyDown={blockInvalidNumberKeys}
                    style={{ flex: 1, padding: '0.25rem 0.4rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 700, backgroundColor: '#ffffff' }}
                  />

                  {activePayments.length > 1 && (
                    <button
                      type="button" onClick={() => handleRemovePaymentRow(idx)}
                      style={{ padding: '0.25rem 0.35rem', border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', cursor: 'pointer' }}
                      title="حذف طريقة الدفع"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.15rem' }}>
                {activePayments.length < 4 && (
                  <button
                    type="button" onClick={handleAddPaymentRow}
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
                  >
                    <Plus size={12} />
                    <span>إضافة طريقة دفع أخرى</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sale Notes */}
      <div style={{ marginBottom: '0.65rem' }}>
        <input type="text" placeholder="ملاحظات اختيارية على الفاتورة..." value={saleNotes} onChange={(e) => setSaleNotes(e.target.value)} style={{ width: '100%', padding: '0.35rem 0.5rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
      </div>

      {/* Final Amount */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '2px dashed #e2e8f0', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0d1527' }}>الصافي المطلوب:</span>
        <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ff6b22' }}>
          {finalAmount.toLocaleString('ar-EG')} <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>ج.م</span>
        </span>
      </div>

      {/* Checkout Submit Button */}
      <button
        type="button" className="btn-add"
        style={{ width: '100%', padding: '0.8rem 1rem', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', borderRadius: 'var(--radius-md)' }}
        disabled={isCartEmpty || isSubmitting || ((isEmployee || (targetAmount > 0 && isSplitMode)) && !isDistributionMatched)}
        onClick={onCheckout}
      >
        {isSubmitting ? (
          <><div className="spinner" /><span>جاري إتمام الفاتورة...</span></>
        ) : (
          <><CreditCard size={17} /><span>{isEmployee ? `تحصيل وإصدار فاتورة موظف (${finalAmount} ج.م)` : isPayLater ? 'اعتماد الفاتورة وتسجيل الدين' : `تحصيل وإصدار الفاتورة (${finalAmount} ج.م)`}</span></>
        )}
      </button>
    </div>
  );
};
