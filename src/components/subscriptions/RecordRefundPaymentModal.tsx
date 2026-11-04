import { useState, useEffect, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { DollarSign, X } from 'lucide-react';
import type { SubscriptionCancellation } from '../../modules/subscriptionCancellations';
import {
  subscriptionCancellationsApi,
  subscriptionCancellationKeys,
} from '../../modules/subscriptionCancellations';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface RecordRefundPaymentModalProps {
  isOpen: boolean;
  cancellation: SubscriptionCancellation | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const RecordRefundPaymentModal = ({
  isOpen,
  cancellation,
  onClose,
  onSuccess,
}: RecordRefundPaymentModalProps) => {
  useModalEscape(onClose, isOpen);

  const [paymentAmount, setPaymentAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (cancellation && isOpen) {
      setPaymentAmount(
        cancellation.remainingRefundAmount > 0
          ? cancellation.remainingRefundAmount.toString()
          : ''
      );
      setNotes('');
    }
  }, [cancellation, isOpen]);

  const mutation = useMutation({
    mutationFn: (amount: number) => {
      if (!cancellation) throw new Error('لا يوجد إشعار إلغاء محدد');
      return subscriptionCancellationsApi.recordRefundPayment(cancellation.id, {
        paymentAmount: amount,
        cashboxType: 'Subscriptions',
        notes: notes.trim() || undefined,
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: subscriptionCancellationKeys.all });
      showToast.success(res.message || 'تم تسجيل صرف الاسترداد بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل عملية صرف الاسترداد');
    },
  });

  if (!isOpen || !cancellation) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast.warning('يرجى إدخال مبلغ صرف صحيح أكبر من الصفر');
      return;
    }

    if (amountNum > cancellation.remainingRefundAmount) {
      showToast.warning(
        `المبلغ المدخل (${amountNum} ج.م) أكبر من المبلغ المتبقي المستحق (${cancellation.remainingRefundAmount} ج.م)`
      );
      return;
    }

    mutation.mutate(amountNum);
  };

  const handleFullPayoff = () => {
    setPaymentAmount(cancellation.remainingRefundAmount.toString());
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card"
        style={{ maxWidth: 460 }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={18} />
            </div>
            <div>
              <h3 className="modal-title">صرف مبلغ استرداد للعميل</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                إلغاء اشتراك #{cancellation.subscriptionId} (قيد #{cancellation.id})
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Refund Balances Summary */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>إجمالي الاسترداد</div>
                <div style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.95rem' }}>
                  {cancellation.refundAmount.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>المصروف سابقاً</div>
                <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.95rem' }}>
                  {cancellation.paidRefundAmount.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>المتبقي للصرف</div>
                <div style={{ fontWeight: 800, color: '#b91c1c', fontSize: '0.95rem' }}>
                  {cancellation.remainingRefundAmount.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
            </div>

            {/* Quick Fill Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleFullPayoff}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                صرف كامل المتبقي ({cancellation.remainingRefundAmount} ج.م)
              </button>
            </div>

            {/* Payment Amount Input */}
            <div className="form-group">
              <label className="form-label required">مبلغ الدفعة المنصرفة (ج.م)</label>
              <input
                type="number"
                step="any"
                min="0.01"
                max={cancellation.remainingRefundAmount}
                className="form-input"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
                disabled={mutation.isPending}
                autoFocus
              />
            </div>

            {/* Notes Input */}
            <div className="form-group">
              <label className="form-label">ملاحظات الصرف (اختياري)</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: نقداً للعميل، تحويل بنكي..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={mutation.isPending}
              />
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
              className="btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'جاري تسجيل الصرف...' : 'تأكيد تسجيل الصرف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

