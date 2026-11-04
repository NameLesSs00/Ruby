import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import {
  coachesApi,
  coachKeys,
} from '../../modules/coaches';
import type { Coach, CreateCoachPayload, UpdateCoachPayload } from '../../modules/coaches';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

export interface CoachFormModalProps {
  isOpen: boolean;
  editingCoach: Coach | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CoachFormModal = ({ isOpen, editingCoach, onClose, onSuccess }: CoachFormModalProps) => {
  useModalEscape(onClose, isOpen);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [notes, setNotes] = useState('');

  // Sync form fields whenever the modal opens or the editing target changes
  useEffect(() => {
    if (editingCoach) {
      setFullName(editingCoach.fullName);
      setPhoneNumber(editingCoach.phoneNumber);
      setHireDate(editingCoach.hireDate ? editingCoach.hireDate.split('T')[0] : '');
      setNotes(editingCoach.notes || '');
    } else {
      setFullName('');
      setPhoneNumber('');
      setHireDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [editingCoach, isOpen]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateCoachPayload) => coachesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() });
      showToast.success('تمت إضافة المدرب بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في إضافة المدرب، يرجى المحاولة لاحقاً');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCoachPayload }) =>
      coachesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coachKeys.lists() });
      showToast.success('تم تحديث بيانات المدرب بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تحديث بيانات المدرب');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) { showToast.warning('يرجى كتابة اسم المدرب بالكامل'); return; }
    if (!phoneNumber.trim()) { showToast.warning('يرجى إدخال رقم هاتف المدرب'); return; }
    if (!hireDate) { showToast.warning('يرجى تحديد تاريخ التعيين'); return; }

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

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3 className="modal-title">
            {editingCoach ? 'تعديل بيانات المدرب' : 'إضافة مدرب جديد'}
          </h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Full name */}
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

            {/* Phone */}
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

            {/* Hire date */}
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

            {/* Notes */}
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
                <span>{editingCoach ? 'حفظ التعديلات' : 'إضافة المدرب'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
