import { useMutation } from '@tanstack/react-query';
import { X, AlertTriangle } from 'lucide-react';
import { payrollsApi, payrollKeys, type PayrollRecord } from '../../modules/payrolls';
import type { Employee } from '../../modules/employees';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface DeletePayrollModalProps {
  record: PayrollRecord | null;
  employees: Employee[];
  onClose: () => void;
}

function extractErr(err: unknown): string | undefined {
  return (err as { response?: { data?: { error?: string; message?: string } } })?.response?.data?.error
    ?? (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
}

export const DeletePayrollModal = ({ record, employees, onClose }: DeletePayrollModalProps) => {
  const deleteMutation = useMutation({
    mutationFn: (id: number) => payrollsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: payrollKeys.lists() });
      showToast.success('تم حذف مسيرة الراتب بنجاح');
      onClose();
    },
    onError: (err: unknown) => {
      const msg = extractErr(err);
      showToast.error(msg?.includes('cash transactions') ? 'لا يمكن حذف المسيرة لوجود حركات مالية مرتبطة بها' : msg || 'فشل في حذف مسيرة الراتب');
    },
  });

  if (!record) return null;

  const empName = employees.find((e) => Number(e.id) === Number(record.employeeId))?.fullName || `#${record.employeeId}`;
  const monthStr = record.payrollMonth ? record.payrollMonth.slice(0, 7) : '—';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: '#ef4444' }}>تأكيد حذف المسيرة</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="confirm-delete-box">
            <div className="delete-warning-icon"><AlertTriangle size={32} /></div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0d1527', marginBottom: '0.4rem' }}>
                هل أنت متأكد من حذف مسيرة راتب {empName} لشهر {monthStr}؟
              </p>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>لا يمكن حذف المسيرة إذا كانت مرتبطة بحركات مالية أو دفعات مسجلة.</p>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={deleteMutation.isPending}>إلغاء</button>
          <button type="button" className="btn-danger" onClick={() => deleteMutation.mutate(record.id)} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? <><div className="spinner" /><span>جاري الحذف...</span></> : <span>نعم، حذف المسيرة</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

