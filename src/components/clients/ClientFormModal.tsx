import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  clientsApi,
  clientKeys,
  type Client,
  type CreateClientPayload,
  type UpdateClientPayload,
} from '../../modules/clients';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface ClientFormModalProps {
  isOpen: boolean;
  editingClient: Client | null;
  onClose: () => void;
}

export const ClientFormModal = ({ isOpen, editingClient, onClose }: ClientFormModalProps) => {
  useModalEscape(onClose, isOpen);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2000-01-01');

  useEffect(() => {
    if (editingClient) {
      setFullName(editingClient.fullName);
      setPhoneNumber(editingClient.phoneNumber);
      setDateOfBirth(editingClient.dateOfBirth ? editingClient.dateOfBirth.split('T')[0] : '2000-01-01');
    } else {
      setFullName('');
      setPhoneNumber('');
      setDateOfBirth('2000-01-01');
    }
  }, [editingClient, isOpen]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      showToast.success('تم تسجيل العميل بنجاح');
      onClose();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل العميل، يرجى المحاولة لاحقاً');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateClientPayload }) =>
      clientsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      showToast.success('تم تحديث بيانات العميل بنجاح');
      onClose();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تحديث بيانات العميل');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { showToast.warning('يرجى كتابة اسم العميل بالكامل'); return; }
    if (!phoneNumber.trim()) { showToast.warning('يرجى إدخال رقم الهاتف'); return; }
    if (!dateOfBirth) { showToast.warning('يرجى تحديد تاريخ الميلاد'); return; }
    const payload = { fullName: fullName.trim(), phoneNumber: phoneNumber.trim(), dateOfBirth };
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
          <h3 className="modal-title">{editingClient ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="client-name">
                اسم العميل بالكامل <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input id="client-name" type="text" className="form-input" placeholder="مثال: حماده فتوح"
                value={fullName} onChange={(e) => setFullName(e.target.value)} required disabled={isSaving} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="client-phone">
                رقم الهاتف <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input id="client-phone" type="tel" className="form-input" placeholder="01012345678"
                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                required disabled={isSaving} dir="ltr" style={{ textAlign: 'end' }} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="client-dob">
                تاريخ الميلاد <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input id="client-dob" type="date" className="form-input"
                value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required disabled={isSaving} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>إلغاء</button>
            <button type="submit" className="btn-add" disabled={isSaving}>
              {isSaving ? <><div className="spinner" /><span>جاري الحفظ...</span></> : <span>{editingClient ? 'حفظ التعديلات' : 'إضافة العميل'}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
