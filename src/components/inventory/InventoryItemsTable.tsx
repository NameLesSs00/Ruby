import { Package, Edit2, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getUnitLabel, type InventoryItem } from '../../modules/inventory';

interface InventoryItemsTableProps {
  items: InventoryItem[];
  stockMap: Map<string, number>;
  isLoading: boolean;
  isError: boolean;
  debouncedSearch: string;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onToggleStatus: (item: InventoryItem) => void;
}

export const InventoryItemsTable = ({
  items,
  stockMap,
  isLoading,
  isError,
  debouncedSearch,
  onEdit,
  onDelete,
  onToggleStatus,
}: InventoryItemsTableProps) => {
  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>الصنف المخزني</th>
            <th>التصنيف</th>
            <th>وحدة القياس</th>
            <th style={{ textAlign: 'center' }}>الرصيد بالمخزن</th>
            <th>الحالة</th>
            <th style={{ textAlign: 'center' }}>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="table-loading-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    className="spinner"
                    style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }}
                  />
                  <span>جاري تحميل الأصناف المخزنية...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
                <span>تعذر تحميل الأصناف المخزنية، يرجى المحاولة لاحقاً</span>
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={6} className="table-empty-row">
                <span>لا توجد أصناف مخزنية مسجلة {debouncedSearch ? 'مطابقة للبحث' : ''}</span>
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const stockQty = stockMap.get(item.name.trim().toLowerCase());
              return (
                <tr key={item.id}>
                  <td>
                    <div className="coach-cell-name">
                      <div className="coach-avatar" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        <Package size={17} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="job-title-badge">
                      {item.inventoryCategoryName || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: '#475569', fontSize: '0.88rem', fontWeight: 600 }}>
                      {getUnitLabel(item.unit)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {stockQty !== undefined ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          backgroundColor: stockQty > 5 ? '#f0fdf4' : stockQty > 0 ? '#fff7ed' : '#fef2f2',
                          color: stockQty > 5 ? '#15803d' : stockQty > 0 ? '#c2410c' : '#b91c1c',
                          border: `1px solid ${stockQty > 5 ? '#bbf7d0' : stockQty > 0 ? '#fed7aa' : '#fecaca'}`,
                        }}
                      >
                        <span>{stockQty.toLocaleString('ar-EG')}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>
                          {getUnitLabel(item.unit)}
                        </span>
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
                        0 {getUnitLabel(item.unit)}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
                      {item.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="تعديل الصنف"
                        onClick={() => onEdit(item)}
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action"
                        title={item.isActive ? 'تعطيل الصنف' : 'تفعيل الصنف'}
                        onClick={() => onToggleStatus(item)}
                      >
                        {item.isActive ? (
                          <XCircle size={16} color="#ef4444" />
                        ) : (
                          <CheckCircle size={16} color="#10b981" />
                        )}
                      </button>

                      <button
                        type="button"
                        className="btn-icon-action delete"
                        title="حذف الصنف"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

