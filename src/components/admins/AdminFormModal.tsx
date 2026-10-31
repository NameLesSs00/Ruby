import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  adminsApi,
  adminKeys,
  type AdminUser,
  type CreatableAdminRole,
  type CreateAdminPayload,
  type UpdateAdminPayload,
} from '../../modules/admins';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface AdminFormModalProps {
  isOpen: boolean;
  editingAdmin: AdminUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminFormModal = ({
  isOpen,
  editingAdmin,
  onClose,
  onSuccess,
}: AdminFormModalProps) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<CreatableAdminRole>('ReceptionAdmin');

  useEffect(() => {
    if (editingAdmin) {
      setUserName(editingAdmin.userName);
      setEmail(editingAdmin.email);
      setPassword('');
    } else {
      setUserName('');
      setEmail('');
      setPassword('');
      setRole('ReceptionAdmin');
    }
  }, [editingAdmin, isOpen]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminPayload) => adminsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      showToast.success('تمت إضافة المسؤول بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في إضافة المسؤول');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdminPayload }) =>
      adminsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
      showToast.success('تم تحديث بيانات المسؤول بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تحديث بيانات المسؤول');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) {
      showToast.warning('يرجى كتابة اسم المستخدم');
      return;
    }

    if (!email.trim()) {
      showToast.warning('يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (!editingAdmin && !password) {
      showToast.warning('يرجى إدخال كلمة المرور');
      return;
    }

    if (editingAdmin) {
      updateMutation.mutate({
        id: editingAdmin.id,
        payload: { userName: userName.trim(), email: email.trim() },
      });
    } else {
      createMutation.mutate({
        userName: userName.trim(),
        email: email.trim(),
        password,
        role,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingAdmin ? 'تعديل بيانات المسؤول' : 'إضافة مسؤول جديد'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="admin-username">
                اسم المستخدم <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="admin-username"
                type="text"
                className="form-input"
                placeholder="مثال: ahmed_reception"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">
                البريد الإلكتروني <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                placeholder="example@academy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSaving}
                dir="ltr"
                style={{ textAlign: 'end' }}
              />
            </div>

            {!editingAdmin && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="admin-role">
                    الدور والصلاحية <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <select
                    id="admin-role"
                    className="select-filter"
                    style={{ width: '100%' }}
                    value={role}
                    onChange={(e) => setRole(e.target.value as CreatableAdminRole)}
                    disabled={isSaving}
                  >
                    <option value="ReceptionAdmin">مسؤول استقبال (ReceptionAdmin)</option>
                    <option value="ShopAdmin">مسؤول متجر (ShopAdmin)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="admin-password">
                    كلمة المرور <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    className="form-input"
                    placeholder="كلمة مرور قوية (مثال: Pola123!)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSaving}
                    dir="ltr"
                  />
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              إلغاء
            </button>
            <button type="submit" className="btn-add" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="spinner" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{editingAdmin ? 'حفظ التعديلات' : 'إضافة المسؤول'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

