import { useState, useEffect } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import { clientsApi, clientKeys, type Client } from '../modules/clients';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';
import { ClientsTable } from '../components/clients/ClientsTable';
import { ClientFormModal } from '../components/clients/ClientFormModal';
import { ClientBarcodeModal } from '../components/clients/ClientBarcodeModal';

export const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedBarcodeClient, setSelectedBarcodeClient] = useState<Client | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    queryKey: clientKeys.list({ page, pageSize, search: debouncedSearch }),
    queryFn: () => clientsApi.getAll({ page, pageSize, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      clientsApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      showToast.success(
        variables.isActive ? 'تم تفعيل حساب العميل بنجاح' : 'تم تعطيل حساب العميل بنجاح'
      );
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تعديل حالة العميل');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="view-container">
      <div className="view-toolbar">
        <div className="toolbar-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="البحث باسم العميل، الهاتف، أو الكود..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button type="button" className="btn-add" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          <span>إضافة عميل جديد</span>
        </button>
      </div>

      <ClientsTable
        clients={data?.items || []}
        isLoading={isLoading}
        isError={isError}
        debouncedSearch={debouncedSearch}
        page={page}
        totalCount={data?.totalCount || 0}
        pageSize={pageSize}
        statusMutationPending={statusMutation.isPending}
        onEdit={handleOpenEditModal}
        onToggleStatus={(id, isActive) => statusMutation.mutate({ id, isActive })}
        onBarcode={setSelectedBarcodeClient}
        onPageChange={setPage}
      />

      <ClientFormModal
        isOpen={isModalOpen}
        editingClient={editingClient}
        onClose={handleCloseModal}
      />

      <ClientBarcodeModal
        client={selectedBarcodeClient}
        onClose={() => setSelectedBarcodeClient(null)}
      />
    </div>
  );
};
