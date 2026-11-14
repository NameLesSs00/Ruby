import { Ticket, ShoppingBag, PlusCircle, Landmark, Building2 } from 'lucide-react';
import type { IncomeReportSources } from '../../../modules/reports';
import { ReportSummaryCards, type SummaryCardItem } from '../ReportSummaryCards';

interface IncomeSourceCardsProps {
  sources?: IncomeReportSources;
}

export const IncomeSourceCards = ({ sources }: IncomeSourceCardsProps) => {
  if (!sources) return null;

  const cards: SummaryCardItem[] = [
    {
      id: 'subscriptions',
      label: 'مدفوعات الاشتراكات',
      value: `${sources.subscriptionPayments.toLocaleString('en-US')} ج.م`,
      icon: <Ticket size={20} />,
      variant: 'info',
    },
    {
      id: 'products',
      label: 'مبيعات المنتجات (POS)',
      value: `${sources.productSales.toLocaleString('en-US')} ج.م`,
      icon: <ShoppingBag size={20} />,
      variant: 'primary',
    },
    {
      id: 'other',
      label: 'إيرادات أخرى',
      value: `${sources.otherIncome.toLocaleString('en-US')} ج.م`,
      icon: <PlusCircle size={20} />,
      variant: 'success',
    },
    {
      id: 'ownerDeposits',
      label: 'إيداعات المالك',
      value: `${sources.ownerDeposits.toLocaleString('en-US')} ج.م`,
      icon: <Landmark size={20} />,
      variant: 'warning',
    },
    {
      id: 'external',
      label: 'تحصيل جهات خارجية',
      value: `${sources.externalEntityCollections.toLocaleString('en-US')} ج.م`,
      icon: <Building2 size={20} />,
      variant: 'neutral',
    },
  ];

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3
        style={{
          fontSize: '0.9375rem',
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: '0.75rem',
        }}
      >
        تفاصيل مصادر الإيرادات
      </h3>
      <ReportSummaryCards cards={cards} />
    </div>
  );
};
