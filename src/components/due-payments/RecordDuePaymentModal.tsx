import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, CreditCard } from 'lucide-react';
import {
  duePaymentTransactionsApi,
  duePaymentTransactionKeys,
  duePaymentKeys,
  generateIdempotencyKey,
  dueTypeLabel,
  type DuePayment,
  type CreateDuePaymentTransactionPayload,
} from '../../modules/duePayments';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface RecordDuePaymentModalProps {
  duePayment: DuePayment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RecordDuePaymentModal = ({
  duePayment,
  isOpen,
  onClose,
  onSuccess,
}: RecordDuePaymentModalProps) => {
  const [amountPaid, setAmountPaid] = useState('');

  useEffect(() => {
    if (duePayment && isOpen) {
      setAmountPaid(
        duePayment.remainingAmount > 0 ? duePayment.remainingAmount.toString() : ''
      );
    } else {
      setAmountPaid('');
    }
  }, [duePayment, isOpen]);

  const mutation = useMutation({
    mutationFn: (payload: CreateDuePaymentTransactionPayload) =>
      duePaymentTransactionsApi.recordTransaction(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: duePaymentKeys.all });
      queryClient.invalidateQueries({ queryKey: duePaymentTransactionKeys.all });
      showToast.success(res.message || 'تم تسجيل عملية التحصيل والسداد بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تسجيل عملية السداد');
    },
  });

  if (!isOpen || !duePayment) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amountPaid);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast.warning('يرجى إدخال مبلغ سداد صحيح أكبر من الصفر');
      return;
    }

    if (amountNum > duePayment.remainingAmount) {
      showToast.warning(
        `المبلغ المدخل (${amountNum} ج.م) يتجاوز الرصيد المتبقي المطلوب (${duePayment.remainingAmount} ج.م)`
      );
      return;
    }

    // Generate a guaranteed unique idempotencyKey for every individual transaction attempt
    const freshIdempotencyKey = generateIdempotencyKey();

    mutation.mutate({
      duePaymentId: duePayment.id,
      amountPaid: amountNum,
      idempotencyKey: freshIdempotencyKey,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} color="#ff6b22" />
            <h3 className="modal-title">تسجيل دفعة سداد دين</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Debt Details Card */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>المدين:</span>
                <span style={{ fontWeight: 800, color: '#0d1527' }}>{duePayment.payerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>نوع الدين:</span>
                <span style={{ fontWeight: 700, color: '#0284c7' }}>
                  {dueTypeLabel(duePayment.dueType)}
                  {duePayment.subscriptionId ? ` (#${duePayment.subscriptionId})` : ''}
                  {duePayment.saleId ? ` (#${duePayment.saleId})` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>إجمالي الدين:</span>
                <span style={{ fontWeight: 700, color: '#0d1527' }}>
                  {duePayment.totalAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>المسدد سابقاً:</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                  {duePayment.paidAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '0.35rem',
                  borderTop: '1px dashed #cbd5e1',
                  marginTop: '0.35rem',
                }}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#b91c1c' }}>
                  المتبقي المطلوب تحصيله:
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#b91c1c' }}>
                  {duePayment.remainingAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="pay-due-amount">
                مبلغ الدفعة المحصلة (ج.م) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="pay-due-amount"
                type="number"
                step="0.5"
                min="0.5"
                max={duePayment.remainingAmount}
                className="form-input"
                placeholder="أدخل مبلغ السداد"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                required
                disabled={mutation.isPending}
                autoFocus
              />
              {duePayment.remainingAmount > 0 && (
                <div style={{ marginTop: '0.4rem', textAlign: 'end' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}
                    onClick={() => setAmountPaid(duePayment.remainingAmount.toString())}
                  >
                    سداد كامل المتبقي ({duePayment.remainingAmount.toLocaleString('ar-EG')} ج.م)
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-add"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <div className="spinner" />
                  <span>جاري تسجيل السداد...</span>
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

