import {
  UserCheck,
  AlertCircle,
  RotateCcw,
  User,
  Ticket,
  QrCode,
} from 'lucide-react';
import type { Subscription } from '../../modules/subscriptions';
import {
  subscriptionTypeLabel,
  subscriptionStatusLabel,
  subscriptionStatusBadgeClass,
} from '../../modules/subscriptions';

export interface ClientAttendanceData {
  clientId: number;
  fullName: string;
  barcode: string | null;
  phoneNumber?: string | null;
  subscriptions: Subscription[];
}

interface ClientAttendanceCardProps {
  clientData: ClientAttendanceData;
  selectedSubId: number | null;
  onSelectSubId: (id: number) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirmCheckIn: () => void;
  isPending: boolean;
  onReset: () => void;
}

export const ClientAttendanceCard = ({
  clientData,
  selectedSubId,
  onSelectSubId,
  notes,
  onNotesChange,
  onConfirmCheckIn,
  isPending,
  onReset,
}: ClientAttendanceCardProps) => {
  const allSubs = clientData.subscriptions || [];
  const activeSubs = allSubs.filter((s) => s.status === 'Active');
  const inactiveSubs = allSubs.filter((s) => s.status !== 'Active');

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        border: '2px solid #38bdf8',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Header info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d1527' }}>
              {clientData.fullName}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.2rem',
                flexWrap: 'wrap',
              }}
            >
              {clientData.barcode ? (
                <span className="client-code-badge">
                  <QrCode size={13} color="#0284c7" />
                  {clientData.barcode}
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>بدون باركود</span>
              )}
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                معرف العميل #{clientData.clientId}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          style={{
            padding: '0.35rem 0.65rem',
            fontSize: '0.78rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
          onClick={onReset}
        >
          <RotateCcw size={13} />
          <span>إعادة ضبط</span>
        </button>
      </div>

      {/* Active Subscriptions section (Selectable for Attendance) */}
      <div>
        <label className="form-label required" style={{ marginBottom: '0.4rem' }}>
          اختر الاشتراك النشط لتسجيل الحصة
        </label>

        {activeSubs.length === 0 ? (
          <div
            style={{
              padding: '0.9rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              color: '#92400e',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={18} />
            <span>لا توجد اشتراكات نشطة صالحة لتسجيل الحضور لهذا العميل</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activeSubs.map((sub) => {
              const isSelected = selectedSubId === sub.id;
              const remainingSessions = Math.max(0, (sub.totalSessions || 0) - (sub.usedSessions || 0));

              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubId(sub.id)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: `2px solid ${isSelected ? '#FF6B22' : '#e2e8f0'}`,
                    backgroundColor: isSelected ? '#fff7ed' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Ticket size={18} color={isSelected ? '#ea580c' : '#64748b'} />
                    <div>
                      <div style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.9rem' }}>
                        اشتراك #{sub.id} — {subscriptionTypeLabel(sub.subscriptionType)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                        الصلاحية: {sub.startDate ? sub.startDate.slice(0, 10) : '—'} إلى{' '}
                        {sub.endDate ? sub.endDate.slice(0, 10) : '—'}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'end' }}>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: remainingSessions > 0 ? '#059669' : '#dc2626',
                      }}
                    >
                      {remainingSessions} حصة متبقية
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      المستخدم: {sub.usedSessions} من أصل {sub.totalSessions}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Non-active subscriptions summary (informative) */}
      {inactiveSubs.length > 0 && (
        <div style={{ marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            اشتراكات سابقة / غير نشطة ({inactiveSubs.length}):
          </span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
            {inactiveSubs.map((s) => (
              <span
                key={s.id}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>#{s.id} {subscriptionTypeLabel(s.subscriptionType)}</span>
                <span className={`status-badge ${subscriptionStatusBadgeClass(s.status)}`} style={{ padding: '0 4px', fontSize: '0.68rem' }}>
                  {subscriptionStatusLabel(s.status)}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes input */}
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label" style={{ fontSize: '0.8rem' }}>
          ملاحظات تسجيل الحضور (اختياري)
        </label>
        <input
          type="text"
          className="form-input"
          placeholder="مثال: تدريب مسائي، تعويض حصة..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>

      {/* Action Button */}
      <button
        type="button"
        className="btn-primary"
        style={{ padding: '0.75rem', fontSize: '0.95rem', gap: '0.5rem' }}
        onClick={onConfirmCheckIn}
        disabled={isPending || activeSubs.length === 0 || !selectedSubId}
      >
        <UserCheck size={18} />
        <span>{isPending ? 'جاري تسجيل الحضور...' : 'تأكيد تسجيل الحضور الآن'}</span>
      </button>
    </div>
  );
};
