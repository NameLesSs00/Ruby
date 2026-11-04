import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Award,
  Briefcase,
  X,
  Trash2,
  Edit2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  subscriptionCoachAssignmentsApi,
  coachAssignmentKeys,
  type Subscription,
  type SubscriptionCoachAssignment,
} from '../../modules/subscriptions';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { SubscriptionAssignmentForm } from './SubscriptionAssignmentForm';
import { AssignmentFormModal } from './AssignmentFormModal';

interface SubscriptionAssignmentsModalProps {
  isOpen: boolean;
  subscription: Subscription | null;
  onClose: () => void;
}

export const SubscriptionAssignmentsModal = ({
  isOpen,
  subscription,
  onClose,
}: SubscriptionAssignmentsModalProps) => {
  const [editingAssignment, setEditingAssignment] =
    useState<SubscriptionCoachAssignment | null>(null);

  const { data: assignmentsData, isLoading } = useQuery({
    queryKey: coachAssignmentKeys.list({ subscriptionId: subscription?.id }),
    queryFn: () =>
      subscriptionCoachAssignmentsApi.getAll({
        subscriptionId: subscription?.id,
        page: 1,
        pageSize: 50,
      }),
    enabled: isOpen && Boolean(subscription?.id),
  });

  const assignments = assignmentsData?.items || [];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => subscriptionCoachAssignmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachAssignmentKeys.all });
      showToast.success('تم إزالة التعيين بنجاح');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في إزالة التعيين');
    },
  });

  if (!isOpen || !subscription) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: 620, width: '95%' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7',
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.15rem' }}>
                تعيين الكادر التدريبي والإشرافي
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                اشتراك العميل: <strong>{subscription.clientName}</strong> (رقم #{subscription.id})
              </span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '74vh', overflowY: 'auto' }}>
          {/* Active Assignments List */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0d1527' }}>
                الكادر المعين حالياً للاشتراك ({assignments.length})
              </span>
            </div>

            {isLoading ? (
              <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 0.4rem' }} />
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>جاري تحميل التعيينات...</span>
              </div>
            ) : assignments.length === 0 ? (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.85rem',
                }}
              >
                <AlertCircle size={24} style={{ margin: '0 auto 0.4rem', opacity: 0.5 }} />
                <span>لا يوجد أي مدرب أو موظف معين لهذا الاشتراك حتى الآن</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {assignments.map((item) => {
                  const isCoach = Boolean(item.coachId);
                  const staffName =
                    item.coachName ||
                    item.employeeName ||
                    (isCoach ? `مدرب #${item.coachId}` : `موظف #${item.employeeId}`);

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            backgroundColor: isCoach ? '#fff7ed' : '#ecfdf5',
                            color: isCoach ? '#ea580c' : '#059669',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {isCoach ? <Award size={18} /> : <Briefcase size={18} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <strong style={{ fontSize: '0.9rem', color: '#0d1527' }}>{staffName}</strong>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                padding: '0.1rem 0.45rem',
                                borderRadius: '4px',
                                backgroundColor: isCoach ? '#ffedd5' : '#d1fae5',
                                color: isCoach ? '#c2410c' : '#047857',
                                fontWeight: 700,
                              }}
                            >
                              {isCoach ? 'مدرب' : 'موظف'}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              fontSize: '0.75rem',
                              color: '#64748b',
                              marginTop: '0.15rem',
                            }}
                          >
                            <Calendar size={13} />
                            <span>
                              من {item.startDate.slice(0, 10)} إلى {item.endDate.slice(0, 10)}
                            </span>
                            {item.notes && <span>— {item.notes}</span>}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          type="button"
                          onClick={() => setEditingAssignment(item)}
                          style={{
                            border: '1px solid #bae6fd',
                            backgroundColor: '#f0f9ff',
                            color: '#0284c7',
                            borderRadius: '6px',
                            padding: '0.35rem 0.5rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                          title="تعديل التعيين"
                        >
                          <Edit2 size={13} />
                          <span>تعديل</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('هل أنت متأكد من إزالة هذا التعيين؟')) {
                              deleteMutation.mutate(item.id);
                            }
                          }}
                          style={{
                            border: 'none',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            borderRadius: '6px',
                            padding: '0.35rem 0.5rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                          title="حذف التعيين"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 size={13} />
                          <span>إزالة</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <SubscriptionAssignmentForm subscription={subscription} />
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>

      {/* Edit Assignment Modal */}
      <AssignmentFormModal
        isOpen={Boolean(editingAssignment)}
        editingAssignment={editingAssignment}
        defaultSubscriptionId={subscription?.id}
        onClose={() => setEditingAssignment(null)}
        onSuccess={() => {
          setEditingAssignment(null);
          queryClient.invalidateQueries({ queryKey: coachAssignmentKeys.all });
        }}
      />
    </div>
  );
};
