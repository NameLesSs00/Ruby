import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, Plus, Tag, CheckCircle, XCircle } from 'lucide-react';
import {
  productCategoriesApi, categoryKeys, type ProductCategory,
} from '../../modules/products';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface CategoryManagerModalProps {
  isOpen: boolean;
  categories: ProductCategory[];
  onClose: () => void;
}

export const CategoryManagerModal = ({ isOpen, categories, onClose }: CategoryManagerModalProps) => {
  useModalEscape(onClose, isOpen);

  const [newCategoryName, setNewCategoryName] = useState('');

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => productCategoriesApi.create({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      showToast.success('تمت إضافة التصنيف بنجاح');
      setNewCategoryName('');
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في إضافة التصنيف');
    },
  });

  const statusCategoryMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      productCategoriesApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      showToast.success(variables.isActive ? 'تم تفعيل التصنيف بنجاح' : 'تم تعطيل التصنيف بنجاح');
    },
    onError: (err: unknown) => showToast.apiError(err, 'فشل في تعديل حالة التصنيف'),
  });

  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) { showToast.warning('يرجى إدخال اسم التصنيف'); return; }
    createCategoryMutation.mutate(newCategoryName.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h3 className="modal-title">إدارة تصنيفات المنتجات</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" className="form-input" placeholder="اسم التصنيف الجديد (مثال: ملابس سباحة)..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} disabled={createCategoryMutation.isPending} />
            <button type="submit" className="btn-add" style={{ flexShrink: 0, padding: '0.65rem 1rem' }} disabled={createCategoryMutation.isPending}>
              <Plus size={16} /><span>إضافة</span>
            </button>
          </form>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
            {categories.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem 0' }}>لا توجد تصنيفات حالياً</p>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Tag size={16} color="#0284c7" />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0d1527' }}>{cat.name}</span>
                    <span className={`status-badge ${cat.isActive ? 'active' : 'inactive'}`} style={{ padding: '0.15rem 0.55rem', fontSize: '0.7rem' }}>{cat.isActive ? 'نشط' : 'غير نشط'}</span>
                  </div>
                  <button type="button" className={`btn-icon-action ${cat.isActive ? 'toggle-active' : 'toggle-inactive'}`} title={cat.isActive ? 'تعطيل التصنيف' : 'تفعيل التصنيف'} disabled={statusCategoryMutation.isPending} onClick={() => statusCategoryMutation.mutate({ id: cat.id, isActive: !cat.isActive })}>
                    {cat.isActive ? <XCircle size={15} /> : <CheckCircle size={15} />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};

