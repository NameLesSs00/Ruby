import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, History, Receipt } from 'lucide-react';
import { payrollPaymentsApi, payrollKeys, paymentStatusLabel, paymentStatusClass } from '../../modules/payrolls';
import type { PayrollRecord } from '../../modules/payrolls';
import type { Employee } from '../../modules/employees';
import { useModalEscape } from '../../lib/useModalEscape';

interface PayrollPaymentsHistoryModalProps {
  isOpen: boolean;
  payroll: PayrollRecord | null;
  employees: Employee[];
  onClose: () => void;
}

export const PayrollPaymentsHistoryModal: React.FC<PayrollPaymentsHistoryModalProps> = ({
  isOpen,
  payroll,
  employees,
  onClose,
}) => {
  useModalEscape(onClose, isOpen);
  const { data: payments = [], isLoading } = useQuery({
    queryKey: payrollKeys.paymentsByPayroll(payroll?.id ?? 0),
    queryFn: () => payrollPaymentsApi.getByPayrollId(payroll!.id),
    enabled: isOpen && !!payroll,
  });

  if (!isOpen || !payroll) return null;

  const empName = employees.find((e) => e.id === payroll.employeeId)?.fullName || `#${payroll.employeeId}`;
  const monthStr = payroll.payrollMonth.slice(0, 7);

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString('ar-EG')} - ${d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return dateStr;
    }
  };

  const totalDisbursed = payments.reduce((sum, p) => sum + p.amountPaid, 0);

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '8px', backgroundColor: '#36C5F020',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7'
            }}>
              <History size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.1rem' }}>سجل صرف دفعات الراتب</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                الموظف: <strong>{empName}</strong> • شهر: <strong>{monthStr}</strong>
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ maxHeight: 'calc(80vh - 140px)', overflowY: 'auto' }}>
          {/* Summary Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem',
            backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0',
            textAlign: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>صافي الراتب</span>
              <strong style={{ fontSize: '0.9rem', color: '#0D1527' }}>{payroll.netSalary.toLocaleString()} ج.م</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>إجمالي المصروف</span>
              <strong style={{ fontSize: '0.9rem', color: '#10B981' }}>{totalDisbursed.toLocaleString()} ج.م</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>المتبقي</span>
              <strong style={{ fontSize: '0.9rem', color: '#EF4444' }}>{payroll.remainingAmount.toLocaleString()} ج.م</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>حالة الصرف</span>
              <span className={`status-badge ${paymentStatusClass(payroll.paymentStatus)}`} style={{ fontSize: '0.75rem' }}>
                {paymentStatusLabel(payroll.paymentStatus)}
              </span>
            </div>
          </div>

          {/* Payments Table */}
          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
              <div className="spinner" style={{ margin: '0 auto 0.5rem', borderTopColor: '#0284C7' }} />
              <span>جاري تحميل سجل الدفعات...</span>
            </div>
          ) : payments.length === 0 ? (
            <div style={{
              padding: '2rem', textAlign: 'center', backgroundColor: '#F8FAFC',
              borderRadius: '8px', border: '1px dashed #CBD5E1', color: '#64748B'
            }}>
              <Receipt size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontWeight: 600, color: '#0D1527' }}>لا توجد أي دفعات مصروفة لهذا الراتب حتى الآن</p>
              <span style={{ fontSize: '0.8rem' }}>يمكنك صرف دفعة عبر زر بطاقة الدفع في جدول الرواتب</span>
            </div>
          ) : (
            <div className="data-table-wrapper" style={{ maxHeight: '260px', overflowY: 'auto' }}>
              <table className="data-table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th>المبلغ المدفوع</th>
                    <th>تاريخ ووقت الصرف</th>
                    <th>الخزينة</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, idx) => (
                    <tr key={p.id}>
                      <td><span className="badge-id">{idx + 1}</span></td>
                      <td style={{ fontWeight: 700, color: '#10B981' }}>
                        +{p.amountPaid.toLocaleString()} ج.م
                      </td>
                      <td style={{ color: '#475569' }}>
                        {formatDateTime(p.paymentDate)}
                      </td>
                      <td>
                        <span style={{
                          padding: '2px 8px', borderRadius: '4px', backgroundColor: '#F1F5F9',
                          fontSize: '0.78rem', color: '#475569', fontWeight: 500
                        }}>
                          خزينة #{p.cashboxId}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
