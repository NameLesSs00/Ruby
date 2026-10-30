import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Phone,
  Calendar,
  AlertCircle,
  AlertTriangle,
  Briefcase,
} from 'lucide-react';
import {
  employeesApi,
  employeeKeys,
  type Employee,
  type CreateEmployeePayload,
  type UpdateEmployeePayload,
} from '../modules/employees';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';

export const EmployeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Delete Confirmation Modal State
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [monthlySalary, setMonthlySalary] = useState('');
  const [hireDate, setHireDate] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const isActiveParam =
    statusFilter === 'all' ? undefined : statusFilter === 'active';

  // Query employees
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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (payload: CreateEmployeePayload) => employeesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      showToast.success('تمت إضافة الموظف بنجاح');
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في إضافة الموظف، يرجى المحاولة لاحقاً');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateEmployeePayload }) =>
      employeesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      showToast.success('تم تحديث بيانات الموظف بنجاح');
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في تحديث بيانات الموظف');
    },
  });

  // Toggle status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      employeesApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      showToast.success(
        variables.isActive
          ? 'تم تفعيل حساب الموظف بنجاح'
          : 'تم تعطيل حساب الموظف بنجاح'
      );
    },
    onError: () => {
      showToast.error('فشل في تعديل حالة الموظف');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      showToast.success('تم حذف الموظف بنجاح');
      setDeletingEmployee(null);
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في حذف الموظف');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingEmployee(null);
    setFullName('');
    setPhoneNumber('');
    setJobTitle('');
    setMonthlySalary('');
    const today = new Date().toISOString().split('T')[0];
    setHireDate(today);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setFullName(employee.fullName);
    setPhoneNumber(employee.phoneNumber);
    setJobTitle(employee.jobTitle);
    setMonthlySalary(employee.monthlySalary.toString());
    setHireDate(employee.hireDate ? employee.hireDate.split('T')[0] : '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast.warning('يرجى كتابة اسم الموظف بالكامل');
      return;
    }

    if (!phoneNumber.trim()) {
      showToast.warning('يرجى إدخال رقم هاتف الموظف');
      return;
    }

    if (!jobTitle.trim()) {
      showToast.warning('يرجى كتابة المسمى الوظيفي');
      return;
    }

    const salaryNum = parseFloat(monthlySalary);
    if (isNaN(salaryNum) || salaryNum < 0) {
      showToast.warning('يرجى إدخال راتب شهري صحيح');
      return;
    }

    if (!hireDate) {
      showToast.warning('يرجى تحديد تاريخ التعيين');
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      jobTitle: jobTitle.trim(),
      monthlySalary: salaryNum,
      hireDate,
    };

    if (editingEmployee) {
      updateMutation.mutate({ id: editingEmployee.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingEmployee) {
      deleteMutation.mutate(deletingEmployee.id);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const employees = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="view-container">
      {/* Top Toolbar */}
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

        <button
          type="button"
          className="btn-add"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} />
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      {/* Employees Data Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>الموظف</th>
              <th>المسمى الوظيفي</th>
              <th>رقم الهاتف</th>
              <th>الراتب الشهري</th>
              <th>تاريخ التعيين</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل بيانات الموظفين...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                  <span>تعذر تحميل قائمة الموظفين، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty-row">
                  <span>لا يوجد موظفون مسجلون حالياً {debouncedSearch ? 'مطابقون للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <div className="coach-cell-name">
                      <div className="coach-avatar">
                        {employee.fullName.charAt(0)}
                      </div>
                      <span>{employee.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="job-title-badge">
                      <Briefcase size={13} style={{ marginInlineEnd: '0.35rem' }} />
                      {employee.jobTitle}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <Phone size={15} />
                      <span dir="ltr">{employee.phoneNumber}</span>
                    </div>
                  </td>
                  <td>
                    <span className="salary-text">
                      {employee.monthlySalary.toLocaleString('ar-EG')}
                      <span className="currency-unit">ج.م</span>
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <Calendar size={15} />
                      <span>{employee.hireDate ? employee.hireDate.split('T')[0] : '—'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${employee.isActive ? 'active' : 'inactive'}`}>
                      {employee.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل بيانات الموظف"
                        onClick={() => handleOpenEditModal(employee)}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        className={`btn-icon-action ${employee.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                        title={employee.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            id: employee.id,
                            isActive: !employee.isActive,
                          })
                        }
                      >
                        {employee.isActive ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action delete"
                        title="حذف الموظف"
                        onClick={() => setDeletingEmployee(employee)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        {!isLoading && totalCount > 0 && (
          <div className="pagination-wrapper">
            <span>
              إجمالي الموظفين: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="btn-page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                السابق
              </button>
              <button
                type="button"
                className="btn-page"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialog for Add / Edit Employee */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingEmployee ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="employee-name">
                    اسم الموظف بالكامل <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="employee-name"
                    type="text"
                    className="form-input"
                    placeholder="مثال: أحمد محمود"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="employee-job">
                    المسمى الوظيفي <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="employee-job"
                    type="text"
                    className="form-input"
                    placeholder="مثال: موظف استقبال / محاسب / مشرف"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="employee-phone">
                    رقم الهاتف <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="employee-phone"
                    type="tel"
                    className="form-input"
                    placeholder="01012345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={isSaving}
                    dir="ltr"
                    style={{ textAlign: 'end' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="employee-salary">
                    الراتب الشهري (بالجنيه المصري) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      id="employee-salary"
                      type="number"
                      min="0"
                      step="100"
                      className="form-input"
                      placeholder="مثال: 8000"
                      value={monthlySalary}
                      onChange={(e) => setMonthlySalary(e.target.value)}
                      required
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="employee-hire-date">
                    تاريخ التعيين <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="employee-hire-date"
                    type="date"
                    className="form-input"
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-add"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="spinner" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <span>{editingEmployee ? 'حفظ التعديلات' : 'إضافة الموظف'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {deletingEmployee && (
        <div className="modal-backdrop" onClick={() => setDeletingEmployee(null)}>
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#ef4444' }}>
                تأكيد حذف الموظف
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeletingEmployee(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="confirm-delete-box">
                <div className="delete-warning-icon">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0d1527', marginBottom: '0.4rem' }}>
                    هل أنت متأكد من حذف الموظف "{deletingEmployee.fullName}"؟
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    هذا الإجراء سيقوم بحذف سجل الموظف نهائياً من النظام.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDeletingEmployee(null)}
                disabled={deleteMutation.isPending}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="spinner" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <span>نعم، حذف الموظف</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
