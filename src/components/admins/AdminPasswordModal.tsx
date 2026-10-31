import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X, KeyRound } from 'lucide-react';
import { adminsApi, type AdminUser, type ResetAdminPasswordPayload } from '../../modules/admins';
import { showToast } from '../../lib/sonner';

interface AdminPasswordModalProps {
  admin: AdminUser | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal = ({
  admin,
  onClose,
  onSuccess,
}: AdminPasswordModalProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    setNewPassword('');
    setConfirmPassword('');
  }, [admin]);

  const passwordMutation = useMutation({
    mutationFn: (payload: ResetAdminPasswordPayload) => {
      if (!admin) throw new Error('No admin selected');
      return adminsApi.resetPassword(admin.id, payload);
    },
    onSuccess: () => {
      showToast.success('تم تغيير كلمة المرور بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في تغيير كلمة المرور');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      showToast.warning('يرجى إدخال كلمة المرور الجديدة');
      return;
    }

    if (newPassword.length < 6) {
      showToast.warning('يجب أن لا تقل كلمة المرور عن 6 أحرف أو أرقام');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast.warning('كلمتا المرور غير متطابقتين');
      return;
    }

    passwordMutation.mutate({ newPassword, confirmPassword });
  };

  if (!admin) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={20} color="#ff6b22" />
            <h3 className="modal-title">تغيير كلمة المرور</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1rem' }}>
              تعيين كلمة مرور جديدة للمسؤول: <strong>{admin.userName}</strong>
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="new-password">
                كلمة المرور الجديدة <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="new-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={passwordMutation.isPending}
                dir="ltr"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">
                تأكيد كلمة المرور الجديدة <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="confirm-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={passwordMutation.isPending}
                dir="ltr"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={passwordMutation.isPending}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-add"
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? (
                <>
                  <div className="spinner" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>تحديث كلمة المرور</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

