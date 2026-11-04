import {
  UserCheck,
  AlertCircle,
  RotateCcw,
  User,
  Ticket,
} from 'lucide-react';
import {
  type ClientWithEligibleSubscriptions,
  type EligibleSubscription,
} from '../../modules/clients';

interface ClientAttendanceCardProps {
  clientData: ClientWithEligibleSubscriptions;
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
  const eligibleSubs: EligibleSubscription[] = clientData.eligibleSubscriptions || [];

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d1527' }}>
              {clientData.fullName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 999, backgroundColor: '#f1f5f9', color: '#475569' }}>
                {clientData.clientCode}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                معرف المشترك #{clientData.clientId}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          onClick={onReset}
        >
          <RotateCcw size={13} />
          <span>إعادة ضبط</span>
        </button>
      </div>

      {/* Subscriptions section */}
      <div>
        <label className="form-label required" style={{ marginBottom: '0.4rem' }}>
          اختر الاشتراك لتسجيل الحصة
        </label>

        {eligibleSubs.length === 0 ? (
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
            <span>لا توجد اشتراكات نشطة أو صالحة للحضور مسجلة لهذا المشترك</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {eligibleSubs.map((sub) => {
              const isSelected = selectedSubId === sub.subscriptionId;
              return (
                <div
                  key={sub.subscriptionId}
                  onClick={() => onSelectSubId(sub.subscriptionId)}
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
                        اشتراك #{sub.subscriptionId} — {sub.subscriptionType}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                        الصلاحية: {sub.startDate} إلى {sub.endDate}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'end' }}>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: sub.remainingSessions > 0 ? '#059669' : '#dc2626',
                      }}
                    >
                      {sub.remainingSessions} حصة متبقية
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
        disabled={isPending || eligibleSubs.length === 0 || !selectedSubId}
      >
        <UserCheck size={18} />
        <span>{isPending ? 'جاري تسجيل الحضور...' : 'تأكيد تسجيل الحضور الآن'}</span>
      </button>
    </div>
  );
};

