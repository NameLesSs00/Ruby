import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Banknote, FileText, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import { employeesApi, type Employee } from '../modules/employees';
import { PayrollsTab } from '../components/payroll/PayrollsTab';
import { BonusesTab } from '../components/payroll/BonusesTab';
import { DeductionsTab } from '../components/payroll/DeductionsTab';
import { PayrollPaymentsTab } from '../components/payroll/PayrollPaymentsTab';

type Tab = 'payrolls' | 'bonuses' | 'deductions' | 'payments';

export const PayrollPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('payrolls');

  // Load all employees (max limit per page is 100)
  const { data: employeesData } = useQuery({
    queryKey: ['employees', 'list', { page: 1, pageSize: 100 }],
    queryFn: () => employeesApi.getAll({ page: 1, pageSize: 100 }),
    staleTime: 5 * 60 * 1000,
  });

  const employees: Employee[] = employeesData?.items || [];

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'payrolls', label: 'مسيرات الرواتب', icon: <FileText size={17} /> },
    { key: 'bonuses', label: 'المكافآت', icon: <TrendingUp size={17} /> },
    { key: 'deductions', label: 'الخصومات', icon: <TrendingDown size={17} /> },
    { key: 'payments', label: 'سجل المدفوعات', icon: <Receipt size={17} /> },
  ];

  return (
    <div className="view-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0D1527, #1e293b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Banknote size={22} color="#36C5F0" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>الرواتب والبدلات</h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>إدارة مسيرات الرواتب والمكافآت والخصومات</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          background: '#f1f5f9',
          borderRadius: '10px',
          padding: '0.35rem',
          marginBottom: '1.5rem',
          width: 'fit-content',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.1rem',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: activeTab === tab.key ? 700 : 500,
              background: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? '#0D1527' : '#64748b',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              transition: 'all 0.18s ease',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'payrolls' && <PayrollsTab employees={employees} />}
      {activeTab === 'bonuses' && <BonusesTab employees={employees} />}
      {activeTab === 'deductions' && <DeductionsTab employees={employees} />}
      {activeTab === 'payments' && <PayrollPaymentsTab employees={employees} />}
    </div>
  );
};
