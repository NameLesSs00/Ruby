import {
  Award,
  Briefcase,
  Calendar,
  AlertCircle,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { SubscriptionCoachAssignment } from '../../modules/subscriptions';
import { PaginationBar } from '../ui/PaginationBar';

interface SubscriptionAssignmentsTableProps {
  items: SubscriptionCoachAssignment[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onEdit: (assignment: SubscriptionCoachAssignment) => void;
  onDelete: (assignment: SubscriptionCoachAssignment) => void;
}

export const SubscriptionAssignmentsTable = ({
  items,
  isLoading,
  isError,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
}: SubscriptionAssignmentsTableProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ whiteSpace: 'nowrap' }}>الاشتراك المرتبط</th>
            <th style={{ whiteSpace: 'nowrap' }}>الكادر المعين</th>
            <th style={{ whiteSpace: 'nowrap' }}>تاريخ البدء</th>
            <th style={{ whiteSpace: 'nowrap' }}>تاريخ الانتهاء</th>
            <th style={{ minWidth: 160 }}>الملاحظات</th>
            <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>الإجراءات</th>
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
                  <span>جاري تحميل سجل تعيينات الكادر والمدربين...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل التعيينات، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={6} className="table-empty-row">
                <span>لا توجد تعيينات مسجلة حالياً تطابق الفلاتر المحددة</span>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isCoach = Boolean(item.coachId);
              const staffName =
                item.coachName ||
                item.employeeName ||
                (isCoach ? `مدرب #${item.coachId}` : `موظف #${item.employeeId}`);

              return (
                <tr key={item.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        backgroundColor: '#f1f5f9',
                        color: '#0284c7',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        border: '1px solid #e0f2fe',
                        display: 'inline-block',
                      }}
                    >
                      اشتراك #{item.subscriptionId}
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          backgroundColor: isCoach ? '#fff7ed' : '#ecfdf5',
                          color: isCoach ? '#ea580c' : '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isCoach ? <Award size={16} /> : <Briefcase size={16} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.88rem' }}>
                          {staffName}
                        </div>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: isCoach ? '#ffedd5' : '#d1fae5',
                            color: isCoach ? '#c2410c' : '#047857',
                            fontWeight: 700,
                            display: 'inline-block',
                            marginTop: '0.1rem',
                          }}
                        >
                          {isCoach ? 'مدرب' : 'موظف'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#334155' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} color="#94a3b8" />
                      {item.startDate ? item.startDate.slice(0, 10) : '—'}
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#334155' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} color="#94a3b8" />
                      {item.endDate ? item.endDate.slice(0, 10) : '—'}
                    </span>
                  </td>

                  <td style={{ fontSize: '0.85rem', color: '#334155', maxWidth: 240 }}>
                    {item.notes || '—'}
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="table-actions" style={{ justifyContent: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل التعيين"
                        onClick={() => onEdit(item)}
                        style={{
                          color: '#0284c7',
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bae6fd',
                        }}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-icon-action delete"
                        title="إزالة التعيين"
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
          label="إجمالي سجلات التعيين"
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

