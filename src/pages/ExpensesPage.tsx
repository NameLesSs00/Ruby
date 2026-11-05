import { useState } from 'react';
import { Wallet, TrendingDown, TrendingUp } from 'lucide-react';
import { ExpensesTab } from '../components/expenses/ExpensesTab';
import { OtherIncomesTab } from '../components/expenses/OtherIncomesTab';

export const ExpensesPage = () => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'other-incomes'>('expenses');

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
            <Wallet size={22} color="#ff6b22" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0d1527' }}>
              المصروفات والإيرادات الأخرى
            </h2>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            تسجيل وإدارة بنود المصروفات التشغيلية ومتابعة مصادر الدخل والإيرادات الإضافية
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
            onClick={() => setActiveTab('expenses')}
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
              backgroundColor: activeTab === 'expenses' ? '#0d1527' : 'transparent',
              color: activeTab === 'expenses' ? '#ffffff' : '#64748b',
            }}
          >
            <TrendingDown size={16} />
            <span>سجل المصروفات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('other-incomes')}
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
              backgroundColor: activeTab === 'other-incomes' ? '#0d1527' : 'transparent',
              color: activeTab === 'other-incomes' ? '#ffffff' : '#64748b',
            }}
          >
            <TrendingUp size={16} />
            <span>الإيرادات الإضافية</span>
          </button>
        </div>
      </div>

      {/* Tab View */}
      {activeTab === 'expenses' ? <ExpensesTab /> : <OtherIncomesTab />}
    </div>
  );
};

