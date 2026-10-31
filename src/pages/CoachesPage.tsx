import { useState, useEffect } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import { coachesApi, coachKeys, type Coach } from '../modules/coaches';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';
import { CoachesTable } from '../components/coaches/CoachesTable';
import { CoachFormModal } from '../components/coaches/CoachFormModal';

export const CoachesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError } = useQuery({
    queryKey: coachKeys.list({ page, pageSize, search: debouncedSearch }),
    queryFn: () => coachesApi.getAll({ page, pageSize, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      coachesApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() });
      showToast.success(
        variables.isActive ? 'تم تفعيل حساب المدرب بنجاح' : 'تم تعطيل حساب المدرب بنجاح'
      );
    },
    onError: () => {
      showToast.error('فشل في تعديل حالة المدرب');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingCoach(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coach: Coach) => {
    setEditingCoach(coach);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoach(null);
  };

  return (
    <div className="view-container">
      <div className="view-toolbar">
        <div className="toolbar-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="البحث باسم المدرب أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button type="button" className="btn-add" onClick={handleOpenCreateModal}>
          <Plus size={18} />
          <span>إضافة مدرب جديد</span>
        </button>
      </div>

      <CoachesTable
        coaches={data?.items || []}
        isLoading={isLoading}
        isError={isError}
        debouncedSearch={debouncedSearch}
        page={page}
        totalCount={data?.totalCount || 0}
        pageSize={pageSize}
        statusMutationPending={statusMutation.isPending}
        onEdit={handleOpenEditModal}
        onToggleStatus={(id, isActive) => statusMutation.mutate({ id, isActive })}
        onPageChange={setPage}
      />

      <CoachFormModal
        isOpen={isModalOpen}
        editingCoach={editingCoach}
        onClose={handleCloseModal}
        onSuccess={handleCloseModal}
      />
    </div>
  );
};
