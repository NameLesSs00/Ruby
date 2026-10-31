import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  productsApi, productKeys,
  type Product, type ProductCategory, type CreateProductPayload, type UpdateProductPayload,
} from '../../modules/products';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  categories: ProductCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductFormModal = ({ isOpen, editingProduct, categories, onClose, onSuccess }: ProductFormModalProps) => {
  const [productName, setProductName] = useState('');
  const [productCategoryId, setProductCategoryId] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setProductCategoryId(editingProduct.productCategoryId);
      setSalePrice(editingProduct.salePrice.toString());
    } else {
      setProductName('');
      setProductCategoryId(categories.length > 0 ? categories[0].id : '');
      setSalePrice('');
    }
  }, [editingProduct, isOpen, categories]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: productKeys.lists() }); showToast.success('تمت إضافة المنتج بنجاح'); onSuccess(); },
    onError: (err: unknown) => { const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message; showToast.error(msg || 'فشل في إضافة المنتج'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) => productsApi.update(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: productKeys.lists() }); showToast.success('تم تحديث بيانات المنتج بنجاح'); onSuccess(); },
    onError: (err: unknown) => { const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message; showToast.error(msg || 'فشل في تحديث بيانات المنتج'); },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) { showToast.warning('يرجى كتابة اسم المنتج'); return; }
    if (!productCategoryId) { showToast.warning('يرجى اختيار تصنيف المنتج'); return; }
    const priceNum = parseFloat(salePrice);
    if (isNaN(priceNum) || priceNum < 0) { showToast.warning('يرجى كتابة سعر بيع صحيح'); return; }
    const payload = { productCategoryId: Number(productCategoryId), name: productName.trim(), salePrice: priceNum };
    if (editingProduct) { updateMutation.mutate({ id: editingProduct.id, payload }); }
    else { createMutation.mutate(payload); }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="product-name">اسم المنتج <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="product-name" type="text" className="form-input" placeholder="مثال: نظارة سباحة احترافية" value={productName} onChange={(e) => setProductName(e.target.value)} required disabled={isSaving} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="product-category">التصنيف <span style={{ color: '#ef4444' }}>*</span></label>
              <select id="product-category" className="form-input" value={productCategoryId} onChange={(e) => setProductCategoryId(Number(e.target.value))} required disabled={isSaving}>
                <option value="" disabled>اختر التصنيف</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="product-price">سعر البيع (بالجنيه المصري) <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="product-price" type="number" min="0" step="0.5" className="form-input" placeholder="مثال: 50" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} required disabled={isSaving} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>إلغاء</button>
            <button type="submit" className="btn-add" disabled={isSaving}>
              {isSaving ? <><div className="spinner" /><span>جاري الحفظ...</span></> : <span>{editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

