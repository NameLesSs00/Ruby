import {
  Calendar,
  AlertCircle,
  User,
} from 'lucide-react';
import {
  coachPaymentTypeLabel,
  type CoachPayment,
  type CoachPaymentType,
} from '../../modules/coachDues';
import { PaginationBar } from '../ui/PaginationBar';

interface CoachPaymentsTableProps {
  items: CoachPayment[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const getPaymentTypeBadge = (type: CoachPaymentType) => {
  const isDue = type === 'DuePayment';
  return (
    <span
      style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        padding: '0.2rem 0.65rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        backgroundColor: isDue ? '#ecfdf5' : '#fff7ed',
        color: isDue ? '#047857' : '#c2410c',
        border: `1px solid ${isDue ? '#a7f3d0' : '#fed7aa'}`,
      }}
    >
      {coachPaymentTypeLabel(type)}
    </span>
  );
};

export const CoachPaymentsTable = ({
  items,
  isLoading,
  isError,
  page,
  totalPages,
  totalCount,
  onPageChange,
}: CoachPaymentsTableProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ whiteSpace: 'nowrap' }}>المدرب المستفيد</th>
            <th style={{ whiteSpace: 'nowrap' }}>نوع العملية</th>
            <th style={{ whiteSpace: 'nowrap' }}>المستحق المرتبط</th>
            <th style={{ whiteSpace: 'nowrap' }}>المبلغ المنصرف</th>
            <th style={{ whiteSpace: 'nowrap' }}>تاريخ الصرف</th>
            <th style={{ minWidth: 160 }}>الملاحظات</th>
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
                  <span>جاري تحميل سجل مدفوعات وسلف المدربين...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل المدفوعات، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={6} className="table-empty-row">
                <span>لا توجد حركات صرف مسجلة حالياً تطابق الفلاتر المحددة</span>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const paymentDateFormatted = item.paymentDate
                ? new Date(item.paymentDate).toLocaleString('ar-EG', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
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
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
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
                          حركة رقم #{item.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>{getPaymentTypeBadge(item.paymentType)}</td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    {item.coachDueId ? (
                      <span
                        style={{
                          fontSize: '0.78rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: '#f1f5f9',
                          color: '#0284c7',
                          fontWeight: 700,
                          border: '1px solid #e0f2fe',
                        }}
                      >
                        مستحق #{item.coachDueId}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>سلفة مباشرة</span>
                    )}
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.92rem' }}>
                      {item.amount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem', color: '#334155' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} color="#94a3b8" />
                      {paymentDateFormatted}
                    </span>
                  </td>

                  <td style={{ fontSize: '0.85rem', color: '#334155', maxWidth: 240 }}>
                    {item.notes || '—'}
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
          label="إجمالي عمليات الصرف"
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

