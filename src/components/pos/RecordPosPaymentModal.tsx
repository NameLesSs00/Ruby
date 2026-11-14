import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CreditCard, X, Plus, Trash2, Split } from 'lucide-react';
import {
  posDuePaymentsApi,
  posKeys,
  type PosDuePayment,
  type RecordPosPaymentPayload,
} from '../../modules/pos';
import {
  type PaymentMethod,
  type PaymentMethodItem,
  PAYMENT_METHODS,
  paymentMethodLabel,
  generateIdempotencyKey,
} from '../../modules/duePayments';
import { queryClient } from '../../lib/query-client';
import { cashTransactionKeys } from '../../modules/cashTransactions';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';
import { blockInvalidNumberKeys } from '../../lib/number-input';

interface RecordPosPaymentModalProps {
  duePayment: PosDuePayment | null;
  onClose: () => void;
}

export const RecordPosPaymentModal = ({
  duePayment,
  onClose,
}: RecordPosPaymentModalProps) => {
  useModalEscape(onClose);

  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Cash');
  const [isSplit, setIsSplit] = useState(false);
  const [splitRows, setSplitRows] = useState<PaymentMethodItem[]>([
    { paymentMethod: 'Cash', amount: 0 },
    { paymentMethod: 'InstaPay', amount: 0 },
  ]);

  useEffect(() => {
    if (duePayment) {
      const rem = duePayment.remainingAmount;
      setPaymentAmount(rem > 0 ? rem.toString() : '');
      setSelectedMethod('Cash');
      setIsSplit(false);
      setSplitRows([
        { paymentMethod: 'Cash', amount: rem > 0 ? rem : 0 },
        { paymentMethod: 'InstaPay', amount: 0 },
      ]);
    } else {
      setPaymentAmount('');
      setIsSplit(false);
    }
  }, [duePayment]);

  const recordPaymentMutation = useMutation({
    mutationFn: (payload: RecordPosPaymentPayload) => posDuePaymentsApi.recordPayment(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: posKeys.duePayments.all });
      queryClient.invalidateQueries({ queryKey: cashTransactionKeys.all });
      showToast.success(res.message || 'تم تسجيل سداد الدفعة بنجاح وتحديث رصيد الدين');
      onClose();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل عملية السداد');
    },
  });

  if (!duePayment) return null;

  const splitTotal = splitRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleAddSplitRow = () => {
    const existing = new Set(splitRows.map((r) => r.paymentMethod));
    const next = PAYMENT_METHODS.find((m) => !existing.has(m)) || 'Visa';
    setSplitRows([...splitRows, { paymentMethod: next, amount: 0 }]);
  };

  const handleUpdateSplitRow = (idx: number, field: keyof PaymentMethodItem, val: string | number) => {
    setSplitRows(splitRows.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalPayments: PaymentMethodItem[] = [];

    if (isSplit) {
      finalPayments = splitRows
        .map((r) => ({ paymentMethod: r.paymentMethod, amount: parseFloat(r.amount.toString()) || 0 }))
        .filter((r) => r.amount > 0);

      if (finalPayments.length === 0) {
        return showToast.warning('يرجى إدخال مبلغ صحيح في طرق الدفع المحددة');
      }
      if (splitTotal > duePayment.remainingAmount) {
        return showToast.warning(`إجمالي مبالغ الدفع (${splitTotal} ج.م) يتجاوز الرصيد المتبقي المطلوب (${duePayment.remainingAmount} ج.م)`);
      }
    } else {
      const amountNum = parseFloat(paymentAmount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return showToast.warning('يرجى إدخال مبلغ سداد صحيح أكبر من الصفر');
      }
      if (amountNum > duePayment.remainingAmount) {
        return showToast.warning(`المبلغ المدخل (${amountNum} ج.م) يتجاوز الرصيد المتبقي المطلوب (${duePayment.remainingAmount} ج.م)`);
      }
      finalPayments = [{ paymentMethod: selectedMethod, amount: amountNum }];
    }

    recordPaymentMutation.mutate({
      duePaymentId: duePayment.id,
      payments: finalPayments,
      idempotencyKey: generateIdempotencyKey(),
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="#ff6b22" />
            <h3 className="modal-title">سداد دفعة من الدين (POS)</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Overview Card */}
            <div
              style={{
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                marginBottom: '0.75rem',
              }}
            >
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0d1527' }}>
                العميل: {duePayment.payerName}
              </div>
              {duePayment.description && (
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.15rem' }}>
                  {duePayment.description}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.45rem', fontSize: '0.82rem' }}>
                <span style={{ color: '#64748b' }}>إجمالي الدين:</span>
                <span style={{ fontWeight: 700 }}>{duePayment.totalAmount.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>المتبقي المطلوب سداده:</span>
                <span style={{ fontWeight: 900, color: '#ef4444' }}>
                  {duePayment.remainingAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            {/* Payment Methods Section */}
            <div style={{ marginBottom: '0.75rem', backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0d1527' }}>طريقة السداد:</label>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isSplit;
                    setIsSplit(next);
                    if (next && (!splitRows || splitRows.length === 0)) {
                      setSplitRows([
                        { paymentMethod: selectedMethod, amount: parseFloat(paymentAmount) || duePayment.remainingAmount },
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
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMethod(m)}
                        style={{
                          padding: '0.35rem 0.15rem',
                          fontSize: '0.73rem',
                          fontWeight: 700,
                          borderRadius: '4px',
                          border: selectedMethod === m ? '1px solid #ff6b22' : '1px solid #cbd5e1',
                          backgroundColor: selectedMethod === m ? '#fff7ed' : '#ffffff',
                          color: selectedMethod === m ? '#c2410c' : '#475569',
                          cursor: 'pointer',
                          textAlign: 'center',
                        }}
                      >
                        {paymentMethodLabel(m)}
                      </button>
                    ))}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="pay-amount" style={{ fontSize: '0.76rem', marginBottom: '0.15rem' }}>
                      مبلغ الدفعة المسددة (ج.م) <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="pay-amount"
                      type="number"
                      min="0.01"
                      max={duePayment.remainingAmount}
                      step="any"
                      className="form-input"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      onKeyDown={blockInvalidNumberKeys}
                      required
                      disabled={recordPaymentMutation.isPending}
                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.88rem', fontWeight: 700 }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                    <span>حدد مبالغ طرق الدفع:</span>
                    <span style={{ fontWeight: 700, color: splitTotal === duePayment.remainingAmount ? '#16a34a' : splitTotal > duePayment.remainingAmount ? '#dc2626' : '#b45309' }}>
                      الإجمالي: {splitTotal} / {duePayment.remainingAmount} ج.م
                    </span>
                  </div>

                  {splitRows.map((r, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <select
                        className="form-input"
                        style={{ width: '45%', padding: '0.28rem 0.35rem', fontSize: '0.76rem', backgroundColor: '#ffffff' }}
                        value={r.paymentMethod}
                        onChange={(e) => handleUpdateSplitRow(idx, 'paymentMethod', e.target.value as PaymentMethod)}
                      >
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m} value={m}>{paymentMethodLabel(m)}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="0"
                        max={duePayment.remainingAmount}
                        step="any"
                        placeholder="المبلغ"
                        value={r.amount || ''}
                        onChange={(e) => handleUpdateSplitRow(idx, 'amount', Math.max(0, parseFloat(e.target.value) || 0))}
                        onKeyDown={blockInvalidNumberKeys}
                        style={{ flex: 1, padding: '0.28rem 0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 700, backgroundColor: '#ffffff' }}
                      />
                      {splitRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setSplitRows(splitRows.filter((_, i) => i !== idx))}
                          style={{ padding: '0.25rem 0.35rem', border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', cursor: 'pointer' }}
                          title="حذف طريقة الدفع"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}

                  {splitRows.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddSplitRow}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', padding: 0 }}
                    >
                      <Plus size={12} />
                      <span>إضافة طريقة دفع أخرى</span>
                    </button>
                  )}
                </div>
              )}

              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', fontWeight: 700, marginTop: '0.45rem' }}
                onClick={() => {
                  if (isSplit) {
                    setSplitRows([
                      { paymentMethod: splitRows[0]?.paymentMethod || 'Cash', amount: duePayment.remainingAmount },
                    ]);
                  } else {
                    setPaymentAmount(duePayment.remainingAmount.toString());
                  }
                }}
              >
                سداد المتبقي بالكامل ({duePayment.remainingAmount} ج.م)
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={recordPaymentMutation.isPending}>
              إلغاء
            </button>
            <button type="submit" className="btn-add" disabled={recordPaymentMutation.isPending || (isSplit && splitTotal <= 0)}>
              {recordPaymentMutation.isPending ? (
                <>
                  <div className="spinner" />
                  <span>جاري التسجيل...</span>
                </>
              ) : (
                <span>تأكيد تسجيل السداد</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
