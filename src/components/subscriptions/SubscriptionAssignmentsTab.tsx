import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Award,
  Briefcase,
  Layers,
  Plus,
} from 'lucide-react';
import {
  subscriptionCoachAssignmentsApi,
  coachAssignmentKeys,
  type SubscriptionCoachAssignment,
} from '../../modules/subscriptions';
import { coachesApi } from '../../modules/coaches';
import { employeesApi } from '../../modules/employees';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { SubscriptionAssignmentsTable } from './SubscriptionAssignmentsTable';
import { AssignmentFormModal } from './AssignmentFormModal';
import { DeleteModal } from '../ui/DeleteModal';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

export const SubscriptionAssignmentsTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [filterCoach, setFilterCoach] = useState<SelectOption | null>(null);
  const [filterEmployee, setFilterEmployee] = useState<SelectOption | null>(null);
  const [filterSubId, setFilterSubId] = useState<string>('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] =
    useState<SubscriptionCoachAssignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] =
    useState<SubscriptionCoachAssignment | null>(null);

  const subIdNum = filterSubId ? parseInt(filterSubId, 10) : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: coachAssignmentKeys.list({
      page,
      pageSize,
      coachId: filterCoach ? filterCoach.id : undefined,
      employeeId: filterEmployee ? filterEmployee.id : undefined,
      subscriptionId: !isNaN(subIdNum as number) ? subIdNum : undefined,
    }),
    queryFn: () =>
      subscriptionCoachAssignmentsApi.getAll({
        page,
        pageSize,
        coachId: filterCoach ? filterCoach.id : undefined,
        employeeId: filterEmployee ? filterEmployee.id : undefined,
        subscriptionId: !isNaN(subIdNum as number) ? subIdNum : undefined,
      }),
  });

  const assignments = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const { coachCount, employeeCount } = useMemo(() => {
    let c = 0;
    let e = 0;
    assignments.forEach((a) => {
      if (a.coachId) c += 1;
      if (a.employeeId) e += 1;
    });
    return { coachCount: c, employeeCount: e };
  }, [assignments]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => subscriptionCoachAssignmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachAssignmentKeys.all });
      showToast.success('تم حذف قيد التعيين بنجاح');
      setDeletingAssignment(null);
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حذف التعيين');
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
      subLabel: `المسمى: ${e.jobTitle}`,
      tag: 'موظف',
    }));
  };

  const handleOpenCreateModal = () => {
    setEditingAssignment(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (assignment: SubscriptionCoachAssignment) => {
    setEditingAssignment(assignment);
    setIsFormModalOpen(true);
  };

  const hasActiveFilters = Boolean(filterCoach || filterEmployee || filterSubId);

  const resetFilters = () => {
    setFilterCoach(null);
    setFilterEmployee(null);
    setFilterSubId('');
    setPage(1);
  };

  return (
    <>
      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        {[
          { label: 'إجمالي التعيينات المسجلة', value: totalCount, unit: 'تعيين', icon: <Layers size={22} />, bg: '#eff6ff', color: '#0284c7' },
          { label: 'تعيينات المدربين (الصفحة)', value: coachCount, unit: 'مدرب', icon: <Award size={22} />, bg: '#fff7ed', color: '#ea580c' },
          { label: 'تعيينات الموظفين (الصفحة)', value: employeeCount, unit: 'موظف', icon: <Briefcase size={22} />, bg: '#ecfdf5', color: '#059669' },
        ].map((m, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              padding: '1.1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                backgroundColor: m.bg,
                color: m.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {m.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{m.label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
                {m.value} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{m.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '0.85rem 1.1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ minWidth: 200, flex: 1 }}>
            <AsyncSearchableSelect
              selectedItem={filterCoach}
              onChange={(val) => {
                setFilterCoach(val);
                setPage(1);
              }}
              loadOptions={loadCoaches}
              placeholder="فلترة بالمدرب..."
            />
          </div>

          <div style={{ minWidth: 200, flex: 1 }}>
            <AsyncSearchableSelect
              selectedItem={filterEmployee}
              onChange={(val) => {
                setFilterEmployee(val);
                setPage(1);
              }}
              loadOptions={loadEmployees}
              placeholder="فلترة بالموظف..."
            />
          </div>

          <div style={{ minWidth: 160 }}>
            <input
              type="number"
              min="1"
              className="form-input"
              placeholder="رقم الاشتراك..."
              value={filterSubId}
              onChange={(e) => {
                setFilterSubId(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-secondary"
              onClick={resetFilters}
              style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
            >
              إعادة تعيين
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn-add"
          onClick={handleOpenCreateModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} />
          <span>إضافة تعيين جديد</span>
        </button>
      </div>

      {/* Table */}
      <SubscriptionAssignmentsTable
        items={assignments}
        isLoading={isLoading}
        isError={isError}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onEdit={handleOpenEditModal}
        onDelete={setDeletingAssignment}
      />

      {/* Assignment Form Modal */}
      <AssignmentFormModal
        isOpen={isFormModalOpen}
        editingAssignment={editingAssignment}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingAssignment(null);
        }}
        onSuccess={() => {
          setIsFormModalOpen(false);
          setEditingAssignment(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingAssignment)}
        title="تأكيد إزالة التعيين"
        message={`هل أنت متأكد من إزالة تعيين (${deletingAssignment?.coachName || deletingAssignment?.employeeName || 'الكادر'}) من الاشتراك رقم #${deletingAssignment?.subscriptionId}؟`}
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingAssignment(null)}
        onConfirm={() => {
          if (deletingAssignment) {
            deleteMutation.mutate(deletingAssignment.id);
          }
        }}
      />
    </>
  );
};
