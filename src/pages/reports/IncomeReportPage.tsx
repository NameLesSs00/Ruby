import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Hash } from 'lucide-react';
import { reportsApi, reportKeys, type ReportDateParams } from '../../modules/reports';
import { ReportFilterBar } from '../../components/reports/ReportFilterBar';
import { ReportSummaryCards, type SummaryCardItem } from '../../components/reports/ReportSummaryCards';
import { IncomeSourceCards } from '../../components/reports/income/IncomeSourceCards';
import { IncomeTransactionsTable } from '../../components/reports/income/IncomeTransactionsTable';
import { showToast } from '../../lib/sonner';

const getInitialDateRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const fromDate = `${year}-${month}-01`;
  const nextMonth = new Date(year, now.getMonth() + 1, 1);
  const toYear = nextMonth.getFullYear();
  const toMonth = String(nextMonth.getMonth() + 1).padStart(2, '0');
  const toDate = `${toYear}-${toMonth}-01`;
  return { fromDate, toDate };
};

export const IncomeReportPage = () => {
  const initialDates = getInitialDateRange();
  const [fromDate, setFromDate] = useState(initialDates.fromDate);
  const [toDate, setToDate] = useState(initialDates.toDate);
  const [filterParams, setFilterParams] = useState<ReportDateParams>({
    FromDate: initialDates.fromDate,
    ToDate: initialDates.toDate,
    PageNumber: 1,
    PageSize: 20,
  });

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: reportKeys.income(filterParams),
    queryFn: () => reportsApi.getIncomeReport(filterParams),
  });

  const handleSearch = () => {
    setFilterParams((prev) => ({
      ...prev,
      FromDate: fromDate || undefined,
      ToDate: toDate || undefined,
      PageNumber: 1,
    }));
  };

  const handleReset = () => {
    const fresh = getInitialDateRange();
    setFromDate(fresh.fromDate);
    setToDate(fresh.toDate);
    setFilterParams({
      FromDate: fresh.fromDate,
      ToDate: fresh.toDate,
      PageNumber: 1,
      PageSize: 20,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilterParams((prev) => ({ ...prev, PageNumber: newPage }));
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      await reportsApi.downloadIncomePdf(filterParams);
      showToast.success('تم تحميل تقرير الإيرادات PDF بنجاح');
    } catch {
      showToast.error('فشل تحميل ملف PDF');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setIsDownloadingExcel(true);
      await reportsApi.downloadIncomeExcel(filterParams);
      showToast.success('تم تحميل تقرير الإيرادات Excel بنجاح');
    } catch {
      showToast.error('فشل تحميل ملف Excel');
    } finally {
      setIsDownloadingExcel(false);
    }
  };

  const summaryCards: SummaryCardItem[] = [
    {
      id: 'totalIncome',
      label: 'إجمالي الإيرادات للفترة',
      value: data?.summary?.totalIncome !== undefined ? `${data.summary.totalIncome.toLocaleString('en-US')} ج.م` : '...',
      icon: <TrendingUp size={22} />,
      variant: 'success',
    },
    {
      id: 'totalTransactions',
      label: 'إجمالي عدد العمليات',
      value: data?.summary?.totalTransactions ?? '...',
      icon: <Hash size={22} />,
      variant: 'info',
    },
  ];

  return (
    <div>
      <ReportFilterBar
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onSearch={handleSearch}
        onReset={handleReset}
        onDownloadPdf={handleDownloadPdf}
        onDownloadExcel={handleDownloadExcel}
        isDownloadingPdf={isDownloadingPdf}
        isDownloadingExcel={isDownloadingExcel}
        isLoading={isLoading}
      />

      <ReportSummaryCards cards={summaryCards} />

      <IncomeSourceCards sources={data?.sources} />

      <IncomeTransactionsTable
        transactions={data?.transactions}
        isLoading={isLoading}
        isError={isError}
        page={data?.pageNumber || 1}
        totalPages={data?.totalPages || 1}
        totalRecords={data?.totalRecords || 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
