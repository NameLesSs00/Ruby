import { useState, useEffect } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import {
  employeesApi,
  employeeKeys,
  type Employee,
} from '../modules/employees';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';
import { EmployeesTable } from '../components/employees/EmployeesTable';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { DeleteModal } from '../components/ui/DeleteModal';

export const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const isActiveParam =
    statusFilter === 'all' ? undefined : statusFilter === 'active';

  const { data, isLoading, isError } = useQuery({
    queryKey: employeeKeys.list({
      searchTerm: debouncedSearch,
      isActive: isActiveParam,
      page,
      pageSize,
    }),
    queryFn: () =>
      employeesApi.getAll({
        searchTerm: debouncedSearch,
        isActive: isActiveParam,
        page,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      employeesApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      showToast.success(
        variables.isActive ? 'تم تفعيل حساب الموظف بنجاح' : 'تم تعطيل حساب الموظف بنجاح'
      );
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تعديل حالة الموظف');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      showToast.success('تم حذف الموظف بنجاح');
      setDeletingEmployee(null);
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حذف الموظف');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="view-container">
      <div className="view-toolbar">
        <div className="toolbar-filters">
          <div className="toolbar-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="البحث بالاسم أو المسمى الوظيفي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
              setPage(1);
            }}
          >
            <option value="all">جميع الحالات</option>
            <option value="active">النشطون فقط</option>
            <option value="inactive">غير النشطين فقط</option>
          </select>
        </div>

        <button type="button" className="btn-add" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      <EmployeesTable
        employees={data?.items || []}
        isLoading={isLoading}
        isError={isError}
        debouncedSearch={debouncedSearch}
        page={page}
        totalCount={data?.totalCount || 0}
        pageSize={pageSize}
        statusMutationPending={statusMutation.isPending}
        onEdit={handleOpenEditModal}
        onToggleStatus={(id, isActive) => statusMutation.mutate({ id, isActive })}
        onDelete={setDeletingEmployee}
        onPageChange={setPage}
      />

      <EmployeeFormModal
        isOpen={isModalOpen}
        editingEmployee={editingEmployee}
        onClose={handleCloseModal}
        onSuccess={handleCloseModal}
      />

      <DeleteModal
        isOpen={!!deletingEmployee}
        title="تأكيد حذف الموظف"
        message={`هل أنت متأكد من حذف الموظف "${deletingEmployee?.fullName}"؟`}
        confirmLabel="نعم، حذف الموظف"
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={() => deletingEmployee && deleteMutation.mutate(deletingEmployee.id)}
      />
    </div>
  );
};
