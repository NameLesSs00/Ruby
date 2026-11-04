import { Eye, ArrowUpLeft, ArrowDownRight, AlertCircle } from 'lucide-react';
import {
  ownerCashboxLabel,
  type OwnerTransaction,
} from '../../modules/ownerTransactions';
import { PaginationBar } from '../ui/PaginationBar';

interface OwnerTransactionsTableProps {
  transactions: OwnerTransaction[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onViewDetails: (tx: OwnerTransaction) => void;
}

export const OwnerTransactionsTable = ({
  transactions,
  isLoading,
  isError,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onViewDetails,
}: OwnerTransactionsTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString('ar-EG')} - ${d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}>رقم الحركة</th>
              <th style={{ width: '150px', textAlign: 'center' }}>نوع الحركة</th>
              <th style={{ width: '160px' }}>الخزينة المتأثرة</th>
              <th style={{ width: '130px', textAlign: 'center' }}>المبلغ</th>
              <th style={{ width: '180px' }}>التاريخ والوقت</th>
              <th>البيان والملاحظات</th>
              <th style={{ width: '90px', textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="spinner" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ margin: 0, color: '#64748b' }}>جاري تحميل حركات المالك...</p>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                  <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <p style={{ margin: 0 }}>فشل في تحميل حركات المالك. يرجى إعادة المحاولة.</p>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  لا توجد حركات مسحوبات أو إيداعات مسجلة للمالك حالياً
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const isWithdrawal = tx.transactionType === 'Withdrawal';

                return (
                  <tr key={tx.id}>
                    {/* ID */}
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#0d1527' }}>
                      #{tx.id}
                    </td>

                    {/* Type Badge */}
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: isWithdrawal ? '#fff1f2' : '#ecfdf5',
                          color: isWithdrawal ? '#e11d48' : '#059669',
                          border: `1px solid ${isWithdrawal ? '#fecdd3' : '#a7f3d0'}`,
                        }}
                      >
                        {isWithdrawal ? <ArrowUpLeft size={14} /> : <ArrowDownRight size={14} />}
                        {isWithdrawal ? 'مسحوبات مالك' : 'إيداع جاري'}
                      </span>
                    </td>

                    {/* Cashbox */}
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>
                      {ownerCashboxLabel(tx.cashboxType)}
                    </td>

                    {/* Amount */}
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          color: isWithdrawal ? '#e11d48' : '#059669',
                        }}
                      >
                        {isWithdrawal ? '- ' : '+ '}
                        {tx.amount.toLocaleString('ar-EG')} ج.م
                      </span>
                    </td>

                    {/* Date and Time */}
                    <td style={{ fontSize: '0.82rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      {formatDateTime(tx.transactionDate)}
                    </td>

                    {/* Notes */}
                    <td
                      style={{
                        maxWidth: '240px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#334155',
                        fontSize: '0.85rem',
                      }}
                      title={tx.notes || ''}
                    >
                      {tx.notes || '—'}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="عرض تفاصيل الإيصال"
                          onClick={() => onViewDetails(tx)}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        label="إجمالي حركات المالك"
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    </div>
  );
};
