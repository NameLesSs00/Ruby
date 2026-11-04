import { useState } from 'react';
import { Landmark, ReceiptText, ArrowLeftRight, Plus, Coins } from 'lucide-react';
import { CashboxBalanceCards } from '../components/cash-transactions/CashboxBalanceCards';
import { CashTransactionsTab } from '../components/cash-transactions/CashTransactionsTab';
import { CashTransfersTab } from '../components/cash-transactions/CashTransfersTab';
import { CreateCashTransferModal } from '../components/cash-transactions/CreateCashTransferModal';
import { OwnerTransactionsTab } from '../components/owner-transactions/OwnerTransactionsTab';

type ActiveTab = 'transactions' | 'transfers' | 'owner-transactions';

export const CashTransactionsPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('transactions');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const TABS: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { key: 'transactions', label: 'سجل حركات النقدية العام', icon: <ReceiptText size={16} /> },
    { key: 'transfers', label: 'سجل التحويلات بين الخزن', icon: <ArrowLeftRight size={16} /> },
    { key: 'owner-transactions', label: 'حركات وسحوبات المالك', icon: <Coins size={16} /> },
  ];

  return (
    <div className="view-container">
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #0d1527)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Landmark size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
              إدارة الخزينة وحسابات النقدية
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              متابعة الأرصدة والسيولة اللحظية، سجل المعاملات المالية، التحويلات، وحركات وسحوبات المالك
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-add"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          onClick={() => setIsTransferModalOpen(true)}
        >
          <Plus size={16} />
          <span>إجراء تحويل نقدية</span>
        </button>
      </div>

      {/* Liquidity Balances Dashboard */}
      <CashboxBalanceCards />

      {/* Tabs Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
        <div className="tab-switcher">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`tab-btn ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Views */}
      {activeTab === 'transactions' && <CashTransactionsTab />}

      {activeTab === 'transfers' && <CashTransfersTab />}

      {activeTab === 'owner-transactions' && <OwnerTransactionsTab />}

      {/* Global Transfer Modal */}
      <CreateCashTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />
    </div>
  );
};
