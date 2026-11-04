import { useMemo } from 'react';
import { Calendar, Shield, Sparkles } from 'lucide-react';
import { getStoredTokens } from '../../lib/axios';
import { decodeJwt, type UserRole } from '../../modules/auth';

const ROLE_LABELS: Record<string, string> = {
  SuperAdmin: 'المدير العام',
  ReceptionAdmin: 'مسؤول الاستقبال',
  ShopAdmin: 'مسؤول المتجر ونقطة البيع',
  Admin: 'مشرف النظام',
  Coach: 'كادر تدريبي',
  Receptionist: 'موظف استقبال',
};

export const DashboardWelcomeBanner = () => {
  const user = useMemo(() => {
    const tokens = getStoredTokens();
    if (tokens?.accessToken) {
      return decodeJwt(tokens.accessToken);
    }
    return null;
  }, []);

  const todayArabic = useMemo(() => {
    try {
      const now = new Date();
      return now.toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }, []);

  const userName = user?.name || 'مستخدم النظام';
  const roleName = user?.role ? (ROLE_LABELS[user.role as UserRole] || user.role) : 'مسؤول النظام';

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0D1527 0%, #16223e 60%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '1.5rem 1.75rem',
        color: '#ffffff',
        marginBottom: '1.5rem',
        boxShadow: '0 10px 25px -5px rgba(13, 21, 39, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
      }}
    >
      {/* Decorative Cyan / Orange Glow in background */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          left: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-50px',
          right: '25%',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 34, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Greeting & Identity */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38BDF8',
              padding: '0.2rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <Sparkles size={13} />
            لوحة الإدارة والمتابعة
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: 'rgba(255, 107, 34, 0.18)',
              border: '1px solid rgba(255, 107, 34, 0.4)',
              color: '#FF6B22',
              padding: '0.2rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}
          >
            <Shield size={13} />
            {roleName}
          </span>
        </div>

        <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
          أهلاً بك، {userName}
        </h1>
        <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
          مركز العمليات والتحكم الشامل لأكاديمية روبي للسباحة
        </p>
      </div>

      {/* Date & Time Widget */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '0.65rem 1rem',
          borderRadius: '12px',
        }}
      >
        <Calendar size={18} color="#38BDF8" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
          {todayArabic}
        </span>
      </div>
    </div>
  );
};

