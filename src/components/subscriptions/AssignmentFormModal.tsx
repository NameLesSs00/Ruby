import { useState, useEffect, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Award, X, Ticket } from 'lucide-react';
import {
  subscriptionCoachAssignmentsApi,
  subscriptionsApi,
  coachAssignmentKeys,
  subscriptionKeys,
  type Subscription,
  type SubscriptionCoachAssignment,
  type CreateCoachAssignmentPayload,
} from '../../modules/subscriptions';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { loadSubscriptionOptions } from './assignmentHelpers';
import { AssignmentStaffSection } from './AssignmentStaffSection';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface AssignmentFormModalProps {
  isOpen: boolean;
  editingAssignment?: SubscriptionCoachAssignment | null;
  defaultSubscriptionId?: number;
  defaultSubscription?: Subscription | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignmentFormModal = ({
  isOpen,
  editingAssignment,
  defaultSubscriptionId,
  defaultSubscription,
  onClose,
  onSuccess,
}: AssignmentFormModalProps) => {
  useModalEscape(onClose, isOpen);

  const isEditing = Boolean(editingAssignment);

  const [selectedSubscription, setSelectedSubscription] = useState<SelectOption | null>(null);
  const [assigneeType, setAssigneeType] = useState<'coach' | 'employee'>('coach');
  const [selectedStaff, setSelectedStaff] = useState<SelectOption | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const targetSubId = editingAssignment?.subscriptionId || defaultSubscription?.id || defaultSubscriptionId;
    if (defaultSubscription) {
      setSelectedSubscription({
        id: defaultSubscription.id,
        label: `${defaultSubscription.clientName} (اشتراك #${defaultSubscription.id})`,
        subLabel: `من ${defaultSubscription.startDate?.slice(0, 10)} إلى ${defaultSubscription.endDate?.slice(0, 10)}`,
        tag: defaultSubscription.status === 'Active' ? 'نشط' : defaultSubscription.status,
      });
      setStartDate(defaultSubscription.startDate?.slice(0, 10) || new Date().toISOString().slice(0, 10));
      setEndDate(defaultSubscription.endDate?.slice(0, 10) || new Date().toISOString().slice(0, 10));
    } else if (targetSubId) {
      setSelectedSubscription({ id: targetSubId, label: `اشتراك #${targetSubId}` });
      subscriptionsApi.getById(targetSubId).then((sub) => {
        if (!sub) return;
        setSelectedSubscription({
          id: sub.id,
          label: `${sub.clientName} (اشتراك #${sub.id})`,
          subLabel: `من ${sub.startDate?.slice(0, 10)} إلى ${sub.endDate?.slice(0, 10)}`,
          tag: sub.status === 'Active' ? 'نشط' : sub.status,
        });
        if (!editingAssignment) {
          if (sub.startDate) setStartDate(sub.startDate.slice(0, 10));
          if (sub.endDate) setEndDate(sub.endDate.slice(0, 10));
        }
      }).catch(() => {});
    } else {
      setSelectedSubscription(null);
      const today = new Date().toISOString().slice(0, 10);
      setStartDate(today);
      setEndDate(today);
    }

    if (editingAssignment) {
      setStartDate(editingAssignment.startDate?.slice(0, 10) || '');
      setEndDate(editingAssignment.endDate?.slice(0, 10) || '');
      setNotes(editingAssignment.notes || '');
      if (editingAssignment.coachId) {
        setAssigneeType('coach');
        setSelectedStaff({ id: editingAssignment.coachId, label: editingAssignment.coachName || `مدرب #${editingAssignment.coachId}`, tag: 'مدرب' });
      } else if (editingAssignment.employeeId) {
        setAssigneeType('employee');
        setSelectedStaff({ id: editingAssignment.employeeId, label: editingAssignment.employeeName || `موظف #${editingAssignment.employeeId}`, tag: 'موظف' });
      }
    } else {
      setAssigneeType('coach');
      setSelectedStaff(null);
      setNotes('');
    }
  }, [isOpen, editingAssignment, defaultSubscriptionId, defaultSubscription]);

  const mutation = useMutation({
    mutationFn: (payload: CreateCoachAssignmentPayload) => {
      if (isEditing && editingAssignment) {
        return subscriptionCoachAssignmentsApi.update(editingAssignment.id, payload);
      }
      return subscriptionCoachAssignmentsApi.create(payload);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: coachAssignmentKeys.all });
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.all });
      showToast.success(res.message || (isEditing ? 'تم تعديل التعيين بنجاح' : 'تم تعيين الكادر بنجاح'));
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حفظ التعيين');
    },
  });

  if (!isOpen) return null;

  const handleSubscriptionSelect = (opt: SelectOption | null) => {
    setSelectedSubscription(opt);
    if (opt) {
      subscriptionsApi
        .getById(opt.id)
        .then((sub) => {
          if (sub) {
            if (sub.startDate) setStartDate(sub.startDate.slice(0, 10));
            if (sub.endDate) setEndDate(sub.endDate.slice(0, 10));
          }
        })
        .catch(() => {});
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedSubscription) {
      showToast.warning('يرجى اختيار الاشتراك أولاً');
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
      subscriptionId: selectedSubscription.id,
      coachId: assigneeType === 'coach' ? selectedStaff.id : null,
      employeeId: assigneeType === 'employee' ? selectedStaff.id : null,
      startDate,
      endDate,
      notes: notes.trim() || null,
    });
  };

  const hasFixedSubscription = isEditing || Boolean(defaultSubscriptionId) || Boolean(defaultSubscription);

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 520 }}>
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
                {isEditing ? `تعديل التعيين #${editingAssignment?.id}` : 'اختيار الاشتراك وربطه بمدرب أو موظف'}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Subscription Selection (No Raw ID Input!) */}
            {hasFixedSubscription ? (
              <div className="form-group">
                <label className="form-label">الاشتراك المرتبط</label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '6px',
                      backgroundColor: '#eff6ff',
                      color: '#0284c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Ticket size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d1527' }}>
                      {selectedSubscription?.label || `اشتراك #${editingAssignment?.subscriptionId || defaultSubscriptionId}`}
                    </div>
                    {selectedSubscription?.subLabel && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                        {selectedSubscription.subLabel}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label required">اختيار الاشتراك</label>
                <AsyncSearchableSelect
                  selectedItem={selectedSubscription}
                  onChange={handleSubscriptionSelect}
                  loadOptions={loadSubscriptionOptions}
                  placeholder="ابحث باسم العميل أو رقم الاشتراك..."
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                  ابحث عن اشتراك العميل النشط لاختياره مباشرة بدون إدخال أرقام
                </span>
              </div>
            )}

            {/* Staff Section */}
            <AssignmentStaffSection
              assigneeType={assigneeType}
              onAssigneeTypeChange={(type) => {
                setAssigneeType(type);
                setSelectedStaff(null);
              }}
              selectedStaff={selectedStaff}
              onSelectedStaffChange={setSelectedStaff}
              disabled={mutation.isPending}
            />

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
              disabled={mutation.isPending || !selectedSubscription || !selectedStaff}
            >
              {mutation.isPending ? 'جاري الحفظ...' : isEditing ? 'حفظ التعديلات' : 'تأكيد التعيين'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
