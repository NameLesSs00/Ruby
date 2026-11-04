import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
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
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { SubscriptionFormFields } from './SubscriptionFormFields';
import type { SelectOption } from '../ui/AsyncSearchableSelect';
import { useModalEscape } from '../../lib/useModalEscape';

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
  useModalEscape(onClose, isOpen);

  const [selectedClient, setSelectedClient] = useState<SelectOption | null>(null);
  const [clientType, setClientType] = useState<ClientType>('Academy');
  const [selectedCoach, setSelectedCoach] = useState<SelectOption | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>('Sessions');
  const [startDate, setStartDate] = useState(getTodayString());
  const [endDate, setEndDate] = useState(getOneMonthLaterString());
  const [totalSessions, setTotalSessions] = useState<number>(8);
  const [amount, setAmount] = useState<number | ''>('');
  const [discountAmount, setDiscountAmount] = useState<number | ''>(0);
  const [paidAmount, setPaidAmount] = useState<number | ''>(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingSubscription) {
      setSelectedClient({
        id: editingSubscription.clientId,
        label: editingSubscription.clientName,
      });
      setClientType(editingSubscription.clientType);
      if (editingSubscription.commissionCoachId) {
        setSelectedCoach({
          id: editingSubscription.commissionCoachId,
          label: editingSubscription.commissionCoachName || `مدرب #${editingSubscription.commissionCoachId}`,
        });
      } else {
        setSelectedCoach(null);
      }
      setSubscriptionType(editingSubscription.subscriptionType);
      setStartDate(editingSubscription.startDate.slice(0, 10));
      setEndDate(editingSubscription.endDate.slice(0, 10));
      setTotalSessions(editingSubscription.totalSessions || 0);
      setAmount(editingSubscription.amount);
      setDiscountAmount(editingSubscription.discountAmount);
      setPaidAmount(editingSubscription.paidAmount);
      setNotes(editingSubscription.notes || '');
    } else {
      setSelectedClient(null);
      setClientType('Academy');
      setSelectedCoach(null);
      setSubscriptionType('Sessions');
      setStartDate(getTodayString());
      setEndDate(getOneMonthLaterString());
      setTotalSessions(8);
      setAmount('');
      setDiscountAmount(0);
      setPaidAmount(0);
      setNotes('');
    }
  }, [editingSubscription, isOpen]);

  const createMutation = useMutation({
    mutationFn: (p: CreateSubscriptionPayload) => subscriptionsApi.create(p),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      showToast.success('تم إنشاء الاشتراك بنجاح');
      onSuccess();
    },
    onError: (err: unknown) =>
      showToast.apiError(err, 'فشل في إنشاء الاشتراك'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateSubscriptionPayload }) =>
      subscriptionsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
      showToast.success('تم تحديث بيانات الاشتراك بنجاح');
      onSuccess();
    },
    onError: (err: unknown) =>
      showToast.apiError(err, 'فشل في تحديث الاشتراك'),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const numAmount = Number(amount) || 0;
  const numDiscount = Number(discountAmount) || 0;
  const numPaid = Number(paidAmount) || 0;

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!editingSubscription && !selectedClient) {
      showToast.warning('يرجى اختيار العميل أولاً');
      return;
    }

    if (clientType === 'External' && !selectedCoach) {
      showToast.warning('يرجى اختيار مدرب العمولة للعميل الخارجي');
      return;
    }

    if (numAmount <= 0) {
      showToast.warning('يرجى إدخال مبلغ اشتراك صحيح');
      return;
    }

    const finalAmount = Math.max(0, numAmount - numDiscount);
    if (numPaid > finalAmount) {
      showToast.warning('المبلغ المدفوع لا يمكن أن يتجاوز صافي قيمة الاشتراك');
      return;
    }

    const payload = {
      clientType,
      subscriptionType,
      commissionCoachId: selectedCoach ? selectedCoach.id : null,
      startDate,
      endDate,
      totalSessions: Number(totalSessions),
      amount: numAmount,
      discountAmount: numDiscount,
      paidAmount: numPaid,
      notes: notes.trim() || null,
    };

    if (editingSubscription) {
      updateMutation.mutate({ id: editingSubscription.id, payload });
    } else {
      createMutation.mutate({ ...payload, clientId: selectedClient!.id });
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card"
        style={{ maxWidth: '640px', width: '95%' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 107, 34, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff6b22',
              }}
            >
              <Ticket size={20} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.15rem' }}>
                {editingSubscription ? 'تعديل بيانات الاشتراك' : 'تسجيل اشتراك جديد'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                تحديد العميل، نوع الخطة، الحصص، والمبالغ المالية
              </span>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: '74vh', overflowY: 'auto', padding: '1.1rem' }}>
            <SubscriptionFormFields
              editingSubscription={editingSubscription}
              selectedClient={selectedClient}
              setSelectedClient={setSelectedClient}
              clientType={clientType}
              setClientType={setClientType}
              selectedCoach={selectedCoach}
              setSelectedCoach={setSelectedCoach}
              subscriptionType={subscriptionType}
              setSubscriptionType={setSubscriptionType}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              totalSessions={totalSessions}
              setTotalSessions={setTotalSessions}
              amount={amount}
              setAmount={setAmount}
              discountAmount={discountAmount}
              setDiscountAmount={setDiscountAmount}
              paidAmount={paidAmount}
              setPaidAmount={setPaidAmount}
              notes={notes}
              setNotes={setNotes}
              isSaving={isSaving}
            />
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
                <span>{editingSubscription ? 'حفظ التعديلات' : 'تسجيل الاشتراك'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
