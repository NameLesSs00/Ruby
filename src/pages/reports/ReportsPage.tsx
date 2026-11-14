import { useState } from 'react';
import { TrendingUp, TrendingDown, Boxes, Landmark, BarChart3 } from 'lucide-react';
import { IncomeReportPage } from './IncomeReportPage';
import { ExpensesReportPage } from './ExpensesReportPage';
import { WarehouseReportPage } from './WarehouseReportPage';
import { CashboxesReportPage } from './CashboxesReportPage';

type ReportTab = 'income' | 'expenses' | 'warehouse' | 'cashboxes';

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('income');

  const tabs = [
    {
      id: 'income' as ReportTab,
      label: 'تقرير الإيرادات',
      icon: <TrendingUp size={18} />,
      color: '#16a34a',
    },
    {
      id: 'expenses' as ReportTab,
      label: 'تقرير المصروفات',
      icon: <TrendingDown size={18} />,
      color: '#dc2626',
    },
    {
      id: 'warehouse' as ReportTab,
      label: 'تقرير المستودع والمخزون',
      icon: <Boxes size={18} />,
      color: '#0284c7',
    },
    {
      id: 'cashboxes' as ReportTab,
      label: 'تقرير الخزائن والمعاملات',
      icon: <Landmark size={18} />,
      color: '#c2410c',
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.625rem',
              background: '#0D1527',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BarChart3 size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0D1527', margin: 0 }}>
              التقارير المالية والتشغيلية
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              متابعة دقيقة لحركات الإيرادات، المصروفات، حركة المستودع، وأرصدة الخزائن
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.5rem 0.5rem 0 0',
                border: 'none',
                background: isActive ? '#ffffff' : 'transparent',
                borderBottom: isActive ? `3px solid ${tab.color}` : '3px solid transparent',
                color: isActive ? '#0D1527' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 -2px 8px rgba(0,0,0,0.04)' : 'none',
              }}
            >
              <span style={{ color: isActive ? tab.color : '#94a3b8' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'income' && <IncomeReportPage />}
        {activeTab === 'expenses' && <ExpensesReportPage />}
        {activeTab === 'warehouse' && <WarehouseReportPage />}
        {activeTab === 'cashboxes' && <CashboxesReportPage />}
      </div>
    </div>
  );
};
