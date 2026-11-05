import { useState, useEffect, type FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DollarSign, X, AlertCircle } from 'lucide-react';
import {
  coachPaymentsApi,
  coachPaymentKeys,
  coachDuesApi,
  coachDueKeys,
  generateCoachPaymentIdempotencyKey,
  type CoachPaymentType,
} from '../../modules/coachDues';
import { coachesApi } from '../../modules/coaches';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface RecordCoachPaymentModalProps {
  isOpen: boolean;
  initialCoachId?: number;
  initialCoachDueId?: number;
  initialRemainingAmount?: number;
  initialPaymentType?: CoachPaymentType;
  onClose: () => void;
  onSuccess: () => void;
}

export const RecordCoachPaymentModal = ({
  isOpen,
  initialCoachId,
  initialCoachDueId,
  initialRemainingAmount,
  initialPaymentType = 'DuePayment',
  onClose,
  onSuccess,
}: RecordCoachPaymentModalProps) => {
  useModalEscape(onClose, isOpen);

  const [paymentType, setPaymentType] = useState<CoachPaymentType>(initialPaymentType);
  const [selectedCoach, setSelectedCoach] = useState<SelectOption | null>(null);
  const [selectedDueId, setSelectedDueId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch dues for selected coach if paying a due
  const { data: coachDuesData, isLoading: isLoadingDues } = useQuery({
    queryKey: coachDueKeys.list({ coachId: selectedCoach?.id, page: 1, pageSize: 50 }),
    queryFn: () => coachDuesApi.getAll({ coachId: selectedCoach?.id, page: 1, pageSize: 50 }),
    enabled: isOpen && paymentType === 'DuePayment' && Boolean(selectedCoach?.id),
  });

  const dues = (coachDuesData?.items || []).filter((d) => d.remainingAmount > 0);

  useEffect(() => {
    if (isOpen) {
      setPaymentType(initialCoachDueId ? 'DuePayment' : initialPaymentType);
      setSelectedDueId(initialCoachDueId || null);
      setAmount(initialRemainingAmount ? initialRemainingAmount.toString() : '');
      setNotes('');

      if (initialCoachId) {
        coachesApi.getById(initialCoachId).then((c) => {
          setSelectedCoach({
            id: c.id,
            label: c.fullName,
            subLabel: `هاتف: ${c.phoneNumber}`,
            tag: 'مدرب',
          });
        }).catch(() => {
          setSelectedCoach({ id: initialCoachId, label: `مدرب #${initialCoachId}` });
        });
      } else {
        setSelectedCoach(null);
      }
    }
  }, [isOpen, initialCoachId, initialCoachDueId, initialRemainingAmount, initialPaymentType]);

  const activeDue = dues.find((d) => d.id === selectedDueId);

  const mutation = useMutation({
    mutationFn: coachPaymentsApi.create,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: coachPaymentKeys.all });
      queryClient.invalidateQueries({ queryKey: coachDueKeys.all });
      showToast.success(res.message || 'تم تسجيل عملية الصرف بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تسجيل عملية الصرف للمدرب');
    },
  });

  if (!isOpen) return null;

  const loadCoaches = async (query: string): Promise<SelectOption[]> => {
    const res = await coachesApi.getAll({
      search: query.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((c) => ({
      id: c.id,
      label: c.fullName,
      subLabel: `هاتف: ${c.phoneNumber}`,
      tag: 'مدرب',
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) {
      showToast.warning('يرجى اختيار المدرب أولاً');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast.warning('يرجى إدخال مبلغ صحيح أكبر من الصفر');
      return;
    }

    if (paymentType === 'DuePayment') {
      if (!selectedDueId) {
        showToast.warning('يرجى اختيار المستحق المراد سداده');
        return;
      }
      if (activeDue && amountNum > activeDue.remainingAmount) {
        showToast.warning(
          `المبلغ المدخل (${amountNum} ج.م) يتجاوز الرصيد المتبقي للمستحق (${activeDue.remainingAmount} ج.م)`
        );
        return;
      }
    }

    const idempotencyKey = generateCoachPaymentIdempotencyKey();

    mutation.mutate({
      coachId: selectedCoach.id,
      paymentType,
      coachDueId: paymentType === 'DuePayment' ? selectedDueId : null,
      amount: amountNum,
      notes: notes.trim() || undefined,
      idempotencyKey,
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} />
            </div>
            <div>
              <h3 className="modal-title">صرف دفعة أو سلفة للمدرب</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>تسجيل حركة صرف نقدية وسداد مستحقات الكادر التدريبي</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Payment Type Switcher */}
            <div className="form-group">
              <label className="form-label required">نوع عملية الصرف</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setPaymentType('DuePayment')}
                  disabled={Boolean(initialCoachDueId) || mutation.isPending}
                  style={{
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentType === 'DuePayment' ? '#059669' : '#e2e8f0'}`,
                    backgroundColor: paymentType === 'DuePayment' ? '#ecfdf5' : '#ffffff',
                    color: paymentType === 'DuePayment' ? '#047857' : '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  سداد مستحق سابق
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentType('Advance');
                    setSelectedDueId(null);
                  }}
                  disabled={Boolean(initialCoachDueId) || mutation.isPending}
                  style={{
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${paymentType === 'Advance' ? '#0D1527' : '#e2e8f0'}`,
                    backgroundColor: paymentType === 'Advance' ? '#f1f5f9' : '#ffffff',
                    color: paymentType === 'Advance' ? '#0D1527' : '#64748b',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  صرف سلفة نقدية
                </button>
              </div>
            </div>

            {/* Coach Selector */}
            <div className="form-group">
              <label className="form-label required">المدرب المستفيد</label>
              <AsyncSearchableSelect
                selectedItem={selectedCoach}
                onChange={setSelectedCoach}
                loadOptions={loadCoaches}
                placeholder="ابحث باسم المدرب أو الهاتف..."
                disabled={Boolean(initialCoachId) || mutation.isPending}
              />
            </div>

            {/* Target Due Selector (When DuePayment) */}
            {paymentType === 'DuePayment' && (
              <div className="form-group">
                <label className="form-label required">المستحق المراد سداده</label>
                {isLoadingDues ? (
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>جاري تحميل مستحقات المدرب...</div>
                ) : dues.length === 0 ? (
                  <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <AlertCircle size={15} />
                    <span>لا توجد مستحقات مالية متبقية غير مسددة لهذا المدرب</span>
                  </div>
                ) : (
                  <select
                    className="form-input"
                    value={selectedDueId || ''}
                    onChange={(e) => {
                      const id = parseInt(e.target.value, 10);
                      setSelectedDueId(isNaN(id) ? null : id);
                      const due = dues.find((d) => d.id === id);
                      if (due) setAmount(due.remainingAmount.toString());
                    }}
                    required
                    disabled={Boolean(initialCoachDueId) || mutation.isPending}
                  >
                    <option value="">اختر المستحق...</option>
                    {dues.map((d) => (
                      <option key={d.id} value={d.id}>
                        مستحق #{d.id} — {d.description} (المتبقي: {d.remainingAmount} ج.م)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Amount */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label required">المبلغ المنصرف (ج.م)</label>
                {activeDue && (
                  <button
                    type="button"
                    onClick={() => setAmount(activeDue.remainingAmount.toString())}
                    style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    سداد كامل المتبقي ({activeDue.remainingAmount} ج.م)
                  </button>
                )}
              </div>
              <input
                type="number"
                step="any"
                min="0.01"
                max={activeDue ? activeDue.remainingAmount : undefined}
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={mutation.isPending}
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">ملاحظات الصرف (اختياري)</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: نقداً من الخزينة، إيصال رقم..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={mutation.isPending}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={mutation.isPending}>
              إلغاء
            </button>
            <button type="submit" className="btn-primary" disabled={mutation.isPending}>
              {mutation.isPending ? 'جاري تسجيل الصرف...' : 'تأكيد تسجيل الصرف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
