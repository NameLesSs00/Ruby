import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Receipt, Search, User, Award } from 'lucide-react';
import { posSalesApi, posKeys, type SaleRecord, type SaleStatus } from '../../modules/pos';
import { employeeSalesApi, employeeSaleKeys } from '../../modules/employeeSales';
import { ReceiptModal } from '../../components/pos/ReceiptModal';
import { ProcessReturnModal } from '../../components/pos/ProcessReturnModal';
import { PosSalesTable } from '../../components/pos/PosSalesTable';
import { EmployeeSalesTable } from '../../components/pos/EmployeeSalesTable';
import { useNavigate } from 'react-router-dom';

export const PosSalesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'customer' | 'employee'>('customer');

  // Customer Sales State
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [statusFilter, setStatusFilter] = useState<SaleStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Employee Sales State
  const [empPage, setEmpPage] = useState(1);
  const [empSearch, setEmpSearch] = useState('');

  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [returnSale, setReturnSale] = useState<SaleRecord | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // Customer Sales Query
  const { data: customerSalesData, isLoading: isCustLoading, isError: isCustError } = useQuery({
    queryKey: posKeys.sales.list({ page, pageSize, status: statusFilter }),
    queryFn: () => posSalesApi.getAll({ page, pageSize, status: statusFilter }),
    enabled: activeTab === 'customer',
  });

  // Employee Sales Query
  const { data: empSalesData, isLoading: isEmpLoading, isError: isEmpError } = useQuery({
    queryKey: employeeSaleKeys.list({ page: empPage, pageSize }),
    queryFn: () => employeeSalesApi.getAll({ page: empPage, pageSize }),
    enabled: activeTab === 'employee',
  });

  const rawSales = customerSalesData?.items || [];
  const sales = useMemo(() => {
    if (!searchTerm.trim()) return rawSales;
    const term = searchTerm.toLowerCase().trim();
    return rawSales.filter((s) => s.invoiceNumber.toLowerCase().includes(term) || (s.notes && s.notes.toLowerCase().includes(term)));
  }, [rawSales, searchTerm]);

  const rawEmpSales = empSalesData?.items || [];
  const empSales = useMemo(() => {
    if (!empSearch.trim()) return rawEmpSales;
    const term = empSearch.toLowerCase().trim();
    return rawEmpSales.filter((s) => s.invoiceNumber.toLowerCase().includes(term) || (s.employeeName && s.employeeName.toLowerCase().includes(term)));
  }, [rawEmpSales, empSearch]);

  const totalCount = customerSalesData?.totalCount || 0;
  const totalPages = customerSalesData?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const empTotalCount = empSalesData?.totalCount || 0;
  const empTotalPages = empSalesData?.totalPages || Math.ceil(empTotalCount / pageSize) || 1;

  const filterPills: { label: string; value: SaleStatus | '' }[] = [
    { label: 'جميع الفواتير', value: '' }, { label: 'مدفوعه', value: 'NotReturned' },
    { label: 'مرتجع جزئياً', value: 'PartiallyReturned' }, { label: 'مرتجع بالكامل', value: 'FullyReturned' },
  ];

  return (
    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt size={22} color="#ff6b22" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0d1527' }}>سجل المبيعات والفواتير</h2>
          </div>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#64748b' }}>
            استعراض فواتير مبيعات العملاء ومبيعات الموظفين بالأسعار المخفضة
          </p>
        </div>

        <button type="button" className="btn-add" onClick={() => navigate('/pos')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>فتح شاشة الكاشير للبيع</span>
        </button>
      </div>

      {/* Main Tabs Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          type="button" onClick={() => setActiveTab('customer')}
          style={{
            padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            backgroundColor: activeTab === 'customer' ? '#0d1527' : '#ffffff', color: activeTab === 'customer' ? '#ffffff' : '#64748b',
            boxShadow: activeTab === 'customer' ? '0 2px 8px rgba(13,21,39,0.2)' : 'var(--shadow-sm)',
          }}
        >
          <User size={16} /><span>فواتير العملاء ({totalCount})</span>
        </button>

        <button
          type="button" onClick={() => setActiveTab('employee')}
          style={{
            padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            backgroundColor: activeTab === 'employee' ? '#C2410C' : '#ffffff', color: activeTab === 'employee' ? '#ffffff' : '#64748b',
            boxShadow: activeTab === 'employee' ? '0 2px 8px rgba(194,65,12,0.2)' : 'var(--shadow-sm)',
          }}
        >
          <Award size={16} /><span>فواتير الموظفين ({empTotalCount})</span>
        </button>
      </div>

      {activeTab === 'customer' ? (
        <>
          {/* Customer Sales Filters & Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', backgroundColor: '#ffffff', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', minWidth: 240, maxWidth: 360, flex: 1 }}>
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: '0.75rem', pointerEvents: 'none' }} />
                <input
                  type="text" placeholder="البحث برقم الفاتورة أو الملاحظات..." value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="form-input" style={{ paddingInlineEnd: '2.25rem' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                {filterPills.map((pill) => {
                  const isSelected = statusFilter === pill.value;
                  return (
                    <button
                      key={pill.value} type="button" onClick={() => { setStatusFilter(pill.value); setPage(1); }}
                      style={{
                        padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                        border: isSelected ? '1px solid #0d1527' : '1px solid #e2e8f0', backgroundColor: isSelected ? '#0d1527' : '#f8fafc',
                        color: isSelected ? '#ffffff' : '#64748b',
                      }}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <PosSalesTable
            sales={sales} totalCount={totalCount} page={page} totalPages={totalPages}
            isLoading={isCustLoading} isError={isCustError} searchTerm={searchTerm}
            onPageChange={setPage}
            onViewReceipt={(s) => { setSelectedSale(s); setIsReceiptOpen(true); }}
            onOpenReturnModal={(s) => { setReturnSale(s); setIsReturnModalOpen(true); }}
          />
        </>
      ) : (
        <>
          {/* Employee Sales Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', backgroundColor: '#ffffff', padding: '0.85rem 1.1rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
            <div style={{ position: 'relative', minWidth: 260, maxWidth: 380 }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: '0.75rem', pointerEvents: 'none' }} />
              <input
                type="text" placeholder="البحث باسم الموظف أو رقم الفاتورة..." value={empSearch}
                onChange={(e) => setEmpSearch(e.target.value)} className="form-input" style={{ paddingInlineEnd: '2.25rem' }}
              />
            </div>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>إجمالي الفواتير: <strong>{empTotalCount}</strong></span>
          </div>

          <EmployeeSalesTable
            sales={empSales} totalCount={empTotalCount} page={empPage} totalPages={empTotalPages}
            isLoading={isEmpLoading} isError={isEmpError} searchTerm={empSearch}
            onPageChange={setEmpPage}
            onViewReceipt={(s) => { setSelectedSale(s as unknown as SaleRecord); setIsReceiptOpen(true); }}
          />
        </>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal sale={selectedSale} isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} />

      {/* Process Return Modal */}
      <ProcessReturnModal
        isOpen={isReturnModalOpen} initialSale={returnSale}
        onClose={() => { setIsReturnModalOpen(false); setReturnSale(null); }}
      />
    </div>
  );
};
