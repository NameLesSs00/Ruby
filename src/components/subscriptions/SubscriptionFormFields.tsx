import type { Dispatch, SetStateAction } from 'react';
import type { Client } from '../../modules/clients';
import type { Coach } from '../../modules/coaches';
import type {
  Subscription,
  ClientType,
  SubscriptionType,
} from '../../modules/subscriptions';

interface Props {
  editingSubscription: Subscription | null;
  clients: Client[];
  coaches: Coach[];
  clientId: number | '';
  setClientId: Dispatch<SetStateAction<number | ''>>;
  clientType: ClientType;
  setClientType: Dispatch<SetStateAction<ClientType>>;
  commissionCoachId: number | '';
  setCommissionCoachId: Dispatch<SetStateAction<number | ''>>;
  subscriptionType: SubscriptionType;
  setSubscriptionType: Dispatch<SetStateAction<SubscriptionType>>;
  startDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: Dispatch<SetStateAction<string>>;
  totalSessions: number;
  setTotalSessions: Dispatch<SetStateAction<number>>;
  amount: number | '';
  setAmount: Dispatch<SetStateAction<number | ''>>;
  discountAmount: number | '';
  setDiscountAmount: Dispatch<SetStateAction<number | ''>>;
  paidAmount: number | '';
  setPaidAmount: Dispatch<SetStateAction<number | ''>>;
  notes: string;
  setNotes: Dispatch<SetStateAction<string>>;
  isSaving: boolean;
}

export const SubscriptionFormFields = ({
  editingSubscription, clients, coaches,
  clientId, setClientId, clientType, setClientType,
  commissionCoachId, setCommissionCoachId,
  subscriptionType, setSubscriptionType,
  startDate, setStartDate, endDate, setEndDate,
  totalSessions, setTotalSessions,
  amount, setAmount, discountAmount, setDiscountAmount,
  paidAmount, setPaidAmount, notes, setNotes,
  isSaving,
}: Props) => {
  const numAmount = Number(amount) || 0;
  const numDiscount = Number(discountAmount) || 0;
  const numPaid = Number(paidAmount) || 0;
  const finalAmount = Math.max(0, numAmount - numDiscount);
  const remainingAmount = Math.max(0, finalAmount - numPaid);

  return (
    <>
      {/* Client Selection (create only) */}
      {!editingSubscription ? (
        <div className="form-group">
          <label className="form-label" htmlFor="sub-client">
            العميل <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            id="sub-client"
            className="select-filter"
            style={{ width: '100%' }}
            value={clientId}
            onChange={(e) => setClientId(e.target.value ? Number(e.target.value) : '')}
            required
            disabled={isSaving}
          >
            <option value="">— اختر العميل —</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.fullName} ({c.phoneNumber})</option>
            ))}
          </select>
        </div>
      ) : (
        <div style={{ padding: '0.6rem 0.75rem', backgroundColor: '#F8FAFC', borderRadius: '6px', fontSize: '0.9rem' }}>
          <span style={{ color: '#64748B' }}>العميل: </span>
          <strong style={{ color: '#0D1527' }}>{editingSubscription.clientName}</strong>
        </div>
      )}

      {/* Client Type & Commission Coach */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="sub-client-type">نوع العميل <span style={{ color: '#ef4444' }}>*</span></label>
          <select
            id="sub-client-type"
            className="select-filter"
            style={{ width: '100%' }}
            value={clientType}
            onChange={(e) => setClientType(e.target.value as ClientType)}
            disabled={isSaving}
          >
            <option value="Academy">أكاديمية (Academy)</option>
            <option value="External">خارجي (External)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sub-coach">
            مدرب العمولة {clientType === 'External'
              ? <span style={{ color: '#ef4444' }}>*</span>
              : <span style={{ color: '#94A3B8', fontSize: '0.73rem' }}>(اختياري)</span>}
          </label>
          <select
            id="sub-coach"
            className="select-filter"
            style={{ width: '100%' }}
            value={commissionCoachId}
            onChange={(e) => setCommissionCoachId(e.target.value ? Number(e.target.value) : '')}
            required={clientType === 'External'}
            disabled={isSaving}
          >
            <option value="">{clientType === 'External' ? '— اختر مدرب العمولة —' : 'بدون مدرب عمولة'}</option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>{coach.fullName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subscription Type & Sessions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="sub-type">نوع الاشتراك <span style={{ color: '#ef4444' }}>*</span></label>
          <select
            id="sub-type"
            className="select-filter"
            style={{ width: '100%' }}
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value as SubscriptionType)}
            disabled={isSaving}
          >
            <option value="Sessions">بالحصص (Sessions)</option>
            <option value="Duration">بالمدة الزمنية (Duration)</option>
            <option value="PrivateTraining">تدريب خاص (Private)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="sub-sessions">
            إجمالي الحصص{' '}
            {subscriptionType === 'Duration'
              ? <span style={{ color: '#94A3B8', fontSize: '0.73rem' }}>(غير مفعل)</span>
              : <span style={{ color: '#ef4444' }}>*</span>}
          </label>
          <input
            id="sub-sessions"
            type="number"
            min="1"
            className="form-input"
            value={subscriptionType === 'Duration' ? 0 : totalSessions}
            onChange={(e) => setTotalSessions(Number(e.target.value))}
            disabled={isSaving || subscriptionType === 'Duration'}
            required={subscriptionType !== 'Duration'}
          />
        </div>
      </div>

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="sub-start">تاريخ البدء <span style={{ color: '#ef4444' }}>*</span></label>
          <input id="sub-start" type="date" className="form-input" value={startDate}
            onChange={(e) => setStartDate(e.target.value)} required disabled={isSaving} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="sub-end">تاريخ الانتهاء <span style={{ color: '#ef4444' }}>*</span></label>
          <input id="sub-end" type="date" className="form-input" value={endDate}
            onChange={(e) => setEndDate(e.target.value)} required disabled={isSaving} />
        </div>
      </div>

      {/* Financials */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="sub-amount">قيمة الاشتراك <span style={{ color: '#ef4444' }}>*</span></label>
          <input id="sub-amount" type="number" min="0" step="any" className="form-input" placeholder="0.00"
            value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
            required disabled={isSaving} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="sub-discount">الخصم</label>
          <input id="sub-discount" type="number" min="0" step="any" className="form-input" placeholder="0.00"
            value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={isSaving} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="sub-paid">المدفوع نقداً</label>
          <input id="sub-paid" type="number" min="0" step="any" className="form-input" placeholder="0.00"
            value={paidAmount} onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={isSaving} />
        </div>
      </div>

      {/* Live Financial Summary */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem',
        backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px',
        border: '1px solid #E2E8F0', textAlign: 'center',
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>الصافي المستحق</span>
          <strong style={{ fontSize: '1rem', color: '#0D1527' }}>{finalAmount.toLocaleString()} ج.م</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>المتبقي بعد السداد</span>
          <strong style={{ fontSize: '1rem', color: remainingAmount > 0 ? '#EF4444' : '#10B981' }}>
            {remainingAmount.toLocaleString()} ج.م
          </strong>
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label" htmlFor="sub-notes">ملاحظات إضافية</label>
        <textarea id="sub-notes" className="form-input" rows={2} placeholder="ملاحظات اختيارية..."
          value={notes} onChange={(e) => setNotes(e.target.value)}
          disabled={isSaving} style={{ resize: 'vertical' }} />
      </div>
    </>
  );
};

