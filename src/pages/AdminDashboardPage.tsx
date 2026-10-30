import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  LayoutDashboard,
  Users,
  Award,
  CreditCard,
  Calendar,
  CheckSquare,
  TrendingUp,
  Receipt,
  Settings,
  LogOut,
  FolderKanban,
  Menu,
  X,
  Briefcase,
  Truck,
  Package,
} from 'lucide-react';
import logoImg from '../assets/logo.png';
import { authApi, decodeJwt } from '../modules/auth';
import { getStoredTokens } from '../lib/axios';
import { showToast } from '../lib/sonner';
import { CoachesPage } from './CoachesPage';
import { EmployeesPage } from './EmployeesPage';
import { SuppliersPage } from './SuppliersPage';
import { ProductsPage } from './ProductsPage';

interface TabItem {
  id: string;
  label: string;
  icon: ReactNode;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: 'dashboard',
    label: 'لوحة التحكم',
    icon: <LayoutDashboard size={20} className="nav-icon" />,
    description: 'نظرة عامة على الإحصائيات اليومية والأنشطة',
  },
  {
    id: 'swimmers',
    label: 'السباحون',
    icon: <Users size={20} className="nav-icon" />,
    description: 'إدارة ملفات السباحين والطلاب والمستويات الرياضية',
  },
  {
    id: 'coaches',
    label: 'المدربون',
    icon: <Award size={20} className="nav-icon" />,
    description: 'إدارة الكادر التدريبي والمسارات المخصصة',
  },
  {
    id: 'employees',
    label: 'الموظفون',
    icon: <Briefcase size={20} className="nav-icon" />,
    description: 'إدارة شؤون الموظفين، الرواتب، والوظائف الإدارية',
  },
  {
    id: 'suppliers',
    label: 'الموردون',
    icon: <Truck size={20} className="nav-icon" />,
    description: 'إدارة الموردين والشركات الموردة للمعدات والمنتجات',
  },
  {
    id: 'products',
    label: 'المنتجات',
    icon: <Package size={20} className="nav-icon" />,
    description: 'إدارة المنتجات، الأسعار، وتصنيفات المبيعات',
  },
  {
    id: 'subscriptions',
    label: 'الاشتراكات',
    icon: <CreditCard size={20} className="nav-icon" />,
    description: 'باقات العضوية والاشتراكات الشهرية والسنوية',
  },
  {
    id: 'schedules',
    label: 'الجداول والمسارات',
    icon: <Calendar size={20} className="nav-icon" />,
    description: 'جداول الحصص التدريبية ومسارات المسبح',
  },
  {
    id: 'attendance',
    label: 'تسجيل الحضور',
    icon: <CheckSquare size={20} className="nav-icon" />,
    description: 'تسجيل حضور وغياب السباحين والمدربين',
  },
  {
    id: 'evaluations',
    label: 'التقييمات',
    icon: <TrendingUp size={20} className="nav-icon" />,
    description: 'تقييم مستويات السباحة والمهارات الفنية',
  },
  {
    id: 'billing',
    label: 'المالية والفواتير',
    icon: <Receipt size={20} className="nav-icon" />,
    description: 'سجلات الدفع والفواتير والتحصيلات',
  },
  {
    id: 'settings',
    label: 'الإعدادات',
    icon: <Settings size={20} className="nav-icon" />,
    description: 'إعدادات النظام العامة والمستخدمين',
  },
];

interface AdminDashboardPageProps {
  onLogout: () => void;
}

export const AdminDashboardPage = ({ onLogout }: AdminDashboardPageProps) => {
  const [activeTabId, setActiveTabId] = useState<string>('coaches');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const tokens = getStoredTokens();
  const decodedUser = tokens?.accessToken ? decodeJwt(tokens.accessToken) : null;
  const userName = decodedUser?.name || 'مدير النظام';
  const userRole = decodedUser?.role || 'SuperAdmin';

  const activeTab = TABS.find((t) => t.id === activeTabId) || TABS[0];

  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
    setIsMobileSidebarOpen(false); // Close sidebar drawer on mobile after clicking
  };

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
      setIsLoggingOut(false);
      onLogout();
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
          {TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleSelectTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
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
            <h2 className="dashboard-header-title">{activeTab.label}</h2>
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

        {/* Tab Content */}
        <main className="dashboard-body">
          {activeTabId === 'coaches' ? (
            <CoachesPage />
          ) : activeTabId === 'employees' ? (
            <EmployeesPage />
          ) : activeTabId === 'suppliers' ? (
            <SuppliersPage />
          ) : activeTabId === 'products' ? (
            <ProductsPage />
          ) : (
            <div className="empty-placeholder-card">
              <div className="placeholder-icon-wrap">
                <FolderKanban size={34} />
              </div>
              <h3 className="placeholder-title">{activeTab.label}</h3>
              <p className="placeholder-desc">{activeTab.description}</p>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                الصفحة فارغة حالياً وقيد التطوير
              </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
