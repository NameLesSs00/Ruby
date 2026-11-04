import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, UserPlus } from 'lucide-react';
import {
  duePaymentsApi,
  duePaymentKeys,
  type CreateExternalDebtPayload,
} from '../../modules/duePayments';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface CreateExternalDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateExternalDebtModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateExternalDebtModalProps) => {
  useModalEscape(onClose, isOpen);

  const [payerName, setPayerName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPayerName('');
      setTotalAmount('');
      setDueDate('');
      setDescription('');
    }
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: (payload: CreateExternalDebtPayload) => duePaymentsApi.createExternalDebt(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: duePaymentKeys.all });
      showToast.success(res.message || 'تم تسجيل الدين الخارجي بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل الدين الخارجي');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!payerName.trim()) {
      showToast.warning('يرجى إدخال اسم المدين أو الجهة');
      return;
    }

    const amountNum = parseFloat(totalAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast.warning('يرجى إدخال مبلغ صحيح أكبر من الصفر');
      return;
    }

    if (!description.trim()) {
      showToast.warning('يرجى كتابة بيان وسبب الدين');
      return;
    }

    mutation.mutate({
      payerName: payerName.trim(),
      totalAmount: amountNum,
      dueDate: dueDate ? dueDate : null,
      description: description.trim(),
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={20} color="#ff6b22" />
            <h3 className="modal-title">تسجيل دين / مستحق خارجي جديد</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="debt-payer-name">
                اسم المدين أو الجهة <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="debt-payer-name"
                type="text"
                className="form-input"
                placeholder="مثال: أحمد عبد الله، شركة النظافة، جهة تنظيمية..."
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                required
                disabled={mutation.isPending}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="debt-amount">
                المبلغ المطلوب (بالجنيه المصري) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="debt-amount"
                type="number"
                step="0.5"
                min="0.5"
                className="form-input"
                placeholder="مثال: 500"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="debt-due-date">
                تاريخ الاستحقاق (اختياري)
              </label>
              <input
                id="debt-due-date"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={mutation.isPending}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="debt-description">
                البيان والسبب <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="debt-description"
                rows={3}
                className="form-input"
                placeholder="أدخل سبب أو تفاصيل هذا الدين والمستحق المالي..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={mutation.isPending}
                style={{ resize: 'vertical' }}
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
              className="btn-add"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <div className="spinner" />
                  <span>جاري التسجيل...</span>
                </>
              ) : (
                <span>تسجيل الدين الخارجي</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

