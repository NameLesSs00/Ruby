import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  suppliersApi, supplierKeys,
  type Supplier, type CreateSupplierPayload, type UpdateSupplierPayload,
} from '../../modules/suppliers';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

interface SupplierFormModalProps {
  isOpen: boolean;
  editingSupplier: Supplier | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const SupplierFormModal = ({ isOpen, editingSupplier, onClose, onSuccess }: SupplierFormModalProps) => {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingSupplier) {
      setName(editingSupplier.name);
      setCompanyName(editingSupplier.companyName);
      setPhoneNumber(editingSupplier.phoneNumber);
      setAddress(editingSupplier.address || '');
      setNotes(editingSupplier.notes || '');
    } else {
      setName(''); setCompanyName(''); setPhoneNumber(''); setAddress(''); setNotes('');
    }
  }, [editingSupplier, isOpen]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateSupplierPayload) => suppliersApi.create(payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: supplierKeys.lists() }); showToast.success('تمت إضافة المورد بنجاح'); onSuccess(); },
    onError: (err: unknown) => { const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message; showToast.error(msg || 'فشل في إضافة المورد'); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSupplierPayload }) => suppliersApi.update(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: supplierKeys.lists() }); showToast.success('تم تحديث بيانات المورد بنجاح'); onSuccess(); },
    onError: (err: unknown) => { const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message; showToast.error(msg || 'فشل في تحديث بيانات المورد'); },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { showToast.warning('يرجى كتابة اسم مسؤول التوريد'); return; }
    if (!companyName.trim()) { showToast.warning('يرجى كتابة اسم الشركة أو المؤسسة'); return; }
    if (!phoneNumber.trim()) { showToast.warning('يرجى إدخال رقم الهاتف'); return; }
    const payload = { name: name.trim(), companyName: companyName.trim(), phoneNumber: phoneNumber.trim(), address: address.trim() || undefined, notes: notes.trim() || undefined };
    if (editingSupplier) { updateMutation.mutate({ id: editingSupplier.id, payload }); }
    else { createMutation.mutate(payload); }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{editingSupplier ? 'تعديل بيانات المورد' : 'إضافة مورد جديد'}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="supplier-name">اسم المسؤول / المندوب <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="supplier-name" type="text" className="form-input" placeholder="مثال: محمد السيد" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSaving} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="supplier-company">اسم الشركة / المؤسسة <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="supplier-company" type="text" className="form-input" placeholder="مثال: شركة النصر للمعدات الرياضية" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required disabled={isSaving} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="supplier-phone">رقم الهاتف <span style={{ color: '#ef4444' }}>*</span></label>
              <input id="supplier-phone" type="tel" className="form-input" placeholder="01012345678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required disabled={isSaving} dir="ltr" style={{ textAlign: 'end' }} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="supplier-address">العنوان / المقر</label>
              <input id="supplier-address" type="text" className="form-input" placeholder="مثال: القاهرة، مدينة نصر" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isSaving} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="supplier-notes">ملاحظات إضافية</label>
              <textarea id="supplier-notes" className="form-input" rows={3} placeholder="أي ملاحظات حول التوريد أو المنتجات..." value={notes} onChange={(e) => setNotes(e.target.value)} disabled={isSaving} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>إلغاء</button>
            <button type="submit" className="btn-add" disabled={isSaving}>
              {isSaving ? <><div className="spinner" /><span>جاري الحفظ...</span></> : <span>{editingSupplier ? 'حفظ التعديلات' : 'إضافة المورد'}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

