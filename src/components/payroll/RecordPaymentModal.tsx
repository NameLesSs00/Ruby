import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { payrollPaymentsApi, payrollKeys } from '../../modules/payrolls';
import type { PayrollRecord } from '../../modules/payrolls';
import type { Employee } from '../../modules/employees';
import { showToast } from '../../lib/sonner';

interface RecordPaymentModalProps {
  isOpen: boolean;
  payroll: PayrollRecord | null;
  employees: Employee[];
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  payroll,
  employees,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [amountPaid, setAmountPaid] = useState<number | ''>('');

  useEffect(() => {
    if (payroll) {
      setAmountPaid(payroll.remainingAmount > 0 ? payroll.remainingAmount : 0);
    }
  }, [payroll]);

  const mutation = useMutation({
    mutationFn: (amount: number) => {
      if (!payroll) throw new Error('No payroll selected');
      return payrollPaymentsApi.recordPayment({
        payrollId: payroll.id,
        amountPaid: amount,
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() });
      if (payroll) {
        queryClient.invalidateQueries({ queryKey: payrollKeys.paymentsByPayroll(payroll.id) });
      }
      queryClient.invalidateQueries({ queryKey: payrollKeys.payments() });
      showToast.success(res.message || 'تم تسجيل صرف الراتب بنجاح');
      onClose();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.response?.data || 'تعذر تسجيل صرف الدفعة';
      showToast.error(typeof msg === 'string' ? msg : 'تعذر تسجيل صرف الدفعة');
    },
  });

  if (!isOpen || !payroll) return null;

  const empName = employees.find((e) => e.id === payroll.employeeId)?.fullName || `#${payroll.employeeId}`;
  const monthStr = payroll.payrollMonth.slice(0, 7);
  const numAmount = Number(amountPaid) || 0;
  const isValidAmount = numAmount > 0 && numAmount <= payroll.remainingAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) return;
    mutation.mutate(numAmount);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '8px', backgroundColor: '#F3702315',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F37023'
            }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.1rem' }}>صرف دفعة راتب</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                الموظف: <strong>{empName}</strong> • شهر: <strong>{monthStr}</strong>
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Financial Overview Cards */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem',
              backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0',
              textAlign: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>صافي الراتب</span>
                <strong style={{ fontSize: '0.95rem', color: '#0D1527' }}>{payroll.netSalary.toLocaleString()} ج.م</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>المدفوع سابقاً</span>
                <strong style={{ fontSize: '0.95rem', color: '#10B981' }}>{payroll.paidAmount.toLocaleString()} ج.م</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>المتبقي للصرف</span>
                <strong style={{ fontSize: '0.95rem', color: '#EF4444' }}>{payroll.remainingAmount.toLocaleString()} ج.م</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>المبلغ المراد صرفه (ج.م) <span style={{ color: '#ef4444' }}>*</span></span>
                {payroll.remainingAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => setAmountPaid(payroll.remainingAmount)}
                    style={{
                      fontSize: '0.78rem', color: '#F37023', background: 'none',
                      border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600
                    }}
                  >
                    صرف المتبقي بالكامل
                  </button>
                )}
              </label>
              <input
                type="number"
                step="any"
                min="1"
                max={payroll.remainingAmount}
                className="form-input"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.00"
                required
                autoFocus
                disabled={mutation.isPending}
              />
            </div>

            {payroll.remainingAmount <= 0 ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem', backgroundColor: '#ECFDF5', borderRadius: '6px', color: '#065F46', fontSize: '0.85rem'
              }}>
                <CheckCircle2 size={18} />
                <span>تم صرف هذا الراتب بالكامل ولا يوجد مبالغ متبقية.</span>
              </div>
            ) : !isValidAmount && amountPaid !== '' ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem', backgroundColor: '#FEF2F2', borderRadius: '6px', color: '#991B1B', fontSize: '0.85rem'
              }}>
                <AlertCircle size={18} />
                <span>المبلغ يجب أن يكون أكبر من 0 وأقل من أو يساوي {payroll.remainingAmount} ج.م</span>
              </div>
            ) : null}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={mutation.isPending}>
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-add"
              disabled={mutation.isPending || !isValidAmount || payroll.remainingAmount <= 0}
              style={{ minWidth: '120px' }}
            >
              {mutation.isPending ? <><div className="spinner" /><span>جاري الصرف...</span></> : <span>تأكيد الصرف</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
