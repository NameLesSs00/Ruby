import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi, reportKeys, type WarehouseReportParams } from '../../modules/reports';
import { productsApi, productKeys } from '../../modules/products';
import { ReportFilterBar } from '../../components/reports/ReportFilterBar';
import { WarehouseSummaryCards } from '../../components/reports/warehouse/WarehouseSummaryCards';
import { WarehouseProductsTable } from '../../components/reports/warehouse/WarehouseProductsTable';
import { WarehouseTransactionsTable } from '../../components/reports/warehouse/WarehouseTransactionsTable';
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

export const WarehouseReportPage = () => {
  const initialDates = getInitialDateRange();
  const [fromDate, setFromDate] = useState(initialDates.fromDate);
  const [toDate, setToDate] = useState(initialDates.toDate);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedTxType, setSelectedTxType] = useState<string>('');

  const [filterParams, setFilterParams] = useState<WarehouseReportParams>({
    FromDate: initialDates.fromDate,
    ToDate: initialDates.toDate,
    PageNumber: 1,
    PageSize: 20,
  });

  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingExcel, setIsDownloadingExcel] = useState(false);

  // Fetch product list for the dropdown filter
  const { data: productsData } = useQuery({
    queryKey: productKeys.list({ pageSize: 100 }),
    queryFn: () => productsApi.getAll({ pageSize: 100 }),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: reportKeys.warehouse(filterParams),
    queryFn: () => reportsApi.getWarehouseReport(filterParams),
  });

  const handleSearch = () => {
    setFilterParams((prev) => ({
      ...prev,
      FromDate: fromDate || undefined,
      ToDate: toDate || undefined,
      ProductId: selectedProductId ? Number(selectedProductId) : undefined,
      TransactionType: (selectedTxType as 'In' | 'Out') || undefined,
      PageNumber: 1,
    }));
  };

  const handleReset = () => {
    const fresh = getInitialDateRange();
    setFromDate(fresh.fromDate);
    setToDate(fresh.toDate);
    setSelectedProductId('');
    setSelectedTxType('');
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
      await reportsApi.downloadWarehousePdf(filterParams);
      showToast.success('تم تحميل تقرير المستودع PDF بنجاح');
    } catch {
      showToast.error('فشل تحميل ملف PDF');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setIsDownloadingExcel(true);
      await reportsApi.downloadWarehouseExcel(filterParams);
      showToast.success('تم تحميل تقرير المستودع Excel بنجاح');
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
        {/* Product Dropdown */}
        <div style={{ minWidth: '180px', flex: '1 1 180px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.375rem',
            }}
          >
            تحديد المنتج
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          >
            <option value="">جميع المنتجات</option>
            {productsData?.items?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Transaction Type Dropdown */}
        <div style={{ minWidth: '140px', flex: '1 1 140px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.375rem',
            }}
          >
            نوع الحركة
          </label>
          <select
            value={selectedTxType}
            onChange={(e) => setSelectedTxType(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          >
            <option value="">الكل (وارد ومنصرف)</option>
            <option value="In">وارد (In)</option>
            <option value="Out">منصرف (Out)</option>
          </select>
        </div>
      </ReportFilterBar>

      <WarehouseSummaryCards summary={data?.summary} />

      <WarehouseProductsTable products={data?.products} isLoading={isLoading} />

      <WarehouseTransactionsTable
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
