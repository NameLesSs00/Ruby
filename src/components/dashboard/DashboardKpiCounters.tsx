import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Users, Ticket, UserCheck, ReceiptText, BarChart3, ChevronLeft } from 'lucide-react';
import { clientsApi, clientKeys } from '../../modules/clients';
import { subscriptionsApi, subscriptionKeys } from '../../modules/subscriptions';
import { attendanceApi, attendanceKeys } from '../../modules/attendance';
import { duePaymentsApi, duePaymentKeys } from '../../modules/duePayments';

export const DashboardKpiCounters = () => {
  const navigate = useNavigate();

  const todayIsoDate = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }, []);

  // 1. Total Registered Clients
  const { data: clientsData, isLoading: loadingClients } = useQuery({
    queryKey: clientKeys.list({ page: 1, pageSize: 1 }),
    queryFn: () => clientsApi.getAll({ page: 1, pageSize: 1 }),
  });

  // 2. Total Subscriptions
  const { data: subsData, isLoading: loadingSubs } = useQuery({
    queryKey: subscriptionKeys.list({ page: 1, pageSize: 1 }),
    queryFn: () => subscriptionsApi.getAll({ page: 1, pageSize: 1 }),
  });

  // 3. Today's Attendances
  const { data: attendanceData, isLoading: loadingAttendance } = useQuery({
    queryKey: attendanceKeys.list({ page: 1, pageSize: 1, fromDate: todayIsoDate, toDate: todayIsoDate }),
    queryFn: () => attendanceApi.getAll({ page: 1, pageSize: 1, fromDate: todayIsoDate, toDate: todayIsoDate }),
  });

  // 4. Pending Due Payments
  const { data: duesData, isLoading: loadingDues } = useQuery({
    queryKey: duePaymentKeys.list({ page: 1, pageSize: 1, status: 'Unpaid' }),
    queryFn: () => duePaymentsApi.getAll({ page: 1, pageSize: 1, status: 'Unpaid' }),
  });

  const cards = [
    {
      id: 'clients',
      label: 'المشتركون المسجلون',
      count: clientsData?.totalCount ?? 0,
      unit: 'مشترك',
      isLoading: loadingClients,
      path: '/clients',
      icon: <Users size={22} />,
      bg: '#e0f2fe',
      color: '#0284c7',
      border: '#bae6fd',
    },
    {
      id: 'subscriptions',
      label: 'الاشتراكات النشطة والإجمالية',
      count: subsData?.totalCount ?? 0,
      unit: 'اشتراك',
      isLoading: loadingSubs,
      path: '/subscriptions',
      icon: <Ticket size={22} />,
      bg: '#ecfdf5',
      color: '#059669',
      border: '#a7f3d0',
    },
    {
      id: 'attendance',
      label: 'حركات الحضور المسجلة اليوم',
      count: attendanceData?.totalCount ?? 0,
      unit: 'حضور',
      isLoading: loadingAttendance,
      path: '/attendance',
      icon: <UserCheck size={22} />,
      bg: '#f0fdf4',
      color: '#16a34a',
      border: '#bbf7d0',
    },
    {
      id: 'dues',
      label: 'المستحقات المعلقة للتحصيل',
      count: duesData?.totalCount ?? 0,
      unit: 'مستحق معلق',
      isLoading: loadingDues,
      path: '/due-payments',
      icon: <ReceiptText size={22} />,
      bg: '#fff1f2',
      color: '#e11d48',
      border: '#fecdd3',
    },
  ];

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.85rem',
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BarChart3 size={16} />
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
          المؤشرات التشغيلية الحية
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#64748b', marginInlineStart: 'auto' }}>
          تحديث فوري من قاعدة البيانات
        </span>
      </div>

      {/* Grid of KPI Counters */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => navigate(card.path)}
            style={{
              backgroundColor: '#ffffff',
              padding: '1.15rem 1.25rem',
              borderRadius: '14px',
              border: `1px solid #e2e8f0`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(13, 21, 39, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  backgroundColor: card.bg,
                  color: card.color,
                  border: `1px solid ${card.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </div>
              <ChevronLeft size={16} color="#94a3b8" />
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.35rem' }}>
                {card.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0d1527', lineHeight: 1 }}>
                  {card.isLoading ? (
                    <span style={{ color: '#94a3b8', fontSize: '1rem' }}>...</span>
                  ) : (
                    card.count.toLocaleString('ar-EG')
                  )}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                  {card.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
