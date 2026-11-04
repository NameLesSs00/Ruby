import { useState, useEffect, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Edit3, X } from 'lucide-react';
import {
  attendanceApi,
  attendanceKeys,
  type AttendanceRecord,
} from '../../modules/attendance';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface EditAttendanceModalProps {
  record: AttendanceRecord | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditAttendanceModal = ({
  record,
  onClose,
  onSuccess,
}: EditAttendanceModalProps) => {
  useModalEscape(onClose);

  const [notes, setNotes] = useState('');
  const [checkInTime, setCheckInTime] = useState('');

  useEffect(() => {
    if (record) {
      setNotes(record.notes || '');
      // Format to datetime-local string (YYYY-MM-DDTHH:mm)
      try {
        const d = new Date(record.checkInTime);
        const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setCheckInTime(isoLocal);
      } catch {
        setCheckInTime('');
      }
    }
  }, [record]);

  const updateMutation = useMutation({
    mutationFn: (payload: { id: number; notes?: string; checkInTime: string }) =>
      attendanceApi.update(payload.id, {
        clientId: record!.clientId,
        subscriptionId: record!.subscriptionId,
        checkInTime: new Date(payload.checkInTime).toISOString(),
        notes: payload.notes?.trim() || undefined,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
      showToast.success(res.message || 'تم تعديل قيد الحضور بنجاح');
      onSuccess?.();
      onClose();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تعديل قيد الحضور');
    },
  });

  if (!record) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!checkInTime) {
      showToast.warning('يرجى تحديد وقت الحضور');
      return;
    }
    updateMutation.mutate({
      id: record.id,
      notes,
      checkInTime,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 460 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Edit3 size={18} />
            </div>
            <div>
              <h3 className="modal-title">تعديل قيد الحضور</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                تحديث وقت الحضور أو الملاحظات المسجلة
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #e2e8f0',
                marginBottom: '1rem',
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#64748b' }}>المشترك:</div>
              <div style={{ fontWeight: 800, color: '#0d1527', marginTop: '0.2rem' }}>
                {record.clientName}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#0284c7', marginTop: '0.15rem' }}>
                اشتراك رقم #{record.subscriptionId}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">وقت وتاريخ الحضور</label>
              <input
                type="datetime-local"
                className="form-input"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                required
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="form-group">
              <label className="form-label">ملاحظات الحضور</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="أضف ملاحظات (اختياري)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={updateMutation.isPending}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

