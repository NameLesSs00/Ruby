import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi, reportKeys, type CashboxReportParams } from '../../modules/reports';
import { ReportFilterBar } from '../../components/reports/ReportFilterBar';
import { CashboxSummaryCards } from '../../components/reports/cashboxes/CashboxSummaryCards';
import { CashboxBreakdownTable } from '../../components/reports/cashboxes/CashboxBreakdownTable';
import { CashboxTransactionsTable } from '../../components/reports/cashboxes/CashboxTransactionsTable';
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

export const CashboxesReportPage = () => {
  const initialDates = getInitialDateRange();
  const [fromDate, setFromDate] = useState(initialDates.fromDate);
  const [toDate, setToDate] = useState(initialDates.toDate);
  const [selectedCashbox, setSelectedCashbox] = useState<string>('');
  const [selectedTxType, setSelectedTxType] = useState<string>('');
  const [selectedRefType, setSelectedRefType] = useState<string>('');

  const [filterParams, setFilterParams] = useState<CashboxReportParams>({
    FromDate: initialDates.fromDate,
    ToDate: initialDates.toDate,
    PageNumber: 1,
    PageSize: 20,
  });

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: reportKeys.cashboxes(filterParams),
    queryFn: () => reportsApi.getCashboxesReport(filterParams),
  });

  const handleSearch = () => {
    setFilterParams((prev) => ({
      ...prev,
      FromDate: fromDate || undefined,
      ToDate: toDate || undefined,
      CashboxType: (selectedCashbox as 'POS' | 'Subscriptions' | 'Main') || undefined,
      TransactionType: (selectedTxType as 'Income' | 'Expense') || undefined,
      ReferenceType: selectedRefType || undefined,
      PageNumber: 1,
    }));
  };

  const handleReset = () => {
    const fresh = getInitialDateRange();
    setFromDate(fresh.fromDate);
    setToDate(fresh.toDate);
    setSelectedCashbox('');
    setSelectedTxType('');
    setSelectedRefType('');
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
      await reportsApi.downloadCashboxesPdf(filterParams);
      showToast.success('تم تحميل تقرير الخزائن PDF بنجاح');
    } catch {
      showToast.error('فشل تحميل ملف PDF');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setIsDownloadingExcel(true);
      await reportsApi.downloadCashboxesExcel(filterParams);
      showToast.success('تم تحميل تقرير الخزائن Excel بنجاح');
    } catch {
      showToast.error('فشل تحميل ملف Excel');
    } finally {
      setIsDownloadingExcel(false);
    }
  };

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
      >
        {/* Cashbox Filter */}
        <div style={{ minWidth: '140px', flex: '1 1 140px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
            الخزينة
          </label>
          <select
            value={selectedCashbox}
            onChange={(e) => setSelectedCashbox(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          >
            <option value="">جميع الخزائن</option>
            <option value="POS">خزينة POS</option>
            <option value="Subscriptions">خزينة الاشتراكات</option>
            <option value="Main">الخزينة الرئيسية</option>
          </select>
        </div>

        {/* Transaction Type Filter */}
        <div style={{ minWidth: '130px', flex: '1 1 130px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
            نوع المعاملة
          </label>
          <select
            value={selectedTxType}
            onChange={(e) => setSelectedTxType(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          >
            <option value="">الكل</option>
            <option value="Income">إيداع / إيراد</option>
            <option value="Expense">صرف / سحب</option>
          </select>
        </div>

        {/* Reference Type Filter */}
        <div style={{ minWidth: '160px', flex: '1 1 160px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.375rem' }}>
            نوع المرجع
          </label>
          <select
            value={selectedRefType}
            onChange={(e) => setSelectedRefType(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          >
            <option value="">جميع المراجع</option>
            <option value="Subscription">اشتراك</option>
            <option value="Sale">بيع POS</option>
            <option value="Expense">مصروف</option>
            <option value="Payroll">راتب</option>
            <option value="CoachPayment">مدفوعات مدربين</option>
            <option value="PurchaseInvoicePayment">فاتورة مشتريات</option>
            <option value="DuePaymentCollection">تحصيل دين</option>
            <option value="SaleReturn">مرتجع بيع</option>
            <option value="SubscriptionCancellation">إلغاء اشتراك</option>
            <option value="OwnerTransaction">معاملة مالك</option>
            <option value="OtherIncome">إيراد آخر</option>
            <option value="CashTransfer">تحويل نقدي</option>
          </select>
        </div>
      </ReportFilterBar>

      <CashboxSummaryCards summary={data?.summary} />

      <CashboxBreakdownTable cashboxes={data?.cashboxes} isLoading={isLoading} />

      <CashboxTransactionsTable
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
