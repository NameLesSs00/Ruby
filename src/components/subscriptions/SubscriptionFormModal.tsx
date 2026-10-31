import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { X, Ticket } from 'lucide-react';
import {
  subscriptionsApi,
  subscriptionKeys,
  type Subscription,
  type ClientType,
  type SubscriptionType,
  type CreateSubscriptionPayload,
  type UpdateSubscriptionPayload,
} from '../../modules/subscriptions';
import { clientsApi } from '../../modules/clients';
import { coachesApi } from '../../modules/coaches';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { SubscriptionFormFields } from './SubscriptionFormFields';

interface SubscriptionFormModalProps {
  isOpen: boolean;
  editingSubscription: Subscription | null;
  onClose: () => void;
  onSuccess: () => void;
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}
function getOneMonthLaterString(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

export const SubscriptionFormModal = ({
  isOpen,
  editingSubscription,
  onClose,
  onSuccess,
}: SubscriptionFormModalProps) => {
  const [clientId, setClientId] = useState<number | ''>('');
  const [clientType, setClientType] = useState<ClientType>('Academy');
  const [commissionCoachId, setCommissionCoachId] = useState<number | ''>('');
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>('Sessions');
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getOneMonthLaterString());
  const [totalSessions, setTotalSessions] = useState<number>(8);
  const [amount, setAmount] = useState<number | ''>('');
  const [discountAmount, setDiscountAmount] = useState<number | ''>(0);
  const [paidAmount, setPaidAmount] = useState<number | ''>(0);
  const [notes, setNotes] = useState('');

  const { data: clientsData } = useQuery({
    queryKey: ['clients', 'dropdown-list'],
    queryFn: () => clientsApi.getAll({ page: 1, pageSize: 100 }),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  const { data: coachesData } = useQuery({
    queryKey: ['coaches', 'dropdown-list'],
    queryFn: () => coachesApi.getAll({ page: 1, pageSize: 100 }),
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (editingSubscription) {
      setClientId(editingSubscription.clientId);
      setClientType(editingSubscription.clientType);
      setCommissionCoachId(editingSubscription.commissionCoachId || '');
      setSubscriptionType(editingSubscription.subscriptionType);
      setStartDate(editingSubscription.startDate.slice(0, 10));
      setEndDate(editingSubscription.endDate.slice(0, 10));
      setTotalSessions(editingSubscription.totalSessions || 0);
      setAmount(editingSubscription.amount);
      setDiscountAmount(editingSubscription.discountAmount);
      setPaidAmount(editingSubscription.paidAmount);
      setNotes(editingSubscription.notes || '');
    } else {
      setClientId(''); setClientType('Academy'); setCommissionCoachId('');
      setSubscriptionType('Sessions'); setStartDate(getTodayString());
      setEndDate(getOneMonthLaterString()); setTotalSessions(8);
      setAmount(''); setDiscountAmount(0); setPaidAmount(0); setNotes('');
    }
  }, [editingSubscription, isOpen]);

  const createMutation = useMutation({
    mutationFn: (p: CreateSubscriptionPayload) => subscriptionsApi.create(p),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      showToast.success('تم إنشاء الاشتراك بنجاح');
      onSuccess();
    },
    onError: (err: any) => showToast.error(err.response?.data?.message || err.response?.data?.error || 'فشل في إنشاء الاشتراك'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSubscriptionPayload }) =>
      subscriptionsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      showToast.success('تم تحديث بيانات الاشتراك بنجاح');
      onSuccess();
    },
    onError: (err: any) => showToast.error(err.response?.data?.message || err.response?.data?.error || 'فشل في تحديث الاشتراك'),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const numAmount = Number(amount) || 0;
  const numDiscount = Number(discountAmount) || 0;
  const numPaid = Number(paidAmount) || 0;

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingSubscription && !clientId) { showToast.warning('يرجى اختيار العميل'); return; }
    if (clientType === 'External' && !commissionCoachId) { showToast.warning('يرجى اختيار مدرب العمولة للعميل الخارجي'); return; }
    if (numAmount <= 0) { showToast.warning('يرجى إدخال مبلغ اشتراك صحيح'); return; }
    const finalAmount = Math.max(0, numAmount - numDiscount);
    if (numPaid > finalAmount) { showToast.warning('المبلغ المدفوع لا يمكن أن يتجاوز صافي قيمة الاشتراك'); return; }

    const payload = {
      clientType, subscriptionType,
      commissionCoachId: commissionCoachId ? Number(commissionCoachId) : null,
      startDate, endDate,
      totalSessions: subscriptionType === 'Duration' ? 0 : Number(totalSessions),
      amount: numAmount, discountAmount: numDiscount, paidAmount: numPaid,
      notes: notes.trim() || null,
    };

    if (editingSubscription) {
      updateMutation.mutate({ id: editingSubscription.id, payload });
    } else {
      createMutation.mutate({ ...payload, clientId: Number(clientId) });
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 38, height: 38, borderRadius: '8px', backgroundColor: '#F3702315',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F37023',
            }}>
              <Ticket size={20} />
            </div>
            <h3 className="modal-title" style={{ margin: 0 }}>
              {editingSubscription ? 'تعديل بيانات الاشتراك' : 'تسجيل اشتراك جديد'}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            <SubscriptionFormFields
              editingSubscription={editingSubscription}
              clients={clientsData?.items || []}
              coaches={coachesData?.items || []}
              clientId={clientId} setClientId={setClientId}
              clientType={clientType} setClientType={setClientType}
              commissionCoachId={commissionCoachId} setCommissionCoachId={setCommissionCoachId}
              subscriptionType={subscriptionType} setSubscriptionType={setSubscriptionType}
              startDate={startDate} setStartDate={setStartDate}
              endDate={endDate} setEndDate={setEndDate}
              totalSessions={totalSessions} setTotalSessions={setTotalSessions}
              amount={amount} setAmount={setAmount}
              discountAmount={discountAmount} setDiscountAmount={setDiscountAmount}
              paidAmount={paidAmount} setPaidAmount={setPaidAmount}
              notes={notes} setNotes={setNotes}
              isSaving={isSaving}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>إلغاء</button>
            <button type="submit" className="btn-add" disabled={isSaving}>
              {isSaving ? <><div className="spinner" /><span>جاري الحفظ...</span></> : <span>{editingSubscription ? 'حفظ التعديلات' : 'تسجيل الاشتراك'}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
