import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Plus, ArrowLeftRight, ArrowDownRight, ArrowUpLeft } from 'lucide-react';
import {
  warehouseTransactionsApi,
  warehouseTransactionKeys,
  type WarehouseMovement,
  type MovementType,
} from '../../modules/warehouseTransactions';
import { inventoryItemsApi, inventoryKeys } from '../../modules/inventory';
import { WarehouseMovementsTable } from './WarehouseMovementsTable';
import { WarehouseMovementModal } from './WarehouseMovementModal';
import { WarehouseMovementDetailsModal } from './WarehouseMovementDetailsModal';
import { DeleteWarehouseMovementModal } from './DeleteWarehouseMovementModal';

export const WarehouseMovementsTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedType, setSelectedType] = useState<MovementType | 'All'>('All');
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>(undefined);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<WarehouseMovement | null>(null);
  const [detailsMovement, setDetailsMovement] = useState<WarehouseMovement | null>(null);
  const [deletingMovement, setDeletingMovement] = useState<WarehouseMovement | null>(null);

  // Fetch warehouse transactions
  const movementTypeParam = selectedType === 'All' ? undefined : selectedType;
  const { data, isLoading, isError } = useQuery({
    queryKey: warehouseTransactionKeys.list({
      page,
      pageSize,
      movementType: movementTypeParam,
      inventoryItemId: selectedItemId,
    }),
    queryFn: () =>
      warehouseTransactionsApi.getAll({
        page,
        pageSize,
        movementType: movementTypeParam,
        inventoryItemId: selectedItemId,
      }),
    placeholderData: keepPreviousData,
  });

  // Fetch inventory items for dropdowns and forms
  const { data: itemsData } = useQuery({
    queryKey: inventoryKeys.itemList({ page: 1, pageSize: 100 }),
    queryFn: () => inventoryItemsApi.getAll({ page: 1, pageSize: 100 }),
  });

  const inventoryItems = itemsData?.items || [];
  const movements = data?.items || [];
  const totalCount = data?.totalCount || 0;

  // Compute page-level stats
  const inMovementsCount = movements.filter((m) => m.movementType === 'In').length;
  const outMovementsCount = movements.filter((m) => m.movementType === 'Out').length;

  const handleOpenCreate = () => {
    setEditingMovement(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (movement: WarehouseMovement) => {
    setEditingMovement(movement);
    setIsFormOpen(true);
  };

  const handleTypeFilterChange = (type: MovementType | 'All') => {
    setSelectedType(type);
    setPage(1);
  };

  const handleItemFilterChange = (itemId: number | undefined) => {
    setSelectedItemId(itemId);
    setPage(1);
  };

  return (
    <div>
      {/* KPI Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeftRight size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي حركات المخزن</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
              {totalCount}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>إذن</span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowDownRight size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>أذونات التوريد (الوارد)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#059669' }}>
              {inMovementsCount}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                في الصفحة
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1.1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fff7ed',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUpLeft size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>أذونات الصرف (الصادر)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ea580c' }}>
              {outMovementsCount}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                في الصفحة
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="view-toolbar" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
          {/* Movement Type Filter Switcher */}
          <div className="tab-switcher">
            <button
              type="button"
              className={`tab-btn ${selectedType === 'All' ? 'active' : ''}`}
              onClick={() => handleTypeFilterChange('All')}
            >
              الكل
            </button>
            <button
              type="button"
              className={`tab-btn ${selectedType === 'In' ? 'active' : ''}`}
              onClick={() => handleTypeFilterChange('In')}
            >
              وارد (توريد)
            </button>
            <button
              type="button"
              className={`tab-btn ${selectedType === 'Out' ? 'active' : ''}`}
              onClick={() => handleTypeFilterChange('Out')}
            >
              صادر (صرف)
            </button>
          </div>

          {/* Inventory Item Filter Dropdown */}
          <select
            className="select-filter"
            value={selectedItemId || ''}
            onChange={(e) =>
              handleItemFilterChange(e.target.value ? Number(e.target.value) : undefined)
            }
            style={{ minWidth: '200px' }}
          >
            <option value="">جميع الأصناف المخزنية</option>
            {inventoryItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} {item.unit ? `(${item.unit})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Create Movement Voucher CTA Button */}
        <button type="button" className="btn-add" onClick={handleOpenCreate}>
          <Plus size={18} />
          <span>إذن حركة جديد</span>
        </button>
      </div>

      {/* Movements Table */}
      <WarehouseMovementsTable
        movements={movements}
        isLoading={isLoading}
        isError={isError}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onViewDetails={(m) => setDetailsMovement(m)}
        onEdit={handleOpenEdit}
        onDelete={(m) => setDeletingMovement(m)}
      />

      {/* Form Modal (Create / Edit) */}
      <WarehouseMovementModal
        isOpen={isFormOpen}
        initialData={editingMovement}
        inventoryItems={inventoryItems}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMovement(null);
        }}
      />

      {/* Details Statement Modal */}
      <WarehouseMovementDetailsModal
        isOpen={!!detailsMovement}
        movement={detailsMovement}
        onClose={() => setDetailsMovement(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteWarehouseMovementModal
        isOpen={!!deletingMovement}
        movement={deletingMovement}
        onClose={() => setDeletingMovement(null)}
      />
    </div>
  );
};
