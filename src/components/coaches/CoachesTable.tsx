import {
  Edit2,
  CheckCircle,
  XCircle,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import type { Coach } from '../../modules/coaches';

export interface CoachesTableProps {
  coaches: Coach[];
  isLoading: boolean;
  isError: boolean;
  debouncedSearch: string;
  page: number;
  totalCount: number;
  pageSize: number;
  statusMutationPending: boolean;
  onEdit: (coach: Coach) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  onPageChange: (page: number) => void;
}

export const CoachesTable = ({
  coaches,
  isLoading,
  isError,
  debouncedSearch,
  page,
  totalCount,
  pageSize,
  statusMutationPending,
  onEdit,
  onToggleStatus,
  onPageChange,
}: CoachesTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>المدرب</th>
            <th>رقم الهاتف</th>
            <th>تاريخ التعيين</th>
            <th>الحالة</th>
            <th>الملاحظات</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="spinner"
                    style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                  />
                  <span>جاري تحميل بيانات المدربين...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle
                  size={24}
                  style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }}
                />
                <span>تعذر تحميل قائمة المدربين، يرجى المحاولة مرة أخرى</span>
              </td>
            </tr>
          ) : coaches.length === 0 ? (
            <tr>
              <td colSpan={6} className="table-empty-row">
                <span>
                  لا يوجد مدربون مسجلون حالياً {debouncedSearch ? 'مطابقون للبحث' : ''}
                </span>
              </td>
            </tr>
          ) : (
            coaches.map((coach) => (
              <tr key={coach.id}>
                {/* Name cell */}
                <td>
                  <div className="coach-cell-name">
                    <div className="coach-avatar">{coach.fullName.charAt(0)}</div>
                    <span>{coach.fullName}</span>
                  </div>
                </td>

                {/* Phone */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                    <Phone size={15} />
                    <span dir="ltr">{coach.phoneNumber}</span>
                  </div>
                </td>

                {/* Hire date */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                    <Calendar size={15} />
                    <span>{coach.hireDate ? coach.hireDate.split('T')[0] : '—'}</span>
                  </div>
                </td>

                {/* Status badge */}
                <td>
                  <span className={`status-badge ${coach.isActive ? 'active' : 'inactive'}`}>
                    {coach.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>

                {/* Notes */}
                <td>
                  <span style={{ color: coach.notes ? '#334155' : '#94a3b8', fontSize: '0.85rem' }}>
                    {coach.notes || 'لا توجد ملاحظات'}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="table-actions" style={{ justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="btn-icon-action"
                      title="تعديل بيانات المدرب"
                      onClick={() => onEdit(coach)}
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      type="button"
                      className={`btn-icon-action ${coach.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                      title={coach.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                      disabled={statusMutationPending}
                      onClick={() => onToggleStatus(coach.id, !coach.isActive)}
                    >
                      {coach.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination bar */}
      {!isLoading && totalCount > 0 && (
        <div className="pagination-wrapper">
          <span>
            إجمالي المدربين: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
          </span>
          <div className="pagination-controls">
            <button
              type="button"
              className="btn-page"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(page - 1, 1))}
            >
              السابق
            </button>
            <button
              type="button"
              className="btn-page"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
