import { useState } from 'react';
import type { ReactNode } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Award,
  LogOut,
  Menu,
  X,
  Briefcase,
  Truck,
  Package,
  Boxes,
  Banknote,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import { authApi, decodeJwt } from '../modules/auth';
import { getStoredTokens, setStoredTokens } from '../lib/axios';
import { showToast } from '../lib/sonner';

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
  allowedRoles?: string[];
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/dashboard',
    label: 'لوحة التحكم',
    icon: <LayoutDashboard size={20} className="nav-icon" />,
  },
  {
    path: '/admins',
    label: 'المسؤولون',
    icon: <ShieldCheck size={20} className="nav-icon" />,
    allowedRoles: ['SuperAdmin'],
  },
  {
    path: '/clients',
    label: 'العملاء',
    icon: <Users size={20} className="nav-icon" />,
    allowedRoles: ['SuperAdmin', 'ReceptionAdmin'],
  },
  {
    path: '/subscriptions',
    label: 'الاشتراكات',
    icon: <Ticket size={20} className="nav-icon" />,
    allowedRoles: ['SuperAdmin', 'ReceptionAdmin'],
  },
  {
    path: '/coaches',
    label: 'المدربون',
    icon: <Award size={20} className="nav-icon" />,
    allowedRoles: ['SuperAdmin', 'ReceptionAdmin'],
  },
  {
    path: '/employees',
    label: 'الموظفون',
    icon: <Briefcase size={20} className="nav-icon" />,
    allowedRoles: ['SuperAdmin'],
  },
  {
    path: '/suppliers',
    label: 'الموردون',
    icon: <Truck size={20} className="nav-icon" />,
    allowedRoles: ['SuperAdmin', 'ShopAdmin'],
  },
  {
    path: '/products',
    label: 'المنتجات',
    icon: <Package size={20} className="nav-icon" />,
    allowedRoles: ['SuperAdmin', 'ShopAdmin'],
  },
  {
    path: '/inventory',
    label: 'المخزون',
    icon: <Boxes size={20} className="nav-icon" />,
    allowedRoles: ['SuperAdmin', 'ShopAdmin'],
  },
  {
    path: '/payroll',
    label: 'الرواتب',
    icon: <Banknote size={20} className="nav-icon" />,
    allowedRoles: ['SuperAdmin'],
  },
];

export const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tokens = getStoredTokens();
  const decodedUser = tokens?.accessToken ? decodeJwt(tokens.accessToken) : null;
  const userName = decodedUser?.name || 'مدير النظام';
  const userRole = decodedUser?.role || 'SuperAdmin';

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(userRole);
  });

  const currentNavItem =
    visibleNavItems.find((item) => location.pathname.startsWith(item.path)) || visibleNavItems[0] || NAV_ITEMS[0];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (tokens?.refreshToken) {
        await authApi.logout(tokens.refreshToken);
      }
      showToast.info('تم تسجيل الخروج بنجاح');
    } catch {
      showToast.info('تم تسجيل الخروج');
    } finally {
      setStoredTokens(null);
      setIsLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Right-Docked RTL Sidebar */}
      <aside className={`dashboard-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <img
            src={logoImg}
            alt="أكاديمية روبي للسباحة"
            className="sidebar-logo-img"
          />
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setIsMobileSidebarOpen(false)}
              style={{ textDecoration: 'none' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut size={18} />
            <span>{isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-start-group">
            <button
              type="button"
              className="hamburger-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="فتح القائمة"
            >
              <Menu size={22} />
            </button>
            <h2 className="dashboard-header-title">{currentNavItem.label}</h2>
          </div>

          <div className="dashboard-header-actions">
            <div className="user-badge">
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">{userRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Route View Content */}
        <main className="dashboard-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
