import { useState } from 'react';
import { UserCheck, Scan, History } from 'lucide-react';
import { QuickCheckInTab } from '../components/attendance/QuickCheckInTab';
import { AttendanceHistoryTab } from '../components/attendance/AttendanceHistoryTab';

type AttendanceTab = 'quick' | 'history';

export const AttendancePage = () => {
  const [activeTab, setActiveTab] = useState<AttendanceTab>('quick');

  const TABS: { key: AttendanceTab; label: string; icon: React.ReactNode }[] = [
    { key: 'quick', label: 'تسجيل الحضور السريع', icon: <Scan size={16} /> },
    { key: 'history', label: 'سجل الحضور العام', icon: <History size={16} /> },
  ];

  return (
    <div className="view-container">
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <UserCheck size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
              تسجيل الحضور والانصراف
            </h1>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              فحص باركود المشتركين، تسجيل الحصص اللحظية، ومتابعة سجل الحضور اليومي
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
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
      {activeTab === 'quick' && <QuickCheckInTab />}
      {activeTab === 'history' && <AttendanceHistoryTab />}
    </div>
  );
};

