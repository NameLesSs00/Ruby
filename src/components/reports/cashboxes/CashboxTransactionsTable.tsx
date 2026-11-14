import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { CashboxTransactionItem } from '../../../modules/reports';
import { TableStateRow } from '../../ui/TableStateRow';
import { PaginationBar } from '../../ui/PaginationBar';

interface CashboxTransactionsTableProps {
  transactions?: CashboxTransactionItem[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (newPage: number) => void;
}

export const CashboxTransactionsTable = ({
  transactions = [],
  isLoading,
  isError,
  page,
  totalPages,
  totalRecords,
  onPageChange,
}: CashboxTransactionsTableProps) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getCashboxArabicName = (type: string) => {
    switch (type) {
      case 'POS':
        return 'POS';
      case 'Subscriptions':
        return 'الاشتراكات';
      case 'Main':
        return 'الرئيسية';
      default:
        return type;
    }
  };

  return (
    <div className="card-box" style={{ background: '#ffffff', borderRadius: '0.75rem', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
          سجل المعاملات النقدية للخزائن
        </h3>
        <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
          إجمالي المعاملات: <strong>{totalRecords}</strong>
        </span>
      </div>

      <div className="table-responsive">
        <table className="data-table" style={{ width: '100%', textAlign: 'start' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>التاريخ والوقت</th>
              <th>الخزينة</th>
              <th>نوع المعاملة</th>
              <th>المرجع</th>
              <th>البيان / الملاحظات</th>
              <th style={{ textAlign: 'end' }}>المبلغ</th>
            </tr>
          </thead>
          <tbody>
            <TableStateRow
              colSpan={7}
              isLoading={isLoading}
              isError={isError}
              isEmpty={!isLoading && !isError && transactions.length === 0}
              loadingText="جاري تحميل سجل حركات الخزائن..."
              emptyText="لا توجد معاملات نقدية مطابقة للفترة المحددة"
            />

            {!isLoading &&
              !isError &&
              transactions.map((t) => {
                const isIncome = t.transactionType === 'Income';
                return (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>#{t.id}</td>
                    <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                      {formatDate(t.transactionDate)}
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: '#f1f5f9',
                          color: '#334155',
                        }}
                      >
                        {getCashboxArabicName(t.cashboxType)}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: isIncome ? '#dcfce7' : '#fee2e2',
                          color: isIncome ? '#15803d' : '#b91c1c',
                        }}
                      >
                        {isIncome ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                        <span>{isIncome ? 'إيداع / إيراد' : 'صرف / سحب'}</span>
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          background: '#e0f2fe',
                          color: '#0369a1',
                        }}
                      >
                        {t.referenceTypeName || t.referenceType}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8125rem', maxWidth: '240px' }}>
                      {t.notes || '-'}
                    </td>
                    <td
                      style={{
                        textAlign: 'end',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        color: isIncome ? '#16a34a' : '#dc2626',
                      }}
                    >
                      {isIncome ? `+${t.amount.toLocaleString('en-US')}` : `-${t.amount.toLocaleString('en-US')}`} ج.م
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={totalRecords}
        label="إجمالي المعاملات"
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    </div>
  );
};
