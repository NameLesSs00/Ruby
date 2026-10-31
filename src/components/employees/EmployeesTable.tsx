import {
  Edit2, CheckCircle, XCircle, Trash2,
  Phone, Calendar, AlertCircle, Briefcase,
} from 'lucide-react';
import type { Employee } from '../../modules/employees';

export interface EmployeesTableProps {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
  debouncedSearch: string;
  page: number;
  totalCount: number;
  pageSize: number;
  statusMutationPending: boolean;
  onEdit: (employee: Employee) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  onDelete: (employee: Employee) => void;
  onPageChange: (page: number) => void;
}

export const EmployeesTable = ({
  employees, isLoading, isError, debouncedSearch,
  page, totalCount, pageSize, statusMutationPending,
  onEdit, onToggleStatus, onDelete, onPageChange,
}: EmployeesTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
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
                    <div className="coach-avatar">{employee.fullName.charAt(0)}</div>
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
                    <button type="button" className="btn-icon-action" title="تعديل بيانات الموظف" onClick={() => onEdit(employee)}>
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      className={`btn-icon-action ${employee.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                      title={employee.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                      disabled={statusMutationPending}
                      onClick={() => onToggleStatus(employee.id, !employee.isActive)}
                    >
                      {employee.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                    <button type="button" className="btn-icon-action delete" title="حذف الموظف" onClick={() => onDelete(employee)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {!isLoading && totalCount > 0 && (
        <div className="pagination-wrapper">
          <span>إجمالي الموظفين: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})</span>
          <div className="pagination-controls">
            <button type="button" className="btn-page" disabled={page <= 1} onClick={() => onPageChange(Math.max(page - 1, 1))}>السابق</button>
            <button type="button" className="btn-page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>التالي</button>
          </div>
        </div>
      )}
    </div>
  );
};

