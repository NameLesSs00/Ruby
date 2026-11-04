import { Eye, AlertCircle, ArrowDownLeft, ArrowUpRight, Calendar, Clock } from 'lucide-react';
import {
  type CashTransaction,
  type CashboxType,
  cashboxLabel,
  referenceTypeLabel,
} from '../../modules/cashTransactions';
import { PaginationBar } from '../ui/PaginationBar';

interface CashTransactionsTableProps {
  items: CashTransaction[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onSelectTransaction: (item: CashTransaction) => void;
}

export const CashTransactionsTable = ({
  items,
  isLoading,
  isError,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onSelectTransaction,
}: CashTransactionsTableProps) => {
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
            <th style={{ whiteSpace: 'nowrap' }}>الخزينة</th>
            <th style={{ whiteSpace: 'nowrap' }}>نوع الحركة</th>
            <th style={{ whiteSpace: 'nowrap' }}>المبلغ</th>
            <th style={{ whiteSpace: 'nowrap' }}>نوع المرجع ورقم الإيصال</th>
            <th style={{ whiteSpace: 'nowrap' }}>التاريخ والوقت</th>
            <th style={{ minWidth: 180 }}>البيان والملاحظات</th>
            <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>التفاصيل</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="spinner"
                    style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                  />
                  <span>جاري تحميل سجل حركات الخزينة...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={7} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل الحركات، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={7} className="table-empty-row">
                <span>لا توجد حركات نقدية مسجلة مطابقة لمحددات الفلتر</span>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isIncome = item.transactionType === 'Income';
              const { formattedDate, formattedTime } = formatDateTime(item.transactionDate);

              return (
                <tr key={item.id} style={{ opacity: item.isVoided ? 0.6 : 1 }}>
                  <td>{getCashboxBadge(item.cashboxType)}</td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: isIncome ? '#ecfdf5' : '#fef2f2',
                        color: isIncome ? '#059669' : '#dc2626',
                        border: `1px solid ${isIncome ? '#a7f3d0' : '#fecaca'}`,
                      }}
                    >
                      {isIncome ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                      <span>{isIncome ? 'وارد (توريد)' : 'صادر (صرف)'}</span>
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        color: isIncome ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {isIncome ? '+' : '-'}
                      {item.amount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {referenceTypeLabel(item.referenceType)}
                      </span>
                      {item.referenceId > 0 && (
                        <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>
                          #{item.referenceId}
                        </span>
                      )}
                    </div>
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

                  <td style={{ whiteSpace: 'nowrap' }}>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="عرض تفاصيل الحركة"
                        onClick={() => onSelectTransaction(item)}
                      >
                        <Eye size={15} />
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
          label="إجمالي حركات الخزينة"
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

