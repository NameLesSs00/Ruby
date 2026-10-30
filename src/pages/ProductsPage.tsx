import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  AlertCircle,
  AlertTriangle,
  Package,
  Layers,
  Tag,
} from 'lucide-react';
import {
  productsApi,
  productCategoriesApi,
  productKeys,
  categoryKeys,
  type Product,
  type ProductCategory,
  type CreateProductPayload,
  type UpdateProductPayload,
} from '../modules/products';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Product Form Fields
  const [productName, setProductName] = useState('');
  const [productCategoryId, setProductCategoryId] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState('');

  // Category Manager Form Field
  const [newCategoryName, setNewCategoryName] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query categories
  const { data: categoriesData } = useQuery({
    queryKey: categoryKeys.list({ page: 1, pageSize: 100 }),
    queryFn: () => productCategoriesApi.getAll({ page: 1, pageSize: 100 }),
  });

  const categories = categoriesData?.items || [];

  // Query products
  const { data, isLoading, isError } = useQuery({
    queryKey: productKeys.list({
      page,
      pageSize,
      search: debouncedSearch,
      categoryId: selectedCategoryId,
    }),
    queryFn: () =>
      productsApi.getAll({
        page,
        pageSize,
        search: debouncedSearch,
        categoryId: selectedCategoryId,
      }),
    placeholderData: keepPreviousData,
  });

  // Create Product Mutation
  const createProductMutation = useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast.success('تمت إضافة المنتج بنجاح');
      handleCloseProductModal();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في إضافة المنتج');
    },
  });

  // Update Product Mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductPayload }) =>
      productsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast.success('تم تحديث بيانات المنتج بنجاح');
      handleCloseProductModal();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في تحديث بيانات المنتج');
    },
  });

  // Toggle Product Status Mutation
  const statusProductMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      productsApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast.success(
        variables.isActive ? 'تم تفعيل المنتج بنجاح' : 'تم تعطيل المنتج بنجاح'
      );
    },
    onError: () => {
      showToast.error('فشل في تعديل حالة المنتج');
    },
  });

  // Delete Product Mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      showToast.success('تم حذف المنتج بنجاح');
      setDeletingProduct(null);
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في حذف المنتج');
    },
  });

  // Create Category Mutation
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => productCategoriesApi.create({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      showToast.success('تمت إضافة التصنيف بنجاح');
      setNewCategoryName('');
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في إضافة التصنيف');
    },
  });

  // Toggle Category Status Mutation
  const statusCategoryMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      productCategoriesApi.updateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      showToast.success('تم تحديث حالة التصنيف');
    },
    onError: () => {
      showToast.error('فشل في تعديل حالة التصنيف');
    },
  });

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductName('');
    setProductCategoryId(categories.length > 0 ? categories[0].id : '');
    setSalePrice('');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductCategoryId(product.productCategoryId);
    setSalePrice(product.salePrice.toString());
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleProductSubmit = (e: FormEvent) => {
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

    const payload = {
      productCategoryId: Number(productCategoryId),
      name: productName.trim(),
      salePrice: priceNum,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, payload });
    } else {
      createProductMutation.mutate(payload);
    }
  };

  const handleAddCategorySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast.warning('يرجى إدخال اسم التصنيف');
      return;
    }
    createCategoryMutation.mutate(newCategoryName.trim());
  };

  const isSavingProduct =
    createProductMutation.isPending || updateProductMutation.isPending;
  const products = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="view-container">
      {/* Top Toolbar */}
      <div className="view-toolbar">
        <div className="toolbar-filters">
          <div className="toolbar-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="البحث باسم المنتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={selectedCategoryId ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCategoryId(val ? Number(val) : undefined);
              setPage(1);
            }}
          >
            <option value="">جميع التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem' }}
            onClick={() => setIsCategoryModalOpen(true)}
          >
            <Layers size={17} />
            <span>إدارة التصنيفات</span>
          </button>

          <button
            type="button"
            className="btn-add"
            onClick={handleOpenCreateProduct}
          >
            <Plus size={18} />
            <span>إضافة منتج جديد</span>
          </button>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>المنتج</th>
              <th>التصنيف</th>
              <th>سعر البيع</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل قائمة المنتجات...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                  <span>تعذر تحميل قائمة المنتجات، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty-row">
                  <span>لا توجد منتجات مسجلة حالياً {debouncedSearch ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="coach-cell-name">
                      <div className="coach-avatar" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        <Package size={18} />
                      </div>
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="job-title-badge">
                      <Tag size={13} style={{ marginInlineEnd: '0.35rem' }} />
                      {product.productCategoryName || 'غير مصنف'}
                    </span>
                  </td>
                  <td>
                    <span className="salary-text">
                      {product.salePrice.toLocaleString('ar-EG')}
                      <span className="currency-unit">ج.م</span>
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل المنتج"
                        onClick={() => handleOpenEditProduct(product)}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        className={`btn-icon-action ${product.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                        title={product.isActive ? 'تعطيل المنتج' : 'تفعيل المنتج'}
                        disabled={statusProductMutation.isPending}
                        onClick={() =>
                          statusProductMutation.mutate({
                            id: product.id,
                            isActive: !product.isActive,
                          })
                        }
                      >
                        {product.isActive ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action delete"
                        title="حذف المنتج"
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        {!isLoading && totalCount > 0 && (
          <div className="pagination-wrapper">
            <span>
              إجمالي المنتجات: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="btn-page"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                السابق
              </button>
              <button
                type="button"
                className="btn-page"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                التالي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Dialog for Add / Edit Product */}
      {isProductModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseProductModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseProductModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="product-name">
                    اسم المنتج <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="product-name"
                    type="text"
                    className="form-input"
                    placeholder="مثال: نظارة سباحة احترافية / مشروب رياضي"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    disabled={isSavingProduct}
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
                    disabled={isSavingProduct}
                  >
                    <option value="" disabled>
                      اختر التصنيف
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
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
                    disabled={isSavingProduct}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseProductModal}
                  disabled={isSavingProduct}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-add"
                  disabled={isSavingProduct}
                >
                  {isSavingProduct ? (
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
      )}

      {/* Delete Product Confirmation Modal */}
      {deletingProduct && (
        <div className="modal-backdrop" onClick={() => setDeletingProduct(null)}>
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#ef4444' }}>
                تأكيد حذف المنتج
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeletingProduct(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="confirm-delete-box">
                <div className="delete-warning-icon">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0d1527', marginBottom: '0.4rem' }}>
                    هل أنت متأكد من حذف المنتج "{deletingProduct.name}"؟
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    سيتم حذف المنتج من قائمة الأسعار بشكل نهائي.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDeletingProduct(null)}
                disabled={deleteProductMutation.isPending}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => deleteProductMutation.mutate(deletingProduct.id)}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? (
                  <>
                    <div className="spinner" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <span>نعم، حذف المنتج</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal Dialog */}
      {isCategoryModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">إدارة تصنيفات المنتجات</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Add New Category Quick Form */}
              <form onSubmit={handleAddCategorySubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="اسم التصنيف الجديد (مثال: ملابس سباحة)..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  disabled={createCategoryMutation.isPending}
                />
                <button
                  type="submit"
                  className="btn-add"
                  style={{ flexShrink: 0, padding: '0.65rem 1rem' }}
                  disabled={createCategoryMutation.isPending}
                >
                  <Plus size={16} />
                  <span>إضافة</span>
                </button>
              </form>

              {/* Categories List */}
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                {categories.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem 0' }}>
                    لا توجد تصنيفات حالياً
                  </p>
                ) : (
                  categories.map((cat: ProductCategory) => (
                    <div
                      key={cat.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Tag size={16} color="#0284c7" />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0d1527' }}>
                          {cat.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={`btn-icon-action ${cat.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                        title={cat.isActive ? 'تعطيل التصنيف' : 'تفعيل التصنيف'}
                        disabled={statusCategoryMutation.isPending}
                        onClick={() =>
                          statusCategoryMutation.mutate({
                            id: cat.id,
                            isActive: !cat.isActive,
                          })
                        }
                      >
                        {cat.isActive ? <XCircle size={15} /> : <CheckCircle size={15} />}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

