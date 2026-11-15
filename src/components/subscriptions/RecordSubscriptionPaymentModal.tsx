import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, X, AlertCircle, Plus, Trash2, Split } from 'lucide-react';
import {
  subscriptionDuePaymentsApi, subscriptionDuePaymentKeys, subscriptionKeys,
  generateTimeIdempotencyKey, type SubscriptionDuePayment, type Subscription,
  type RecordSubscriptionPaymentPayload,
} from '../../modules/subscriptions';
import {
  type PaymentMethod, type PaymentMethodItem, PAYMENT_METHODS, paymentMethodLabel,
} from '../../modules/duePayments';
import { cashTransactionKeys } from '../../modules/cashTransactions';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';
import { blockInvalidNumberKeys } from '../../lib/number-input';

interface RecordSubscriptionPaymentModalProps {
  isOpen: boolean;
  duePayment: SubscriptionDuePayment | null;
  subscription?: Subscription | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RecordSubscriptionPaymentModal = ({
  isOpen, duePayment: initialDuePayment, subscription, onClose, onSuccess,
}: RecordSubscriptionPaymentModalProps) => {
  useModalEscape(onClose, isOpen);

  const queryClient = useQueryClient();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Cash');
  const [isSplit, setIsSplit] = useState(false);
  const [splitRows, setSplitRows] = useState<PaymentMethodItem[]>([
    { paymentMethod: 'Cash', amount: 0 }, { paymentMethod: 'InstaPay', amount: 0 },
  ]);

  const { data: fetchedDueData, isLoading: isDueLoading } = useQuery({
    queryKey: subscriptionDuePaymentKeys.list({ subscriptionId: subscription?.id }),
    queryFn: () => subscriptionDuePaymentsApi.getAll({ subscriptionId: subscription?.id, page: 1, pageSize: 1 }),
    enabled: isOpen && !initialDuePayment && Boolean(subscription?.id),
  });

  const activeDuePayment = initialDuePayment || fetchedDueData?.items?.[0] || null;

  useEffect(() => {
    if (activeDuePayment && isOpen) {
      const rem = activeDuePayment.remainingAmount;
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
  }, [activeDuePayment, isOpen]);

  const recordPaymentMutation = useMutation({
    mutationFn: (payload: RecordSubscriptionPaymentPayload) =>
      subscriptionDuePaymentsApi.recordPayment(payload),
    meta: { invalidate: [subscriptionDuePaymentKeys.all, subscriptionKeys.all, cashTransactionKeys.all] },
    onSuccess: async () => {
      showToast.success('تم تسجيل سداد الدفعة بنجاح وتحديث رصيد الاشتراك');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: subscriptionDuePaymentKeys.all }),
        queryClient.invalidateQueries({ queryKey: subscriptionKeys.all }),
        queryClient.invalidateQueries({ queryKey: cashTransactionKeys.all }),
      ]);
      onClose();
      onSuccess?.();
    },
    onError: (err: unknown) => showToast.apiError(err, 'فشل في تسجيل عملية السداد للاشتراك'),
  });

  if (!isOpen) return null;

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
    if (!activeDuePayment) return showToast.error('تعذر تحديد حساب المستحقات');

    let finalPayments: PaymentMethodItem[] = [];
    if (isSplit) {
      finalPayments = splitRows
        .map((r) => ({ paymentMethod: r.paymentMethod, amount: parseFloat(r.amount.toString()) || 0 }))
        .filter((r) => r.amount > 0);
      if (finalPayments.length === 0) return showToast.warning('يرجى إدخال مبلغ صحيح في طرق الدفع');
      if (splitTotal > activeDuePayment.remainingAmount) {
        return showToast.warning(`إجمالي مبالغ الدفع (${splitTotal} ج.م) يتجاوز الرصيد المطلوب (${activeDuePayment.remainingAmount} ج.م)`);
      }
    } else {
      const amountNum = parseFloat(paymentAmount);
      if (isNaN(amountNum) || amountNum <= 0) return showToast.warning('يرجى إدخال مبلغ سداد صحيح');
      if (amountNum > activeDuePayment.remainingAmount) {
        return showToast.warning(`المبلغ المدخل (${amountNum} ج.م) يتجاوز الرصيد المطلوب (${activeDuePayment.remainingAmount} ج.م)`);
      }
      finalPayments = [{ paymentMethod: selectedMethod, amount: amountNum }];
    }

    recordPaymentMutation.mutate({
      duePaymentId: activeDuePayment.id,
      payments: finalPayments,
      idempotencyKey: generateTimeIdempotencyKey(),
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 470, width: '95%' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '8px', backgroundColor: 'rgba(255, 107, 34, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b22' }}>
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.05rem' }}>سداد دفعة من مستحقات الاشتراك</h3>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>تسجيل استلام قسط أو دفعة بطرق دفع متعددة</span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {isDueLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 0.5rem' }} />
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>جاري فحص رصيد المستحقات...</span>
          </div>
        ) : !activeDuePayment ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ margin: 0, fontWeight: 700 }}>لا توجد مستحقات متبقية مسجلة لهذا الاشتراك</p>
            <button type="button" className="btn-secondary" style={{ marginTop: '1rem' }} onClick={onClose}>إغلاق</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Due Overview Card */}
              <div style={{ padding: '0.7rem 0.85rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0d1527' }}>العميل: {activeDuePayment.payerName}</div>
                <div style={{ fontSize: '0.76rem', color: '#64748b' }}>اشتراك رقم #{activeDuePayment.subscriptionId} — {activeDuePayment.description}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.4rem', textAlign: 'center' }}>
                  <div><span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>الإجمالي</span><span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{activeDuePayment.totalAmount.toLocaleString('ar-EG')} ج.م</span></div>
                  <div><span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>المسدد</span><span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.8rem' }}>{activeDuePayment.paidAmount.toLocaleString('ar-EG')} ج.م</span></div>
                  <div><span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>المتبقي</span><span style={{ color: '#ef4444', fontWeight: 900, fontSize: '0.85rem' }}>{activeDuePayment.remainingAmount.toLocaleString('ar-EG')} ج.م</span></div>
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
                          { paymentMethod: selectedMethod, amount: parseFloat(paymentAmount) || activeDuePayment.remainingAmount },
                          { paymentMethod: 'InstaPay', amount: 0 },
                        ]);
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: isSplit ? '#ff6b22' : '#0284c7', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <Split size={12} /><span>{isSplit ? 'طريقة واحدة' : 'تجزئة الدفع (أكثر من طريقة)'}</span>
                  </button>
                </div>

                {!isSplit ? (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
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
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" htmlFor="pay-due-amount" style={{ fontSize: '0.76rem', marginBottom: '0.15rem' }}>
                        المبلغ المسدد (ج.م) <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        id="pay-due-amount" type="number" min="0.5" max={activeDuePayment.remainingAmount} step="any"
                        className="form-input" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)}
                        onKeyDown={blockInvalidNumberKeys} required disabled={recordPaymentMutation.isPending}
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.88rem', fontWeight: 700 }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                      <span>حدد مبالغ طرق الدفع:</span>
                      <span style={{ fontWeight: 700, color: splitTotal === activeDuePayment.remainingAmount ? '#16a34a' : splitTotal > activeDuePayment.remainingAmount ? '#dc2626' : '#b45309' }}>
                        الإجمالي: {splitTotal} / {activeDuePayment.remainingAmount} ج.م
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
                          type="number" min="0" max={activeDuePayment.remainingAmount} step="any" placeholder="المبلغ"
                          value={r.amount || ''} onChange={(e) => handleUpdateSplitRow(idx, 'amount', Math.max(0, parseFloat(e.target.value) || 0))}
                          onKeyDown={blockInvalidNumberKeys}
                          style={{ flex: 1, padding: '0.28rem 0.45rem', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontWeight: 700, backgroundColor: '#ffffff' }}
                        />
                        {splitRows.length > 1 && (
                          <button
                            type="button" onClick={() => setSplitRows(splitRows.filter((_, i) => i !== idx))}
                            style={{ padding: '0.25rem 0.35rem', border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', cursor: 'pointer' }}
                            title="حذف"
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

                <button
                  type="button" className="btn-secondary"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem', fontWeight: 700, marginTop: '0.45rem' }}
                  onClick={() => {
                    if (isSplit) {
                      setSplitRows([{ paymentMethod: splitRows[0]?.paymentMethod || 'Cash', amount: activeDuePayment.remainingAmount }]);
                    } else {
                      setPaymentAmount(activeDuePayment.remainingAmount.toString());
                    }
                  }}
                >
                  سداد المتبقي بالكامل ({activeDuePayment.remainingAmount} ج.م)
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={recordPaymentMutation.isPending}>إلغاء</button>
              <button type="submit" className="btn-add" disabled={recordPaymentMutation.isPending || (isSplit && splitTotal <= 0)}>
                {recordPaymentMutation.isPending ? (<><div className="spinner" /><span>جاري التسجيل...</span></>) : (<span>تأكيد تسجيل السداد</span>)}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
