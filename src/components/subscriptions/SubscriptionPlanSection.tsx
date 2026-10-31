import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Layers } from 'lucide-react';
import type { SubscriptionType } from '../../modules/subscriptions';

interface SubscriptionPlanSectionProps {
  subscriptionType: SubscriptionType;
  setSubscriptionType: Dispatch<SetStateAction<SubscriptionType>>;
  totalSessions: number;
  setTotalSessions: Dispatch<SetStateAction<number>>;
  startDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: Dispatch<SetStateAction<string>>;
  isSaving: boolean;
}

export const SubscriptionPlanSection = ({
  subscriptionType,
  setSubscriptionType,
  totalSessions,
  setTotalSessions,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isSaving,
}: SubscriptionPlanSectionProps) => {
  const [durationPreset, setDurationPreset] = useState<number | null>(() => {
    if (!startDate || !endDate) return 1;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diffMonths = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    return [1, 3, 6, 12].includes(diffMonths) ? diffMonths : 1;
  });

  const durationPresets = [
    { months: 1, label: 'شهر واحد' },
    { months: 3, label: '3 شهور' },
    { months: 6, label: '6 شهور' },
    { months: 12, label: 'سنة كاملة' },
  ];

  const applyDatePreset = (months: number) => {
    setDurationPreset(months);
    const base = startDate ? new Date(startDate) : new Date();
    base.setMonth(base.getMonth() + months);
    setEndDate(base.toISOString().slice(0, 10));
  };

  return (
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
        <Layers size={18} color="#ff6b22" />
        <span>خطة الاشتراك وعدد الحصص</span>
      </div>

      {/* Subscription Type Selector */}
      <div className="form-group">
        <label className="form-label">
          نوع نظام الاشتراك <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
            backgroundColor: '#f1f5f9',
            padding: '0.3rem',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {[
            { type: 'Sessions', label: 'بالحصص' },
            { type: 'Duration', label: 'بالمدة الزمنية' },
            { type: 'PrivateTraining', label: 'تدريب خاص (Private)' },
          ].map((p) => {
            const isSelected = subscriptionType === p.type;
            return (
              <button
                key={p.type}
                type="button"
                onClick={() => setSubscriptionType(p.type as SubscriptionType)}
                style={{
                  padding: '0.45rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#ff6b22' : '#64748b',
                  boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sessions Count & Quick Steppers */}
      <div className="form-group" style={{ marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <label className="form-label" htmlFor="sub-sessions" style={{ margin: 0 }}>
            إجمالي الحصص <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {[4, 8, 12, 16].map((cnt) => {
              const isSelected = totalSessions === cnt;
              return (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setTotalSessions(cnt)}
                  style={{
                    border: isSelected ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                    color: isSelected ? '#0284c7' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 800 : 600,
                    borderRadius: '4px',
                    padding: '0.15rem 0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 1px 2px rgba(2, 132, 199, 0.15)' : 'none',
                  }}
                >
                  {cnt} حصص
                </button>
              );
            })}
          </div>
        </div>
        <input
          id="sub-sessions"
          type="number"
          min="1"
          className="form-input"
          value={totalSessions}
          onChange={(e) => setTotalSessions(Math.max(1, Number(e.target.value)))}
          disabled={isSaving}
          required
        />
      </div>

      {/* Dates Range with Presets */}
      <div style={{ marginTop: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
            فترة الاشتراك
          </span>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {durationPresets.map((preset) => {
              const isSelected = durationPreset === preset.months;
              return (
                <button
                  key={preset.months}
                  type="button"
                  onClick={() => applyDatePreset(preset.months)}
                  style={{
                    border: isSelected ? '1.5px solid #ff6b22' : '1px solid #cbd5e1',
                    backgroundColor: isSelected ? '#fff7ed' : '#ffffff',
                    color: isSelected ? '#ff6b22' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 800 : 600,
                    borderRadius: '5px',
                    padding: '0.2rem 0.6rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 1px 3px rgba(255, 107, 34, 0.2)' : 'none',
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="sub-start" style={{ fontSize: '0.8rem' }}>
              تاريخ البدء <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="sub-start"
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => {
                const newStart = e.target.value;
                setStartDate(newStart);
                if (durationPreset && newStart) {
                  const base = new Date(newStart);
                  base.setMonth(base.getMonth() + durationPreset);
                  setEndDate(base.toISOString().slice(0, 10));
                }
              }}
              required
              disabled={isSaving}
            />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" htmlFor="sub-end" style={{ fontSize: '0.8rem' }}>
              تاريخ الانتهاء <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="sub-end"
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDurationPreset(null);
              }}
              required
              disabled={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

