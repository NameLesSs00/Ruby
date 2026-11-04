import { Link } from 'react-router-dom';
import {
  Users,
  Ticket,
  UserCheck,
  Award,
  ShoppingCart,
  Package,
  Boxes,
  Truck,
  ShoppingBag,
  Landmark,
  Wallet,
  Banknote,
  ReceiptText,
  ShieldCheck,
  ChevronLeft,
  Layers,
} from 'lucide-react';

interface ModuleLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface CategoryCard {
  title: string;
  badge: string;
  bgLight: string;
  color: string;
  links: ModuleLink[];
}

const CATEGORIES: CategoryCard[] = [
  {
    title: 'شؤون السباحين والتدريب',
    badge: 'العمليات الأساسية',
    bgLight: '#f0f9ff',
    color: '#0284c7',
    links: [
      { label: 'دليل العملاء والسباحين', path: '/clients', icon: <Users size={16} /> },
      { label: 'إدارة الاشتراكات والباقات', path: '/subscriptions', icon: <Ticket size={16} /> },
      { label: 'سجلات الحضور اليومي', path: '/attendance', icon: <UserCheck size={16} /> },
      { label: 'الكادر التدريبي والمستحقات', path: '/coaches', icon: <Award size={16} /> },
    ],
  },
  {
    title: 'المتجر ونقطة البيع والمخازن',
    badge: 'المبيعات والتوريد',
    bgLight: '#fff7ed',
    color: '#FF6B22',
    links: [
      { label: 'نقطة البيع السريع (POS)', path: '/pos', icon: <ShoppingCart size={16} /> },
      { label: 'كتالوج المنتجات والأسعار', path: '/products', icon: <Package size={16} /> },
      { label: 'المخزون وحركات التوريد والصرف', path: '/inventory', icon: <Boxes size={16} /> },
      { label: 'سجل الموردين المعتمدين', path: '/suppliers', icon: <Truck size={16} /> },
      { label: 'فواتير المشتريات ودفعاتها', path: '/purchases', icon: <ShoppingBag size={16} /> },
    ],
  },
  {
    title: 'العمليات المالية والحسابات',
    badge: 'الخزينة والتقارير',
    bgLight: '#ecfdf5',
    color: '#059669',
    links: [
      { label: 'حسابات وحركات الخزينة', path: '/cash-transactions', icon: <Landmark size={16} /> },
      { label: 'سجل المصروفات والإيرادات', path: '/expenses', icon: <Wallet size={16} /> },
      { label: 'مسيرات الرواتب والمكافآت', path: '/payroll', icon: <Banknote size={16} /> },
      { label: 'سجل الديون والمستحقات', path: '/due-payments', icon: <ReceiptText size={16} /> },
      { label: 'إدارة مسؤولي النظام والصلاحيات', path: '/admins', icon: <ShieldCheck size={16} /> },
    ],
  },
];

export const DashboardModulesGrid = () => {
  return (
    <div>
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
            backgroundColor: '#f1f5f9',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Layers size={16} />
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
          أقسام ومنظومة الأكاديمية
        </h2>
        <span style={{ fontSize: '0.8rem', color: '#64748b', marginInlineStart: 'auto' }}>
          دليل التصفح المباشر لكافة الوحدات
        </span>
      </div>

      {/* 3-Column Categorized Modules */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {CATEGORIES.map((cat, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Category Header */}
            <div
              style={{
                padding: '0.9rem 1.15rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0d1527' }}>
                {cat.title}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: cat.bgLight,
                  color: cat.color,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '20px',
                }}
              >
                {cat.badge}
              </span>
            </div>

            {/* Links List */}
            <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
              {cat.links.map((link, lIdx) => (
                <Link
                  key={lIdx}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    color: '#334155',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.color = '#0d1527';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#334155';
                  }}
                >
                  <span style={{ color: cat.color, display: 'flex', alignItems: 'center' }}>
                    {link.icon}
                  </span>
                  <span style={{ flex: 1 }}>{link.label}</span>
                  <ChevronLeft size={15} color="#94a3b8" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

