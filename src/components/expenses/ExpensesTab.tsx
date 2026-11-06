import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Search,
  Plus,
  DollarSign,
  Layers,
} from 'lucide-react';
import {
  expensesApi,
  expenseKeys,
  type Expense,
} from '../../modules/expenses';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { ExpenseFormModal } from './ExpenseFormModal';
import { DeleteModal } from '../ui/DeleteModal';
import { ExpensesTable } from './ExpensesTable';

export const ExpensesTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: expenseKeys.list({ page, pageSize, search: searchTerm }),
    queryFn: () => expensesApi.getAll({ page, pageSize, search: searchTerm }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Filter items in-memory for instant feedback if backend Search doesn't catch all
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems;
    const term = searchTerm.toLowerCase().trim();
    return rawItems.filter(
      (item) => item.description && item.description.toLowerCase().includes(term)
    );
  }, [rawItems, searchTerm]);

  // Aggregate metrics
  const totalPageExpenses = useMemo(() => {
    return filteredItems.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  }, [filteredItems]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => expensesApi.delete(id),
    onSuccess: () => {
      showToast.success('تم حذف قيد المصروف بنجاح');
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      setDeletingExpense(null);
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حذف قيد المصروف');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingExpense(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingExpense) {
      deleteMutation.mutate(deletingExpense.id);
    }
  };

  return (
    <>
      {/* Metric Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي مصروفات الصفحة</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
              {totalPageExpenses.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>ج.م</span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي عدد القيود</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
              {totalCount}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>بند</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '0.85rem 1.1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: 260, maxWidth: 380, flex: 1 }}>
            <Search
              size={16}
              color="#94a3b8"
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                insetInlineEnd: '0.75rem',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="البحث في بيان المصروف..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="form-input"
              style={{ paddingInlineEnd: '2.25rem' }}
            />
          </div>
        </div>

        <button
          type="button"
          className="btn-add"
          onClick={handleOpenCreateModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} />
          <span>تسجيل مصروف جديد</span>
        </button>
      </div>

      {/* Data Table Component */}
      <ExpensesTable
        isLoading={isLoading}
        isError={isError}
        items={filteredItems}
        searchTerm={searchTerm}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onEdit={handleOpenEditModal}
        onDelete={setDeletingExpense}
      />

      {/* Expense Form Modal */}
      <ExpenseFormModal
        isOpen={isFormModalOpen}
        editingExpense={editingExpense}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingExpense(null);
        }}
        onSuccess={() => {
          setIsFormModalOpen(false);
          setEditingExpense(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingExpense)}
        title="تأكيد حذف المصروف"
        message={`هل أنت متأكد من حذف المصروف بقيمة (${deletingExpense?.amount} ج.م) والبيان "${deletingExpense?.description}"؟`}
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
