import { useState, useEffect, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Ban, X, AlertCircle } from 'lucide-react';
import type { Subscription } from '../../modules/subscriptions';
import {
  subscriptionCancellationsApi,
  subscriptionCancellationKeys,
} from '../../modules/subscriptionCancellations';
import { subscriptionKeys } from '../../modules/subscriptions';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  subscription: Subscription | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelSubscriptionModal = ({
  isOpen,
  subscription,
  onClose,
  onSuccess,
}: CancelSubscriptionModalProps) => {
  useModalEscape(onClose, isOpen);

  const [reason, setReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (subscription && isOpen) {
      setReason('');
      setRefundAmount(subscription.paidAmount > 0 ? subscription.paidAmount.toString() : '0');
      setNotes('');
    }
  }, [subscription, isOpen]);

  const mutation = useMutation({
    mutationFn: subscriptionCancellationsApi.create,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: subscriptionCancellationKeys.all });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      showToast.success(res.message || 'تم تسجيل إلغاء الاشتراك بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل إلغاء الاشتراك');
    },
  });

  if (!isOpen || !subscription) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      showToast.warning('يرجى تحديد سبب إلغاء الاشتراك');
      return;
    }

    const refundNum = parseFloat(refundAmount);
    if (isNaN(refundNum) || refundNum < 0) {
      showToast.warning('يرجى إدخال مبلغ استرداد صحيح');
      return;
    }

    if (refundNum > subscription.paidAmount) {
      showToast.warning(
        `مبلغ الاسترداد (${refundNum} ج.م) لا يمكن أن يتجاوز المبلغ المسدد بالفعل (${subscription.paidAmount} ج.م)`
      );
      return;
    }

    mutation.mutate({
      subscriptionId: subscription.id,
      reason: reason.trim(),
      refundAmount: refundNum,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card"
        style={{ maxWidth: 500 }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ban size={18} />
            </div>
            <div>
              <h3 className="modal-title" style={{ color: '#b91c1c' }}>إلغاء الاشتراك وتسجيل الاسترداد</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                اشتراك #{subscription.id} - {subscription.clientName}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Subscription Context Card */}
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
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>إجمالي الاشتراك</div>
                <div style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.95rem' }}>
                  {subscription.finalAmount.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>المسدد منه</div>
                <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.95rem' }}>
                  {subscription.paidAmount.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>المتبقي</div>
                <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.95rem' }}>
                  {subscription.remainingAmount.toLocaleString('ar-EG')} ج.م
                </div>
              </div>
            </div>

            {/* Reason Input */}
            <div className="form-group">
              <label className="form-label required">سبب الإلغاء</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: ظروف خاصة بالعميل، طلب استرداد، نقل..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>

            {/* Refund Amount Input */}
            <div className="form-group">
              <label className="form-label required">المبلغ المقرر استرداده للعميل (ج.م)</label>
              <input
                type="number"
                step="any"
                min="0"
                max={subscription.paidAmount}
                className="form-input"
                placeholder="0.00"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                required
                disabled={mutation.isPending}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                الحد الأقصى للاسترداد هو المبلغ المسدد من العميل ({subscription.paidAmount} ج.م)
              </span>
            </div>

            {/* Notes Input */}
            <div className="form-group">
              <label className="form-label">ملاحظات إضافية (اختياري)</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="أي تفاصيل أو ملاحظات إضافية حول الإلغاء..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={mutation.isPending}
              />
            </div>

            {/* Caution Callout */}
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: '#92400e',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <span>
                سيتم تحويل حالة الاشتراك إلى "ملغي" وتسجيل التزام الاسترداد في سجل الإلغاءات لصرفه للعميل لاحقاً.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              تراجع
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ backgroundColor: '#dc2626', borderColor: '#b91c1c' }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'جاري الإلغاء...' : 'تأكيد إلغاء الاشتراك'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

