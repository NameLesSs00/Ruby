import { useState, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, X, AlertCircle, Calendar } from 'lucide-react';
import {
  deductionsApi, payrollKeys, monthInputToApiDate,
  type Deduction, type CreateDeductionPayload, type DeductionFilterParams,
} from '../../modules/payrolls';
import type { Employee } from '../../modules/employees';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { EmployeeNameCell } from './EmployeeNameCell';

function extractErr(err: unknown): string | undefined {
  return (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error
    ?? (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
}

function fmtMonth(iso: string): string {
  return iso ? iso.slice(0, 7) : '—';
}

export const DeductionsTab = ({ employees }: { employees: Employee[] }) => {
  const [filterEmployeeId, setFilterEmployeeId] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addEmployeeId, setAddEmployeeId] = useState('');
  const [addMonth, setAddMonth] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [addDescription, setAddDescription] = useState('');

  const filters = useMemo<DeductionFilterParams>(() => ({
    employeeId: filterEmployeeId ? Number(filterEmployeeId) : undefined,
    payrollMonth: filterMonth ? monthInputToApiDate(filterMonth) : undefined,
  }), [filterEmployeeId, filterMonth]);

  const { data: deductions = [], isLoading, isError } = useQuery({
    queryKey: payrollKeys.deductions(filters),
    queryFn: () => deductionsApi.getAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: (p: CreateDeductionPayload) => deductionsApi.create(p),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.deductions() });
      showToast.success('تمت إضافة الخصم بنجاح');
      setIsAddOpen(false); setAddEmployeeId(''); setAddMonth(''); setAddAmount(''); setAddDescription('');
    },
    onError: (err: unknown) => showToast.error(extractErr(err) || 'فشل في إضافة الخصم'),
  });

  const handleReset = () => { setFilterEmployeeId(''); setFilterMonth(''); };

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!addEmployeeId) { showToast.warning('يرجى اختيار الموظف'); return; }
    if (!addMonth) { showToast.warning('يرجى تحديد شهر الخصم'); return; }
    const amt = parseFloat(addAmount);
    if (isNaN(amt) || amt <= 0) { showToast.warning('يرجى إدخال مبلغ صحيح'); return; }
    createMutation.mutate({ employeeId: Number(addEmployeeId), payrollMonth: monthInputToApiDate(addMonth), amount: amt, description: addDescription.trim() });
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
            {employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.fullName}</option>))}
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
              onClick={handleReset}
              style={{ padding: '0.5rem 1rem' }}
            >
              إعادة تعيين
            </button>
          )}
        </div>
        <button type="button" className="btn-add" onClick={() => setIsAddOpen(true)}><Plus size={18} /><span>إضافة خصم</span></button>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr><th>الموظف</th><th>المبلغ</th><th>تاريخ الخصم</th><th>شهر الراتب</th><th>الوصف</th></tr></thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="table-loading-row"><div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}><div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} /><span>جاري تحميل الخصومات...</span></div></td></tr>
            ) : isError ? (
              <tr><td colSpan={5} className="table-empty-row" style={{ color: '#ef4444' }}><AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} /><span>تعذر تحميل الخصومات</span></td></tr>
            ) : deductions.length === 0 ? (
              <tr><td colSpan={5} className="table-empty-row"><span>لا توجد خصومات مسجلة</span></td></tr>
            ) : (
              deductions.map((deduction: Deduction) => (
                <tr key={deduction.id}>
                  <td><EmployeeNameCell employeeId={deduction.employeeId} fallbackEmployees={employees} /></td>
                  <td><span style={{ color: '#ef4444', fontWeight: 700 }}>-{deduction.amount.toLocaleString('ar-EG')}<span className="currency-unit"> ج.م</span></span></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}><Calendar size={15} /><span>{deduction.deductionDate.split('T')[0]}</span></div></td>
                  <td>{fmtMonth(deduction.payrollMonth)}</td>
                  <td style={{ color: '#64748b', fontSize: '0.85rem' }}>{deduction.description || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">إضافة خصم جديد</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsAddOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="deduction-emp">الموظف <span style={{ color: '#ef4444' }}>*</span></label>
                  <select id="deduction-emp" className="select-filter" style={{ width: '100%' }} value={addEmployeeId} onChange={(e) => setAddEmployeeId(e.target.value)} disabled={createMutation.isPending}>
                    <option value="">— اختر الموظف —</option>
                    {employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.fullName}</option>))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="deduction-month">شهر الراتب <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="deduction-month" type="month" className="form-input" value={addMonth} onChange={(e) => setAddMonth(e.target.value)} disabled={createMutation.isPending} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="deduction-amount">المبلغ (ج.م) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="deduction-amount" type="number" min="1" step="50" className="form-input" placeholder="مثال: 300" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} disabled={createMutation.isPending} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="deduction-desc">الوصف</label>
                  <input id="deduction-desc" type="text" className="form-input" placeholder="سبب الخصم..." value={addDescription} onChange={(e) => setAddDescription(e.target.value)} disabled={createMutation.isPending} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsAddOpen(false)} disabled={createMutation.isPending}>إلغاء</button>
                <button type="submit" className="btn-add" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <><div className="spinner" /><span>جاري الإضافة...</span></> : <span>إضافة الخصم</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
