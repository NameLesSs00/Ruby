import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation, keepPreviousData } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Phone,
  MapPin,
  AlertCircle,
  AlertTriangle,
  Building,
} from 'lucide-react';
import {
  suppliersApi,
  supplierKeys,
  type Supplier,
  type CreateSupplierPayload,
  type UpdateSupplierPayload,
} from '../modules/suppliers';
import { queryClient } from '../lib/query-client';
import { showToast } from '../lib/sonner';

export const SuppliersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query suppliers
  const { data, isLoading, isError } = useQuery({
    queryKey: supplierKeys.list({ page, pageSize, search: debouncedSearch }),
    queryFn: () => suppliersApi.getAll({ page, pageSize, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (payload: CreateSupplierPayload) => suppliersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      showToast.success('تمت إضافة المورد بنجاح');
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في إضافة المورد، يرجى المحاولة لاحقاً');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSupplierPayload }) =>
      suppliersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      showToast.success('تم تحديث بيانات المورد بنجاح');
      handleCloseModal();
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في تحديث بيانات المورد');
    },
  });

  // Toggle status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      suppliersApi.updateStatus(id, isActive),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      showToast.success(
        variables.isActive
          ? 'تم تفعيل حساب المورد بنجاح'
          : 'تم تعطيل حساب المورد بنجاح'
      );
    },
    onError: () => {
      showToast.error('فشل في تعديل حالة المورد');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => suppliersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      showToast.success('تم حذف المورد بنجاح');
      setDeletingSupplier(null);
    },
    onError: (err: unknown) => {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(errorMsg || 'فشل في حذف المورد');
    },
  });

  const handleOpenCreateModal = () => {
    setEditingSupplier(null);
    setName('');
    setCompanyName('');
    setPhoneNumber('');
    setAddress('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setName(supplier.name);
    setCompanyName(supplier.companyName);
    setPhoneNumber(supplier.phoneNumber);
    setAddress(supplier.address || '');
    setNotes(supplier.notes || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast.warning('يرجى كتابة اسم مسؤول التوريد');
      return;
    }

    if (!companyName.trim()) {
      showToast.warning('يرجى كتابة اسم الشركة أو المؤسسة');
      return;
    }

    if (!phoneNumber.trim()) {
      showToast.warning('يرجى إدخال رقم الهاتف');
      return;
    }

    const payload = {
      name: name.trim(),
      companyName: companyName.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (editingSupplier) {
      updateMutation.mutate({ id: editingSupplier.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingSupplier) {
      deleteMutation.mutate(deletingSupplier.id);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const suppliers = data?.items || [];
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
            placeholder="البحث باسم المورد أو الشركة..."
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
          <span>إضافة مورد جديد</span>
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>المورد والشركة</th>
              <th>رقم الهاتف</th>
              <th>العنوان</th>
              <th>الملاحظات</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل قائمة الموردين...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                  <span>تعذر تحميل قائمة الموردين، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty-row">
                  <span>لا يوجد موردون مسجلون حالياً {debouncedSearch ? 'مطابقون للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>
                    <div className="coach-cell-name">
                      <div className="coach-avatar" style={{ backgroundColor: '#fff3ec', color: '#ea580c' }}>
                        <Building size={18} />
                      </div>
                      <div>
                        <div>{supplier.companyName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                          {supplier.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <Phone size={15} />
                      <span dir="ltr">{supplier.phoneNumber}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                      <MapPin size={15} />
                      <span>{supplier.address || '—'}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: supplier.notes ? '#334155' : '#94a3b8', fontSize: '0.85rem' }}>
                      {supplier.notes || 'لا توجد ملاحظات'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${supplier.isActive ? 'active' : 'inactive'}`}>
                      {supplier.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل بيانات المورد"
                        onClick={() => handleOpenEditModal(supplier)}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        className={`btn-icon-action ${supplier.isActive ? 'toggle-active' : 'toggle-inactive'}`}
                        title={supplier.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                        disabled={statusMutation.isPending}
                        onClick={() =>
                          statusMutation.mutate({
                            id: supplier.id,
                            isActive: !supplier.isActive,
                          })
                        }
                      >
                        {supplier.isActive ? (
                          <XCircle size={16} />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action delete"
                        title="حذف المورد"
                        onClick={() => setDeletingSupplier(supplier)}
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

        {/* Pagination Bar */}
        {!isLoading && totalCount > 0 && (
          <div className="pagination-wrapper">
            <span>
              إجمالي الموردين: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
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

      {/* Modal Dialog for Add / Edit Supplier */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingSupplier ? 'تعديل بيانات المورد' : 'إضافة مورد جديد'}
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
                  <label className="form-label" htmlFor="supplier-name">
                    اسم المسؤول / المندوب <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="supplier-name"
                    type="text"
                    className="form-input"
                    placeholder="مثال: محمد السيد"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="supplier-company">
                    اسم الشركة / المؤسسة <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="supplier-company"
                    type="text"
                    className="form-input"
                    placeholder="مثال: شركة النصر للمعدات الرياضية"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="supplier-phone">
                    رقم الهاتف <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="supplier-phone"
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
                  <label className="form-label" htmlFor="supplier-address">
                    العنوان / المقر
                  </label>
                  <input
                    id="supplier-address"
                    type="text"
                    className="form-input"
                    placeholder="مثال: القاهرة، مدينة نصر"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    disabled={isSaving}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="supplier-notes">
                    ملاحظات إضافية
                  </label>
                  <textarea
                    id="supplier-notes"
                    className="form-input"
                    rows={3}
                    placeholder="أي ملاحظات حول التوريد أو المنتجات..."
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
                    <span>{editingSupplier ? 'حفظ التعديلات' : 'إضافة المورد'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSupplier && (
        <div className="modal-backdrop" onClick={() => setDeletingSupplier(null)}>
          <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#ef4444' }}>
                تأكيد حذف المورد
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeletingSupplier(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="confirm-delete-box">
                <div className="delete-warning-icon">
                  <AlertTriangle size={32} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0d1527', marginBottom: '0.4rem' }}>
                    هل أنت متأكد من حذف المورد "{deletingSupplier.companyName}"؟
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    سيتم حذف سجل المورد من النظام بشكل نهائي.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setDeletingSupplier(null)}
                disabled={deleteMutation.isPending}
              >
                إلغاء
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="spinner" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <span>نعم، حذف المورد</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

