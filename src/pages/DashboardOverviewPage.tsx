import { DashboardWelcomeBanner } from '../components/dashboard/DashboardWelcomeBanner';
import { DashboardQuickActions } from '../components/dashboard/DashboardQuickActions';
import { DashboardKpiCounters } from '../components/dashboard/DashboardKpiCounters';
import { DashboardModulesGrid } from '../components/dashboard/DashboardModulesGrid';

export const DashboardOverviewPage = () => {
  return (
    <div className="view-container" style={{ paddingBottom: '3rem' }}>
      {/* 1. Welcome Greeting Banner & Role Identity */}
      <DashboardWelcomeBanner />

      {/* 2. Primary High-Frequency Quick Actions */}
      <DashboardQuickActions />

      {/* 3. Live Operational KPI Counters */}
      <DashboardKpiCounters />

      {/* 4. Categorized Systems & Workspaces Navigation */}
      <DashboardModulesGrid />
    </div>
  );
};
