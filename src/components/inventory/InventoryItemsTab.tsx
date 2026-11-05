import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import {
  inventoryItemsApi,
  inventoryKeys,
  type InventoryItem,
  type InventoryCategory,
} from '../../modules/inventory';
import {
  warehouseTransactionsApi,
  warehouseTransactionKeys,
} from '../../modules/warehouseTransactions';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { InventoryItemFormModal } from './InventoryItemFormModal';
import { InventoryItemsTable } from './InventoryItemsTable';
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

  // Fetch real-time warehouse stock balances
  const { data: stockData } = useQuery({
    queryKey: warehouseTransactionKeys.stockBalances(),
    queryFn: () => warehouseTransactionsApi.getItemStockBalances(),
  });

  const stockMap = useMemo(() => {
    const map = new Map<string, number>();
    (stockData?.items || []).forEach((s) => {
      if (s.itemName) {
        map.set(s.itemName.trim().toLowerCase(), s.quantity);
      }
    });
    return map;
  }, [stockData]);

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      inventoryItemsApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
      showToast.success(variables.isActive ? 'تم تفعيل الصنف المخزني' : 'تم تعطيل الصنف المخزني');
    },
    onError: (err: unknown) => showToast.apiError(err, 'فشل في تعديل حالة الصنف المخزني'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryItemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.items() });
      showToast.success('تم حذف الصنف المخزني بنجاح');
      setDeletingItem(null);
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حذف الصنف المخزني');
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

      <InventoryItemsTable
        items={items}
        stockMap={stockMap}
        isLoading={isLoading}
        isError={isError}
        debouncedSearch={debouncedSearch}
        onEdit={(item) => {
          setEditingItem(item);
          setIsFormOpen(true);
        }}
        onDelete={(item) => setDeletingItem(item)}
        onToggleStatus={(item) => statusMutation.mutate({ id: item.id, isActive: !item.isActive })}
      />

      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        label="أصناف مخزنية"
        isLoading={isLoading}
        onPageChange={setPage}
      />

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
        title="حذف الصنف المخزني"
        message={`هل أنت متأكد من حذف الصنف "${deletingItem?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmLabel="نعم، حذف"
        isPending={deleteMutation.isPending}
        onConfirm={() => {
          if (deletingItem) deleteMutation.mutate(deletingItem.id);
        }}
        onClose={() => setDeletingItem(null)}
      />
    </>
  );
};
