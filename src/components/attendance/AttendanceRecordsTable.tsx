import { Clock, Calendar, User, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { type AttendanceRecord } from '../../modules/attendance';
import { PaginationBar } from '../ui/PaginationBar';

interface AttendanceRecordsTableProps {
  items: AttendanceRecord[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onEdit: (record: AttendanceRecord) => void;
  onDelete: (record: AttendanceRecord) => void;
}

export const AttendanceRecordsTable = ({
  items,
  isLoading,
  isError,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
}: AttendanceRecordsTableProps) => {
  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const formattedDate = date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return { formattedDate, formattedTime };
    } catch {
      return { formattedDate: isoString, formattedTime: '' };
    }
  };

  return (
    <div className="data-table-wrapper" style={{ backgroundColor: '#ffffff' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ whiteSpace: 'nowrap' }}>المشترك</th>
            <th style={{ whiteSpace: 'nowrap' }}>الاشتراك المرتبط</th>
            <th style={{ whiteSpace: 'nowrap' }}>تاريخ ووقت الحضور</th>
            <th style={{ minWidth: 160 }}>الملاحظات</th>
            <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="spinner"
                    style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                  />
                  <span>جاري تحميل سجلات الحضور...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={5} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجلات الحضور، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={5} className="table-empty-row">
                <span>لا توجد سجلات حضور مسجلة تطابق محددات البحث</span>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const { formattedDate, formattedTime } = formatDateTime(item.checkInTime);
              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: '#0284c7',
                        }}
                      >
                        <User size={15} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0d1527', whiteSpace: 'nowrap' }}>
                          {item.clientName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          معرف العميل #{item.clientId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: '#eff6ff',
                        color: '#0284c7',
                        border: '1px solid #bae6fd',
                      }}
                    >
                      اشتراك #{item.subscriptionId}
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#0d1527',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Calendar size={13} color="#64748b" />
                        {formattedDate}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Clock size={12} color="#94a3b8" />
                        {formattedTime}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span style={{ fontSize: '0.85rem', color: item.notes ? '#334155' : '#94a3b8' }}>
                      {item.notes || '—'}
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="table-actions" style={{ justifyContent: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل الملاحظات أو الوقت"
                        onClick={() => onEdit(item)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action delete"
                        title="حذف قيد الحضور"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          label="إجمالي سجلات الحضور"
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

