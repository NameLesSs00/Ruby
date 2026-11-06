import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Calendar,
  Coins,
  Layers,
} from 'lucide-react';
import {
  otherIncomesApi,
  otherIncomeKeys,
  type OtherIncome,
} from '../../modules/expenses';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { OtherIncomeFormModal } from './OtherIncomeFormModal';
import { DeleteModal } from '../ui/DeleteModal';
import { PaginationBar } from '../ui/PaginationBar';

export const OtherIncomesTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<OtherIncome | null>(null);
  const [deletingIncome, setDeletingIncome] = useState<OtherIncome | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: otherIncomeKeys.list({ page, pageSize, search: searchTerm }),
    queryFn: () => otherIncomesApi.getAll({ page, pageSize, search: searchTerm }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems;
    const term = searchTerm.toLowerCase().trim();
    return rawItems.filter(
      (item) => item.description && item.description.toLowerCase().includes(term)
    );
  }, [rawItems, searchTerm]);

  const totalAmountSum = useMemo(() => {
    return rawItems.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [rawItems]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => otherIncomesApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: otherIncomeKeys.lists() });
      showToast.success(res.message || 'تم حذف الإيراد الإضافي بنجاح');
      setDeletingIncome(null);
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حذف الإيراد الإضافي');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingIncome(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (income: OtherIncome) => {
    setEditingIncome(income);
    setIsFormModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingIncome) {
      deleteMutation.mutate(deletingIncome.id);
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '1rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  return (
    <>
      {/* Metric Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الإيرادات الإضافية (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857' }}>
              {totalAmountSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
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
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>إيراد</span>
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
              placeholder="البحث في بيان ومصدر الإيراد..."
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
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#16a34a' }}
        >
          <Plus size={16} />
          <span>تسجيل إيراد إضافي</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>تاريخ ووقت التحصيل</th>
              <th>البيان والمصدر</th>
              <th>المبلغ المحصل</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#16a34a', borderColor: 'rgba(22,163,74,0.2)' }} />
                    <span>جاري تحميل سجل الإيرادات الإضافية...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <span>تعذر تحميل سجل الإيرادات الإضافية، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty-row">
                  <span>لا توجد إيرادات إضافية مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const incomeDateFormatted = new Date(item.incomeDate).toLocaleString('ar-EG', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });

                return (
                  <tr key={item.id}>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: '#0d1527', fontWeight: 600 }}>
                        <Calendar size={14} color="#94a3b8" />
                        {incomeDateFormatted}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>
                        {item.description || '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 900, color: '#047857', fontSize: '0.95rem' }}>
                        + {item.amount.toLocaleString('ar-EG')}{' '}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                      </span>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center', gap: '0.45rem' }}>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="تعديل الإيراد"
                          onClick={() => handleOpenEditModal(item)}
                          style={{
                            color: '#0284c7',
                            backgroundColor: '#f0f9ff',
                            border: '1px solid #bae6fd',
                          }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="حذف الإيراد"
                          onClick={() => setDeletingIncome(item)}
                          style={{
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            label="إجمالي بنود الإيرادات"
            isLoading={isLoading}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Other Income Form Modal */}
      <OtherIncomeFormModal
        isOpen={isFormModalOpen}
        editingIncome={editingIncome}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingIncome(null);
        }}
        onSuccess={() => {
          setIsFormModalOpen(false);
          setEditingIncome(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingIncome)}
        title="تأكيد حذف الإيراد الإضافي"
        message={`هل أنت متأكد من حذف الإيراد بقيمة (${deletingIncome?.amount} ج.م) والبيان "${deletingIncome?.description}"؟`}
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingIncome(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

