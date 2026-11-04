import { CheckCircle2, Clock, UserCheck } from 'lucide-react';
import { type AttendanceRecord } from '../../modules/attendance';

interface RecentCheckInsFeedProps {
  items: AttendanceRecord[];
  isLoading: boolean;
}

export const RecentCheckInsFeed = ({ items, isLoading }: RecentCheckInsFeedProps) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
            حضور اليوم اللحظي
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: 999, backgroundColor: '#ecfdf5', color: '#059669' }}>
          {items.length} تسجيلات أخيرة
        </span>
      </div>

      {isLoading ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
          جاري تحميل سجل الحضور اللحظي...
        </div>
      ) : items.length === 0 ? (
        <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
          لم يتم تسجيل أي حضور حتى الآن اليوم
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {items.map((item) => {
            const time = new Date(item.checkInTime).toLocaleTimeString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
            });
            return (
              <div
                key={item.id}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCheck size={15} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.85rem' }}>
                      {item.clientName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#0284c7' }}>
                      اشتراك #{item.subscriptionId}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <Clock size={12} />
                  <span>{time}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

