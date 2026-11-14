import type { ExpenseTransactionItem } from '../../../modules/reports';
import { TableStateRow } from '../../ui/TableStateRow';
import { PaginationBar } from '../../ui/PaginationBar';

interface ExpenseTransactionsTableProps {
  transactions?: ExpenseTransactionItem[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (newPage: number) => void;
}

export const ExpenseTransactionsTable = ({
  transactions = [],
  isLoading,
  isError,
  page,
  totalPages,
  totalRecords,
  onPageChange,
}: ExpenseTransactionsTableProps) => {
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

  return (
    <div className="card-box" style={{ background: '#ffffff', borderRadius: '0.75rem', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
          سجل حركات المصروفات
        </h3>
        <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
          إجمالي العمليات: <strong>{totalRecords}</strong>
        </span>
      </div>

      <div className="table-responsive">
        <table className="data-table" style={{ width: '100%', textAlign: 'start' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>التاريخ والوقت</th>
              <th>التصنيف</th>
              <th>الوصف</th>
              <th>الخزينة</th>
              <th>طريقة الدفع</th>
              <th>رقم الفاتورة / المرجع</th>
              <th style={{ textAlign: 'end' }}>المبلغ</th>
            </tr>
          </thead>
          <tbody>
            <TableStateRow
              colSpan={8}
              isLoading={isLoading}
              isError={isError}
              isEmpty={!isLoading && !isError && transactions.length === 0}
              loadingText="جاري تحميل سجل المصروفات..."
              emptyText="لا توجد حركات مصروفات مطابقة للفترة المحددة"
            />

            {!isLoading &&
              !isError &&
              transactions.map((t) => (
                <tr key={t.transactionId}>
                  <td style={{ fontWeight: 600, color: '#64748b' }}>
                    #{t.transactionId}
                  </td>
                  <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                    {formatDate(t.transactionDate)}
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#fee2e2',
                        color: '#991b1b',
                      }}
                    >
                      {t.categoryName || t.category}
                    </span>
                  </td>
                  <td style={{ maxWidth: '240px', fontSize: '0.8125rem' }}>
                    {t.description || '-'}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: '#f1f5f9',
                        color: '#475569',
                      }}
                    >
                      {t.cashboxName || t.cashboxType}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#334155',
                      }}
                    >
                      {t.paymentMethodName || t.paymentMethod || 'نقدي'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                    {t.invoiceNumber || (t.referenceId ? `#${t.referenceId}` : '-')}
                  </td>
                  <td style={{ textAlign: 'end', fontWeight: 700, color: '#dc2626', whiteSpace: 'nowrap' }}>
                    -{t.amount.toLocaleString('en-US')} ج.م
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={totalRecords}
        label="إجمالي الحركات"
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    </div>
  );
};
