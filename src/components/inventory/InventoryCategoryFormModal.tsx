import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  inventoryCategoriesApi,
  inventoryKeys,
  type InventoryCategory,
  type CreateInventoryCategoryPayload,
  type UpdateInventoryCategoryPayload,
} from '../../modules/inventory';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface InventoryCategoryFormModalProps {
  isOpen: boolean;
  editingCategory: InventoryCategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const InventoryCategoryFormModal = ({
  isOpen,
  editingCategory,
  onClose,
  onSuccess,
}: InventoryCategoryFormModalProps) => {
  useModalEscape(onClose, isOpen);

  const [name, setName] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
    } else {
      setName('');
    }
  }, [editingCategory, isOpen]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateInventoryCategoryPayload) => inventoryCategoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
      showToast.success('تمت إضافة تصنيف المخزون بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في إضافة التصنيف');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateInventoryCategoryPayload }) =>
      inventoryCategoriesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
      showToast.success('تم تحديث تصنيف المخزون بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تحديث التصنيف');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast.warning('يرجى إدخال اسم التصنيف');
      return;
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, payload: { name: name.trim() } });
    } else {
      createMutation.mutate({ name: name.trim() });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingCategory ? 'تعديل تصنيف المخزون' : 'إضافة تصنيف مخزون جديد'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="inv-cat-name">
                اسم التصنيف <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="inv-cat-name"
                type="text"
                className="form-input"
                placeholder="مثال: مستلزمات سباحة / أدوات نظافة / معدات صيانة"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSaving}
              />
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
                <span>{editingCategory ? 'حفظ التعديلات' : 'إضافة التصنيف'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

