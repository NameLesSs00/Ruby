import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Boxes, Package, ArrowLeftRight, Layers, Archive } from 'lucide-react';
import { inventoryCategoriesApi, inventoryKeys } from '../modules/inventory';
import { InventoryItemsTab } from '../components/inventory/InventoryItemsTab';
import { InventoryCategoriesTab } from '../components/inventory/InventoryCategoriesTab';
import { WarehouseMovementsTab } from '../components/inventory/WarehouseMovementsTab';
import { WarehouseStockTab } from '../components/inventory/WarehouseStockTab';

type InventoryTab = 'items' | 'stock' | 'movements' | 'categories';

export const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('items');

  // Load all active categories for the item form and filter
  const { data: categoriesData } = useQuery({
    queryKey: inventoryKeys.categoryList({ page: 1, pageSize: 100 }),
    queryFn: () => inventoryCategoriesApi.getAll({ page: 1, pageSize: 100 }),
  });

  const categories = categoriesData?.items || [];

  const TABS = [
    { key: 'items' as const, label: 'الأصناف المخزنية', icon: <Package size={17} /> },
    { key: 'stock' as const, label: 'رصيد المخزن الحالي', icon: <Archive size={17} /> },
    { key: 'movements' as const, label: 'حركات التوريد والصرف', icon: <ArrowLeftRight size={17} /> },
    { key: 'categories' as const, label: 'تصنيفات المخزون', icon: <Layers size={17} /> },
  ];

  return (
    <div className="view-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0D1527, #1e293b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Boxes size={22} color="#36C5F0" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
            إدارة المخزون والتوريدات
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            متابعة الأصناف المخزنية، أذونات التوريد والصرف، وتصنيفات المواد والمعدات
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-switcher" style={{ marginBottom: '1.25rem' }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Views */}
      {activeTab === 'items' && <InventoryItemsTab categories={categories} />}
      {activeTab === 'stock' && <WarehouseStockTab />}
      {activeTab === 'movements' && <WarehouseMovementsTab />}
      {activeTab === 'categories' && <InventoryCategoriesTab />}
    </div>
  );
};
