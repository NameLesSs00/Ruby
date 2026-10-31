import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Boxes, Package, Layers } from 'lucide-react';
import { inventoryCategoriesApi, inventoryKeys } from '../modules/inventory';
import { InventoryItemsTab } from '../components/inventory/InventoryItemsTab';
import { InventoryCategoriesTab } from '../components/inventory/InventoryCategoriesTab';

type InventoryTab = 'items' | 'categories';

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
    { key: 'categories' as const, label: 'تصنيفات المخزون', icon: <Layers size={17} /> },
  ];

  return (
    <div className="view-container">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: 42,
            height: 42,
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
          <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
            إدارة المخزون والتوريدات
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
            متابعة الأصناف المخزنية ووحدات القياس وتصنيفات المواد والمعدات
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          background: '#f1f5f9',
          borderRadius: '10px',
          padding: '0.35rem',
          marginBottom: '1.5rem',
          width: 'fit-content',
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1.1rem',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              fontWeight: activeTab === tab.key ? 700 : 500,
              background: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? '#F37023' : '#64748b',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
              transition: 'all 0.18s ease',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Views */}
      {activeTab === 'items' && <InventoryItemsTab categories={categories} />}
      {activeTab === 'categories' && <InventoryCategoriesTab />}
    </div>
  );
};

