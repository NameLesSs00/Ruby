import { useState, useEffect } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Receipt,
  RotateCcw,
  Clock,
  LayoutDashboard,
  User,
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import { getStoredTokens } from '../lib/axios';
import { decodeJwt } from '../modules/auth';

export const PosLayout = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const tokens = getStoredTokens();
  const decodedUser = tokens?.accessToken ? decodeJwt(tokens.accessToken) : null;
  const roleDisplay =
    decodedUser?.role === 'SuperAdmin'
      ? 'مدير عام النظام'
      : decodedUser?.role === 'ShopAdmin'
      ? 'مسؤول المتجر والـ POS'
      : decodedUser?.role || 'مستخدم النظام';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl',
      }}
    >
      {/* POS Top Navigation Header */}
      <header
        style={{
          backgroundColor: '#0d1527',
          color: '#ffffff',
          boxShadow: '0 2px 10px rgba(13, 21, 39, 0.15)',
          padding: '0.65rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid #1e293b',
        }}
      >
        {/* Brand & Terminal Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src={logoImg}
            alt="Ruby Academy Logo"
            style={{ width: 38, height: 38, objectFit: 'contain' }}
          />
          <div>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>نظام نقاط البيع</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  backgroundColor: '#ff6b22',
                  color: '#ffffff',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                }}
              >
                POS TERMINAL
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              أكاديمية روبي للسباحة
            </div>
          </div>
        </div>

        {/* Section Navigation Pills */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#16223e',
            padding: '0.3rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #1e293b',
          }}
        >
          <NavLink
            to="/pos"
            end
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: isActive ? '#0d1527' : 'transparent',
              color: isActive ? '#ffffff' : '#cbd5e1',
              border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
              boxShadow: isActive ? '0 2px 6px rgba(13, 21, 39, 0.5)' : 'none',
            })}
          >
            <ShoppingCart size={16} />
            <span>شاشة الكاشير</span>
          </NavLink>

          <NavLink
            to="/pos/sales"
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: isActive ? '#0d1527' : 'transparent',
              color: isActive ? '#ffffff' : '#cbd5e1',
              border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
              boxShadow: isActive ? '0 2px 6px rgba(13, 21, 39, 0.5)' : 'none',
            })}
          >
            <Receipt size={16} />
            <span>سجل المبيعات</span>
          </NavLink>

          <NavLink
            to="/pos/returns"
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: isActive ? '#0d1527' : 'transparent',
              color: isActive ? '#ffffff' : '#cbd5e1',
              border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
              boxShadow: isActive ? '0 2px 6px rgba(13, 21, 39, 0.5)' : 'none',
            })}
          >
            <RotateCcw size={16} />
            <span>المرتجعات</span>
          </NavLink>

          <NavLink
            to="/pos/due-payments"
            style={({ isActive }) => ({
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: isActive ? '#0d1527' : 'transparent',
              color: isActive ? '#ffffff' : '#cbd5e1',
              border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
              boxShadow: isActive ? '0 2px 6px rgba(13, 21, 39, 0.5)' : 'none',
            })}
          >
            <Clock size={16} />
            <span>الديون والمستحقات</span>
          </NavLink>
        </nav>

        {/* Live Clock & User Info & Exit to Admin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Live Clock Pill */}
          {currentTime && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                backgroundColor: '#16223e',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: '#38bdf8',
                fontWeight: 700,
                border: '1px solid #1e293b',
              }}
            >
              <Clock size={13} />
              <span>{currentTime}</span>
            </div>
          )}

          {/* User Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: '#16223e',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              color: '#cbd5e1',
              border: '1px solid #1e293b',
            }}
          >
            <User size={14} color="#38bdf8" />
            <span style={{ fontWeight: 600 }}>{decodedUser?.name || 'الكاشير'}</span>
            <span style={{ color: '#64748b' }}>|</span>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{roleDisplay}</span>
          </div>

          {/* Link to Admin Dashboard */}
          <Link
            to="/dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 700,
              backgroundColor: '#334155',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#475569')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
            title="الانتقال إلى لوحة التحكم الإدارية"
          >
            <LayoutDashboard size={15} />
            <span>لوحة الإدارة</span>
          </Link>
        </div>
      </header>

      {/* POS Content View */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
    </div>
  );
};
