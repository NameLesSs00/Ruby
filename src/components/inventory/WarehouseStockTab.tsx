import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, RotateCw } from 'lucide-react';
import {
  warehouseTransactionsApi,
  warehouseTransactionKeys,
} from '../../modules/warehouseTransactions';
import { WarehouseStockCards } from './WarehouseStockCards';
import { WarehouseStockTable } from './WarehouseStockTable';

export const WarehouseStockTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: warehouseTransactionKeys.stockBalances(),
    queryFn: () => warehouseTransactionsApi.getItemStockBalances(),
  });

  const stockItems = data?.items || [];
  const totalCount = data?.totalCount || stockItems.length;

  // Aggregate metrics
  const totalQuantity = useMemo(() => {
    return stockItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }, [stockItems]);

  const lowStockCount = useMemo(() => {
    return stockItems.filter((item) => item.quantity > 0 && item.quantity <= 5).length;
  }, [stockItems]);

  const outOfStockCount = useMemo(() => {
    return stockItems.filter((item) => !item.quantity || item.quantity <= 0).length;
  }, [stockItems]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return stockItems.filter((item) => {
      const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.trim().toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter === 'in_stock') return item.quantity > 5;
      if (statusFilter === 'low_stock') return item.quantity > 0 && item.quantity <= 5;
      if (statusFilter === 'out_of_stock') return !item.quantity || item.quantity <= 0;
      return true;
    });
  }, [stockItems, searchTerm, statusFilter]);

  return (
    <div>
      {/* KPI Cards */}
      <WarehouseStockCards
        totalCount={totalCount}
        totalQuantity={totalQuantity}
        lowStockCount={lowStockCount}
      />

      {/* Toolbar & Filters */}
      <div className="view-toolbar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          <div className="toolbar-search">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="البحث باسم الصنف في المخزن..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="tab-switcher">
            <button
              type="button"
              className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              الكل ({stockItems.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${statusFilter === 'in_stock' ? 'active' : ''}`}
              onClick={() => setStatusFilter('in_stock')}
            >
              متوفر ({stockItems.filter((i) => i.quantity > 5).length})
            </button>
            <button
              type="button"
              className={`tab-btn ${statusFilter === 'low_stock' ? 'active' : ''}`}
              onClick={() => setStatusFilter('low_stock')}
            >
              منخفض ({lowStockCount})
            </button>
            {outOfStockCount > 0 && (
              <button
                type="button"
                className={`tab-btn ${statusFilter === 'out_of_stock' ? 'active' : ''}`}
                onClick={() => setStatusFilter('out_of_stock')}
              >
                نافد ({outOfStockCount})
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          className="btn-refresh"
          onClick={() => refetch()}
          disabled={isFetching}
          title="تحديث أرصدة المخزن"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#334155',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          <RotateCw size={15} className={isFetching ? 'spin' : ''} />
          <span>تحديث الأرصدة</span>
        </button>
      </div>

      {/* Stock Table */}
      <WarehouseStockTable
        items={filteredItems}
        isLoading={isLoading}
        isError={isError}
        searchTerm={searchTerm}
      />
    </div>
  );
};
