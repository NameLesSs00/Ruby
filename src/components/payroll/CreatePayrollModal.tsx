import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { payrollsApi, payrollKeys, monthInputToApiDate, type CreatePayrollPayload } from '../../modules/payrolls';
import type { Employee } from '../../modules/employees';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface CreatePayrollModalProps {
  isOpen: boolean;
  employees: Employee[];
  onClose: () => void;
}

function extractErr(err: unknown): string | undefined {
  return (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error
    ?? (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
}

export const CreatePayrollModal = ({ isOpen, employees, onClose }: CreatePayrollModalProps) => {
  useModalEscape(onClose, isOpen);

  const [employeeId, setEmployeeId] = useState('');
  const [month, setMonth] = useState('');
  const [notes, setNotes] = useState('');

  const createMutation = useMutation({
    mutationFn: (p: CreatePayrollPayload) => payrollsApi.create(p),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() });
      showToast.success('تم إنشاء مسيرة الراتب بنجاح');
      onClose();
      setEmployeeId('');
      setMonth('');
      setNotes('');
    },
    onError: (err: unknown) => {
      const msg = extractErr(err);
      showToast.error(msg?.includes('already exists') ? 'مسيرة الراتب موجودة مسبقاً لهذا الموظف في هذا الشهر' : msg || 'فشل في إنشاء مسيرة الراتب');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!employeeId) { showToast.warning('يرجى اختيار الموظف'); return; }
    if (!month) { showToast.warning('يرجى تحديد شهر الراتب'); return; }
    createMutation.mutate({
      employeeId: Number(employeeId),
      payrollMonth: monthInputToApiDate(month),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">إنشاء مسيرة راتب جديدة</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="pr-emp">الموظف <span style={{ color: '#ef4444' }}>*</span></label>
              <select
                id="pr-emp"
                className="select-filter"
                style={{ width: '100%' }}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={createMutation.isPending}
              >
                <option value="">— اختر الموظف —</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pr-month">شهر الراتب <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                id="pr-month"
                type="month"
                className="form-input"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                disabled={createMutation.isPending}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="pr-notes">ملاحظات</label>
              <textarea
                id="pr-notes"
                className="form-input"
                rows={3}
                placeholder="ملاحظات اختيارية..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={createMutation.isPending}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={createMutation.isPending}>
              إلغاء
            </button>
            <button type="submit" className="btn-add" disabled={createMutation.isPending}>
              {createMutation.isPending ? <><div className="spinner" /><span>جاري الإنشاء...</span></> : <span>إنشاء المسيرة</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
