import { Plus, Trash2 } from 'lucide-react';
import type { InventoryItem } from '../../modules/inventory';

export interface FormItemLine {
  inventoryItemId: number | '';
  quantity: number;
  unitCost: number;
}

interface PurchaseInvoiceLineItemsProps {
  items: FormItemLine[];
  inventoryItems: InventoryItem[];
  isSaving: boolean;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onItemChange: (index: number, field: keyof FormItemLine, value: unknown) => void;
}

export const PurchaseInvoiceLineItems = ({
  items,
  inventoryItems,
  isSaving,
  onAddItem,
  onRemoveItem,
  onItemChange,
}: PurchaseInvoiceLineItemsProps) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0d1527' }}>
          أصناف وبنود الفاتورة ({items.length})
        </span>
        <button
          type="button"
          className="btn-secondary"
          onClick={onAddItem}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.65rem',
            fontSize: '0.8rem',
          }}
          disabled={isSaving}
        >
          <Plus size={14} />
          <span>إضافة صنف</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((line, idx) => {
          const lineTotal = (line.quantity || 0) * (line.unitCost || 0);

          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.2fr 1fr auto',
                gap: '0.5rem',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                padding: '0.5rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <select
                  className="form-input"
                  style={{ fontSize: '0.8rem', padding: '0.35rem' }}
                  value={line.inventoryItemId}
                  onChange={(e) =>
                    onItemChange(
                      idx,
                      'inventoryItemId',
                      e.target.value ? Number(e.target.value) : ''
                    )
                  }
                  required
                  disabled={isSaving}
                >
                  <option value="">اختر الصنف المخزني...</option>
                  {inventoryItems.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="الكمية"
                  className="form-input"
                  style={{ fontSize: '0.8rem', padding: '0.35rem', textAlign: 'center' }}
                  value={line.quantity || ''}
                  onChange={(e) =>
                    onItemChange(idx, 'quantity', Math.max(1, Number(e.target.value)))
                  }
                  required
                  disabled={isSaving}
                />
              </div>

              <div>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="سعر الوحدة"
                  className="form-input"
                  style={{ fontSize: '0.8rem', padding: '0.35rem', textAlign: 'center' }}
                  value={line.unitCost || ''}
                  onChange={(e) =>
                    onItemChange(idx, 'unitCost', Math.max(0, Number(e.target.value)))
                  }
                  required
                  disabled={isSaving}
                />
              </div>

              <div style={{ textAlign: 'end', fontSize: '0.85rem', fontWeight: 800, color: '#0d1527' }}>
                {lineTotal.toLocaleString('ar-EG')} ج.م
              </div>

              <div>
                <button
                  type="button"
                  className="btn-icon-action"
                  style={{ color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                  onClick={() => onRemoveItem(idx)}
                  disabled={isSaving || items.length <= 1}
                  title="حذف البند"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

