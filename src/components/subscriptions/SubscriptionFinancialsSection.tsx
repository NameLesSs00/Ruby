import type { Dispatch, SetStateAction } from 'react';
import { Coins, CheckCircle2, AlertCircle, Plus, Trash2, Split } from 'lucide-react';
import { blockInvalidNumberKeys } from '../../lib/number-input';
import {
  type PaymentMethod,
  type PaymentMethodItem,
  PAYMENT_METHODS,
  paymentMethodLabel,
} from '../../modules/duePayments';

interface SubscriptionFinancialsSectionProps {
  amount: number | '';
  setAmount: Dispatch<SetStateAction<number | ''>>;
  discountAmount: number | '';
  setDiscountAmount: Dispatch<SetStateAction<number | ''>>;
  paidAmount: number | '';
  setPaidAmount: Dispatch<SetStateAction<number | ''>>;
  selectedMethod: PaymentMethod;
  setSelectedMethod: Dispatch<SetStateAction<PaymentMethod>>;
  isSplit: boolean;
  setIsSplit: Dispatch<SetStateAction<boolean>>;
  splitRows: PaymentMethodItem[];
  setSplitRows: Dispatch<SetStateAction<PaymentMethodItem[]>>;
  isSaving: boolean;
  isEditing?: boolean;
}

export const SubscriptionFinancialsSection = ({
  amount, setAmount, discountAmount, setDiscountAmount, paidAmount, setPaidAmount,
  selectedMethod, setSelectedMethod, isSplit, setIsSplit, splitRows, setSplitRows,
  isSaving, isEditing = false,
}: SubscriptionFinancialsSectionProps) => {
  const numAmount = Number(amount) || 0;
  const numDiscount = Number(discountAmount) || 0;
  const numPaid = Number(paidAmount) || 0;
  const finalAmount = Math.max(0, numAmount - numDiscount);
  const remainingAmount = Math.max(0, finalAmount - numPaid);

  const splitTotal = splitRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleAddSplitRow = () => {
    const existing = new Set(splitRows.map((r) => r.paymentMethod));
    const next = PAYMENT_METHODS.find((m) => !existing.has(m)) || 'Visa';
    setSplitRows([...splitRows, { paymentMethod: next, amount: 0 }]);
  };

  const handleUpdateSplitRow = (idx: number, field: keyof PaymentMethodItem, val: string | number) => {
    setSplitRows(splitRows.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  };

  const handleRemoveSplitRow = (idx: number) => {
    if (splitRows.length <= 1) return;
    setSplitRows(splitRows.filter((_, i) => i !== idx));
  };

  return (
    <div className="form-section" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
        <Coins size={16} color="#ff6b22" />
        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0d1527' }}>
          3. البيانات المالية وطرق الدفع
        </h4>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="sub-amount">
            قيمة الاشتراك (ج.م) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="sub-amount" type="number" min="0" step="any" className="form-input" placeholder="0.00"
            value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            onKeyDown={blockInvalidNumberKeys} required disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sub-discount">الخصم (ج.م)</label>
          <input
            id="sub-discount" type="number" min="0" step="any" className="form-input" placeholder="0.00"
            value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))}
            onKeyDown={blockInvalidNumberKeys} disabled={isSaving}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sub-paid">المدفوع مقدماً (ج.م)</label>
          <input
            id="sub-paid" type="number" min="0" max={finalAmount} step="any" className="form-input" placeholder="0.00"
            value={paidAmount} onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
            onKeyDown={blockInvalidNumberKeys} disabled={isSaving}
          />
        </div>
      </div>

      {/* Quick Pay in Full Button */}
      {finalAmount > 0 && numPaid < finalAmount && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.35rem', marginBottom: '0.65rem' }}>
          <button
            type="button" className="btn-secondary"
            style={{ padding: '0.2rem 0.6rem', fontSize: '0.74rem', fontWeight: 700 }}
            onClick={() => {
              setPaidAmount(finalAmount);
              if (isSplit) {
                setSplitRows([{ paymentMethod: splitRows[0]?.paymentMethod || 'Cash', amount: finalAmount }]);
              }
            }}
          >
            سداد الصافي بالكامل ({finalAmount.toLocaleString('ar-EG')} ج.م)
          </button>
        </div>
      )}

      {/* Payment Method Selector (Only for new subscriptions when paidAmount > 0) */}
      {!isEditing && numPaid > 0 && (
        <div style={{ backgroundColor: '#f8fafc', padding: '0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0d1527' }}>
              طريقة دفع المبلغ المقدم ({numPaid} ج.م):
            </label>
            <button
              type="button"
              onClick={() => {
                const next = !isSplit;
                setIsSplit(next);
                if (next && (!splitRows || splitRows.length === 0)) {
                  setSplitRows([
                    { paymentMethod: selectedMethod, amount: numPaid },
                    { paymentMethod: 'InstaPay', amount: 0 },
                  ]);
                }
              }}
              style={{ background: 'none', border: 'none', color: isSplit ? '#ff6b22' : '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <Split size={12} />
              <span>{isSplit ? 'طريقة واحدة' : 'تجزئة الدفع (أكثر من طريقة)'}</span>
            </button>
          </div>

          {!isSplit ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem' }}>
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m} type="button" onClick={() => setSelectedMethod(m)}
                  style={{
                    padding: '0.35rem 0.15rem', fontSize: '0.73rem', fontWeight: 700, borderRadius: '4px',
                    border: selectedMethod === m ? '1px solid #ff6b22' : '1px solid #cbd5e1',
                    backgroundColor: selectedMethod === m ? '#fff7ed' : '#ffffff',
                    color: selectedMethod === m ? '#c2410c' : '#475569', cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  {paymentMethodLabel(m)}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                <span>حدد مبالغ طرق الدفع:</span>
                <span style={{ fontWeight: 700, color: splitTotal === numPaid ? '#16a34a' : splitTotal > numPaid ? '#dc2626' : '#b45309' }}>
                  الإجمالي: {splitTotal} / {numPaid} ج.م
                </span>
              </div>

              {splitRows.map((r, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <select
                    className="form-input" style={{ width: '45%', padding: '0.28rem 0.35rem', fontSize: '0.76rem', backgroundColor: '#ffffff' }}
                    value={r.paymentMethod} onChange={(e) => handleUpdateSplitRow(idx, 'paymentMethod', e.target.value as PaymentMethod)}
                  >
                    {PAYMENT_METHODS.map((m) => (<option key={m} value={m}>{paymentMethodLabel(m)}</option>))}
                  </select>
                  <input
                    type="number" min="0" max={numPaid} step="any" placeholder="المبلغ" value={r.amount || ''}
                    onChange={(e) => handleUpdateSplitRow(idx, 'amount', Math.max(0, parseFloat(e.target.value) || 0))}
                    onKeyDown={blockInvalidNumberKeys}
                    style={{ flex: 1, padding: '0.28rem 0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 700, backgroundColor: '#ffffff' }}
                  />
                  {splitRows.length > 1 && (
                    <button
                      type="button" onClick={() => handleRemoveSplitRow(idx)}
                      style={{ padding: '0.25rem 0.35rem', border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', cursor: 'pointer' }}
                      title="حذف طريقة الدفع"
                    ><Trash2 size={13} /></button>
                  )}
                </div>
              ))}

              {splitRows.length < 4 && (
                <button
                  type="button" onClick={handleAddSplitRow}
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
                >
                  <Plus size={12} /><span>إضافة طريقة دفع أخرى</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Financials & Balance Summary Card */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: '#f8fafc',
          padding: '0.75rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0',
        }}
      >
        <div>
          <span style={{ fontSize: '0.73rem', color: '#64748b', display: 'block' }}>صافي قيمة الاشتراك المستحقة</span>
          <strong style={{ fontSize: '1.1rem', color: '#ff6b22' }}>
            {finalAmount.toLocaleString('ar-EG')} <span style={{ fontSize: '0.75rem' }}>ج.م</span>
          </strong>
        </div>

        <div>
          <span style={{ fontSize: '0.73rem', color: '#64748b', display: 'block' }}>المتبقي بعد السداد</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
            {remainingAmount === 0 ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontWeight: 800 }}>
                <CheckCircle2 size={16} /><span>خالص بالكامل (0 ج.م)</span>
              </div>
            ) : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontWeight: 800 }}>
                <AlertCircle size={16} /><span>{remainingAmount.toLocaleString('ar-EG')} ج.م (دين مؤجل)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

