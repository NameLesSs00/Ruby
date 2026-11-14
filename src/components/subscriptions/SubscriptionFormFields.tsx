import type { Dispatch, SetStateAction } from 'react';
import { User } from 'lucide-react';
import type {
  Subscription,
  ClientType,
  SubscriptionType,
} from '../../modules/subscriptions';
import type { PaymentMethod, PaymentMethodItem } from '../../modules/duePayments';
import {
  AsyncSearchableSelect,
  type SelectOption,
} from '../ui/AsyncSearchableSelect';
import { clientsApi } from '../../modules/clients';
import { coachesApi } from '../../modules/coaches';
import { SubscriptionPlanSection } from './SubscriptionPlanSection';
import { SubscriptionFinancialsSection } from './SubscriptionFinancialsSection';

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
  selectedMethod: PaymentMethod;
  setSelectedMethod: Dispatch<SetStateAction<PaymentMethod>>;
  isSplit: boolean;
  setIsSplit: Dispatch<SetStateAction<boolean>>;
  splitRows: PaymentMethodItem[];
  setSplitRows: Dispatch<SetStateAction<PaymentMethodItem[]>>;
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
  selectedMethod,
  setSelectedMethod,
  isSplit,
  setIsSplit,
  splitRows,
  setSplitRows,
  notes,
  setNotes,
  isSaving,
}: Props) => {
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
      <SubscriptionFinancialsSection
        amount={amount}
        setAmount={setAmount}
        discountAmount={discountAmount}
        setDiscountAmount={setDiscountAmount}
        paidAmount={paidAmount}
        setPaidAmount={setPaidAmount}
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        isSplit={isSplit}
        setIsSplit={setIsSplit}
        splitRows={splitRows}
        setSplitRows={setSplitRows}
        isSaving={isSaving}
        isEditing={Boolean(editingSubscription)}
      />

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
