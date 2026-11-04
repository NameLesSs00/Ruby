import { AlertCircle, ArrowLeft, Calendar, Clock } from 'lucide-react';
import {
  type CashTransfer,
  type CashboxType,
  cashboxLabel,
} from '../../modules/cashTransactions';
import { PaginationBar } from '../ui/PaginationBar';

interface CashTransfersTableProps {
  items: CashTransfer[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const CashTransfersTable = ({
  items,
  isLoading,
  isError,
  page,
  totalPages,
  totalCount,
  onPageChange,
}: CashTransfersTableProps) => {
  const getCashboxBadge = (type: CashboxType) => {
    const styles: Record<CashboxType, { bg: string; color: string; border: string }> = {
      Main: { bg: '#eff6ff', color: '#0284c7', border: '#bae6fd' },
      Subscriptions: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
      POS: { bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' },
    };
    const s = styles[type] || styles.Main;
    return (
      <span
        style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          fontSize: '0.74rem',
          fontWeight: 700,
          backgroundColor: s.bg,
          color: s.color,
          border: `1px solid ${s.border}`,
        }}
      >
        {cashboxLabel(type)}
      </span>
    );
  };

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
            <th style={{ whiteSpace: 'nowrap' }}>مسار التحويل (من - إلى)</th>
            <th style={{ whiteSpace: 'nowrap' }}>المبلغ المحول</th>
            <th style={{ whiteSpace: 'nowrap' }}>تاريخ ووقت التحويل</th>
            <th style={{ minWidth: 180 }}>البيان والملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={4} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="spinner"
                    style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                  />
                  <span>جاري تحميل سجل التحويلات بين الخزن...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={4} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل التحويلات، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={4} className="table-empty-row">
                <span>لا توجد تحويلات مسجلة بين الخزن</span>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const { formattedDate, formattedTime } = formatDateTime(item.transferDate);

              return (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getCashboxBadge(item.fromCashboxType)}
                      <ArrowLeft size={15} color="#94a3b8" />
                      {getCashboxBadge(item.toCashboxType)}
                    </div>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        color: '#0284c7',
                      }}
                    >
                      {item.amount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0d1527', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={12} color="#64748b" />
                        {formattedDate}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
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
          label="إجمالي سجلات التحويل"
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

