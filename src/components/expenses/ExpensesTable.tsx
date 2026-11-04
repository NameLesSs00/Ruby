import { Calendar, Edit2, Trash2, AlertCircle } from 'lucide-react';
import type { Expense } from '../../modules/expenses';
import { PaginationBar } from '../ui/PaginationBar';

interface ExpensesTableProps {
  isLoading: boolean;
  isError: boolean;
  items: Expense[];
  searchTerm: string;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onEdit: (item: Expense) => void;
  onDelete: (item: Expense) => void;
}

export const ExpensesTable = ({
  isLoading,
  isError,
  items,
  searchTerm,
  page,
  totalPages,
  totalCount,
  onPageChange,
  onEdit,
  onDelete,
}: ExpensesTableProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>تاريخ ووقت الصرف</th>
            <th>البيان والسبب</th>
            <th>المبلغ المنصرف</th>
            <th>تاريخ الإضافة بالنظام</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
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
                  <span>جاري تحميل سجل المصروفات...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={5} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل المصروفات، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={5} className="table-empty-row">
                <span>لا توجد مصروفات مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const expenseDateFormatted = new Date(item.expenseDate).toLocaleString('ar-EG', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });
              const createdAtFormatted = item.createdAt
                ? new Date(item.createdAt).toLocaleDateString('ar-EG')
                : '—';

              return (
                <tr key={item.id}>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.85rem',
                        color: '#0d1527',
                        fontWeight: 600,
                      }}
                    >
                      <Calendar size={14} color="#94a3b8" />
                      {expenseDateFormatted}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>
                      {item.description || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 900, color: '#b91c1c', fontSize: '0.95rem' }}>
                      {item.amount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    {createdAtFormatted}
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center', gap: '0.45rem' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل المصروف"
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
                        className="btn-icon-action"
                        title="حذف المصروف"
                        onClick={() => onDelete(item)}
                        style={{
                          color: '#ef4444',
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca',
                        }}
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
          label="إجمالي بنود المصروفات"
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

