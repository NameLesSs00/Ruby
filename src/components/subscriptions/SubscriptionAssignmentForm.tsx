import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Award, Briefcase, Plus } from 'lucide-react';
import {
  subscriptionCoachAssignmentsApi,
  coachAssignmentKeys,
  type Subscription,
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

interface SubscriptionAssignmentFormProps {
  subscription: Subscription;
}

export const SubscriptionAssignmentForm = ({
  subscription,
}: SubscriptionAssignmentFormProps) => {
  const [assigneeType, setAssigneeType] = useState<'coach' | 'employee'>('coach');
  const [selectedStaff, setSelectedStaff] = useState<SelectOption | null>(null);
  const [startDate, setStartDate] = useState(
    subscription.startDate?.slice(0, 10) || new Date().toISOString().slice(0, 10)
  );
  const [endDate, setEndDate] = useState(
    subscription.endDate?.slice(0, 10) || new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState('');

  const createMutation = useMutation({
    mutationFn: (payload: CreateCoachAssignmentPayload) =>
      subscriptionCoachAssignmentsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachAssignmentKeys.all });
      showToast.success('تم تعيين الكادر للاشتراك بنجاح');
      setSelectedStaff(null);
      setNotes('');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تعيين الكادر للاشتراك');
    },
  });

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

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff) {
      showToast.warning('يرجى اختيار المدرب أو الموظف أولاً');
      return;
    }

    createMutation.mutate({
      subscriptionId: subscription.id,
      coachId: assigneeType === 'coach' ? selectedStaff.id : null,
      employeeId: assigneeType === 'employee' ? selectedStaff.id : null,
      startDate,
      endDate,
      notes: notes.trim() || null,
    });
  };

  return (
    <form
      onSubmit={handleAddAssignment}
      style={{
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #e2e8f0',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          marginBottom: '0.85rem',
          color: '#0d1527',
          fontWeight: 800,
          fontSize: '0.9rem',
        }}
      >
        <Plus size={16} color="#ff6b22" />
        <span>إضافة تعيين جديد للاشتراك</span>
      </div>

      {/* Segmented Staff Type */}
      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
        <label className="form-label">نوع الكادر المراد تعيينه</label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.4rem',
            backgroundColor: '#e2e8f0',
            padding: '0.25rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAssigneeType('coach');
              setSelectedStaff(null);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.4rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: assigneeType === 'coach' ? '#ffffff' : 'transparent',
              color: assigneeType === 'coach' ? '#ea580c' : '#64748b',
              boxShadow: assigneeType === 'coach' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Award size={16} />
            <span>مدرب (Coach)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAssigneeType('employee');
              setSelectedStaff(null);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              padding: '0.4rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: assigneeType === 'employee' ? '#ffffff' : 'transparent',
              color: assigneeType === 'employee' ? '#059669' : '#64748b',
              boxShadow: assigneeType === 'employee' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Briefcase size={16} />
            <span>موظف (Employee)</span>
          </button>
        </div>
      </div>

      {/* Async Staff Selector */}
      <AsyncSearchableSelect
        label={assigneeType === 'coach' ? 'اختيار المدرب' : 'اختيار الموظف'}
        placeholder={
          assigneeType === 'coach'
            ? 'ابحث باسم المدرب أو الهاتف...'
            : 'ابحث باسم الموظف أو المسمى الوظيفي...'
        }
        selectedItem={selectedStaff}
        onChange={(opt) => setSelectedStaff(opt)}
        loadOptions={assigneeType === 'coach' ? loadCoaches : loadEmployees}
        required
        disabled={createMutation.isPending}
      />

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="assign-start" style={{ fontSize: '0.8rem' }}>
            تاريخ البدء <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="assign-start"
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            disabled={createMutation.isPending}
          />
        </div>
        <div className="form-group" style={{ margin: 0 }}>
          <label className="form-label" htmlFor="assign-end" style={{ fontSize: '0.8rem' }}>
            تاريخ الانتهاء <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="assign-end"
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            disabled={createMutation.isPending}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="form-group" style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
        <label className="form-label" htmlFor="assign-notes" style={{ fontSize: '0.8rem' }}>
          ملاحظات التعيين (اختياري)
        </label>
        <input
          id="assign-notes"
          type="text"
          placeholder="أي تعليمات أو ملاحظات للمدرب أو المشرف..."
          className="form-input"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={createMutation.isPending}
        />
      </div>

      <button
        type="submit"
        className="btn-add"
        style={{ width: '100%', justifyContent: 'center' }}
        disabled={createMutation.isPending}
      >
        {createMutation.isPending ? (
          <>
            <div className="spinner" />
            <span>جاري تسجيل التعيين...</span>
          </>
        ) : (
          <span>حفظ وتأكيد التعيين</span>
        )}
      </button>
    </form>
  );
};

