import { useState, useEffect, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, CreditCard, Banknote, Smartphone, Phone, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import {
  duePaymentTransactionsApi, duePaymentTransactionKeys, duePaymentKeys,
  generateIdempotencyKey, dueTypeLabel, type DuePayment, type PaymentMethod,
  type PaymentMethodItem, type CreateDuePaymentTransactionPayload,
} from '../../modules/duePayments';
import { queryClient } from '../../lib/query-client';
import { cashTransactionKeys } from '../../modules/cashTransactions';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';
import { blockInvalidNumberKeys } from '../../lib/number-input';

interface RecordDuePaymentModalProps {
  duePayment: DuePayment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PAYMENT_METHODS: { method: PaymentMethod; label: string; icon: typeof Banknote }[] = [
  { method: 'Cash', label: 'نقداً', icon: Banknote },
  { method: 'InstaPay', label: 'إنستاباي', icon: Smartphone },
  { method: 'VodafoneCash', label: 'فودافون كاش', icon: Phone },
  { method: 'Visa', label: 'فيزا', icon: CreditCard },
];

export const RecordDuePaymentModal = ({
  duePayment, isOpen, onClose, onSuccess,
}: RecordDuePaymentModalProps) => {
  useModalEscape(onClose, isOpen);

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [isSplit, setIsSplit] = useState(false);
  const [splitRows, setSplitRows] = useState<PaymentMethodItem[]>([
    { paymentMethod: 'Cash', amount: 0 }, { paymentMethod: 'InstaPay', amount: 0 },
  ]);

  useEffect(() => {
    if (duePayment && isOpen) {
      setAmountPaid(duePayment.remainingAmount > 0 ? duePayment.remainingAmount.toString() : '');
      setSelectedMethod('Cash');
      setIsSplit(false);
      setSplitRows([
        { paymentMethod: 'Cash', amount: duePayment.remainingAmount > 0 ? duePayment.remainingAmount : 0 },
        { paymentMethod: 'InstaPay', amount: 0 },
      ]);
    } else {
      setAmountPaid('');
      setIsSplit(false);
    }
  }, [duePayment, isOpen]);

  const mutation = useMutation({
    mutationFn: (p: CreateDuePaymentTransactionPayload) => duePaymentTransactionsApi.recordTransaction(p),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: duePaymentKeys.all });
      queryClient.invalidateQueries({ queryKey: duePaymentTransactionKeys.all });
      queryClient.invalidateQueries({ queryKey: cashTransactionKeys.all });
      showToast.success(res.message || 'تم تسجيل عملية التحصيل والسداد بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => showToast.apiError(err, 'فشل في تسجيل عملية السداد'),
  });

  if (!isOpen || !duePayment) return null;

  const splitTotal = splitRows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const handleAddSplitRow = () => {
    const existing = new Set(splitRows.map((r) => r.paymentMethod));
    const next = PAYMENT_METHODS.find((o) => !existing.has(o.method))?.method || 'Visa';
    setSplitRows([...splitRows, { paymentMethod: next, amount: 0 }]);
  };

  const handleUpdateSplitRow = (idx: number, field: keyof PaymentMethodItem, val: string | number) => {
    setSplitRows(splitRows.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let finalPayments: PaymentMethodItem[] = [];

    if (isSplit) {
      finalPayments = splitRows
        .map((r) => ({ paymentMethod: r.paymentMethod, amount: parseFloat(r.amount.toString()) || 0 }))
        .filter((r) => r.amount > 0);
      if (finalPayments.length === 0) return showToast.warning('يرجى إدخال مبلغ صحيح في طرق الدفع المحددة');
      if (splitTotal > duePayment.remainingAmount) {
        return showToast.warning(`إجمالي مبالغ الدفع (${splitTotal} ج.م) يتجاوز الرصيد المتبقي المطلوب (${duePayment.remainingAmount} ج.م)`);
      }
    } else {
      const amountNum = parseFloat(amountPaid);
      if (isNaN(amountNum) || amountNum <= 0) return showToast.warning('يرجى إدخال مبلغ سداد صحيح أكبر من الصفر');
      if (amountNum > duePayment.remainingAmount) {
        return showToast.warning(`المبلغ المدخل (${amountNum} ج.م) يتجاوز الرصيد المتبقي المطلوب (${duePayment.remainingAmount} ج.م)`);
      }
      finalPayments = [{ paymentMethod: selectedMethod, amount: amountNum }];
    }

    mutation.mutate({
      duePaymentId: duePayment.id, payments: finalPayments, idempotencyKey: generateIdempotencyKey(),
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 490 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', backgroundColor: '#FFF7ED', color: '#F37023', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="modal-title">تسجيل دفعة سداد دين</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>تحصيل دفعة مالية وإثبات حركة سداد في الخزينة</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {/* Debt Details Card */}
            <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#64748b' }}>المدين:</span>
                <span style={{ fontWeight: 800, color: '#0d1527' }}>{duePayment.payerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#64748b' }}>نوع الدين:</span>
                <span style={{ fontWeight: 700, color: '#0284c7' }}>
                  {dueTypeLabel(duePayment.dueType)}
                  {duePayment.subscriptionId ? ` (#${duePayment.subscriptionId})` : ''}
                  {duePayment.saleId ? ` (#${duePayment.saleId})` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#64748b' }}>إجمالي الدين:</span>
                <span style={{ fontWeight: 700, color: '#0d1527' }}>{duePayment.totalAmount.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#64748b' }}>المسدد سابقاً:</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>{duePayment.paidAmount.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.3rem', borderTop: '1px dashed #cbd5e1' }}>
                <span style={{ fontWeight: 800, color: '#b91c1c' }}>المتبقي المطلوب:</span>
                <span style={{ fontWeight: 900, color: '#b91c1c', fontSize: '0.95rem' }}>
                  {duePayment.remainingAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            {/* Payment Method Switcher or Split Toggle */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label required">طريقة التحصيل / الدفع</label>
                <button
                  type="button"
                  onClick={() => setIsSplit(!isSplit)}
                  style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  {isSplit ? '⬅ العودة للدفع بطريقة واحدة' : 'تقسيم الدفع على أكثر من طريقة'}
                </button>
              </div>

              {!isSplit ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.45rem' }}>
                  {PAYMENT_METHODS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = selectedMethod === opt.method;
                    return (
                      <button
                        key={opt.method}
                        type="button"
                        onClick={() => setSelectedMethod(opt.method)}
                        style={{
                          padding: '0.55rem 0.3rem', borderRadius: 'var(--radius-sm)',
                          border: `2px solid ${isSelected ? '#F37023' : '#e2e8f0'}`,
                          backgroundColor: isSelected ? '#FFF7ED' : '#ffffff',
                          color: isSelected ? '#C2410C' : '#475569',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                          fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        <Icon size={16} color={isSelected ? '#F37023' : '#64748b'} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {splitRows.map((row, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <select
                        className="form-input" style={{ width: '42%' }} value={row.paymentMethod}
                        onChange={(e) => handleUpdateSplitRow(idx, 'paymentMethod', e.target.value as PaymentMethod)}
                      >
                        {PAYMENT_METHODS.map((o) => (<option key={o.method} value={o.method}>{o.label}</option>))}
                      </select>
                      <input
                        type="number" step="any" min="0" className="form-input" placeholder="المبلغ"
                        value={row.amount || ''}
                        onChange={(e) => handleUpdateSplitRow(idx, 'amount', parseFloat(e.target.value) || 0)}
                        onKeyDown={blockInvalidNumberKeys}
                      />
                      {splitRows.length > 1 && (
                        <button
                          type="button" onClick={() => setSplitRows(splitRows.filter((_, i) => i !== idx))}
                          style={{ padding: '0.4rem', border: 'none', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {splitRows.length < 4 && (
                      <button
                        type="button" onClick={handleAddSplitRow}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', color: '#0284c7', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                      >
                        <Plus size={14} /><span>إضافة طريقة دفع أخرى</span>
                      </button>
                    )}
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: splitTotal > duePayment.remainingAmount ? '#dc2626' : '#047857' }}>
                      إجمالي المقسم: {splitTotal} ج.م
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Single Method Amount Input */}
            {!isSplit && (
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label required">مبلغ الدفعة المحصلة (ج.م)</label>
                  {duePayment.remainingAmount > 0 && (
                    <button
                      type="button" onClick={() => setAmountPaid(duePayment.remainingAmount.toString())}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      سداد كامل المتبقي ({duePayment.remainingAmount.toLocaleString('ar-EG')} ج.م)
                    </button>
                  )}
                </div>
                <input
                  type="number" step="any" min="0.01" max={duePayment.remainingAmount}
                  className="form-input" placeholder="أدخل مبلغ السداد" value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)} onKeyDown={blockInvalidNumberKeys}
                  required disabled={mutation.isPending} autoFocus
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={mutation.isPending}>
              إلغاء
            </button>
            <button
              type="submit" className="btn-primary"
              disabled={mutation.isPending || (isSplit ? splitTotal <= 0 : !amountPaid || parseFloat(amountPaid) <= 0)}
            >
              {mutation.isPending ? (
                <>
                  <div className="spinner" />
                  <span>جاري تسجيل السداد...</span>
                </>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} />
                  <span>تأكيد تسجيل السداد</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
