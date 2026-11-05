import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import type { InventoryItem } from '../../modules/inventory';
import {
  warehouseTransactionsApi,
  warehouseTransactionKeys,
  type MovementType,
} from '../../modules/warehouseTransactions';

export interface MovementItemRow {
  inventoryItemId: number;
  quantity: number;
}

interface WarehouseMovementItemRowsProps {
  items: MovementItemRow[];
  inventoryItems: InventoryItem[];
  movementType?: MovementType;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onItemChange: (index: number, itemId: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
}

export const WarehouseMovementItemRows = ({
  items,
  inventoryItems,
  movementType = 'In',
  onAddRow,
  onRemoveRow,
  onItemChange,
  onQuantityChange,
}: WarehouseMovementItemRowsProps) => {
  const { data: stockData } = useQuery({
    queryKey: warehouseTransactionKeys.stockBalances(),
    queryFn: () => warehouseTransactionsApi.getItemStockBalances(),
  });

  const stockMap = useMemo(() => {
    const map = new Map<string, number>();
    (stockData?.items || []).forEach((s) => {
      if (s.itemName) {
        map.set(s.itemName.trim().toLowerCase(), s.quantity);
      }
    });
    return map;
  }, [stockData]);

  const itemMap = useMemo(() => {
    const map = new Map<number, InventoryItem>();
    inventoryItems.forEach((item) => map.set(item.id, item));
    return map;
  }, [inventoryItems]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5rem',
        }}
      >
        <label className="form-label" style={{ margin: 0 }}>
          الأصناف والكميات *
        </label>
        <button
          type="button"
          onClick={onAddRow}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#0D1527',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.2rem 0.5rem',
          }}
        >
          <Plus size={15} />
          <span>إضافة صنف آخر</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {items.map((row, idx) => {
          const selectedItem = itemMap.get(row.inventoryItemId);
          const currentStock = selectedItem
            ? stockMap.get(selectedItem.name.trim().toLowerCase()) ?? 0
            : undefined;
          const isOverStock =
            movementType === 'Out' && currentStock !== undefined && row.quantity > currentStock;

          return (
            <div
              key={idx}
              style={{
                backgroundColor: isOverStock ? '#fff1f2' : '#f8fafc',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: `1px solid ${isOverStock ? '#fecdd3' : '#e2e8f0'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 110px 40px',
                  gap: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <select
                    className="select-filter"
                    value={row.inventoryItemId || ''}
                    onChange={(e) => onItemChange(idx, Number(e.target.value))}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    <option value="">-- اختر الصنف المخزني --</option>
                    {inventoryItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.unit ? `(${item.unit})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-input"
                    value={row.quantity || ''}
                    onChange={(e) => onQuantityChange(idx, parseInt(e.target.value, 10))}
                    placeholder="الكمية"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', textAlign: 'center' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveRow(idx)}
                  disabled={items.length <= 1}
                  title="حذف هذا السطر"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: items.length <= 1 ? '#f1f5f9' : '#fee2e2',
                    color: items.length <= 1 ? '#94a3b8' : '#ef4444',
                    cursor: items.length <= 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Stock availability indicator */}
              {selectedItem && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    paddingInline: '0.25rem',
                    color: isOverStock ? '#b91c1c' : '#64748b',
                  }}
                >
                  <span>
                    الرصيد المتوفر بالمخزن حالياً:{' '}
                    <strong style={{ color: currentStock && currentStock > 0 ? '#15803d' : '#b91c1c' }}>
                      {currentStock !== undefined ? currentStock.toLocaleString('ar-EG') : 0}{' '}
                      {selectedItem.unit || 'وحدة'}
                    </strong>
                  </span>
                  {isOverStock && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}>
                      <AlertCircle size={13} />
                      تنبيه: الكمية المصروفة تتجاوز رصيد المخزن
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
