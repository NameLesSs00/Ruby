import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Receipt,
  Search,
  RotateCcw,
  CheckCircle2,
  X,
  TrendingUp,
} from 'lucide-react';
import {
  posSalesApi,
  posKeys,
  type SaleRecord,
  type SaleStatus,
} from '../../modules/pos';
import { ReceiptModal } from '../../components/pos/ReceiptModal';
import { ProcessReturnModal } from '../../components/pos/ProcessReturnModal';
import { PosSalesTable } from '../../components/pos/PosSalesTable';
import { useNavigate } from 'react-router-dom';

export const PosSalesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [statusFilter, setStatusFilter] = useState<SaleStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const [returnSale, setReturnSale] = useState<SaleRecord | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: posKeys.sales.list({ page, pageSize, status: statusFilter }),
    queryFn: () => posSalesApi.getAll({ page, pageSize, status: statusFilter }),
  });

  const rawSales = data?.items || [];

  const sales = useMemo(() => {
    return rawSales.filter((sale) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase().trim();
      return (
        sale.invoiceNumber.toLowerCase().includes(term) ||
        (sale.notes && sale.notes.toLowerCase().includes(term))
      );
    });
  }, [rawSales, searchTerm]);

  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const { totalSalesVolume, activeSalesCount, returnedSalesCount } = useMemo(() => {
    let volume = 0;
    let active = 0;
    let returned = 0;
    rawSales.forEach((s) => {
      volume += s.finalAmount || 0;
      if (s.status === 'NotReturned') {
        active += 1;
      } else {
        returned += 1;
      }
    });
    return {
      totalSalesVolume: volume,
      activeSalesCount: active,
      returnedSalesCount: returned,
    };
  }, [rawSales]);

  const filterPills: { label: string; value: SaleStatus | '' }[] = [
    { label: 'جميع الفواتير', value: '' },
    { label: 'سليمة (غير مرتجعة)', value: 'NotReturned' },
    { label: 'مرتجع جزئياً', value: 'PartiallyReturned' },
    { label: 'مرتجع بالكامل', value: 'FullyReturned' },
  ];

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '1rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  return (
    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
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
            <Receipt size={22} color="#ff6b22" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0d1527' }}>
              سجل المبيعات والفواتير
            </h2>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            استعراض فواتير المبيعات الصادرة، طباعة الإيصالات، ومتابعة حالات المرتجعات
          </p>
        </div>

        <button
          type="button"
          className="btn-add"
          onClick={() => navigate('/pos')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <span>فتح شاشة الكاشير للبيع</span>
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الفواتير</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
              {totalCount} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>فاتورة</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#fff7ed', color: '#ff6b22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي المبيعات (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ff6b22' }}>
              {totalSalesVolume.toLocaleString('ar-EG')} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>فواتير سليمة وغير مرتجعة</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857' }}>
              {activeSalesCount} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>فاتورة</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RotateCcw size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>فواتير خضعت للمرتجع</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#b91c1c' }}>
              {returnedSalesCount} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>فاتورة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '0.85rem 1.1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: 260, maxWidth: 360, flex: 1 }}>
            <Search
              size={16}
              color="#94a3b8"
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '0.75rem' }}
            />
            <input
              type="text"
              placeholder="البحث برقم الفاتورة أو الملاحظات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{
                paddingInlineStart: '2.25rem',
                paddingInlineEnd: searchTerm ? '2.25rem' : '0.75rem',
                fontSize: '0.85rem',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  insetInlineEnd: '0.6rem',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '0.2rem',
                  display: 'flex',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {filterPills.map((pill) => {
              const isSelected = statusFilter === pill.value;
              return (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(pill.value);
                    setPage(1);
                  }}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isSelected ? '1px solid #0d1527' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#0d1527' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#64748b',
                  }}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          نتائج البحث: <strong>{sales.length}</strong> من أصل <strong>{totalCount}</strong>
        </div>
      </div>

      {/* Sales Table */}
      <PosSalesTable
        sales={sales}
        totalCount={totalCount}
        page={page}
        totalPages={totalPages}
        isLoading={isLoading}
        isError={isError}
        searchTerm={searchTerm}
        onPageChange={setPage}
        onViewReceipt={(sale) => {
          setSelectedSale(sale);
          setIsReceiptOpen(true);
        }}
        onOpenReturnModal={(sale) => {
          setReturnSale(sale);
          setIsReturnModalOpen(true);
        }}
      />

      {/* Printable Receipt Modal */}
      <ReceiptModal
        sale={selectedSale}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />

      {/* In-Page Process Return Modal */}
      <ProcessReturnModal
        isOpen={isReturnModalOpen}
        initialSale={returnSale}
        onClose={() => {
          setIsReturnModalOpen(false);
          setReturnSale(null);
        }}
      />
    </div>
  );
};
