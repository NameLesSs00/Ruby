import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Award,
  Briefcase,
  Package,
  Truck,
  ArrowLeft,
  Activity,
} from 'lucide-react';
import { clientsApi, clientKeys } from '../modules/clients';
import { coachesApi, coachKeys } from '../modules/coaches';
import { employeesApi, employeeKeys } from '../modules/employees';
import { productsApi, productKeys } from '../modules/products';

export const DashboardOverviewPage = () => {
  const { data: clientsData } = useQuery({
    queryKey: clientKeys.list({ page: 1, pageSize: 1 }),
    queryFn: () => clientsApi.getAll({ page: 1, pageSize: 1 }),
  });

  const { data: coachesData } = useQuery({
    queryKey: coachKeys.list({ page: 1, pageSize: 1 }),
    queryFn: () => coachesApi.getAll({ page: 1, pageSize: 1 }),
  });

  const { data: employeesData } = useQuery({
    queryKey: employeeKeys.list({ page: 1, pageSize: 1 }),
    queryFn: () => employeesApi.getAll({ page: 1, pageSize: 1 }),
  });

  const { data: productsData } = useQuery({
    queryKey: productKeys.list({ page: 1, pageSize: 1 }),
    queryFn: () => productsApi.getAll({ page: 1, pageSize: 1 }),
  });

  const stats = [
    {
      title: 'إجمالي العملاء',
      count: clientsData?.totalCount ?? 0,
      icon: <Users size={24} color="#0284c7" />,
      bg: '#f0f9ff',
      link: '/clients',
      linkText: 'عرض قائمة العملاء',
    },
    {
      title: 'المدربون النشطون',
      count: coachesData?.totalCount ?? 0,
      icon: <Award size={24} color="#ea580c" />,
      bg: '#fff7ed',
      link: '/coaches',
      linkText: 'إدارة الكادر التدريبي',
    },
    {
      title: 'فريق العمل والموظفون',
      count: employeesData?.totalCount ?? 0,
      icon: <Briefcase size={24} color="#059669" />,
      bg: '#ecfdf5',
      link: '/employees',
      linkText: 'سجلات الموظفين',
    },
    {
      title: 'المنتجات المسجلة',
      count: productsData?.totalCount ?? 0,
      icon: <Package size={24} color="#7c3aed" />,
      bg: '#f5f3ff',
      link: '/products',
      linkText: 'قائمة المنتجات والأسعار',
    },
  ];

  return (
    <div className="view-container">
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d1527 0%, #16223e 100%)',
          color: '#ffffff',
          padding: '2rem 1.75rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-cyan)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <Activity size={16} />
            <span>نظام إدارة الأكاديمية متصل</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
            مرحباً بك في لوحة تحكم أكاديمية روبي للسباحة
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '580px', margin: 0 }}>
            يمكنك الوصول السريع لجميع سجلات العملاء، المدربين، الموظفين، الموردين، والمنتجات من خلال الروابط السريعة أدناه.
          </p>
        </div>

        <Link
          to="/clients"
          className="btn-add"
          style={{ textDecoration: 'none' }}
        >
          <Users size={18} />
          <span>إدارة العملاء</span>
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {stats.map((s, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {s.title}
                </span>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-navy)', marginTop: '0.35rem' }}>
                  {s.count.toLocaleString('ar-EG')}
                </div>
              </div>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {s.icon}
              </div>
            </div>

            <Link
              to={s.link}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--color-navy)',
                textDecoration: 'none',
                paddingTop: '0.75rem',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <span>{s.linkText}</span>
              <ArrowLeft size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Access Shortcuts */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
        }}
      >
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '1rem' }}>
          الأقسام الرئيسية السريعة
        </h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/clients" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={16} />
            <span>العملاء</span>
          </Link>
          <Link to="/coaches" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={16} />
            <span>المدربون</span>
          </Link>
          <Link to="/employees" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={16} />
            <span>الموظفون</span>
          </Link>
          <Link to="/suppliers" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={16} />
            <span>الموردون</span>
          </Link>
          <Link to="/products" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={16} />
            <span>المنتجات</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

