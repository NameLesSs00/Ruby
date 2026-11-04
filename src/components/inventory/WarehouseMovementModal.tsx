import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, ArrowDownRight, ArrowUpLeft } from 'lucide-react';
import {
  warehouseTransactionsApi,
  warehouseTransactionKeys,
  type WarehouseMovement,
  type MovementType,
  type CreateWarehouseMovementPayload,
  type UpdateWarehouseMovementPayload,
} from '../../modules/warehouseTransactions';
import type { InventoryItem } from '../../modules/inventory';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { WarehouseMovementItemRows, type MovementItemRow } from './WarehouseMovementItemRows';
import { useModalEscape } from '../../lib/useModalEscape';

interface WarehouseMovementModalProps {
  isOpen: boolean;
  initialData: WarehouseMovement | null;
  inventoryItems: InventoryItem[];
  onClose: () => void;
}

export const WarehouseMovementModal = ({
  isOpen,
  initialData,
  inventoryItems,
  onClose,
}: WarehouseMovementModalProps) => {
  useModalEscape(onClose, isOpen);

  const isEdit = !!initialData;
  const [movementType, setMovementType] = useState<MovementType>('In');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<MovementItemRow[]>([
    { inventoryItemId: 0, quantity: 1 },
  ]);

  useEffect(() => {
    if (initialData) {
      setMovementType(initialData.movementType);
      setDescription(initialData.description || '');
      if (initialData.items && initialData.items.length > 0) {
        setItems(
          initialData.items.map((i) => ({
            inventoryItemId: i.inventoryItemId,
            quantity: i.quantity,
          }))
        );
      } else {
        setItems([{ inventoryItemId: 0, quantity: 1 }]);
      }
    } else {
      setMovementType('In');
      setDescription('');
      setItems([{ inventoryItemId: 0, quantity: 1 }]);
    }
  }, [initialData, isOpen]);

  const mutation = useMutation({
    mutationFn: (payload: CreateWarehouseMovementPayload | UpdateWarehouseMovementPayload) => {
      if (isEdit && initialData) {
        return warehouseTransactionsApi.update(initialData.movementGroupId, payload);
      }
      return warehouseTransactionsApi.create(payload as CreateWarehouseMovementPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseTransactionKeys.all });
      showToast.success(
        isEdit ? 'تم تحديث إذن الحركة بنجاح' : 'تم إنشاء إذن الحركة بنجاح'
      );
      onClose();
    },
    onError: (err) => {
      showToast.apiError(
        err,
        isEdit ? 'فشل في تحديث إذن الحركة' : 'فشل في إنشاء إذن الحركة'
      );
    },
  });

  if (!isOpen) return null;

  const handleAddItemRow = () => {
    setItems((prev) => [...prev, { inventoryItemId: 0, quantity: 1 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length <= 1) {
      showToast.error('يجب أن يحتوي الإذن على صنف واحد على الأقل');
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, itemId: number) => {
    setItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, inventoryItemId: itemId } : row))
    );
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const validQty = Math.max(1, isNaN(qty) ? 1 : qty);
    setItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, quantity: validQty } : row))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      showToast.error('يرجى كتابة بيان أو سبب الحركة');
      return;
    }

    if (items.length === 0) {
      showToast.error('يرجى إضافة صنف واحد على الأقل');
      return;
    }

    for (let i = 0; i < items.length; i++) {
      if (!items[i].inventoryItemId || items[i].inventoryItemId <= 0) {
        showToast.error(`يرجى تحديد الصنف في السطر رقم ${i + 1}`);
        return;
      }
      if (!items[i].quantity || items[i].quantity <= 0) {
        showToast.error(`يرجى تحديد كمية صحيحة في السطر رقم ${i + 1}`);
        return;
      }
    }

    const payload: CreateWarehouseMovementPayload = {
      movementType,
      description: description.trim(),
      items: items.map((i) => ({
        inventoryItemId: Number(i.inventoryItemId),
        quantity: Number(i.quantity),
      })),
    };

    mutation.mutate(payload);
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card"
        style={{ maxWidth: '640px', width: '92%' }}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title" style={{ margin: 0 }}>
              {isEdit ? 'تعديل إذن حركة مخزنية' : 'إذن حركة مخزنية جديد'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
              {isEdit ? `رقم الإذن: #${initialData?.movementGroupId}` : 'تسجيل إذن وارد أو صادر جديد'}
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* Movement Type Switcher */}
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.4rem' }}>
                نوع الحركة المخزنية *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setMovementType('In')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: movementType === 'In' ? '2px solid #059669' : '1px solid #e2e8f0',
                    backgroundColor: movementType === 'In' ? '#ecfdf5' : '#ffffff',
                    color: movementType === 'In' ? '#059669' : '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <ArrowDownRight size={18} />
                  <span>إذن توريد (وارد +)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMovementType('Out')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: movementType === 'Out' ? '2px solid #ea580c' : '1px solid #e2e8f0',
                    backgroundColor: movementType === 'Out' ? '#fff7ed' : '#ffffff',
                    color: movementType === 'Out' ? '#ea580c' : '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <ArrowUpLeft size={18} />
                  <span>إذن صرف (صادر -)</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">البيان والسبب *</label>
              <textarea
                className="form-input"
                rows={2}
                placeholder="اكتب سبب التوريد أو جهة الصرف (مثال: استلام توريد ملابس سباحة من المورد...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Item Rows Line Builder */}
            <WarehouseMovementItemRows
              items={items}
              inventoryItems={inventoryItems}
              onAddRow={handleAddItemRow}
              onRemoveRow={handleRemoveItemRow}
              onItemChange={handleItemChange}
              onQuantityChange={handleQuantityChange}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <div className="spinner" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{isEdit ? 'حفظ التعديلات' : 'تأكيد وحفظ الإذن'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
