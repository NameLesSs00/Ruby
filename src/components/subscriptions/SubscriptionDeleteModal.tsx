import { useMutation } from '@tanstack/react-query';
import { X, AlertTriangle } from 'lucide-react';
import { subscriptionsApi, subscriptionKeys } from '../../modules/subscriptions';
import type { Subscription } from '../../modules/subscriptions';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface SubscriptionDeleteModalProps {
  subscription: Subscription | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubscriptionDeleteModal = ({
  subscription,
  onClose,
  onSuccess,
}: SubscriptionDeleteModalProps) => {
  useModalEscape(onClose);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => subscriptionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      showToast.success('تم حذف الاشتراك بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'تعذر حذف الاشتراك');
    },
  });

  if (!subscription) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: '#ef4444' }}>تأكيد حذف الاشتراك</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="confirm-delete-box">
            <div className="delete-warning-icon"><AlertTriangle size={32} /></div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0d1527', marginBottom: '0.4rem' }}>
                هل أنت متأكد من حذف اشتراك العميل {subscription.clientName}؟
              </p>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                لا يمكن التراجع عن هذا الإجراء، وسيتم رفض الحذف في حال وجود سجلات دفعات مالية مرتبطة.
              </p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={deleteMutation.isPending}>
            إلغاء
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={() => deleteMutation.mutate(subscription.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <><div className="spinner" /><span>جاري الحذف...</span></> : <span>نعم، حذف الاشتراك</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

