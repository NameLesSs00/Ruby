import { useState, useEffect } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { Search, Plus, Edit2, Trash2, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';
import {
  inventoryItemsApi,
  inventoryKeys,
  getUnitLabel,
  type InventoryItem,
  type InventoryCategory,
} from '../../modules/inventory';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { InventoryItemFormModal } from './InventoryItemFormModal';
import { DeleteModal } from '../ui/DeleteModal';
import { PaginationBar } from '../ui/PaginationBar';

interface InventoryItemsTabProps {
  categories: InventoryCategory[];
}

export const InventoryItemsTab = ({ categories }: InventoryItemsTabProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const isActiveParam = statusFilter === 'all' ? undefined : statusFilter === 'active';

  const { data, isLoading, isError } = useQuery({
    queryKey: inventoryKeys.itemList({
      searchTerm: debouncedSearch,
      inventoryCategoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
      isActive: isActiveParam,
      page,
      pageSize,
    }),
    queryFn: () =>
      inventoryItemsApi.getAll({
        searchTerm: debouncedSearch,
        inventoryCategoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
        isActive: isActiveParam,
        page,
        pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      inventoryItemsApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
      showToast.success(variables.isActive ? 'تم تفعيل الصنف المخزني' : 'تم تعطيل الصنف المخزني');
    },
    onError: () => showToast.error('فشل في تعديل حالة الصنف المخزني'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
      showToast.success('تم حذف الصنف المخزني بنجاح');
      setDeletingItem(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في حذف الصنف المخزني');
    },
  });

  const items = data?.items || [];
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
              placeholder="البحث باسم الصنف المخزني..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value ? Number(e.target.value) : '');
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
            setEditingItem(null);
            setIsFormOpen(true);
          }}
        >
          <Plus size={18} />
          <span>إضافة صنف مخزني</span>
        </button>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>الصنف المخزني</th>
              <th>التصنيف</th>
              <th>وحدة القياس</th>
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
                    <span>جاري تحميل الأصناف المخزنية...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                  <span>تعذر تحميل الأصناف المخزنية، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty-row">
                  <span>لا توجد أصناف مخزنية مسجلة {debouncedSearch ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="coach-cell-name">
                      <div className="coach-avatar" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        <Package size={17} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="job-title-badge">
                      {item.inventoryCategoryName || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
                      {getUnitLabel(item.unit)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
                      {item.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل الصنف"
                        onClick={() => {
                          setEditingItem(item);
                          setIsFormOpen(true);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        className={`btn-icon-action ${item.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                        title={item.isActive ? 'تعطيل الصنف' : 'تفعيل الصنف'}
                        disabled={statusMutation.isPending}
                        onClick={() => statusMutation.mutate({ id: item.id, isActive: !item.isActive })}
                      >
                        {item.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action delete"
                        title="حذف الصنف"
                        onClick={() => setDeletingItem(item)}
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
          label="إجمالي الأصناف"
          isLoading={isLoading}
          onPageChange={setPage}
        />
      </div>

      <InventoryItemFormModal
        isOpen={isFormOpen}
        editingItem={editingItem}
        categories={categories}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
      />

      <DeleteModal
        isOpen={!!deletingItem}
        title="تأكيد حذف الصنف المخزني"
        message={`هل أنت متأكد من حذف الصنف "${deletingItem?.name}"؟`}
        confirmLabel="نعم، حذف الصنف"
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => deletingItem && deleteMutation.mutate(deletingItem.id)}
      />
    </>
  );
};
