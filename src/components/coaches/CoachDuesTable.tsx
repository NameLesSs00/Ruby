import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  User,
} from 'lucide-react';
import type { CoachDue } from '../../modules/coachDues';
import { PaginationBar } from '../ui/PaginationBar';

interface CoachDuesTableProps {
  items: CoachDue[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPayDue: (due: CoachDue) => void;
}

export const CoachDuesTable = ({
  items,
  isLoading,
  isError,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onPayDue,
}: CoachDuesTableProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ whiteSpace: 'nowrap' }}>المدرب</th>
            <th style={{ whiteSpace: 'nowrap' }}>إجمالي المستحق</th>
            <th style={{ whiteSpace: 'nowrap' }}>المسدد</th>
            <th style={{ whiteSpace: 'nowrap' }}>المتبقي</th>
            <th style={{ width: 130, whiteSpace: 'nowrap' }}>نسبة السداد</th>
            <th style={{ minWidth: 160 }}>البيان والسبب</th>
            <th style={{ whiteSpace: 'nowrap' }}>تاريخ التسجيل</th>
            <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="spinner"
                    style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                  />
                  <span>جاري تحميل مستحقات المدربين...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={8} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل مستحقات المدربين، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={8} className="table-empty-row">
                <span>لا توجد مستحقات مالية مسجلة حالياً تطابق الفلاتر المحددة</span>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const itemPercent =
                item.amount > 0
                  ? Math.min(100, Math.round(((item.paidAmount || 0) / item.amount) * 100))
                  : 100;
              const dateFormatted = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('ar-EG')
                : '—';

              return (
                <tr key={item.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          backgroundColor: '#fff7ed',
                          color: '#ea580c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <User size={15} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.88rem' }}>
                          {item.coachName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          مستحق #{item.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 700, color: '#0d1527' }}>
                      {item.amount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>
                      {item.paidAmount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        color: item.remainingAmount > 0 ? '#b91c1c' : '#16a34a',
                      }}
                    >
                      {item.remainingAmount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 90 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                        {itemPercent}%
                      </span>
                      <div
                        style={{
                          width: '100%',
                          height: 5,
                          borderRadius: 999,
                          backgroundColor: '#f1f5f9',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${itemPercent}%`,
                            borderRadius: 999,
                            backgroundColor:
                              itemPercent >= 100
                                ? '#10b981'
                                : itemPercent > 0
                                ? '#f59e0b'
                                : '#ef4444',
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td style={{ fontSize: '0.85rem', color: '#334155', maxWidth: 220 }}>
                    {item.description || '—'}
                  </td>

                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#64748b' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} color="#94a3b8" />
                      {dateFormatted}
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      {item.remainingAmount > 0 ? (
                        <button
                          type="button"
                          className="btn-add"
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.8rem',
                            gap: '0.35rem',
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                          onClick={() => onPayDue(item)}
                        >
                          <DollarSign size={14} />
                          <span>سداد دفعة</span>
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.78rem',
                            color: '#16a34a',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <CheckCircle2 size={14} />
                          <span>تم السداد بالكامل</span>
                        </span>
                      )}
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
          label="إجمالي مستحقات المدربين"
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

