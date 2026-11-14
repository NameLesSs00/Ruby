import type { WarehouseProductItem } from '../../../modules/reports';

interface WarehouseProductsTableProps {
  products?: WarehouseProductItem[];
  isLoading: boolean;
}

export const WarehouseProductsTable = ({ products = [], isLoading }: WarehouseProductsTableProps) => {
  if (isLoading) {
    return (
      <div className="card-box" style={{ background: '#ffffff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>جاري تحميل جدول الأصناف...</p>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="card-box" style={{ background: '#ffffff', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1rem' }}>
        ملخص حركة الأصناف في المستودع
      </h3>

      <div className="table-responsive">
        <table className="data-table" style={{ width: '100%', textAlign: 'start' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>#</th>
              <th>اسم الصنف / المنتج</th>
              <th style={{ textAlign: 'center' }}>إجمالي الوارد</th>
              <th style={{ textAlign: 'center' }}>إجمالي المنصرف</th>
              <th style={{ textAlign: 'center' }}>صافي الحركة</th>
              <th style={{ textAlign: 'end' }}>الرصيد الحالي</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.productId}>
                <td style={{ fontWeight: 600, color: '#64748b' }}>#{p.productId}</td>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>{p.productName}</td>
                <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 600 }}>
                  +{p.totalIncoming}
                </td>
                <td style={{ textAlign: 'center', color: '#ea580c', fontWeight: 600 }}>
                  -{p.totalOutgoing}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 700 }}>
                  <span
                    style={{
                      color: p.netMovement >= 0 ? '#16a34a' : '#dc2626',
                    }}
                  >
                    {p.netMovement >= 0 ? `+${p.netMovement}` : p.netMovement}
                  </span>
                </td>
                <td style={{ textAlign: 'end', fontWeight: 700, color: '#0284c7' }}>
                  {p.currentStock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
