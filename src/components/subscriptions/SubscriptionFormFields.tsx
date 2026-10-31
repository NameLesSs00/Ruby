import type { Dispatch, SetStateAction } from 'react';
import {
  User,
  Coins,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type {
  Subscription,
  ClientType,
  SubscriptionType,
} from '../../modules/subscriptions';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { clientsApi } from '../../modules/clients';
import { coachesApi } from '../../modules/coaches';
import { SubscriptionPlanSection } from './SubscriptionPlanSection';

interface Props {
  editingSubscription: Subscription | null;
  selectedClient: SelectOption | null;
  setSelectedClient: Dispatch<SetStateAction<SelectOption | null>>;
  clientType: ClientType;
  setClientType: Dispatch<SetStateAction<ClientType>>;
  selectedCoach: SelectOption | null;
  setSelectedCoach: Dispatch<SetStateAction<SelectOption | null>>;
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
  editingSubscription,
  selectedClient,
  setSelectedClient,
  clientType,
  setClientType,
  selectedCoach,
  setSelectedCoach,
  subscriptionType,
  setSubscriptionType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  totalSessions,
  setTotalSessions,
  amount,
  setAmount,
  discountAmount,
  setDiscountAmount,
  paidAmount,
  setPaidAmount,
  notes,
  setNotes,
  isSaving,
}: Props) => {
  const numAmount = Number(amount) || 0;
  const numDiscount = Number(discountAmount) || 0;
  const numPaid = Number(paidAmount) || 0;
  const finalAmount = Math.max(0, numAmount - numDiscount);
  const remainingAmount = Math.max(0, finalAmount - numPaid);

  const loadClients = async (query: string): Promise<SelectOption[]> => {
    const res = await clientsApi.getAll({
      search: query.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((c) => ({
      id: c.id,
      label: c.fullName,
      subLabel: `هاتف: ${c.phoneNumber}`,
      tag: c.clientCode ? `كود: ${c.clientCode}` : undefined,
    }));
  };

  const loadCoaches = async (query: string): Promise<SelectOption[]> => {
    const res = await coachesApi.getAll({
      search: query.trim() || undefined,
      page: 1,
      pageSize: 20,
    });
    return (res.items || []).map((coach) => ({
      id: coach.id,
      label: coach.fullName,
      subLabel: `هاتف: ${coach.phoneNumber}`,
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Section 1: Client & Coach Information ── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '0.85rem',
            color: '#0d1527',
            fontWeight: 800,
            fontSize: '0.95rem',
          }}
        >
          <User size={18} color="#ff6b22" />
          <span>بيانات العميل والكادر التدريبي</span>
        </div>

        {!editingSubscription ? (
          <AsyncSearchableSelect
            label="اختيار العميل"
            placeholder="ابحث باسم العميل، الهاتف، أو كود الباركود..."
            selectedItem={selectedClient}
            onChange={(opt) => setSelectedClient(opt)}
            loadOptions={loadClients}
            required
            disabled={isSaving}
            helperText="يمكنك البحث في قاعدة بيانات جميع العملاء فور كتابة الاسم أو الرقم"
          />
        ) : (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid #e2e8f0',
              marginBottom: '0.75rem',
            }}
          >
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>العميل المشترك: </span>
            <strong style={{ color: '#0d1527', fontSize: '0.95rem' }}>
              {editingSubscription.clientName}
            </strong>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="sub-client-type">
              نوع العميل <span style={{ color: '#ef4444' }}>*</span>
            </label>
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

          <AsyncSearchableSelect
            label={clientType === 'External' ? 'مدرب العمولة' : 'مدرب العمولة (اختياري)'}
            placeholder="ابحث باسم المدرب..."
            selectedItem={selectedCoach}
            onChange={(opt) => setSelectedCoach(opt)}
            loadOptions={loadCoaches}
            required={clientType === 'External'}
            disabled={isSaving}
          />
        </div>
      </div>

      {/* ── Section 2: Subscription Plan & Dates ── */}
      <SubscriptionPlanSection
        subscriptionType={subscriptionType}
        setSubscriptionType={setSubscriptionType}
        totalSessions={totalSessions}
        setTotalSessions={setTotalSessions}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        isSaving={isSaving}
      />

      {/* ── Section 3: Financials & Payments ── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            marginBottom: '0.85rem',
            color: '#0d1527',
            fontWeight: 800,
            fontSize: '0.95rem',
          }}
        >
          <Coins size={18} color="#ff6b22" />
          <span>الحسابات المالية والسداد</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="sub-amount">
              قيمة الاشتراك (ج.م) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="sub-amount"
              type="number"
              min="0"
              step="any"
              className="form-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sub-discount">
              الخصم (ج.م)
            </label>
            <input
              id="sub-discount"
              type="number"
              min="0"
              step="any"
              className="form-input"
              placeholder="0.00"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sub-paid">
              المدفوع نقداً (ج.م)
            </label>
            <input
              id="sub-paid"
              type="number"
              min="0"
              step="any"
              className="form-input"
              placeholder="0.00"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={isSaving}
            />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            backgroundColor: '#f8fafc',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #e2e8f0',
            marginTop: '0.5rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
              صافي قيمة الاشتراك المستحقة
            </span>
            <strong style={{ fontSize: '1.15rem', color: '#ff6b22' }}>
              {finalAmount.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.8rem' }}>ج.م</span>
            </strong>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
              المتبقي بعد السداد
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
              {remainingAmount === 0 ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontWeight: 800 }}>
                  <CheckCircle2 size={16} />
                  <span>خالص بالكامل (0 ج.م)</span>
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontWeight: 800 }}>
                  <AlertCircle size={16} />
                  <span>{remainingAmount.toLocaleString('ar-EG')} ج.م (دين مؤجل)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 4: Optional Notes ── */}
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label" htmlFor="sub-notes">
          ملاحظات إضافية على الاشتراك (اختياري)
        </label>
        <textarea
          id="sub-notes"
          className="form-input"
          rows={2}
          placeholder="أي تفاصيل خاصة أو شروط متفق عليها..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isSaving}
          style={{ resize: 'vertical' }}
        />
      </div>
    </div>
  );
};
