import { Package, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { WarehouseItemStock } from '../../modules/warehouseTransactions';

interface WarehouseStockTableProps {
  items: WarehouseItemStock[];
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
}

export const WarehouseStockTable = ({
  items,
  isLoading,
  isError,
  searchTerm,
}: WarehouseStockTableProps) => {
  const getStockBadge = (quantity: number) => {
    if (quantity > 5) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            backgroundColor: '#dcfce7',
            color: '#15803d',
            border: '1px solid #bbf7d0',
          }}
        >
          <CheckCircle2 size={13} />
          <span>متوفر بالمخزن</span>
        </span>
      );
    }
    if (quantity > 0) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            backgroundColor: '#ffedd5',
            color: '#c2410c',
            border: '1px solid #fed7aa',
          }}
        >
          <AlertTriangle size={13} />
          <span>كمية منخفضة</span>
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.78rem',
          fontWeight: 700,
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          border: '1px solid #fecaca',
        }}
      >
        <XCircle size={13} />
        <span>نفد من المخزن</span>
      </span>
    );
  };

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>#</th>
            <th>الصنف المخزني</th>
            <th style={{ textAlign: 'center' }}>الكمية المتوفرة بالمخزن</th>
            <th style={{ textAlign: 'center' }}>حالة التوفر</th>
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
                  <span>جاري تحميل أرصدة المخزن...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={4} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertTriangle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                <span>تعذر تحميل أرصدة المخزن، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={4} className="table-empty-row">
                <span>لا توجد أرصدة مخزنية {searchTerm ? 'مطابقة للبحث' : ''}</span>
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={item.itemName || index}>
                <td>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{index + 1}</span>
                </td>
                <td>
                  <div className="coach-cell-name">
                    <div
                      className="coach-avatar"
                      style={{
                        backgroundColor: item.quantity > 5 ? '#f0fdf4' : item.quantity > 0 ? '#fff7ed' : '#fef2f2',
                        color: item.quantity > 5 ? '#16a34a' : item.quantity > 0 ? '#ea580c' : '#dc2626',
                      }}
                    >
                      <Package size={17} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.itemName}</div>
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.35rem 0.85rem',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      color: item.quantity > 0 ? '#0f172a' : '#94a3b8',
                    }}
                  >
                    {item.quantity.toLocaleString('ar-EG')}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>{getStockBadge(item.quantity)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

