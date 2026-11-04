import { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Plus, ArrowUpLeft, ArrowDownRight, Wallet, Calendar, RotateCcw } from 'lucide-react';
import {
  ownerTransactionsApi,
  ownerTransactionKeys,
  type OwnerTransaction,
  type OwnerTransactionType,
} from '../../modules/ownerTransactions';
import { type CashboxType } from '../../modules/cashTransactions';
import { OwnerTransactionsTable } from './OwnerTransactionsTable';
import { CreateOwnerTransactionModal } from './CreateOwnerTransactionModal';
import { OwnerTransactionDetailsModal } from './OwnerTransactionDetailsModal';

interface OwnerTransactionsTabProps {
  initialCashbox?: CashboxType;
}

export const OwnerTransactionsTab = ({ initialCashbox }: OwnerTransactionsTabProps = {}) => {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [selectedType, setSelectedType] = useState<OwnerTransactionType | 'All'>('All');
  const [selectedCashbox, setSelectedCashbox] = useState<CashboxType | 'All'>(initialCashbox || 'All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailsTx, setDetailsTx] = useState<OwnerTransaction | null>(null);

  const queryParams = useMemo(() => ({
    pageNumber: page,
    pageSize,
    transactionType: selectedType === 'All' ? undefined : selectedType,
    cashboxType: selectedCashbox === 'All' ? undefined : selectedCashbox,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
  }), [page, pageSize, selectedType, selectedCashbox, fromDate, toDate]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ownerTransactionKeys.list(queryParams),
    queryFn: () => ownerTransactionsApi.getAll(queryParams),
    placeholderData: keepPreviousData,
  });

  const transactions = data?.items || [];
  const totalCount = data?.totalCount || 0;

  // Compute page totals
  const totalWithdrawals = useMemo(() => {
    return transactions
      .filter((t) => t.transactionType === 'Withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalDeposits = useMemo(() => {
    return transactions
      .filter((t) => t.transactionType === 'Deposit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const netOwnerFlow = totalDeposits - totalWithdrawals;

  const handleResetFilters = () => {
    setSelectedType('All');
    setSelectedCashbox('All');
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  const hasActiveFilters = selectedType !== 'All' || selectedCashbox !== 'All' || !!fromDate || !!toDate;

  return (
    <div>
      {/* KPI Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Total Withdrawals */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fff1f2',
              color: '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUpLeft size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي مسحوبات المالك</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#e11d48' }}>
              {totalWithdrawals.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>ج.م</span>
            </div>
          </div>
        </div>

        {/* Total Deposits */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowDownRight size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي إيداعات المالك</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#059669' }}>
              {totalDeposits.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>ج.م</span>
            </div>
          </div>
        </div>

        {/* Net Flow */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#f8fafc',
              color: '#0d1527',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wallet size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>صافي حركة المالك (في الصفحة)</div>
            <div
              style={{
                fontSize: '1.3rem',
                fontWeight: 900,
                color: netOwnerFlow >= 0 ? '#059669' : '#e11d48',
              }}
            >
              {netOwnerFlow.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>ج.م</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="view-toolbar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          {/* Transaction Type Filter Switcher */}
          <div className="tab-switcher">
            <button
              type="button"
              className={`tab-btn ${selectedType === 'All' ? 'active' : ''}`}
              onClick={() => {
                setSelectedType('All');
                setPage(1);
              }}
            >
              الكل
            </button>
            <button
              type="button"
              className={`tab-btn ${selectedType === 'Withdrawal' ? 'active' : ''}`}
              onClick={() => {
                setSelectedType('Withdrawal');
                setPage(1);
              }}
            >
              مسحوبات
            </button>
            <button
              type="button"
              className={`tab-btn ${selectedType === 'Deposit' ? 'active' : ''}`}
              onClick={() => {
                setSelectedType('Deposit');
                setPage(1);
              }}
            >
              إيداعات
            </button>
          </div>

          {/* Cashbox Select Filter */}
          <select
            className="select-filter"
            value={selectedCashbox}
            onChange={(e) => {
              setSelectedCashbox(e.target.value as CashboxType | 'All');
              setPage(1);
            }}
          >
            <option value="All">جميع الخزن</option>
            <option value="POS">خزينة الكاشير والمتجر (POS)</option>
            <option value="Subscriptions">خزينة الاشتراكات والاستقبال</option>
            <option value="Main">الخزينة الرئيسية</option>
          </select>

          {/* Date Range Inputs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={15} color="#64748b" />
            <input
              type="date"
              className="form-input"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
              title="من تاريخ"
            />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>إلى</span>
            <input
              type="date"
              className="form-input"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
              title="إلى تاريخ"
            />
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
              onClick={handleResetFilters}
            >
              <RotateCcw size={14} />
              <span>إعادة تعيين</span>
            </button>
          )}
        </div>

        {/* Create Owner Transaction CTA Button */}
        <button
          type="button"
          className="btn-add"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus size={18} />
          <span>تسجيل حركة مالك</span>
        </button>
      </div>

      {/* Table */}
      <OwnerTransactionsTable
        transactions={transactions}
        isLoading={isLoading}
        isError={isError}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onViewDetails={(tx) => setDetailsTx(tx)}
      />

      {/* Create Modal */}
      <CreateOwnerTransactionModal
        isOpen={isCreateOpen}
        defaultCashbox={selectedCashbox !== 'All' ? selectedCashbox : 'POS'}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Details Modal */}
      <OwnerTransactionDetailsModal
        isOpen={Boolean(detailsTx)}
        transaction={detailsTx}
        onClose={() => setDetailsTx(null)}
      />
    </div>
  );
};

