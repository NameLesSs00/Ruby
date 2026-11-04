import { RotateCcw, RefreshCw } from 'lucide-react';
import {
  type CashboxType,
  type CashTransactionType,
  type CashReferenceType,
  cashboxLabel,
  referenceTypeLabel,
} from '../../modules/cashTransactions';

interface CashTransactionsFilterBarProps {
  cashboxFilter?: CashboxType;
  onCashboxChange: (val: CashboxType | undefined) => void;
  typeFilter?: CashTransactionType;
  onTypeChange: (val: CashTransactionType | undefined) => void;
  referenceFilter?: CashReferenceType;
  onReferenceChange: (val: CashReferenceType | undefined) => void;
  fromDate: string;
  onFromDateChange: (val: string) => void;
  toDate: string;
  onToDateChange: (val: string) => void;
  onRefresh: () => void;
  onReset: () => void;
}

export const CashTransactionsFilterBar = ({
  cashboxFilter,
  onCashboxChange,
  typeFilter,
  onTypeChange,
  referenceFilter,
  onReferenceChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onRefresh,
  onReset,
}: CashTransactionsFilterBarProps) => {
  const setDatePreset = (preset: 'today' | 'week' | 'month' | 'all') => {
    const now = new Date();
    if (preset === 'today') {
      const d = now.toISOString().slice(0, 10);
      onFromDateChange(d);
      onToDateChange(d);
    } else if (preset === 'week') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      onFromDateChange(past.toISOString().slice(0, 10));
      onToDateChange(now.toISOString().slice(0, 10));
    } else if (preset === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      onFromDateChange(firstDay);
      onToDateChange(now.toISOString().slice(0, 10));
    } else {
      onFromDateChange('');
      onToDateChange('');
    }
  };

  const hasActiveFilters = Boolean(
    cashboxFilter || typeFilter || referenceFilter || fromDate || toDate
  );

  const referenceOptions: CashReferenceType[] = [
    'Subscription',
    'Sale',
    'Payroll',
    'Expense',
    'SubscriptionCancellation',
    'SaleReturn',
    'OtherIncome',
    'DuePaymentCollection',
    'CoachPayment',
    'PurchaseInvoicePayment',
    'CashTransfer',
  ];

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '1rem 1.2rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1rem',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      {/* Top presets row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>فترة سريعة:</span>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
            onClick={() => setDatePreset('today')}
          >
            اليوم
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
            onClick={() => setDatePreset('week')}
          >
            آخر 7 أيام
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
            onClick={() => setDatePreset('month')}
          >
            هذا الشهر
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
            onClick={() => setDatePreset('all')}
          >
            الكل
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn-secondary"
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#dc2626',
              }}
              onClick={onReset}
            >
              <RotateCcw size={12} />
              <span>إعادة ضبط الفلاتر</span>
            </button>
          )}
        </div>

        <button
          type="button"
          className="btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          onClick={onRefresh}
          title="تحديث البيانات"
        >
          <RefreshCw size={14} />
          <span>تحديث</span>
        </button>
      </div>

      {/* Main filters grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>الخزينة</label>
          <select
            className="form-input"
            value={cashboxFilter || ''}
            onChange={(e) => onCashboxChange(e.target.value ? (e.target.value as CashboxType) : undefined)}
          >
            <option value="">كافة الخزن</option>
            <option value="Main">{cashboxLabel('Main')}</option>
            <option value="Subscriptions">{cashboxLabel('Subscriptions')}</option>
            <option value="POS">{cashboxLabel('POS')}</option>
          </select>
        </div>

        <div>
          <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>نوع حركة النقدية</label>
          <select
            className="form-input"
            value={typeFilter || ''}
            onChange={(e) => onTypeChange(e.target.value ? (e.target.value as CashTransactionType) : undefined)}
          >
            <option value="">كافة الحركات (وارد وصادر)</option>
            <option value="Income">وارد / إيراد (+)</option>
            <option value="Expense">صادر / مصروف (-)</option>
          </select>
        </div>

        <div>
          <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>نوع المعاملة المرجعية</label>
          <select
            className="form-input"
            value={referenceFilter || ''}
            onChange={(e) => onReferenceChange(e.target.value ? (e.target.value as CashReferenceType) : undefined)}
          >
            <option value="">كافة المعاملات</option>
            {referenceOptions.map((ref) => (
              <option key={ref} value={ref}>
                {referenceTypeLabel(ref)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>من تاريخ</label>
          <input
            type="date"
            className="form-input"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>إلى تاريخ</label>
          <input
            type="date"
            className="form-input"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

