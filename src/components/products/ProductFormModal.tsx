import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  productsApi,
  productKeys,
  getProductImageUrl,
  type Product,
  type ProductCategory,
  type CreateProductPayload,
  type UpdateProductPayload,
} from '../../modules/products';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';
import { blockInvalidNumberKeys } from '../../lib/number-input';
import { ProductImageUpload } from './ProductImageUpload';

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

  const queryClient = useQueryClient();
  const [productName, setProductName] = useState('');
  const [productCategoryId, setProductCategoryId] = useState<number | ''>('');
  const [barcode, setBarcode] = useState('');
  const [customerPrice, setCustomerPrice] = useState('');
  const [employeePrice, setEmployeePrice] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.name);
      setProductCategoryId(editingProduct.productCategoryId);
      setBarcode(editingProduct.barcode || '');
      setCustomerPrice(editingProduct.customerPrice !== undefined ? editingProduct.customerPrice.toString() : '');
      setEmployeePrice(editingProduct.employeePrice !== undefined ? editingProduct.employeePrice.toString() : '');
      setSelectedFile(null);
      setRemoveExistingImage(false);
      setPreviewUrl(getProductImageUrl(editingProduct.imageUrl));
    } else {
      setProductName('');
      setProductCategoryId(categories.length > 0 ? categories[0].id : '');
      setBarcode('');
      setCustomerPrice('');
      setEmployeePrice('');
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
  };

  const handleRestoreExistingImage = () => {
    if (editingProduct?.imageUrl) {
      setSelectedFile(null);
      setRemoveExistingImage(false);
      setPreviewUrl(getProductImageUrl(editingProduct.imageUrl));
    }
  };

  const createMutation = useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    meta: { invalidate: productKeys.all },
    onSuccess: async () => {
      showToast.success('تمت إضافة المنتج بنجاح');
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في إضافة المنتج');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      productsApi.update(id, payload),
    meta: { invalidate: productKeys.all },
    onSuccess: async () => {
      showToast.success('تم تحديث بيانات المنتج بنجاح');
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
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
    if (!barcode.trim()) {
      showToast.warning('يرجى إدخال باركود المنتج');
      return;
    }
    const custPriceNum = parseFloat(customerPrice);
    if (isNaN(custPriceNum) || custPriceNum < 0) {
      showToast.warning('يرجى كتابة سعر عميل صحيح');
      return;
    }
    const empPriceNum = parseFloat(employeePrice);
    if (isNaN(empPriceNum) || empPriceNum < 0) {
      showToast.warning('يرجى كتابة سعر موظف صحيح');
      return;
    }

    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        payload: {
          productCategoryId: Number(productCategoryId),
          name: productName.trim(),
          barcode: barcode.trim(),
          customerPrice: custPriceNum,
          employeePrice: empPriceNum,
          imageFile: selectedFile,
          removeImage: removeExistingImage,
        },
      });
    } else {
      createMutation.mutate({
        productCategoryId: Number(productCategoryId),
        name: productName.trim(),
        barcode: barcode.trim(),
        customerPrice: custPriceNum,
        employeePrice: empPriceNum,
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
            <ProductImageUpload
              previewUrl={previewUrl}
              removeExistingImage={removeExistingImage}
              selectedFile={selectedFile}
              hasExistingImage={Boolean(editingProduct?.imageUrl)}
              isSaving={isSaving}
              onFileChange={handleFileChange}
              onRemoveImage={handleRemoveImage}
              onRestoreExistingImage={handleRestoreExistingImage}
            />

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
              <label className="form-label" htmlFor="product-barcode">
                الباركود <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="product-barcode"
                type="text"
                className="form-input"
                placeholder="مثال: 123456789 أو PROD-01"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="product-customer-price">
                  سعر العميل (ج.م) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="product-customer-price"
                  type="number"
                  min="0"
                  step="any"
                  className="form-input"
                  placeholder="مثال: 50"
                  value={customerPrice}
                  onChange={(e) => setCustomerPrice(e.target.value)}
                  onKeyDown={blockInvalidNumberKeys}
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="product-employee-price">
                  سعر الموظف (ج.م) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="product-employee-price"
                  type="number"
                  min="0"
                  step="any"
                  className="form-input"
                  placeholder="مثال: 35"
                  value={employeePrice}
                  onChange={(e) => setEmployeePrice(e.target.value)}
                  onKeyDown={blockInvalidNumberKeys}
                  required
                  disabled={isSaving}
                />
              </div>
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
