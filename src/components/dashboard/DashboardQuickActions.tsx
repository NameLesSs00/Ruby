import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  ShoppingCart,
  Ticket,
  Boxes,
  ReceiptText,
  Landmark,
  Users,
  Wallet,
  ArrowLeft,
  Zap,
} from 'lucide-react';

interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  path: string;
  icon: React.ReactNode;
  bgLight: string;
  color: string;
  borderColor: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'attendance',
    title: 'تسجيل الحضور السريع',
    subtitle: 'مسح باركود المشترك أو تسجيل الحضور بالاسم',
    path: '/attendance',
    icon: <UserCheck size={22} />,
    bgLight: '#f0f9ff',
    color: '#0284c7',
    borderColor: '#bae6fd',
  },
  {
    id: 'pos',
    title: 'نقطة البيع (POS)',
    subtitle: 'إصدار فاتورة بيع جديدة لمنتجات الأكاديمية',
    path: '/pos',
    icon: <ShoppingCart size={22} />,
    bgLight: '#fff7ed',
    color: '#FF6B22',
    borderColor: '#fed7aa',
  },
  {
    id: 'subscriptions',
    title: 'اشتراك جديد',
    subtitle: 'تسجيل عضوية جديدة في باقات تدريب السباحة',
    path: '/subscriptions',
    icon: <Ticket size={22} />,
    bgLight: '#ecfdf5',
    color: '#059669',
    borderColor: '#a7f3d0',
  },
  {
    id: 'inventory',
    title: 'إذن حركة مخزنية',
    subtitle: 'تسجيل إذن توريد وارد أو إذن صرف للمعدات',
    path: '/inventory',
    icon: <Boxes size={22} />,
    bgLight: '#eef2ff',
    color: '#4f46e5',
    borderColor: '#c7d2fe',
  },
  {
    id: 'due-payments',
    title: 'تحصيل المستحقات والديون',
    subtitle: 'تسجيل سداد دفعة من الديون والمستحقات المعلقة',
    path: '/due-payments',
    icon: <ReceiptText size={22} />,
    bgLight: '#fdf2f8',
    color: '#db2777',
    borderColor: '#fbcfe8',
  },
  {
    id: 'cash-transactions',
    title: 'تحويل أو حركة خزينة',
    subtitle: 'تحويل نقدية بين الخزن أو تسجيل إيداع / سحب',
    path: '/cash-transactions',
    icon: <Landmark size={22} />,
    bgLight: '#fffbeb',
    color: '#d97706',
    borderColor: '#fde68a',
  },
  {
    id: 'clients',
    title: 'تسجيل مشترك جديد',
    subtitle: 'إضافة سباح جديد وإصدار الباركود الخاص به',
    path: '/clients',
    icon: <Users size={22} />,
    bgLight: '#f0fdfa',
    color: '#0d9488',
    borderColor: '#99f6e4',
  },
  {
    id: 'expenses',
    title: 'تسجيل قيد مصروف',
    subtitle: 'تسجيل مصروفات تشغيلية، صيانة، أو إدارية',
    path: '/expenses',
    icon: <Wallet size={22} />,
    bgLight: '#fff1f2',
    color: '#e11d48',
    borderColor: '#fecdd3',
  },
];

export const DashboardQuickActions = () => {
  const navigate = useNavigate();

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
            backgroundColor: '#fff7ed',
            color: '#FF6B22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap size={16} />
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
          الإجراءات والعمليات السريعة
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#64748b', marginInlineStart: 'auto' }}>
          وصول فوري للوظائف اليومية الأكثر استخداماً
        </span>
      </div>

      {/* Grid of Quick Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '0.85rem',
        }}
      >
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => navigate(action.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              backgroundColor: '#ffffff',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: `1px solid #e2e8f0`,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              textAlign: 'start',
              fontFamily: 'inherit',
              transition: 'all 0.18s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = action.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 14px -2px rgba(13, 21, 39, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            {/* Action Icon Badge */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                backgroundColor: action.bgLight,
                color: action.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: `1px solid ${action.borderColor}`,
              }}
            >
              {action.icon}
            </div>

            {/* Action Texts */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#0d1527',
                  marginBottom: '0.15rem',
                }}
              >
                {action.title}
              </div>
              <div
                style={{
                  fontSize: '0.74rem',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={action.subtitle}
              >
                {action.subtitle}
              </div>
            </div>

            {/* Direction Arrow Indicator */}
            <div
              style={{
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

