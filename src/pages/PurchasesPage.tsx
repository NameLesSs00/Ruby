import { useState } from 'react';
import { ShoppingBag, FileText, History } from 'lucide-react';
import { PurchaseInvoicesTab } from '../components/purchases/PurchaseInvoicesTab';
import { PurchasePaymentsTab } from '../components/purchases/PurchasePaymentsTab';

export const PurchasesPage = () => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');

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
            <ShoppingBag size={22} color="#ff6b22" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0d1527' }}>
              فواتير المشتريات وسداد الموردين
            </h2>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            إدارة فواتير الشراء المخزنية، متابعة حسابات ومديونيات الموردين، وسداد المستحقات
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'invoices' ? '#0d1527' : 'transparent',
              color: activeTab === 'invoices' ? '#ffffff' : '#64748b',
            }}
          >
            <FileText size={16} />
            <span>فواتير المشتريات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'payments' ? '#0d1527' : 'transparent',
              color: activeTab === 'payments' ? '#ffffff' : '#64748b',
            }}
          >
            <History size={16} />
            <span>سجل مدفوعات الموردين</span>
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      {activeTab === 'invoices' ? <PurchaseInvoicesTab /> : <PurchasePaymentsTab />}
    </div>
  );
};

