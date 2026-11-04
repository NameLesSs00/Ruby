import { useState, useEffect } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, AlertCircle, Layers, Calendar } from 'lucide-react';
import {
  inventoryCategoriesApi,
  inventoryKeys,
  type InventoryCategory,
} from '../../modules/inventory';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { InventoryCategoryFormModal } from './InventoryCategoryFormModal';
import { DeleteModal } from '../ui/DeleteModal';
import { PaginationBar } from '../ui/PaginationBar';

export const InventoryCategoriesTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<InventoryCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<InventoryCategory | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const isActiveParam = statusFilter === 'all' ? undefined : statusFilter === 'active';

  const { data, isLoading, isError } = useQuery({
    queryKey: inventoryKeys.categoryList({
      searchTerm: debouncedSearch,
      isActive: isActiveParam,
      page,
      pageSize,
    }),
    queryFn: () =>
      inventoryCategoriesApi.getAll({
        searchTerm: debouncedSearch,
        isActive: isActiveParam,
        page,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      inventoryCategoriesApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
      showToast.success(variables.isActive ? 'تم تفعيل تصنيف المخزون' : 'تم تعطيل تصنيف المخزون');
    },
    onError: (err: unknown) => showToast.apiError(err, 'فشل في تعديل حالة التصنيف'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.categories() });
      showToast.success('تم حذف تصنيف المخزون بنجاح');
      setDeletingCategory(null);
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حذف تصنيف المخزون');
    },
  });

  const categories = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  return (
    <>
      <div className="view-toolbar">
        <div className="toolbar-filters">
          <div className="toolbar-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="البحث باسم تصنيف المخزون..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'all' | 'active' | 'inactive');
              setPage(1);
            }}
          >
            <option value="all">جميع الحالات</option>
            <option value="active">النشطة فقط</option>
            <option value="inactive">غير النشطة فقط</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-add"
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={18} />
          <span>إضافة تصنيف جديد</span>
        </button>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>تصنيف المخزون</th>
              <th>تاريخ الإنشاء</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل تصنيفات المخزون...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                  <span>تعذر تحميل تصنيفات المخزون، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty-row">
                  <span>لا توجد تصنيفات مسجلة {debouncedSearch ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <div className="coach-cell-name">
                      <div className="coach-avatar" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                        <Layers size={17} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{cat.name}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <Calendar size={15} />
                      <span>{cat.createdAt ? cat.createdAt.split('T')[0] : '—'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${cat.isActive ? 'active' : 'inactive'}`}>
                      {cat.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل التصنيف"
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        className={`btn-icon-action ${cat.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                        title={cat.isActive ? 'تعطيل التصنيف' : 'تفعيل التصنيف'}
                        disabled={statusMutation.isPending}
                        onClick={() => statusMutation.mutate({ id: cat.id, isActive: !cat.isActive })}
                      >
                        {cat.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action delete"
                        title="حذف التصنيف"
                        onClick={() => setDeletingCategory(cat)}
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

        <PaginationBar
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          label="إجمالي التصنيفات"
          isLoading={isLoading}
          onPageChange={setPage}
        />
      </div>

      <InventoryCategoryFormModal
        isOpen={isFormOpen}
        editingCategory={editingCategory}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
      />

      <DeleteModal
        isOpen={!!deletingCategory}
        title="تأكيد حذف تصنيف المخزون"
        message={`هل أنت متأكد من حذف التصنيف "${deletingCategory?.name}"؟`}
        confirmLabel="نعم، حذف التصنيف"
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => deletingCategory && deleteMutation.mutate(deletingCategory.id)}
      />
    </>
  );
};
