import { useState, useEffect, useMemo, type FormEvent, type CSSProperties } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, AlertCircle, Receipt, Wallet, Info, CheckCircle2, DollarSign } from 'lucide-react';
import {
  coachPaymentsApi, coachPaymentKeys, coachDuesApi, coachDueKeys,
  generateCoachPaymentIdempotencyKey, type CoachPaymentType,
} from '../../modules/coachDues';
import { coachesApi } from '../../modules/coaches';
import { AsyncSearchableSelect, type SelectOption } from '../ui/AsyncSearchableSelect';
import { cashTransactionKeys } from '../../modules/cashTransactions';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';
import { blockInvalidNumberKeys } from '../../lib/number-input';

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
  isOpen, initialCoachId, initialCoachDueId, initialRemainingAmount,
  initialPaymentType = 'DuePayment', onClose, onSuccess,
}: RecordCoachPaymentModalProps) => {
  useModalEscape(onClose, isOpen);
  const queryClient = useQueryClient();

  const [paymentType, setPaymentType] = useState<CoachPaymentType>(initialPaymentType);
  const [selectedCoach, setSelectedCoach] = useState<SelectOption | null>(null);
  const [selectedDueId, setSelectedDueId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const { data: coachDuesData, isLoading: isLoadingDues } = useQuery({
    queryKey: coachDueKeys.list({ coachId: selectedCoach?.id, page: 1, pageSize: 50 }),
    queryFn: () => coachDuesApi.getAll({ coachId: selectedCoach?.id, page: 1, pageSize: 50 }),
    enabled: isOpen && paymentType === 'DuePayment' && Boolean(selectedCoach?.id),
  });

  const dues = useMemo(() => (coachDuesData?.items || []).filter((d) => d.remainingAmount > 0), [coachDuesData]);

  useEffect(() => {
    if (!isOpen) return;
    setPaymentType(initialCoachDueId ? 'DuePayment' : initialPaymentType);
    setSelectedDueId(initialCoachDueId || null);
    setAmount(initialRemainingAmount ? initialRemainingAmount.toString() : '');
    setNotes('');

    if (initialCoachId) {
      coachesApi.getById(initialCoachId)
        .then((c) => setSelectedCoach({ id: c.id, label: c.fullName, subLabel: `هاتف: ${c.phoneNumber}`, tag: 'مدرب' }))
        .catch(() => setSelectedCoach({ id: initialCoachId, label: `مدرب #${initialCoachId}` }));
    } else {
      setSelectedCoach(null);
    }
  }, [isOpen, initialCoachId, initialCoachDueId, initialRemainingAmount, initialPaymentType]);

  const activeDue = dues.find((d) => d.id === selectedDueId);

  const mutation = useMutation({
    mutationFn: coachPaymentsApi.create,
    meta: { invalidate: [coachPaymentKeys.all, coachDueKeys.all, cashTransactionKeys.all] },
    onSuccess: async (res) => {
      showToast.success(res.message || 'تم تسجيل عملية الصرف بنجاح');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: coachPaymentKeys.all }),
        queryClient.invalidateQueries({ queryKey: coachDueKeys.all }),
        queryClient.invalidateQueries({ queryKey: cashTransactionKeys.all }),
      ]);
      onSuccess();
    },
    onError: (err: unknown) => showToast.apiError(err, 'فشل في تسجيل عملية الصرف للمدرب'),
  });

  if (!isOpen) return null;

  const loadCoaches = async (query: string): Promise<SelectOption[]> => {
    const res = await coachesApi.getAll({ search: query.trim() || undefined, page: 1, pageSize: 20 });
    return (res.items || []).map((c) => ({ id: c.id, label: c.fullName, subLabel: `هاتف: ${c.phoneNumber}`, tag: 'مدرب' }));
  };

  const handleSelectPaymentType = (type: CoachPaymentType) => {
    if (mutation.isPending) return;
    setPaymentType(type);
    if (type === 'Advance') {
      setSelectedDueId(null);
    } else if (initialCoachDueId) {
      setSelectedDueId(initialCoachDueId);
      if (initialRemainingAmount) setAmount(initialRemainingAmount.toString());
    } else if (dues.length > 0 && !selectedDueId) {
      setSelectedDueId(dues[0].id);
      setAmount(dues[0].remainingAmount.toString());
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return showToast.warning('يرجى اختيار المدرب أولاً');
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return showToast.warning('يرجى إدخال مبلغ صحيح أكبر من الصفر');
    if (paymentType === 'DuePayment') {
      if (!selectedDueId) return showToast.warning('يرجى اختيار المستحق المراد سداده');
      if (activeDue && amountNum > activeDue.remainingAmount) {
        return showToast.warning(`المبلغ المدخل (${amountNum} ج.م) يتجاوز الرصيد المتبقي للمستحق (${activeDue.remainingAmount} ج.م)`);
      }
    }
    mutation.mutate({
      coachId: selectedCoach.id, paymentType, coachDueId: paymentType === 'DuePayment' ? selectedDueId : null,
      amount: amountNum, notes: notes.trim() || undefined, idempotencyKey: generateCoachPaymentIdempotencyKey(),
    });
  };

  const cardBtnStyle = (isActive: boolean, activeBorder: string, activeBg: string, activeColor: string): CSSProperties => ({
    padding: '0.75rem', borderRadius: 'var(--radius-md)', border: `2px solid ${isActive ? activeBorder : '#e2e8f0'}`,
    backgroundColor: isActive ? activeBg : '#ffffff', color: isActive ? activeColor : '#475569',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
    cursor: mutation.isPending ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: mutation.isPending ? 0.6 : 1,
  });

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '10px', backgroundColor: '#FFF7ED', color: '#F37023', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="modal-title">صرف دفعة أو سلفة للمدرب</h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>تسجيل حركة صرف نقدية وسداد مستحقات الكادر التدريبي</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Payment Type Switcher Cards */}
            <div className="form-group">
              <label className="form-label required">نوع عملية الصرف</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => handleSelectPaymentType('DuePayment')}
                  disabled={mutation.isPending}
                  style={cardBtnStyle(paymentType === 'DuePayment', '#F37023', '#FFF7ED', '#C2410C')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Receipt size={16} color={paymentType === 'DuePayment' ? '#F37023' : '#64748b'} />
                    <span>سداد مستحق سابق</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: paymentType === 'DuePayment' ? '#9A3412' : '#94a3b8' }}>خصم من مستحقات مسجلة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPaymentType('Advance')}
                  disabled={mutation.isPending}
                  style={cardBtnStyle(paymentType === 'Advance', '#0D1527', '#F8FAFC', '#0D1527')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Wallet size={16} color={paymentType === 'Advance' ? '#0D1527' : '#64748b'} />
                    <span>صرف سلفة نقدية</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: paymentType === 'Advance' ? '#334155' : '#94a3b8' }}>دفعة مقدمة تُقيد كسلفة</span>
                </button>
              </div>
            </div>

            {/* Coach Selector */}
            <div className="form-group">
              <label className="form-label required">المدرب المستفيد</label>
              <AsyncSearchableSelect
                selectedItem={selectedCoach}
                onChange={(coach) => {
                  setSelectedCoach(coach);
                  setSelectedDueId(null);
                  if (paymentType === 'DuePayment') setAmount('');
                }}
                loadOptions={loadCoaches}
                placeholder="ابحث باسم المدرب أو الهاتف..."
                disabled={Boolean(initialCoachId) || mutation.isPending}
              />
            </div>

            {/* Target Due Selector (When DuePayment) */}
            {paymentType === 'DuePayment' && (
              <div className="form-group">
                <label className="form-label required">المستحق المراد سداده</label>
                {!selectedCoach ? (
                  <div style={{ padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Info size={15} color="#36C5F0" />
                    <span>يرجى اختيار المدرب أولاً لعرض مستحقاته</span>
                  </div>
                ) : isLoadingDues ? (
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>جاري تحميل مستحقات المدرب...</div>
                ) : dues.length === 0 ? (
                  <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                      <AlertCircle size={15} />
                      <span>لا توجد مستحقات مالية غير مسددة لهذا المدرب</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectPaymentType('Advance')}
                      style={{ alignSelf: 'flex-start', background: '#fef3c7', border: '1px solid #fde68a', padding: '0.2rem 0.5rem', borderRadius: '5px', color: '#b45309', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      التحويل إلى صرف سلفة نقدية بدلاً من ذلك ⬅
                    </button>
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
                    disabled={mutation.isPending}
                  >
                    <option value="">اختر المستحق...</option>
                    {dues.map((d) => (
                      <option key={d.id} value={d.id}>مستحق #{d.id} — {d.description} (المتبقي: {d.remainingAmount} ج.م)</option>
                    ))}
                  </select>
                )}

                {activeDue && (
                  <div style={{ marginTop: '0.3rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                    <span style={{ color: '#64748b' }}>إجمالي: <strong>{activeDue.amount} ج.م</strong></span>
                    <span style={{ color: '#64748b' }}>المدفوع: <strong>{activeDue.paidAmount} ج.م</strong></span>
                    <span style={{ backgroundColor: '#FEF3C7', color: '#92400e', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      المتبقي: {activeDue.remainingAmount} ج.م
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Advance Note Banner */}
            {paymentType === 'Advance' && (
              <div style={{ padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', color: '#166534', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Info size={16} color="#15803d" />
                <span>سيتم صرف السلفة كحركة نقدية فورية للمدرب من الخزينة، وتُقيد في حساب سلف المدرب.</span>
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
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={blockInvalidNumberKeys}
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
            <button
              type="submit"
              className="btn-primary"
              disabled={mutation.isPending || !selectedCoach || !amount || parseFloat(amount) <= 0}
            >
              {mutation.isPending ? (
                <>
                  <div className="spinner" />
                  <span>جاري تسجيل الصرف...</span>
                </>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} />
                  <span>{paymentType === 'Advance' ? 'تأكيد صرف السلفة' : 'تأكيد سداد المستحق'}</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
