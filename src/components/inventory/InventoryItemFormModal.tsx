import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  inventoryItemsApi,
  inventoryKeys,
  STANDARD_UNITS,
  type InventoryItem,
  type InventoryCategory,
  type CreateInventoryItemPayload,
  type UpdateInventoryItemPayload,
} from '../../modules/inventory';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface InventoryItemFormModalProps {
  isOpen: boolean;
  editingItem: InventoryItem | null;
  categories: InventoryCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

export const InventoryItemFormModal = ({
  isOpen,
  editingItem,
  categories,
  onClose,
  onSuccess,
}: InventoryItemFormModalProps) => {
  const [name, setName] = useState('');
  const [inventoryCategoryId, setInventoryCategoryId] = useState<number | ''>('');
  const [unit, setUnit] = useState('Piece');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setInventoryCategoryId(editingItem.inventoryCategoryId);
      setUnit(editingItem.unit || 'Piece');
    } else {
      setName('');
      setInventoryCategoryId(categories.length > 0 ? categories[0].id : '');
      setUnit('Piece');
    }
  }, [editingItem, isOpen, categories]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateInventoryItemPayload) => inventoryItemsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
      showToast.success('تمت إضافة الصنف المخزني بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في إضافة الصنف المخزني');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateInventoryItemPayload }) =>
      inventoryItemsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
      showToast.success('تم تحديث بيانات الصنف المخزني بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تحديث بيانات الصنف المخزني');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast.warning('يرجى إدخال اسم الصنف المخزني');
      return;
    }

    if (!inventoryCategoryId) {
      showToast.warning('يرجى اختيار تصنيف المخزون');
      return;
    }

    if (!unit) {
      showToast.warning('يرجى تحديد وحدة القياس');
      return;
    }

    const payload = {
      name: name.trim(),
      inventoryCategoryId: Number(inventoryCategoryId),
      unit,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingItem ? 'تعديل صنف مخزني' : 'إضافة صنف مخزني جديد'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="inv-item-name">
                اسم الصنف <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="inv-item-name"
                type="text"
                className="form-input"
                placeholder="مثال: كلور سائل / طوق سباحة / نظارات تدريب"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="inv-item-category">
                تصنيف المخزون <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="inv-item-category"
                className="select-filter"
                style={{ width: '100%' }}
                value={inventoryCategoryId}
                onChange={(e) => setInventoryCategoryId(e.target.value ? Number(e.target.value) : '')}
                required
                disabled={isSaving}
              >
                <option value="">— اختر التصنيف —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="inv-item-unit">
                وحدة القياس <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="inv-item-unit"
                className="select-filter"
                style={{ width: '100%' }}
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                disabled={isSaving}
              >
                {STANDARD_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              إلغاء
            </button>
            <button type="submit" className="btn-add" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="spinner" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{editingItem ? 'حفظ التعديلات' : 'إضافة الصنف'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

