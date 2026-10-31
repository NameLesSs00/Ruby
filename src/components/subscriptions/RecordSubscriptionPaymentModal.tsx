import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreditCard, X, AlertCircle } from 'lucide-react';
import {
  subscriptionDuePaymentsApi,
  subscriptionDuePaymentKeys,
  subscriptionKeys,
  type SubscriptionDuePayment,
  type Subscription,
  type RecordSubscriptionPaymentPayload,
} from '../../modules/subscriptions';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface RecordSubscriptionPaymentModalProps {
  isOpen: boolean;
  duePayment: SubscriptionDuePayment | null;
  subscription?: Subscription | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RecordSubscriptionPaymentModal = ({
  isOpen,
  duePayment: initialDuePayment,
  subscription,
  onClose,
  onSuccess,
}: RecordSubscriptionPaymentModalProps) => {
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  // If opened with just a subscription, fetch its due payment record
  const { data: fetchedDueData, isLoading: isDueLoading } = useQuery({
    queryKey: subscriptionDuePaymentKeys.list({ subscriptionId: subscription?.id }),
    queryFn: () => subscriptionDuePaymentsApi.getAll({ subscriptionId: subscription?.id, page: 1, pageSize: 1 }),
    enabled: isOpen && !initialDuePayment && Boolean(subscription?.id),
  });

  const activeDuePayment: SubscriptionDuePayment | null =
    initialDuePayment || fetchedDueData?.items?.[0] || null;

  useEffect(() => {
    if (activeDuePayment) {
      setPaymentAmount(activeDuePayment.remainingAmount.toString());
    } else {
      setPaymentAmount('');
    }
  }, [activeDuePayment]);

  const recordPaymentMutation = useMutation({
    mutationFn: (payload: RecordSubscriptionPaymentPayload) =>
      subscriptionDuePaymentsApi.recordPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionDuePaymentKeys.all });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      showToast.success('تم تسجيل سداد الدفعة بنجاح وتحديث رصيد الاشتراك');
      onClose();
      onSuccess?.();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تسجيل عملية السداد للاشتراك');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDuePayment) {
      showToast.error('تعذر تحديد حساب المستحقات لهذا الاشتراك');
      return;
    }

    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast.warning('يرجى إدخال مبلغ سداد صحيح');
      return;
    }

    if (amountNum > activeDuePayment.remainingAmount) {
      showToast.warning('المبلغ المدخل أكبر من المتبقي على العميل');
      return;
    }

    recordPaymentMutation.mutate({
      duePaymentId: activeDuePayment.id,
      amountPaid: amountNum,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 460, width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 107, 34, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff6b22',
              }}
            >
              <CreditCard size={18} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.1rem' }}>
                سداد دفعة من مستحقات الاشتراك
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                تسجيل استلام قسط أو دفعة نقدية في الخزينة
              </span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {isDueLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 0.5rem' }} />
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              جاري فحص رصيد المستحقات للاشتراك...
            </span>
          </div>
        ) : !activeDuePayment ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ margin: 0, fontWeight: 700 }}>
              لا توجد مستحقات متبقية مسجلة لهذا الاشتراك، أو تم السداد بالكامل
            </p>
            <button
              type="button"
              className="btn-secondary"
              style={{ marginTop: '1rem' }}
              onClick={onClose}
            >
              إغلاق
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0d1527' }}>
                  العميل: {activeDuePayment.payerName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                  اشتراك رقم #{activeDuePayment.subscriptionId} — {activeDuePayment.description}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.65rem',
                    fontSize: '0.85rem',
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '0.45rem',
                  }}
                >
                  <span style={{ color: '#64748b' }}>إجمالي الاشتراك:</span>
                  <span style={{ fontWeight: 700 }}>
                    {activeDuePayment.totalAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: '#64748b' }}>المسدد مسبقاً:</span>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>
                    {activeDuePayment.paidAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '0.25rem',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: '#64748b' }}>المتبقي المطلوب سداده:</span>
                  <span style={{ fontWeight: 900, color: '#ef4444' }}>
                    {activeDuePayment.remainingAmount.toLocaleString('ar-EG')} ج.م
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="pay-due-amount">
                  مبلغ الدفعة المسددة (ج.م) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="pay-due-amount"
                  type="number"
                  min="0.5"
                  max={activeDuePayment.remainingAmount}
                  step="any"
                  className="form-input"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  disabled={recordPaymentMutation.isPending}
                />
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.45rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}
                    onClick={() => setPaymentAmount(activeDuePayment.remainingAmount.toString())}
                  >
                    سداد المتبقي بالكامل ({activeDuePayment.remainingAmount} ج.م)
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={recordPaymentMutation.isPending}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn-add"
                disabled={recordPaymentMutation.isPending}
              >
                {recordPaymentMutation.isPending ? (
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
        )}
      </div>
    </div>
  );
};

