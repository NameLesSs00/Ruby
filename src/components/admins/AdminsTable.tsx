import { Edit2, KeyRound, CheckCircle, XCircle, AlertCircle, Shield, User } from 'lucide-react';
import { type AdminUser, getRoleBadgeInfo } from '../../modules/admins';

interface AdminsTableProps {
  admins: AdminUser[];
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  statusMutationPending: boolean;
  onEdit: (admin: AdminUser) => void;
  onResetPassword: (admin: AdminUser) => void;
  onToggleStatus: (admin: AdminUser) => void;
}

export const AdminsTable = ({
  admins,
  isLoading,
  isError,
  searchTerm,
  statusMutationPending,
  onEdit,
  onResetPassword,
  onToggleStatus,
}: AdminsTableProps) => {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>اسم المستخدم</th>
            <th>البريد الإلكتروني</th>
            <th>الدور والصلاحية</th>
            <th>الحالة</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                  <span>جاري تحميل بيانات المسؤولين...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={5} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                <span>تعذر تحميل قائمة المسؤولين، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : admins.length === 0 ? (
            <tr>
              <td colSpan={5} className="table-empty-row">
                <span>لا يوجد مسؤولون {searchTerm ? 'مطابقون للبحث' : ''}</span>
              </td>
            </tr>
          ) : (
            admins.map((admin) => {
              const roleInfo = getRoleBadgeInfo(admin.role);
              const isSuper = admin.role === 'SuperAdmin';

              return (
                <tr key={admin.id}>
                  <td>
                    <div className="coach-cell-name">
                      <div
                        className="coach-avatar"
                        style={{
                          backgroundColor: isSuper ? '#0D1527' : '#f1f5f9',
                          color: isSuper ? '#f8fafc' : '#0284c7',
                        }}
                      >
                        {isSuper ? <Shield size={16} /> : <User size={16} />}
                      </div>
                      <span style={{ fontWeight: 600 }}>{admin.userName}</span>
                    </div>
                  </td>
                  <td>
                    <span dir="ltr" style={{ color: '#475569', fontSize: '0.9rem' }}>
                      {admin.email}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        backgroundColor: roleInfo.bg,
                        color: roleInfo.color,
                      }}
                    >
                      {roleInfo.label}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${!admin.isDeactivated ? 'active' : 'inactive'}`}>
                      {!admin.isDeactivated ? 'نشط' : 'معطل'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل بيانات المسؤول"
                        onClick={() => onEdit(admin)}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تغيير كلمة المرور"
                        onClick={() => onResetPassword(admin)}
                      >
                        <KeyRound size={16} />
                      </button>

                      {!isSuper && (
                        <button
                          type="button"
                          className={`btn-icon-action ${!admin.isDeactivated ? 'toggle-active' : 'toggle-inactive'}`}
                          title={!admin.isDeactivated ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                          disabled={statusMutationPending}
                          onClick={() => onToggleStatus(admin)}
                        >
                          {!admin.isDeactivated ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

