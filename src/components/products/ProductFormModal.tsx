import { useState, useEffect, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, UploadCloud, Trash2, Image as ImageIcon, RotateCcw } from 'lucide-react';
import {
  productsApi,
  productKeys,
  getProductImageUrl,
  type Product,
  type ProductCategory,
  type CreateProductPayload,
  type UpdateProductPayload,
} from '../../modules/products';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface ProductFormModalProps {
  isOpen: boolean;
  editingProduct: Product | null;
  categories: ProductCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ProductFormModal = ({
  isOpen,
  editingProduct,
  categories,
  onClose,
  onSuccess,
}: ProductFormModalProps) => {
  useModalEscape(onClose, isOpen);

  const [productName, setProductName] = useState('');
  const [productCategoryId, setProductCategoryId] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setProductCategoryId(editingProduct.productCategoryId);
      setSalePrice(editingProduct.salePrice.toString());
      setSelectedFile(null);
      setRemoveExistingImage(false);
      setPreviewUrl(getProductImageUrl(editingProduct.imageUrl));
    } else {
      setProductName('');
      setProductCategoryId(categories.length > 0 ? categories[0].id : '');
      setSalePrice('');
      setSelectedFile(null);
      setRemoveExistingImage(false);
      setPreviewUrl(null);
    }
  }, [editingProduct, isOpen, categories]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast.warning('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast.warning('حجم الصورة كبير جداً، يجب ألا يتجاوز 5 ميجابايت');
      return;
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setRemoveExistingImage(false);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (editingProduct?.imageUrl) setRemoveExistingImage(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRestoreExistingImage = () => {
    if (editingProduct?.imageUrl) {
      setSelectedFile(null);
      setRemoveExistingImage(false);
      setPreviewUrl(getProductImageUrl(editingProduct.imageUrl));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast.success('تمت إضافة المنتج بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في إضافة المنتج');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      productsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast.success('تم تحديث بيانات المنتج بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تحديث بيانات المنتج');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      showToast.warning('يرجى كتابة اسم المنتج');
      return;
    }
    if (!productCategoryId) {
      showToast.warning('يرجى اختيار تصنيف المنتج');
      return;
    }
    const priceNum = parseFloat(salePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      showToast.warning('يرجى كتابة سعر بيع صحيح');
      return;
    }

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        payload: {
          productCategoryId: Number(productCategoryId),
          name: productName.trim(),
          salePrice: priceNum,
          imageFile: selectedFile,
          removeImage: removeExistingImage,
        },
      });
    } else {
      createMutation.mutate({
        productCategoryId: Number(productCategoryId),
        name: productName.trim(),
        salePrice: priceNum,
        imageFile: selectedFile,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h3 className="modal-title">{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ImageIcon size={16} color="var(--color-orange)" />
                <span>صورة المنتج (اختياري)</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={isSaving}
              />

              {previewUrl && !removeExistingImage ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                  <img
                    src={previewUrl}
                    alt="معاينة المنتج"
                    style={{ width: 72, height: 72, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                      {selectedFile ? selectedFile.name : 'الصورة الحالية للمنتج'}
                    </div>
                    {selectedFile && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {(selectedFile.size / 1024).toFixed(1)} ك.ب
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
                        تغيير الصورة
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', color: '#ef4444', borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}
                        onClick={handleRemoveImage}
                        disabled={isSaving}
                      >
                        <Trash2 size={13} style={{ marginInlineEnd: '0.25rem' }} />
                        إزالة
                      </button>
                    </div>
                  </div>
                </div>
              ) : removeExistingImage ? (
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px dashed #f87171', backgroundColor: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#b91c1c' }}>تم تحديد إزالة الصورة الحالية عند الحفظ</span>
                  <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} onClick={handleRestoreExistingImage} disabled={isSaving}>
                    <RotateCcw size={13} style={{ marginInlineEnd: '0.25rem' }} />
                    تراجع
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #cbd5e1', borderRadius: 'var(--radius-md)', padding: '1.25rem 1rem', textAlign: 'center', cursor: 'pointer', backgroundColor: '#ffffff', transition: 'border-color 0.2s, background-color 0.2s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-orange)';
                    e.currentTarget.style.backgroundColor = '#fffaf7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <UploadCloud size={32} color="var(--color-orange)" style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>اضغط هنا لرفع صورة المنتج</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>صيغ مدعومة: JPG, PNG, WebP (بحد أقصى 5 ميجابايت)</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="product-name">
                اسم المنتج <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="product-name"
                type="text"
                className="form-input"
                placeholder="مثال: نظارة سباحة احترافية"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="product-category">
                التصنيف <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="product-category"
                className="form-input"
                value={productCategoryId}
                onChange={(e) => setProductCategoryId(Number(e.target.value))}
                required
                disabled={isSaving}
              >
                <option value="" disabled>اختر التصنيف</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="product-price">
                سعر البيع (بالجنيه المصري) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.5"
                className="form-input"
                placeholder="مثال: 50"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>
              إلغاء
            </button>
            <button type="submit" className="btn-add" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="spinner" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
