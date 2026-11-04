import { Plus, Trash2 } from 'lucide-react';
import type { InventoryItem } from '../../modules/inventory';

export interface MovementItemRow {
  inventoryItemId: number;
  quantity: number;
}

interface WarehouseMovementItemRowsProps {
  items: MovementItemRow[];
  inventoryItems: InventoryItem[];
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onItemChange: (index: number, itemId: number) => void;
  onQuantityChange: (index: number, quantity: number) => void;
}

export const WarehouseMovementItemRows = ({
  items,
  inventoryItems,
  onAddRow,
  onRemoveRow,
  onItemChange,
  onQuantityChange,
}: WarehouseMovementItemRowsProps) => {
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
            color: '#F37023',
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 110px 40px',
              gap: '0.5rem',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
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
        ))}
      </div>
    </div>
  );
};
