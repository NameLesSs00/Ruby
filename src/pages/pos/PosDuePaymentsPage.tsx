import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, History } from 'lucide-react';
import {
  posDuePaymentsApi,
  posKeys,
  type PosDuePayment,
  type DuePaymentStatus,
} from '../../modules/pos';
import { PosDebtsTab } from '../../components/pos/PosDebtsTab';
import { PosPaymentHistoryTab } from '../../components/pos/PosPaymentHistoryTab';
import { RecordPosPaymentModal } from '../../components/pos/RecordPosPaymentModal';

export const PosDuePaymentsPage = () => {
  const [activeTab, setActiveTab] = useState<'debts' | 'history'>('debts');
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [statusFilter, setStatusFilter] = useState<DuePaymentStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [payingDue, setPayingDue] = useState<PosDuePayment | null>(null);

  const { data: dueData, isLoading, isError } = useQuery({
    queryKey: posKeys.duePayments.list({ page, pageSize, status: statusFilter }),
    queryFn: () => posDuePaymentsApi.getAll({ page, pageSize, status: statusFilter }),
    enabled: activeTab === 'debts',
  });

  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: posKeys.duePayments.history({ page, pageSize }),
    queryFn: () => posDuePaymentsApi.getPaymentHistory({ page, pageSize }),
    enabled: activeTab === 'history',
  });

  const totalCount = dueData?.totalCount || 0;
  const totalPages = dueData?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  return (
    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={22} color="#ff6b22" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0d1527' }}>
              الديون والمستحقات الآجلة (POS)
            </h2>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            متابعة حسابات وفواتير البيع الآجل، تسجيل دفعات التحصيل، ومراجعة سجل الخزينة
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveTab('debts');
              setPage(1);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'debts' ? '#0d1527' : 'transparent',
              color: activeTab === 'debts' ? '#ffffff' : '#64748b',
            }}
          >
            <Clock size={16} />
            <span>سجل الديون والمستحقات</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              setPage(1);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: activeTab === 'history' ? '#0d1527' : 'transparent',
              color: activeTab === 'history' ? '#ffffff' : '#64748b',
            }}
          >
            <History size={16} />
            <span>سجل المدفوعات والتحصيلات</span>
          </button>
        </div>
      </div>

      {activeTab === 'debts' ? (
        <PosDebtsTab
          items={dueData?.items || []}
          totalCount={totalCount}
          page={page}
          totalPages={totalPages}
          isLoading={isLoading}
          isError={isError}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={(status) => {
            setStatusFilter(status);
            setPage(1);
          }}
          onPageChange={setPage}
          onOpenPaymentModal={setPayingDue}
        />
      ) : (
        <PosPaymentHistoryTab
          items={historyData?.items || []}
          isLoading={isHistoryLoading}
        />
      )}

      <RecordPosPaymentModal
        duePayment={payingDue}
        onClose={() => setPayingDue(null)}
      />
    </div>
  );
};
