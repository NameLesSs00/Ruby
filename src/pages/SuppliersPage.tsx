import { useState, useEffect } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import {
  suppliersApi,
  supplierKeys,
  type Supplier,
} from '../modules/suppliers';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';
import { SuppliersTable } from '../components/suppliers/SuppliersTable';
import { SupplierFormModal } from '../components/suppliers/SupplierFormModal';
import { DeleteModal } from '../components/ui/DeleteModal';

export const SuppliersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    queryKey: supplierKeys.list({ page, pageSize, search: debouncedSearch }),
    queryFn: () => suppliersApi.getAll({ page, pageSize, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      suppliersApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      showToast.success(
        variables.isActive ? 'تم تفعيل حساب المورد بنجاح' : 'تم تعطيل حساب المورد بنجاح'
      );
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تعديل حالة المورد');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => suppliersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      showToast.success('تم حذف المورد بنجاح');
      setDeletingSupplier(null);
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حذف المورد');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  return (
    <div className="view-container">
      <div className="view-toolbar">
        <div className="toolbar-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="البحث باسم المورد أو الشركة أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button type="button" className="btn-add" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          <span>إضافة مورد جديد</span>
        </button>
      </div>

      <SuppliersTable
        suppliers={data?.items || []}
        isLoading={isLoading}
        isError={isError}
        debouncedSearch={debouncedSearch}
        page={page}
        totalCount={data?.totalCount || 0}
        pageSize={pageSize}
        statusMutationPending={statusMutation.isPending}
        onEdit={handleOpenEditModal}
        onToggleStatus={(id, isActive) => statusMutation.mutate({ id, isActive })}
        onDelete={setDeletingSupplier}
        onPageChange={setPage}
      />

      <SupplierFormModal
        isOpen={isModalOpen}
        editingSupplier={editingSupplier}
        onClose={handleCloseModal}
        onSuccess={handleCloseModal}
      />

      <DeleteModal
        isOpen={!!deletingSupplier}
        title="تأكيد حذف المورد"
        message={`هل أنت متأكد من حذف المورد "${deletingSupplier?.name}"؟`}
        confirmLabel="نعم، حذف المورد"
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingSupplier(null)}
        onConfirm={() => deletingSupplier && deleteMutation.mutate(deletingSupplier.id)}
      />
    </div>
  );
};
