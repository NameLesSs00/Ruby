import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, ArrowUpLeft, ArrowDownRight, Landmark, DollarSign } from 'lucide-react';
import {
  ownerTransactionsApi,
  ownerTransactionKeys,
  type OwnerTransactionType,
  type CreateOwnerTransactionPayload,
} from '../../modules/ownerTransactions';
import { cashTransactionKeys, type CashboxType } from '../../modules/cashTransactions';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface CreateOwnerTransactionModalProps {
  isOpen: boolean;
  defaultCashbox?: CashboxType;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateOwnerTransactionModal = ({
  isOpen,
  defaultCashbox = 'POS',
  onClose,
  onSuccess,
}: CreateOwnerTransactionModalProps) => {
  const [transactionType, setTransactionType] = useState<OwnerTransactionType>('Withdrawal');
  const [cashboxType, setCashboxType] = useState<CashboxType>(defaultCashbox);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTransactionType('Withdrawal');
      setCashboxType(defaultCashbox);
      setAmount('');
      setNotes('');
    }
  }, [isOpen, defaultCashbox]);

  const mutation = useMutation({
    mutationFn: (payload: CreateOwnerTransactionPayload) =>
      ownerTransactionsApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ownerTransactionKeys.all });
      queryClient.invalidateQueries({ queryKey: cashTransactionKeys.all });
      showToast.success(res.message || 'تم تسجيل حركة المالك بنجاح');
      onSuccess?.();
      onClose();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل حركة المالك');
    },
  });

  useModalEscape(onClose, isOpen && !mutation.isPending);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast.warning('يرجى إدخال مبلغ صحيح أكبر من الصفر');
      return;
    }

    if (!notes.trim()) {
      showToast.warning('يرجى إدخال البيان أو سبب الحركة');
      return;
    }

    mutation.mutate({
      transactionType,
      cashboxType,
      amount: numericAmount,
      notes: notes.trim(),
    });
  };

  const isWithdrawal = transactionType === 'Withdrawal';

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card"
        style={{ maxWidth: '540px', width: '92%' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                backgroundColor: isWithdrawal ? '#fff1f2' : '#ecfdf5',
                color: isWithdrawal ? '#e11d48' : '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isWithdrawal ? <ArrowUpLeft size={20} /> : <ArrowDownRight size={20} />}
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0 }}>
                تسجيل حركة مالك جديدة
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                سحب أرباح أو إيداع سيولة شخصية في خزينة الأكاديمية
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Transaction Type Switcher */}
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.45rem' }}>
                نوع الحركة المالية *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setTransactionType('Withdrawal')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: isWithdrawal ? '2px solid #e11d48' : '1px solid #e2e8f0',
                    backgroundColor: isWithdrawal ? '#fff1f2' : '#ffffff',
                    color: isWithdrawal ? '#e11d48' : '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <ArrowUpLeft size={18} />
                  <span>مسحوبات المالك (سحب -)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransactionType('Deposit')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: !isWithdrawal ? '2px solid #059669' : '1px solid #e2e8f0',
                    backgroundColor: !isWithdrawal ? '#ecfdf5' : '#ffffff',
                    color: !isWithdrawal ? '#059669' : '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <ArrowDownRight size={18} />
                  <span>إيداع جاري المالك (إيداع +)</span>
                </button>
              </div>
            </div>

            {/* Target Cashbox Dropdown */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Landmark size={15} color="#64748b" />
                <span>الخزينة المتأثرة بالحركة *</span>
              </label>
              <select
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                }}
                value={cashboxType}
                onChange={(e) => setCashboxType(e.target.value as CashboxType)}
                disabled={mutation.isPending}
                required
              >
                <option value="POS">خزينة الكاشير والمتجر (POS)</option>
                <option value="Subscriptions">خزينة الاشتراكات والاستقبال</option>
                <option value="Main">الخزينة الرئيسية</option>
              </select>
            </div>

            {/* Amount Input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <DollarSign size={15} color="#64748b" />
                <span>المبلغ النقدي (ج.م) *</span>
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                className="form-input"
                placeholder="أدخل المبلغ (مثال: 500)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={mutation.isPending}
                required
              />
            </div>

            {/* Notes / Statement Textarea */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">البيان والملاحظات *</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="اكتب سبب السحب أو الإيداع (مثال: سحب إيراد نهاية اليوم / إيداع سيولة شخصية...)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={mutation.isPending}
                required
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
              {mutation.isPending ? (
                <>
                  <div className="spinner" />
                  <span>جاري التسجيل...</span>
                </>
              ) : (
                <span>تأكيد وتسجيل الحركة</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

