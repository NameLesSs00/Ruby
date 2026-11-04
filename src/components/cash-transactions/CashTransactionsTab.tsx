import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  cashTransactionsApi,
  cashTransactionKeys,
  type CashboxType,
  type CashTransactionType,
  type CashReferenceType,
  type CashTransaction,
} from '../../modules/cashTransactions';
import { CashTransactionsFilterBar } from './CashTransactionsFilterBar';
import { CashTransactionsTable } from './CashTransactionsTable';
import { CashTransactionDetailsModal } from './CashTransactionDetailsModal';

interface CashTransactionsTabProps {
  initialCashbox?: CashboxType;
  onCashboxChange?: (box: CashboxType | undefined) => void;
}

export const CashTransactionsTab = ({
  initialCashbox,
  onCashboxChange,
}: CashTransactionsTabProps = {}) => {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [cashboxFilter, setCashboxFilter] = useState<CashboxType | undefined>(initialCashbox);
  const [typeFilter, setTypeFilter] = useState<CashTransactionType | undefined>();
  const [referenceFilter, setReferenceFilter] = useState<CashReferenceType | undefined>();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<CashTransaction | null>(null);

  const queryParams = useMemo(
    () => ({
      cashboxType: cashboxFilter,
      transactionType: typeFilter,
      referenceType: referenceFilter,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      pageNumber: page,
      pageSize,
    }),
    [cashboxFilter, typeFilter, referenceFilter, fromDate, toDate, page, pageSize]
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: cashTransactionKeys.list(queryParams),
    queryFn: () => cashTransactionsApi.getAll(queryParams),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const handleResetFilters = () => {
    setCashboxFilter(undefined);
    onCashboxChange?.(undefined);
    setTypeFilter(undefined);
    setReferenceFilter(undefined);
    setFromDate('');
    setToDate('');
    setPage(1);
  };

  return (
    <>
      <CashTransactionsFilterBar
        cashboxFilter={cashboxFilter}
        onCashboxChange={(val) => {
          setCashboxFilter(val);
          onCashboxChange?.(val);
          setPage(1);
        }}
        typeFilter={typeFilter}
        onTypeChange={(val) => {
          setTypeFilter(val);
          setPage(1);
        }}
        referenceFilter={referenceFilter}
        onReferenceChange={(val) => {
          setReferenceFilter(val);
          setPage(1);
        }}
        fromDate={fromDate}
        onFromDateChange={(val) => {
          setFromDate(val);
          setPage(1);
        }}
        toDate={toDate}
        onToDateChange={(val) => {
          setToDate(val);
          setPage(1);
        }}
        onRefresh={() => refetch()}
        onReset={handleResetFilters}
      />

      <CashTransactionsTable
        items={rawItems}
        isLoading={isLoading}
        isError={isError}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onSelectTransaction={setSelectedTransaction}
      />

      <CashTransactionDetailsModal
        isOpen={Boolean(selectedTransaction)}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </>
  );
};
