import {
  Wallet,
  RotateCcw,
  XCircle,
  ShoppingBag,
  Banknote,
  Award,
  Landmark,
  FileMinus,
} from 'lucide-react';
import type { ExpenseReportSources } from '../../../modules/reports';
import { ReportSummaryCards, type SummaryCardItem } from '../ReportSummaryCards';

interface ExpenseSourceCardsProps {
  sources?: ExpenseReportSources;
}

export const ExpenseSourceCards = ({ sources }: ExpenseSourceCardsProps) => {
  if (!sources) return null;

  const cards: SummaryCardItem[] = [
    {
      id: 'academyExpenses',
      label: 'مصروفات الأكاديمية العامة',
      value: `${sources.academyExpenses.toLocaleString('en-US')} ج.م`,
      icon: <Wallet size={20} />,
      variant: 'danger',
    },
    {
      id: 'purchasePayments',
      label: 'مدفوعات فواتير المشتريات',
      value: `${sources.purchasePayments.toLocaleString('en-US')} ج.م`,
      icon: <ShoppingBag size={20} />,
      variant: 'primary',
    },
    {
      id: 'subscriptionCancellations',
      label: 'استرداد إلغاء الاشتراكات',
      value: `${sources.subscriptionCancellations.toLocaleString('en-US')} ج.م`,
      icon: <XCircle size={20} />,
      variant: 'warning',
    },
    {
      id: 'saleReturns',
      label: 'مرتجعات مبيعات POS',
      value: `${sources.saleReturns.toLocaleString('en-US')} ج.م`,
      icon: <RotateCcw size={20} />,
      variant: 'neutral',
    },
    {
      id: 'coachPayments',
      label: 'مدفوعات المدربين',
      value: `${sources.coachPayments.toLocaleString('en-US')} ج.م`,
      icon: <Award size={20} />,
      variant: 'info',
    },
    {
      id: 'payrollPayments',
      label: 'مدفوعات الرواتب',
      value: `${sources.payrollPayments.toLocaleString('en-US')} ج.م`,
      icon: <Banknote size={20} />,
      variant: 'primary',
    },
    {
      id: 'ownerWithdrawals',
      label: 'سحوبات المالك',
      value: `${sources.ownerWithdrawals.toLocaleString('en-US')} ج.م`,
      icon: <Landmark size={20} />,
      variant: 'danger',
    },
    {
      id: 'otherExpenses',
      label: 'مصروفات أخرى',
      value: `${sources.otherExpenses.toLocaleString('en-US')} ج.م`,
      icon: <FileMinus size={20} />,
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
        تفاصيل بنود ومصادر المصروفات
      </h3>
      <ReportSummaryCards cards={cards} />
    </div>
  );
};
