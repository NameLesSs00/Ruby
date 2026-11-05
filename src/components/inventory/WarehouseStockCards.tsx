import { Boxes, Package, TrendingDown } from 'lucide-react';

interface WarehouseStockCardsProps {
  totalCount: number;
  totalQuantity: number;
  lowStockCount: number;
}

export const WarehouseStockCards = ({
  totalCount,
  totalQuantity,
  lowStockCount,
}: WarehouseStockCardsProps) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1.1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Boxes size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الأصناف المسجلة</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
            {totalCount}{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>صنف</span>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1.1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Package size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الرصيد بالمخزن</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#059669' }}>
            {totalQuantity.toLocaleString('ar-EG')}{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>وحدة/قطعة</span>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1.1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#fff7ed',
            color: '#ea580c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrendingDown size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>أصناف قريبة من النفاد (≤ 5)</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ea580c' }}>
            {lowStockCount}{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>صنف</span>
          </div>
        </div>
      </div>
    </div>
  );
};

