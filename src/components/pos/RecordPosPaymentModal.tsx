import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CreditCard, X } from 'lucide-react';
import {
  posDuePaymentsApi,
  posKeys,
  type PosDuePayment,
  type RecordPosPaymentPayload,
} from '../../modules/pos';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

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

  useEffect(() => {
    if (duePayment) {
      setPaymentAmount(duePayment.remainingAmount.toString());
    } else {
      setPaymentAmount('');
    }
  }, [duePayment]);

  const recordPaymentMutation = useMutation({
    mutationFn: (payload: RecordPosPaymentPayload) => posDuePaymentsApi.recordPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: posKeys.duePayments.all });
      showToast.success('تم تسجيل سداد الدفعة بنجاح وتحديث رصيد الدين');
      onClose();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل عملية السداد');
    },
  });

  if (!duePayment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(paymentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast.warning('يرجى إدخال مبلغ سداد صحيح');
      return;
    }

    if (amountNum > duePayment.remainingAmount) {
      showToast.warning('المبلغ المدخل أكبر من المتبقي على العميل');
      return;
    }

    recordPaymentMutation.mutate({
      duePaymentId: duePayment.id,
      amountPaid: amountNum,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="#ff6b22" />
            <h3 className="modal-title">سداد دفعة من الدين</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

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
                العميل: {duePayment.payerName}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>إجمالي الدين:</span>
                <span style={{ fontWeight: 600 }}>{duePayment.totalAmount.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>المتبقي المطلوب سداده:</span>
                <span style={{ fontWeight: 900, color: '#ef4444' }}>
                  {duePayment.remainingAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pay-amount">
                مبلغ الدفعة المسددة (ج.م) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="pay-amount"
                type="number"
                min="0.5"
                max={duePayment.remainingAmount}
                step="0.5"
                className="form-input"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
                disabled={recordPaymentMutation.isPending}
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}
                  onClick={() => setPaymentAmount(duePayment.remainingAmount.toString())}
                >
                  سداد المتبقي بالكامل ({duePayment.remainingAmount} ج.م)
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={recordPaymentMutation.isPending}>
              إلغاء
            </button>
            <button type="submit" className="btn-add" disabled={recordPaymentMutation.isPending}>
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

