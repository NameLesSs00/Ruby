import { Eye, Calendar, User, AlertCircle, Package } from 'lucide-react';
import type { EmployeeSaleRecord } from '../../modules/employeeSales';
import { PaginationBar } from '../ui/PaginationBar';

interface EmployeeSalesTableProps {
  sales: EmployeeSaleRecord[];
  totalCount: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  searchTerm?: string;
  onPageChange: (page: number) => void;
  onViewReceipt: (sale: EmployeeSaleRecord) => void;
}

export const EmployeeSalesTable = ({
  sales,
  totalCount,
  page,
  totalPages,
  isLoading,
  isError,
  searchTerm,
  onPageChange,
  onViewReceipt,
}: EmployeeSalesTableProps) => {
  return (
    <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <table className="data-table" style={{ minWidth: 800 }}>
        <thead>
          <tr>
            <th style={{ whiteSpace: 'nowrap' }}>رقم الفاتورة</th>
            <th style={{ whiteSpace: 'nowrap' }}>اسم الموظف المشتري</th>
            <th style={{ whiteSpace: 'nowrap' }}>تاريخ البيع</th>
            <th style={{ whiteSpace: 'nowrap' }}>الأصناف</th>
            <th style={{ whiteSpace: 'nowrap' }}>الإجمالي الصافي</th>
            <th style={{ whiteSpace: 'nowrap' }}>الحالة</th>
            <th style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={7} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                  <span>جاري تحميل فواتير مبيعات الموظفين...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={7} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>تعذر تحميل سجل مبيعات الموظفين، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : sales.length === 0 ? (
            <tr>
              <td colSpan={7} className="table-empty-row">
                <Package size={32} color="#cbd5e1" style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                <span>لا توجد فواتير مبيعات مسجلة للموظفين حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
              </td>
            </tr>
          ) : (
            sales.map((sale) => {
              const itemsCount = (sale.items || []).reduce((sum, i) => sum + i.quantity, 0);
              const itemsNames = (sale.items || []).map((i) => `${i.productName} (${i.quantity})`).join(', ');

              return (
                <tr key={sale.id}>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--color-navy)', fontSize: '0.9rem' }}>
                      {sale.invoiceNumber}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#fff7ed', color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={13} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#0d1527' }}>
                        {sale.employeeName || `#${sale.employeeId}`}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                      <Calendar size={13} color="#94a3b8" />
                      {new Date(sale.saleDate).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', color: '#475569', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={itemsNames}>
                      <span style={{ fontWeight: 700, color: '#0284c7' }}>[{itemsCount} قطعة]</span> {itemsNames}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 900, color: '#ff6b22', fontSize: '1rem' }}>
                      {sale.finalAmount.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.15rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: sale.status === 'NotReturned' ? '#ecfdf5' : '#fef2f2',
                        color: sale.status === 'NotReturned' ? '#059669' : '#dc2626',
                        border: `1px solid ${sale.status === 'NotReturned' ? '#a7f3d0' : '#fecaca'}`,
                      }}
                    >
                      {sale.status === 'NotReturned' ? 'مدفوعة' : 'مرتجع'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onViewReceipt(sale)}
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      title="عرض وطباعة الإيصال"
                    >
                      <Eye size={13} />
                      <span>عرض الإيصال</span>
                    </button>
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
          label="إجمالي فواتير الموظفين"
          isLoading={isLoading}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

