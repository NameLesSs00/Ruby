import { Landmark, ArrowDownLeft, ArrowUpRight, Scale, Layers } from 'lucide-react';
import type { CashboxReportSummary } from '../../../modules/reports';
import { ReportSummaryCards, type SummaryCardItem } from '../ReportSummaryCards';

interface CashboxSummaryCardsProps {
  summary?: CashboxReportSummary;
}

export const CashboxSummaryCards = ({ summary }: CashboxSummaryCardsProps) => {
  if (!summary) return null;

  const cards: SummaryCardItem[] = [
    {
      id: 'totalCashboxes',
      label: 'عدد الخزائن',
      value: summary.totalCashboxes,
      icon: <Layers size={20} />,
      variant: 'neutral',
    },
    {
      id: 'currentBalance',
      label: 'إجمالي الرصيد الحالي',
      value: `${summary.totalCurrentBalance.toLocaleString('en-US')} ج.م`,
      icon: <Landmark size={20} />,
      variant: 'primary',
    },
    {
      id: 'incoming',
      label: 'إجمالي المقبوضات (وارد)',
      value: `+${summary.totalIncoming.toLocaleString('en-US')} ج.م`,
      icon: <ArrowDownLeft size={20} />,
      variant: 'success',
    },
    {
      id: 'outgoing',
      label: 'إجمالي المدفوعات (صادر)',
      value: `-${summary.totalOutgoing.toLocaleString('en-US')} ج.م`,
      icon: <ArrowUpRight size={20} />,
      variant: 'danger',
    },
    {
      id: 'netMovement',
      label: 'صافي حركة الخزائن',
      value:
        summary.netMovement >= 0
          ? `+${summary.netMovement.toLocaleString('en-US')} ج.م`
          : `${summary.netMovement.toLocaleString('en-US')} ج.م`,
      icon: <Scale size={20} />,
      variant: summary.netMovement >= 0 ? 'info' : 'warning',
    },
  ];

  return <ReportSummaryCards cards={cards} />;
};
