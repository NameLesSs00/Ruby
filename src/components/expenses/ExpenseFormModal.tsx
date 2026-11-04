import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, Receipt } from 'lucide-react';
import {
  expensesApi,
  expenseKeys,
  type Expense,
  type CreateExpensePayload,
  type UpdateExpensePayload,
} from '../../modules/expenses';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface ExpenseFormModalProps {
  isOpen: boolean;
  editingExpense: Expense | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ExpenseFormModal = ({
  isOpen,
  editingExpense,
  onClose,
  onSuccess,
}: ExpenseFormModalProps) => {
  useModalEscape(onClose, isOpen);

  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      const d = editingExpense.expenseDate
        ? new Date(editingExpense.expenseDate).toISOString().slice(0, 16)
        : '';
      setExpenseDate(d);
      setDescription(editingExpense.description || '');
    } else {
      setAmount('');
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setExpenseDate(now.toISOString().slice(0, 16));
      setDescription('');
    }
  }, [editingExpense, isOpen]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateExpensePayload) => expensesApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      showToast.success(res.message || 'تم تسجيل المصروف بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل المصروف');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateExpensePayload }) =>
      expensesApi.update(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      showToast.success(res.message || 'تم تحديث بيانات المصروف بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تحديث بيانات المصروف');
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

    if (!expenseDate) {
      showToast.warning('يرجى تحديد تاريخ المصروف');
      return;
    }

    if (!description.trim()) {
      showToast.warning('يرجى كتابة بيان ووصف المصروف');
      return;
    }

    const isoDate = new Date(expenseDate).toISOString();

    if (editingExpense) {
      updateMutation.mutate({
        id: editingExpense.id,
        payload: {
          amount: amountNum,
          expenseDate: isoDate,
          description: description.trim(),
          cashboxType: 'Main',
        },
      });
    } else {
      createMutation.mutate({
        amount: amountNum,
        expenseDate: isoDate,
        description: description.trim(),
        cashboxType: 'Main',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt size={20} color="#ff6b22" />
            <h3 className="modal-title">
              {editingExpense ? 'تعديل بيانات المصروف' : 'تسجيل مصروف جديد'}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="expense-amount">
                المبلغ (بالجنيه المصري) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="expense-amount"
                type="number"
                step="0.5"
                min="0.5"
                className="form-input"
                placeholder="مثال: 250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={isSaving}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expense-date">
                تاريخ ووقت الصرف <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="expense-date"
                type="datetime-local"
                className="form-input"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="expense-description">
                البيان والسبب <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="expense-description"
                rows={3}
                className="form-input"
                placeholder="مثال: صيانة فلاتر حمام السباحة، شراء أدوات نظافة..."
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
            >
              {isSaving ? (
                <>
                  <div className="spinner" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{editingExpense ? 'حفظ التعديلات' : 'تسجيل المصروف'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

