import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  X,
  Phone,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  coachesApi,
  coachKeys,
  type Coach,
  type CreateCoachPayload,
  type UpdateCoachPayload,
} from '../modules/coaches';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';

export const CoachesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [notes, setNotes] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1); // Reset to first page on search
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query coaches
  const { data, isLoading, isError } = useQuery({
    queryKey: coachKeys.list({ page, pageSize, search: debouncedSearch }),
    queryFn: () => coachesApi.getAll({ page, pageSize, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (payload: CreateCoachPayload) => coachesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() });
      showToast.success('تمت إضافة المدرب بنجاح');
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في إضافة المدرب، يرجى المحاولة لاحقاً');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCoachPayload }) =>
      coachesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() });
      showToast.success('تم تحديث بيانات المدرب بنجاح');
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في تحديث بيانات المدرب');
    },
  });

  // Toggle status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      coachesApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() });
      showToast.success(
        variables.isActive
          ? 'تم تفعيل حساب المدرب بنجاح'
          : 'تم تعطيل حساب المدرب بنجاح'
      );
    },
    onError: () => {
      showToast.error('فشل في تعديل حالة المدرب');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingCoach(null);
    setFullName('');
    setPhoneNumber('');
    // Default to today in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    setHireDate(today);
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coach: Coach) => {
    setEditingCoach(coach);
    setFullName(coach.fullName);
    setPhoneNumber(coach.phoneNumber);
    setHireDate(coach.hireDate ? coach.hireDate.split('T')[0] : '');
    setNotes(coach.notes || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoach(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast.warning('يرجى كتابة اسم المدرب بالكامل');
      return;
    }

    if (!phoneNumber.trim()) {
      showToast.warning('يرجى إدخال رقم هاتف المدرب');
      return;
    }

    if (!hireDate) {
      showToast.warning('يرجى تحديد تاريخ التعيين');
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      hireDate,
      notes: notes.trim() || undefined,
    };

    if (editingCoach) {
      updateMutation.mutate({ id: editingCoach.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const coaches = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="view-container">
      {/* Top Toolbar */}
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

        <button
          type="button"
          className="btn-add"
          onClick={handleOpenCreateModal}
        >
          <Plus size={18} />
          <span>إضافة مدرب جديد</span>
        </button>
      </div>

      {/* Coaches Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>المدرب</th>
              <th>رقم الهاتف</th>
              <th>تاريخ التعيين</th>
              <th>الحالة</th>
              <th>الملاحظات</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل بيانات المدربين...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                  <span>تعذر تحميل قائمة المدربين، يرجى المحاولة مرة أخرى</span>
                </td>
              </tr>
            ) : coaches.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty-row">
                  <span>لا يوجد مدربون مسجلون حالياً {debouncedSearch ? 'مطابقون للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              coaches.map((coach) => (
                <tr key={coach.id}>
                  <td>
                    <div className="coach-cell-name">
                      <div className="coach-avatar">
                        {coach.fullName.charAt(0)}
                      </div>
                      <span>{coach.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <Phone size={15} />
                      <span dir="ltr">{coach.phoneNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <Calendar size={15} />
                      <span>{coach.hireDate ? coach.hireDate.split('T')[0] : '—'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${coach.isActive ? 'active' : 'inactive'}`}>
                      {coach.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: coach.notes ? '#334155' : '#94a3b8', fontSize: '0.85rem' }}>
                      {coach.notes || 'لا توجد ملاحظات'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل بيانات المدرب"
                        onClick={() => handleOpenEditModal(coach)}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        className={`btn-icon-action ${coach.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                        title={coach.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            id: coach.id,
                            isActive: !coach.isActive,
                          })
                        }
                      >
                        {coach.isActive ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
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
              إجمالي المدربين: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
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

      {/* Modal Dialog for Add / Edit Coach */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCoach ? 'تعديل بيانات المدرب' : 'إضافة مدرب جديد'}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label" htmlFor="coach-name">
                    اسم المدرب بالكامل <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="coach-name"
                    type="text"
                    className="form-input"
                    placeholder="مثال: كابتن أحمد محمود"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="coach-phone">
                    رقم الهاتف <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="coach-phone"
                    type="tel"
                    className="form-input"
                    placeholder="01012345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={isSaving}
                    dir="ltr"
                    style={{ textAlign: 'end' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="coach-hire-date">
                    تاريخ التعيين <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="coach-hire-date"
                    type="date"
                    className="form-input"
                    value={hireDate}
                    onChange={(e) => setHireDate(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="coach-notes">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    id="coach-notes"
                    className="form-input"
                    rows={3}
                    placeholder="أي ملاحظات خاصة بالمدرب أو تخصصه..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-add"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="spinner" />
                      <span>جاري الحفظ...</span>
                    </>
                  ) : (
                    <span>{editingCoach ? 'حفظ التعديلات' : 'إضافة المدرب'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

