import { useQuery } from '@tanstack/react-query';
import { Landmark, Ticket, ShoppingCart, Wallet, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import {
  cashTransactionsApi,
  cashTransactionKeys,
  cashboxLabel,
  type CashboxType,
} from '../../modules/cashTransactions';

export const CashboxBalanceCards = () => {
  const { data: balances = [], isLoading } = useQuery({
    queryKey: cashTransactionKeys.balances(),
    queryFn: cashTransactionsApi.getBalances,
  });

  const mainBox = balances.find((b) => b.cashboxType === 'Main');
  const subsBox = balances.find((b) => b.cashboxType === 'Subscriptions');
  const posBox = balances.find((b) => b.cashboxType === 'POS');

  const totalLiquidity = balances.reduce((sum, b) => sum + (b.balance || 0), 0);
  const totalIncomeAll = balances.reduce((sum, b) => sum + (b.totalIncome || 0), 0);
  const totalExpenseAll = balances.reduce((sum, b) => sum + (b.totalExpense || 0), 0);

  const getCashboxIcon = (type: CashboxType) => {
    switch (type) {
      case 'Main':
        return <Landmark size={20} />;
      case 'Subscriptions':
        return <Ticket size={20} />;
      case 'POS':
        return <ShoppingCart size={20} />;
    }
  };

  const renderSingleBoxCard = (
    type: CashboxType,
    income: number,
    expense: number,
    bal: number,
    accentColor: string
  ) => {
    return (
      <div
        key={type}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1.1rem 1.25rem',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                backgroundColor: `${accentColor}15`,
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getCashboxIcon(type)}
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#0d1527', fontSize: '0.95rem' }}>
                {cashboxLabel(type)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                {type === 'Main' ? 'الإدارة العامة' : type === 'Subscriptions' ? 'الاستقبال والاشتراكات' : 'المتجر ونقاط البيع'}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.15rem' }}>الرصيد المتاح</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 900, color: bal >= 0 ? '#0d1527' : '#dc2626' }}>
            {isLoading ? '...' : bal.toLocaleString('ar-EG')}{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#16a34a' }}>
            <ArrowDownLeft size={13} />
            <span>وارد: {income.toLocaleString('ar-EG')} ج.م</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626' }}>
            <ArrowUpRight size={13} />
            <span>صادر: {expense.toLocaleString('ar-EG')} ج.م</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}
    >
      {/* Total Liquid Assets Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d1527 0%, #1e293b 100%)',
          borderRadius: 'var(--radius-md)',
          padding: '1.1rem 1.25rem',
          boxShadow: 'var(--shadow-sm)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>إجمالي السيولة النقدية</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>كافة الخزن مجتمعة</div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.15rem' }}>إجمالي الرصيد الصافي</div>
          <div style={{ fontSize: '1.55rem', fontWeight: 900, color: '#ffffff' }}>
            {isLoading ? '...' : totalLiquidity.toLocaleString('ar-EG')}{' '}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>ج.م</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', color: '#cbd5e1' }}>
          <div>وارد: {totalIncomeAll.toLocaleString('ar-EG')} ج.م</div>
          <div>منصرف: {totalExpenseAll.toLocaleString('ar-EG')} ج.م</div>
        </div>
      </div>

      {/* Main Cashbox Card */}
      {renderSingleBoxCard('Main', mainBox?.totalIncome || 0, mainBox?.totalExpense || 0, mainBox?.balance || 0, '#0284c7')}

      {/* Subscriptions Cashbox Card */}
      {renderSingleBoxCard('Subscriptions', subsBox?.totalIncome || 0, subsBox?.totalExpense || 0, subsBox?.balance || 0, '#ea580c')}

      {/* POS Cashbox Card */}
      {renderSingleBoxCard('POS', posBox?.totalIncome || 0, posBox?.totalExpense || 0, posBox?.balance || 0, '#8b5cf6')}
    </div>
  );
};

