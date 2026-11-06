import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowLeft,
  Home,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import { getStoredTokens, setStoredTokens } from '../lib/axios';
import {
  authApi,
  decodeJwt,
  getAllowedPagesForRole,
  getDefaultRouteForRole,
  getRoleDisplayName,
} from '../modules/auth';
import { showToast } from '../lib/sonner';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const tokens = getStoredTokens();
  const user = tokens?.accessToken ? decodeJwt(tokens.accessToken) : null;
  const role = user?.role || 'SuperAdmin';
  const roleLabel = getRoleDisplayName(role);
  const allowedPages = getAllowedPagesForRole(role);
  const defaultRoute = getDefaultRouteForRole(role);

  const handleLogout = async () => {
    try {
      if (tokens?.refreshToken) {
        await authApi.logout(tokens.refreshToken);
      }
      showToast.info('تم تسجيل الخروج بنجاح');
    } catch {
      showToast.info('تم تسجيل الخروج');
    } finally {
      setStoredTokens(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px -5px rgba(13, 21, 39, 0.08)',
          padding: '2.25rem 2rem',
          textAlign: 'center',
        }}
      >
        {/* Icon Badge */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            border: '2px solid #fecaca',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <ShieldAlert size={36} />
        </div>

        {/* Main Message */}
        <h1
          style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#0d1527',
            margin: '0 0 0.5rem',
          }}
        >
          عفواً، ليس لديك صلاحية للوصول إلى هذه الصفحة
        </h1>
        <p
          style={{
            fontSize: '0.92rem',
            color: '#64748b',
            margin: '0 auto 1.25rem',
            maxWidth: '520px',
            lineHeight: 1.6,
          }}
        >
          حسابك الحالي مسجل بصلاحية{' '}
          <strong style={{ color: '#0d1527', fontWeight: 800 }}>{roleLabel}</strong>، ولا يتضمن
          أذونات عرض هذا القسم. يمكنك الانتقال مباشرة إلى أحد الأقسام المتاحة لك أدناه:
        </p>

        {/* Allowed Pages Section */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            textAlign: 'start',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              color: '#0d1527',
              marginBottom: '0.85rem',
            }}
          >
            <CheckCircle2 size={18} color="#0284c7" />
            <span>الأقسام والصفحات المسموح لك بالدخول إليها:</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {allowedPages.map((page) => (
              <button
                key={page.path}
                type="button"
                onClick={() => navigate(page.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'start',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0d1527';
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: '#0d1527',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {page.label}
                  </div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      lineHeight: 1.4,
                    }}
                  >
                    {page.description}
                  </div>
                </div>
                <ArrowLeft size={18} color="#0d1527" style={{ flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => navigate(defaultRoute, { replace: true })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
              borderRadius: '8px',
              backgroundColor: '#0d1527',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <Home size={17} />
            <span>الانتقال إلى صفحتي الرئيسية</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </div>
  );
};

