import { useState, useEffect, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Award, Briefcase, X } from 'lucide-react';
import {
  subscriptionCoachAssignmentsApi,
  coachAssignmentKeys,
  type SubscriptionCoachAssignment,
  type CreateCoachAssignmentPayload,
} from '../../modules/subscriptions';
import { coachesApi } from '../../modules/coaches';
import { employeesApi } from '../../modules/employees';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface AssignmentFormModalProps {
  isOpen: boolean;
  editingAssignment?: SubscriptionCoachAssignment | null;
  defaultSubscriptionId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignmentFormModal = ({
  isOpen,
  editingAssignment,
  defaultSubscriptionId,
  onClose,
  onSuccess,
}: AssignmentFormModalProps) => {
  const isEditing = Boolean(editingAssignment);

  const [subscriptionIdInput, setSubscriptionIdInput] = useState<string>('');
  const [assigneeType, setAssigneeType] = useState<'coach' | 'employee'>('coach');
  const [selectedStaff, setSelectedStaff] = useState<SelectOption | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (editingAssignment) {
        setSubscriptionIdInput(editingAssignment.subscriptionId.toString());
        setStartDate(editingAssignment.startDate?.slice(0, 10) || '');
        setEndDate(editingAssignment.endDate?.slice(0, 10) || '');
        setNotes(editingAssignment.notes || '');

        if (editingAssignment.coachId) {
          setAssigneeType('coach');
          setSelectedStaff({
            id: editingAssignment.coachId,
            label: editingAssignment.coachName || `مدرب #${editingAssignment.coachId}`,
            tag: 'مدرب',
          });
        } else if (editingAssignment.employeeId) {
          setAssigneeType('employee');
          setSelectedStaff({
            id: editingAssignment.employeeId,
            label: editingAssignment.employeeName || `موظف #${editingAssignment.employeeId}`,
            tag: 'موظف',
          });
        }
      } else {
        setSubscriptionIdInput(defaultSubscriptionId ? defaultSubscriptionId.toString() : '');
        setAssigneeType('coach');
        setSelectedStaff(null);
        const today = new Date().toISOString().slice(0, 10);
        setStartDate(today);
        setEndDate(today);
        setNotes('');
      }
    }
  }, [isOpen, editingAssignment, defaultSubscriptionId]);

  const mutation = useMutation({
    mutationFn: (payload: CreateCoachAssignmentPayload) => {
      if (isEditing && editingAssignment) {
        return subscriptionCoachAssignmentsApi.update(editingAssignment.id, payload);
      }
      return subscriptionCoachAssignmentsApi.create(payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: coachAssignmentKeys.all });
      showToast.success(res.message || (isEditing ? 'تم تعديل التعيين بنجاح' : 'تم تعيين الكادر بنجاح'));
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في حفظ التعيين');
    },
  });

  if (!isOpen) return null;

  const loadCoaches = async (query: string): Promise<SelectOption[]> => {
    const res = await coachesApi.getAll({
      search: query.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((c) => ({
      id: c.id,
      label: c.fullName,
      subLabel: `هاتف: ${c.phoneNumber}`,
      tag: 'مدرب',
    }));
  };

  const loadEmployees = async (query: string): Promise<SelectOption[]> => {
    const res = await employeesApi.getAll({
      searchTerm: query.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((e) => ({
      id: e.id,
      label: e.fullName,
      subLabel: `المسمى: ${e.jobTitle} — هاتف: ${e.phoneNumber}`,
      tag: 'موظف',
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subId = parseInt(subscriptionIdInput, 10);
    if (isNaN(subId) || subId <= 0) {
      showToast.warning('يرجى إدخال رقم اشتراك صحيح');
      return;
    }

    if (!selectedStaff) {
      showToast.warning('يرجى اختيار المدرب أو الموظف أولاً');
      return;
    }

    if (!startDate || !endDate) {
      showToast.warning('يرجى تحديد تاريخ البدء وتاريخ الانتهاء');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      showToast.warning('تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البدء');
      return;
    }

    mutation.mutate({
      subscriptionId: subId,
      coachId: assigneeType === 'coach' ? selectedStaff.id : null,
      employeeId: assigneeType === 'employee' ? selectedStaff.id : null,
      startDate,
      endDate,
      notes: notes.trim() || null,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
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
              <Award size={18} />
            </div>
            <div>
              <h3 className="modal-title">{isEditing ? 'تعديل تعيين الكادر' : 'إضافة تعيين كادر للاشتراك'}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                {isEditing ? `تعيين قيد #${editingAssignment?.id}` : 'ربط مدرب أو موظف باشتراك'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Subscription ID Input (read only if editing or fixed) */}
            <div className="form-group">
              <label className="form-label required">رقم الاشتراك المرجعي</label>
              <input
                type="number"
                min="1"
                className="form-input"
                placeholder="أدخل رقم الاشتراك..."
                value={subscriptionIdInput}
                onChange={(e) => setSubscriptionIdInput(e.target.value)}
                required
                disabled={isEditing || Boolean(defaultSubscriptionId) || mutation.isPending}
              />
            </div>

            {/* Assignee Type Switcher */}
            <div className="form-group">
              <label className="form-label required">نوع الكادر المعين</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAssigneeType('coach');
                    setSelectedStaff(null);
                  }}
                  disabled={mutation.isPending}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${assigneeType === 'coach' ? '#F37023' : '#e2e8f0'}`,
                    backgroundColor: assigneeType === 'coach' ? '#fff7ed' : '#ffffff',
                    color: assigneeType === 'coach' ? '#c2410c' : '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Award size={16} />
                  <span>مدرب أكاديمية</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAssigneeType('employee');
                    setSelectedStaff(null);
                  }}
                  disabled={mutation.isPending}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${assigneeType === 'employee' ? '#0284c7' : '#e2e8f0'}`,
                    backgroundColor: assigneeType === 'employee' ? '#f0f9ff' : '#ffffff',
                    color: assigneeType === 'employee' ? '#0369a1' : '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Briefcase size={16} />
                  <span>موظف إشرافي</span>
                </button>
              </div>
            </div>

            {/* Staff Search Selector */}
            <div className="form-group">
              <label className="form-label required">
                {assigneeType === 'coach' ? 'اختر المدرب' : 'اختر الموظف'}
              </label>
              <AsyncSearchableSelect
                key={assigneeType}
                selectedItem={selectedStaff}
                onChange={setSelectedStaff}
                loadOptions={assigneeType === 'coach' ? loadCoaches : loadEmployees}
                placeholder={assigneeType === 'coach' ? 'ابحث بالاسم أو الهاتف...' : 'ابحث باسم الموظف أو المسمى...'}
              />
            </div>

            {/* Dates Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label required">تاريخ بدء التعيين</label>
                <input
                  type="date"
                  className="form-input"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={mutation.isPending}
                />
              </div>
              <div className="form-group">
                <label className="form-label required">تاريخ انتهاء التعيين</label>
                <input
                  type="date"
                  className="form-input"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  disabled={mutation.isPending}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">ملاحظات (اختياري)</label>
              <input
                type="text"
                className="form-input"
                placeholder="أية ملاحظات إضافية حول التعيين..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
              className="btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'جاري الحفظ...' : isEditing ? 'حفظ التعديلات' : 'تأكيد التعيين'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
