import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, QrCode } from 'lucide-react';
import {
  clientsApi,
  clientKeys,
  type Client,
  type CreateClientPayload,
  type UpdateClientPayload,
} from '../../modules/clients';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface ClientFormModalProps {
  isOpen: boolean;
  editingClient: Client | null;
  onClose: () => void;
}

export const ClientFormModal = ({ isOpen, editingClient, onClose }: ClientFormModalProps) => {
  useModalEscape(onClose, isOpen);
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    if (editingClient) {
      setFullName(editingClient.fullName || '');
      setPhoneNumber(editingClient.phoneNumber || '');
      setBarcode(editingClient.barcode || '');
      setDateOfBirth(
        editingClient.dateOfBirth ? editingClient.dateOfBirth.split('T')[0] : ''
      );
    } else {
      setFullName('');
      setPhoneNumber('');
      setBarcode('');
      setDateOfBirth('');
    }
  }, [editingClient, isOpen]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    meta: { invalidate: clientKeys.all },
    onSuccess: async () => {
      showToast.success('تم تسجيل العميل بنجاح');
      await queryClient.invalidateQueries({ queryKey: clientKeys.all });
      onClose();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل العميل، يرجى المحاولة لاحقاً');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateClientPayload }) =>
      clientsApi.update(id, payload),
    meta: { invalidate: clientKeys.all },
    onSuccess: async () => {
      showToast.success('تم تحديث بيانات العميل بنجاح');
      await queryClient.invalidateQueries({ queryKey: clientKeys.all });
      onClose();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تحديث بيانات العميل');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast.warning('يرجى كتابة اسم العميل بالكامل');
      return;
    }
    if (!phoneNumber.trim()) {
      showToast.warning('يرجى إدخال رقم الهاتف');
      return;
    }
    if (!barcode.trim()) {
      showToast.warning('يرجى إدخال كود الباركود الخاص بالعميل');
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      barcode: barcode.trim(),
      dateOfBirth: dateOfBirth ? dateOfBirth : null,
    };

    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">
            {editingClient ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="client-name">
                اسم العميل بالكامل <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="client-name"
                type="text"
                className="form-input"
                placeholder="مثال: حماده فتوح"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="client-barcode">
                الباركود (كود العضوية) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="client-barcode"
                  type="text"
                  className="form-input"
                  placeholder="مثال: CL-3456789 أو مرر القارئ"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  required
                  disabled={isSaving}
                  dir="ltr"
                  style={{ textAlign: 'start', paddingInlineEnd: '2.5rem' }}
                />
                <QrCode
                  size={18}
                  style={{
                    position: 'absolute',
                    insetInlineEnd: '0.75rem',
                    color: '#94a3b8',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="client-phone">
                رقم الهاتف <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="client-phone"
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
              <label className="form-label" htmlFor="client-dob">
                تاريخ الميلاد (اختياري)
              </label>
              <input
                id="client-dob"
                type="date"
                className="form-input"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                disabled={isSaving}
              />
            </div>
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
                <span>{editingClient ? 'حفظ التعديلات' : 'إضافة العميل'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
