import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, AlertCircle, Calendar, CreditCard, Receipt } from 'lucide-react';
import {
  payrollsApi, payrollKeys, paymentStatusLabel, paymentStatusClass,
  type PayrollRecord, type UpdatePayrollPayload,
} from '../../modules/payrolls';
import type { Employee } from '../../modules/employees';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';
import { EmployeeNameCell } from './EmployeeNameCell';
import { CreatePayrollModal } from './CreatePayrollModal';
import { DeletePayrollModal } from './DeletePayrollModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { PayrollPaymentsHistoryModal } from './PayrollPaymentsHistoryModal';

function fmt(val: number) { return val.toLocaleString('ar-EG'); }
function fmtMonth(iso: string) { return iso ? iso.slice(0, 7) : '—'; }

export const PayrollsTab = ({ employees }: { employees: Employee[] }) => {
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<PayrollRecord | null>(null);
  const [payingRecord, setPayingRecord] = useState<PayrollRecord | null>(null);
  const [historyRecord, setHistoryRecord] = useState<PayrollRecord | null>(null);
  const [editNotes, setEditNotes] = useState('');
  useModalEscape(() => setEditingRecord(null), Boolean(editingRecord));

  const { data: payrolls = [], isLoading, isError } = useQuery({
    queryKey: payrollKeys.lists(),
    queryFn: () => payrollsApi.getAll(),
  });

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((p) => {
      const matchEmp = !filterEmployeeId || Number(p.employeeId) === Number(filterEmployeeId);
      const matchMonth = !filterMonth || p.payrollMonth.startsWith(filterMonth);
      return matchEmp && matchMonth;
    });
  }, [payrolls, filterEmployeeId, filterMonth]);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePayrollPayload }) => payrollsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() });
      showToast.success('تم تحديث ملاحظات المسيرة بنجاح');
      setEditingRecord(null);
    },
    onError: (err: unknown) => showToast.apiError(err, ''),
  });

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    updateMutation.mutate({ id: editingRecord.id, payload: { notes: editNotes } });
  };

  return (
    <>
      <div className="view-toolbar" style={{ flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="select-filter"
            value={filterEmployeeId}
            onChange={(e) => setFilterEmployeeId(e.target.value)}
          >
            <option value="">جميع الموظفين</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.fullName}</option>
            ))}
          </select>

          <input
            type="month"
            className="form-input"
            style={{ width: 'auto' }}
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          />

          {(filterEmployeeId || filterMonth) && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => { setFilterEmployeeId(''); setFilterMonth(''); }}
              style={{ padding: '0.5rem 1rem' }}
            >
              إعادة تعيين
            </button>
          )}
        </div>

        <button type="button" className="btn-add" onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} /><span>إنشاء مسيرة راتب</span>
        </button>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>الموظف</th><th>الشهر</th><th>الراتب الأساسي</th><th>المكافآت</th>
              <th>الخصومات</th><th>الصافي</th><th>المدفوع</th><th>المتبقي</th>
              <th>الحالة</th><th>الملاحظات</th><th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={11} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                  <span>جاري تحميل مسيرات الرواتب...</span>
                </div>
              </td></tr>
            ) : isError ? (
              <tr><td colSpan={11} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                <span>تعذر تحميل مسيرات الرواتب</span>
              </td></tr>
            ) : filteredPayrolls.length === 0 ? (
              <tr><td colSpan={11} className="table-empty-row">
                <span>لا توجد مسيرات رواتب مسجلة {filterEmployeeId || filterMonth ? 'مطابقة للبحث' : ''}</span>
              </td></tr>
            ) : (
              filteredPayrolls.map((record) => {
                const canPay = record.remainingAmount > 0 && record.paymentStatus !== 3;
                return (
                  <tr key={record.id}>
                    <td>
                      <EmployeeNameCell employeeId={record.employeeId} fallbackEmployees={employees} />
                    </td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}><Calendar size={15} /><span>{fmtMonth(record.payrollMonth)}</span></div></td>
                    <td><span className="salary-text">{fmt(record.salaryAmount)}<span className="currency-unit">ج.م</span></span></td>
                    <td><span style={{ color: '#16a34a', fontWeight: 600 }}>+{fmt(record.bonusAmount)}</span></td>
                    <td><span style={{ color: '#dc2626', fontWeight: 600 }}>-{fmt(record.deductionAmount)}</span></td>
                    <td><span className="salary-text" style={{ color: '#0d1527', fontWeight: 700 }}>{fmt(record.netSalary)}<span className="currency-unit">ج.م</span></span></td>
                    <td><span style={{ color: '#0284c7', fontWeight: 600 }}>{fmt(record.paidAmount)}</span></td>
                    <td><span style={{ color: record.remainingAmount > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{fmt(record.remainingAmount)}</span></td>
                    <td><span className={`status-badge ${paymentStatusClass(record.paymentStatus)}`}>{paymentStatusLabel(record.paymentStatus)}</span></td>
                    <td><span style={{ color: '#64748b', fontSize: '0.85rem' }}>{record.notes || '—'}</span></td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-icon-action"
                          style={{ color: canPay ? '#ff6b22' : '#94a3b8', opacity: canPay ? 1 : 0.45 }}
                          disabled={!canPay}
                          title={canPay ? 'تسجيل صرف دفعة' : 'تم صرف كامل الراتب'}
                          onClick={() => setPayingRecord(record)}
                        >
                          <CreditCard size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action"
                          style={{ color: '#0284c7' }}
                          title="سجل دفعات الراتب"
                          onClick={() => setHistoryRecord(record)}
                        >
                          <Receipt size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="تعديل الملاحظات"
                          onClick={() => { setEditingRecord(record); setEditNotes(record.notes || ''); }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action delete"
                          title="حذف المسيرة"
                          onClick={() => setDeletingRecord(record)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <CreatePayrollModal
        isOpen={isCreateOpen}
        employees={employees}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Delete Modal */}
      <DeletePayrollModal
        record={deletingRecord}
        employees={employees}
        onClose={() => setDeletingRecord(null)}
      />

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={!!payingRecord}
        payroll={payingRecord}
        employees={employees}
        onClose={() => setPayingRecord(null)}
      />

      {/* Payments History Modal */}
      <PayrollPaymentsHistoryModal
        isOpen={!!historyRecord}
        payroll={historyRecord}
        employees={employees}
        onClose={() => setHistoryRecord(null)}
      />

      {/* Edit Notes Modal */}
      {editingRecord && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 className="modal-title">تعديل ملاحظات المسيرة</h3>
              <button type="button" className="modal-close-btn" onClick={() => setEditingRecord(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-notes">الملاحظات</label>
                  <textarea
                    id="edit-notes"
                    className="form-input"
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    disabled={updateMutation.isPending}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setEditingRecord(null)} disabled={updateMutation.isPending}>إلغاء</button>
                <button type="submit" className="btn-add" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? <><div className="spinner" /><span>جاري الحفظ...</span></> : <span>حفظ الملاحظات</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
