import { useState } from 'react';
import { ReceiptText, Clock, History } from 'lucide-react';
import { DuePaymentsTab } from '../components/due-payments/DuePaymentsTab';
import { DuePaymentTransactionsTab } from '../components/due-payments/DuePaymentTransactionsTab';

export const DuePaymentsPage = () => {
  const [activeTab, setActiveTab] = useState<'debts' | 'transactions'>('debts');

  return (
    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ReceiptText size={22} color="#ff6b22" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0d1527' }}>
              الديون والمستحقات الشاملة
            </h2>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            متابعة كافة حسابات المديونيات والتحصيلات (الاشتراكات، المبيعات، والديون الخارجية) وسداد الأرصدة
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'debts' ? 'active' : ''}`}
            onClick={() => setActiveTab('debts')}
          >
            <Clock size={16} />
            <span>سجل الديون والمستحقات</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <History size={16} />
            <span>سجل حركات السداد</span>
          </button>
        </div>
      </div>

      {/* Tab View */}
      {activeTab === 'debts' ? <DuePaymentsTab /> : <DuePaymentTransactionsTab />}
    </div>
  );
};

