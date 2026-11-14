import { Package, ArrowDownLeft, ArrowUpRight, Activity, Boxes } from 'lucide-react';
import type { WarehouseReportSummary } from '../../../modules/reports';
import { ReportSummaryCards, type SummaryCardItem } from '../ReportSummaryCards';

interface WarehouseSummaryCardsProps {
  summary?: WarehouseReportSummary;
}

export const WarehouseSummaryCards = ({ summary }: WarehouseSummaryCardsProps) => {
  if (!summary) return null;

  const cards: SummaryCardItem[] = [
    {
      id: 'totalProducts',
      label: 'عدد الأصناف',
      value: summary.totalProducts,
      icon: <Package size={20} />,
      variant: 'neutral',
    },
    {
      id: 'currentStock',
      label: 'إجمالي المخزون الحالي',
      value: summary.totalCurrentStock,
      icon: <Boxes size={20} />,
      variant: 'info',
    },
    {
      id: 'incoming',
      label: 'إجمالي الوارد (In)',
      value: `+${summary.totalIncoming}`,
      icon: <ArrowDownLeft size={20} />,
      variant: 'success',
    },
    {
      id: 'outgoing',
      label: 'إجمالي المنصرف (Out)',
      value: `-${summary.totalOutgoing}`,
      icon: <ArrowUpRight size={20} />,
      variant: 'warning',
    },
    {
      id: 'netMovement',
      label: 'صافي حركة الفترة',
      value: summary.netMovement >= 0 ? `+${summary.netMovement}` : `${summary.netMovement}`,
      icon: <Activity size={20} />,
      variant: summary.netMovement >= 0 ? 'success' : 'danger',
    },
  ];

  return <ReportSummaryCards cards={cards} />;
};
