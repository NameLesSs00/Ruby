import { useMutation } from '@tanstack/react-query';
import { AlertTriangle, X } from 'lucide-react';
import {
  attendanceApi,
  attendanceKeys,
  type AttendanceRecord,
} from '../../modules/attendance';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface DeleteAttendanceModalProps {
  record: AttendanceRecord | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteAttendanceModal = ({
  record,
  onClose,
  onSuccess,
}: DeleteAttendanceModalProps) => {
  useModalEscape(onClose);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => attendanceApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      showToast.success(res.message || 'تم حذف قيد الحضور بنجاح');
      onSuccess?.();
      onClose();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حذف قيد الحضور');
    },
  });

  if (!record) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="modal-title" style={{ color: '#dc2626' }}>تأكيد حذف قيد الحضور</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                عملية الحذف نهائية وسيتم استرجاع الحصة للمشترك
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
            هل أنت متأكد من رغبتك في حذف قيد الحضور الخاص بالمشترك{' '}
            <strong style={{ color: '#0d1527' }}>{record.clientName}</strong> المسجل بتاريخ{' '}
            <strong dir="ltr" style={{ color: '#0d1527' }}>
              {new Date(record.checkInTime).toLocaleString('ar-EG')}
            </strong>؟
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="btn-danger"
            style={{
              padding: '0.6rem 1.25rem',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => deleteMutation.mutate(record.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'جاري الحذف...' : 'تأكيد الحذف'}
          </button>
        </div>
      </div>
    </div>
  );
};

