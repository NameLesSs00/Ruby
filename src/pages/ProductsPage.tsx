import { useState, useEffect } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { Search, Plus, Layers } from 'lucide-react';
import {
  productsApi,
  productCategoriesApi,
  productKeys,
  categoryKeys,
  type Product,
} from '../modules/products';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';
import { ProductsTable } from '../components/products/ProductsTable';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { CategoryManagerModal } from '../components/products/CategoryManagerModal';
import { DeleteModal } from '../components/ui/DeleteModal';

export const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: categoriesData } = useQuery({
    queryKey: categoryKeys.list({ page: 1, pageSize: 100 }),
    queryFn: () => productCategoriesApi.getAll({ page: 1, pageSize: 100 }),
  });

  const categories = categoriesData?.items || [];

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

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="view-container">
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

      <ProductsTable
        products={data?.items || []}
        isLoading={isLoading}
        isError={isError}
        debouncedSearch={debouncedSearch}
        page={page}
        totalCount={data?.totalCount || 0}
        pageSize={pageSize}
        statusMutationPending={statusProductMutation.isPending}
        onEdit={handleOpenEditProduct}
        onToggleStatus={(id, isActive) => statusProductMutation.mutate({ id, isActive })}
        onDelete={setDeletingProduct}
        onPageChange={setPage}
      />

      <ProductFormModal
        isOpen={isProductModalOpen}
        editingProduct={editingProduct}
        categories={categories}
        onClose={handleCloseProductModal}
        onSuccess={handleCloseProductModal}
      />

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        categories={categories}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      <DeleteModal
        isOpen={!!deletingProduct}
        title="تأكيد حذف المنتج"
        message={`هل أنت متأكد من حذف المنتج "${deletingProduct?.name}"؟`}
        confirmLabel="نعم، حذف المنتج"
        isPending={deleteProductMutation.isPending}
        onClose={() => setDeletingProduct(null)}
        onConfirm={() => deletingProduct && deleteProductMutation.mutate(deletingProduct.id)}
      />
    </div>
  );
};
