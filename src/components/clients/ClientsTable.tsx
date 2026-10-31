import {
  Edit2,
  CheckCircle,
  XCircle,
  Phone,
  Calendar,
  AlertCircle,
  QrCode,
  User,
} from 'lucide-react';
import type { Client } from '../../modules/clients';

function calculateAge(dobString: string): number | null {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  isError: boolean;
  debouncedSearch: string;
  page: number;
  totalCount: number;
  pageSize: number;
  statusMutationPending: boolean;
  onEdit: (client: Client) => void;
  onToggleStatus: (id: number, isActive: boolean) => void;
  onBarcode: (client: Client) => void;
  onPageChange: (page: number) => void;
}

export const ClientsTable = ({
  clients,
  isLoading,
  isError,
  debouncedSearch,
  page,
  totalCount,
  pageSize,
  statusMutationPending,
  onEdit,
  onToggleStatus,
  onBarcode,
  onPageChange,
}: ClientsTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>كود العميل</th>
            <th>العميل</th>
            <th>رقم الهاتف</th>
            <th>تاريخ الميلاد / السن</th>
            <th>الحالة</th>
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
                  <span>جاري تحميل قائمة العملاء...</span>
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
                <span>تعذر تحميل قائمة العملاء، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : clients.length === 0 ? (
            <tr>
              <td colSpan={6} className="table-empty-row">
                <span>
                  لا يوجد عملاء مسجلون حالياً {debouncedSearch ? 'مطابقون للبحث' : ''}
                </span>
              </td>
            </tr>
          ) : (
            clients.map((client) => {
              const age = calculateAge(client.dateOfBirth);
              return (
                <tr key={client.id}>
                  <td>
                    <span className="client-code-badge">
                      <QrCode size={13} color="#0284c7" />
                      {client.clientCode}
                    </span>
                  </td>
                  <td>
                    <div className="coach-cell-name">
                      <div className="coach-avatar" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
                        <User size={18} />
                      </div>
                      <span>{client.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <Phone size={15} />
                      <span dir="ltr">{client.phoneNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <Calendar size={15} />
                      <span>
                        {client.dateOfBirth ? client.dateOfBirth.split('T')[0] : '—'}
                        {age !== null && (
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginInlineStart: '0.35rem' }}>
                            ({age} سنة)
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${client.isActive ? 'active' : 'inactive'}`}>
                      {client.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action barcode"
                        title="عرض وطباعة الباركود"
                        onClick={() => onBarcode(client)}
                      >
                        <QrCode size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل بيانات العميل"
                        onClick={() => onEdit(client)}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        className={`btn-icon-action ${client.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                        title={client.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                        disabled={statusMutationPending}
                        onClick={() => onToggleStatus(client.id, !client.isActive)}
                      >
                        {client.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination Bar */}
      {!isLoading && totalCount > 0 && (
        <div className="pagination-wrapper">
          <span>
            إجمالي العملاء: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
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
