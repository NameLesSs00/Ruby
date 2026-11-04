import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, CreditCard } from 'lucide-react';
import {
  purchasePaymentsApi,
  purchasePaymentKeys,
  purchaseInvoiceKeys,
  type PurchaseInvoice,
  type CreatePurchasePaymentPayload,
} from '../../modules/purchases';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface RecordPurchasePaymentModalProps {
  invoice: PurchaseInvoice | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RecordPurchasePaymentModal = ({
  invoice,
  isOpen,
  onClose,
  onSuccess,
}: RecordPurchasePaymentModalProps) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');

  useEffect(() => {
    if (invoice && isOpen) {
      setAmountPaid(invoice.remainingAmount > 0 ? invoice.remainingAmount.toString() : '');
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setPaymentDate(now.toISOString().slice(0, 16));
    } else {
      setAmountPaid('');
      setPaymentDate('');
    }
  }, [invoice, isOpen]);

  const mutation = useMutation({
    mutationFn: (payload: CreatePurchasePaymentPayload) => purchasePaymentsApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: purchaseInvoiceKeys.all });
      queryClient.invalidateQueries({ queryKey: purchasePaymentKeys.all });
      showToast.success(res.message || 'تم تسجيل دفعة المشتريات بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تسجيل الدفعة');
    },
  });

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amountPaid);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast.warning('يرجى إدخال مبلغ صحيح أكبر من الصفر');
      return;
    }

    if (amountNum > invoice.remainingAmount) {
      showToast.warning(
        `المبلغ المدخل (${amountNum} ج.م) أكبر من المبلغ المتبقي على الفاتورة (${invoice.remainingAmount} ج.م)`
      );
      return;
    }

    if (!paymentDate) {
      showToast.warning('يرجى تحديد تاريخ السداد');
      return;
    }

    mutation.mutate({
      purchaseInvoiceId: invoice.id,
      amountPaid: amountNum,
      paymentDate: new Date(paymentDate).toISOString(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={20} color="#ff6b22" />
            <h3 className="modal-title">تسجيل دفعة سداد للمورد</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Invoice Summary Card */}
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
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>رقم الفاتورة:</span>
                <span style={{ fontWeight: 800, color: '#0d1527' }}>{invoice.invoiceNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>اسم المورد:</span>
                <span style={{ fontWeight: 700, color: '#0d1527' }}>{invoice.supplierName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>إجمالي الفاتورة:</span>
                <span style={{ fontWeight: 700, color: '#0d1527' }}>
                  {invoice.totalAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>المسدد سابقاً:</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>
                  {invoice.paidAmount.toLocaleString('ar-EG')} ج.م
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
                  المتبقي المطلوب سداده:
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 900, color: '#b91c1c' }}>
                  {invoice.remainingAmount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="payment-amount">
                المبلغ المسدد (بالجنيه المصري) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="payment-amount"
                type="number"
                step="0.5"
                min="0.5"
                max={invoice.remainingAmount}
                className="form-input"
                placeholder="أدخل مبلغ الدفعة"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                required
                disabled={mutation.isPending}
                autoFocus
              />
              {invoice.remainingAmount > 0 && (
                <div style={{ marginTop: '0.4rem', textAlign: 'end' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem', fontWeight: 700 }}
                    onClick={() => setAmountPaid(invoice.remainingAmount.toString())}
                  >
                    سداد كامل المتبقي ({invoice.remainingAmount.toLocaleString('ar-EG')} ج.م)
                  </button>
                </div>
              )}
            </div>

            {/* Payment Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="payment-date">
                تاريخ ووقت السداد <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="payment-date"
                type="datetime-local"
                className="form-input"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
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
              className="btn-add"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <div className="spinner" />
                  <span>جاري تسجيل الدفعة...</span>
                </>
              ) : (
                <span>تأكيد سداد الدفعة</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

