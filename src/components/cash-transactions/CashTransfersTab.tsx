import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, RefreshCw, RotateCcw } from 'lucide-react';
import {
  cashTransfersApi,
  cashTransferKeys,
  type CashboxType,
  cashboxLabel,
} from '../../modules/cashTransactions';
import { CashTransfersTable } from './CashTransfersTable';
import { CreateCashTransferModal } from './CreateCashTransferModal';

export const CashTransfersTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [fromCashbox, setFromCashbox] = useState<CashboxType | undefined>();
  const [toCashbox, setToCashbox] = useState<CashboxType | undefined>();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const queryParams = useMemo(
    () => ({
      fromCashboxType: fromCashbox,
      toCashboxType: toCashbox,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      pageNumber: page,
      pageSize,
    }),
    [fromCashbox, toCashbox, fromDate, toDate, page, pageSize]
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: cashTransferKeys.list(queryParams),
    queryFn: () => cashTransfersApi.getAll(queryParams),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const setDatePreset = (preset: 'today' | 'week' | 'month' | 'all') => {
    const now = new Date();
    if (preset === 'today') {
      const d = now.toISOString().slice(0, 10);
      setFromDate(d);
      setToDate(d);
    } else if (preset === 'week') {
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setFromDate(past.toISOString().slice(0, 10));
      setToDate(now.toISOString().slice(0, 10));
    } else if (preset === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      setFromDate(firstDay);
      setToDate(now.toISOString().slice(0, 10));
    } else {
      setFromDate('');
      setToDate('');
    }
    setPage(1);
  };

  const hasActiveFilters = Boolean(fromCashbox || toCashbox || fromDate || toDate);

  const resetFilters = () => {
    setFromCashbox(undefined);
    setToCashbox(undefined);
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  return (
    <>
      {/* Filter Bar */}
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '1rem 1.2rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>فترة سريعة:</span>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => setDatePreset('today')}
            >
              اليوم
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => setDatePreset('week')}
            >
              آخر 7 أيام
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => setDatePreset('month')}
            >
              هذا الشهر
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }}
              onClick={() => setDatePreset('all')}
            >
              الكل
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#dc2626' }}
                onClick={resetFilters}
              >
                <RotateCcw size={12} />
                <span>إعادة ضبط</span>
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => refetch()}
              title="تحديث البيانات"
            >
              <RefreshCw size={14} />
              <span>تحديث</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem', width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={() => setIsTransferModalOpen(true)}
            >
              <Plus size={15} />
              <span>تحويل نقدية جديد</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>من خزينة (المصدر)</label>
            <select
              className="form-input"
              value={fromCashbox || ''}
              onChange={(e) => {
                setFromCashbox(e.target.value ? (e.target.value as CashboxType) : undefined);
                setPage(1);
              }}
            >
              <option value="">كافة خزن المصدر</option>
              <option value="Main">{cashboxLabel('Main')}</option>
              <option value="Subscriptions">{cashboxLabel('Subscriptions')}</option>
              <option value="POS">{cashboxLabel('POS')}</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>إلى خزينة (الوجهة)</label>
            <select
              className="form-input"
              value={toCashbox || ''}
              onChange={(e) => {
                setToCashbox(e.target.value ? (e.target.value as CashboxType) : undefined);
                setPage(1);
              }}
            >
              <option value="">كافة خزن الوجهة</option>
              <option value="Main">{cashboxLabel('Main')}</option>
              <option value="Subscriptions">{cashboxLabel('Subscriptions')}</option>
              <option value="POS">{cashboxLabel('POS')}</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>من تاريخ</label>
            <input
              type="date"
              className="form-input"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>إلى تاريخ</label>
            <input
              type="date"
              className="form-input"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Transfers Table */}
      <CashTransfersTable
        items={rawItems}
        isLoading={isLoading}
        isError={isError}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />

      {/* Transfer Modal */}
      <CreateCashTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      />
    </>
  );
};

