import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { WarehouseTransactionItem } from '../../../modules/reports';
import { TableStateRow } from '../../ui/TableStateRow';
import { PaginationBar } from '../../ui/PaginationBar';

interface WarehouseTransactionsTableProps {
  transactions?: WarehouseTransactionItem[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (newPage: number) => void;
}

export const WarehouseTransactionsTable = ({
  transactions = [],
  isLoading,
  isError,
  page,
  totalPages,
  totalRecords,
  onPageChange,
}: WarehouseTransactionsTableProps) => {
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
          سجل حركات التحويل والمخزون
        </h3>
        <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
          إجمالي الحركات: <strong>{totalRecords}</strong>
        </span>
      </div>

      <div className="table-responsive">
        <table className="data-table" style={{ width: '100%', textAlign: 'start' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>التاريخ والوقت</th>
              <th>المنتج</th>
              <th>نوع الحركة</th>
              <th style={{ textAlign: 'center' }}>الكمية</th>
              <th>مجموعة الحركة</th>
              <th>البيان / الوصف</th>
            </tr>
          </thead>
          <tbody>
            <TableStateRow
              colSpan={7}
              isLoading={isLoading}
              isError={isError}
              isEmpty={!isLoading && !isError && transactions.length === 0}
              loadingText="جاري تحميل سجل حركات المستودع..."
              emptyText="لا توجد حركات مخزنية مطابقة للفترة المحددة"
            />

            {!isLoading &&
              !isError &&
              transactions.map((t) => {
                const isIn = t.transactionType === 'In';
                return (
                  <tr key={t.transactionId}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>#{t.transactionId}</td>
                    <td style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                      {formatDate(t.transactionDate)}
                    </td>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{t.productName}</td>
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
                          background: isIn ? '#e0f2fe' : '#ffedd5',
                          color: isIn ? '#0369a1' : '#c2410c',
                        }}
                      >
                        {isIn ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                        <span>{isIn ? 'وارد (In)' : 'منصرف (Out)'}</span>
                      </span>
                    </td>
                    <td
                      style={{
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        color: isIn ? '#16a34a' : '#ea580c',
                      }}
                    >
                      {isIn ? `+${t.quantity}` : `-${t.quantity}`}
                    </td>
                    <td style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                      {t.movementGroupId ? `#${t.movementGroupId}` : '-'}
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: '#475569' }}>
                      {t.description || '-'}
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
        label="إجمالي الحركات"
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    </div>
  );
};
