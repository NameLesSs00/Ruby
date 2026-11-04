import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, TrendingUp } from 'lucide-react';
import {
  otherIncomesApi,
  otherIncomeKeys,
  type OtherIncome,
  type CreateOtherIncomePayload,
  type UpdateOtherIncomePayload,
} from '../../modules/expenses';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface OtherIncomeFormModalProps {
  isOpen: boolean;
  editingIncome: OtherIncome | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const OtherIncomeFormModal = ({
  isOpen,
  editingIncome,
  onClose,
  onSuccess,
}: OtherIncomeFormModalProps) => {
  const [amount, setAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingIncome) {
      setAmount(editingIncome.amount.toString());
      const d = editingIncome.incomeDate
        ? new Date(editingIncome.incomeDate).toISOString().slice(0, 16)
        : '';
      setIncomeDate(d);
      setDescription(editingIncome.description || '');
    } else {
      setAmount('');
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setIncomeDate(now.toISOString().slice(0, 16));
      setDescription('');
    }
  }, [editingIncome, isOpen]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateOtherIncomePayload) => otherIncomesApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: otherIncomeKeys.lists() });
      showToast.success(res.message || 'تم تسجيل الإيراد الإضافي بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تسجيل الإيراد الإضافي');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOtherIncomePayload }) =>
      otherIncomesApi.update(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: otherIncomeKeys.lists() });
      showToast.success(res.message || 'تم تحديث بيانات الإيراد بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تحديث بيانات الإيراد');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast.warning('يرجى إدخال مبلغ صحيح أكبر من الصفر');
      return;
    }

    if (!incomeDate) {
      showToast.warning('يرجى تحديد تاريخ الإيراد');
      return;
    }

    if (!description.trim()) {
      showToast.warning('يرجى كتابة بيان وسبب الإيراد');
      return;
    }

    const isoDate = new Date(incomeDate).toISOString();

    if (editingIncome) {
      updateMutation.mutate({
        id: editingIncome.id,
        payload: {
          amount: amountNum,
          incomeDate: isoDate,
          description: description.trim(),
        },
      });
    } else {
      createMutation.mutate({
        amount: amountNum,
        incomeDate: isoDate,
        description: description.trim(),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} color="#16a34a" />
            <h3 className="modal-title">
              {editingIncome ? 'تعديل الإيراد الإضافي' : 'تسجيل إيراد إضافي جديد'}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="income-amount">
                المبلغ المحصل (بالجنيه المصري) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="income-amount"
                type="number"
                step="0.5"
                min="0.5"
                className="form-input"
                placeholder="مثال: 1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={isSaving}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="income-date">
                تاريخ ووقت التحصيل <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="income-date"
                type="datetime-local"
                className="form-input"
                value={incomeDate}
                onChange={(e) => setIncomeDate(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="income-description">
                البيان والمصدر <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="income-description"
                rows={3}
                className="form-input"
                placeholder="مثال: إيجار قاعة مناسبات، رسوم تنظيم بطولة، دعم خارجي..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isSaving}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-add"
              disabled={isSaving}
              style={{ backgroundColor: '#16a34a' }}
            >
              {isSaving ? (
                <>
                  <div className="spinner" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{editingIncome ? 'حفظ التعديلات' : 'تسجيل الإيراد'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

