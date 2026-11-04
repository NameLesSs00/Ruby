import { Eye, Edit2, Trash2, ArrowDownRight, ArrowUpLeft, AlertCircle } from 'lucide-react';
import type { WarehouseMovement } from '../../modules/warehouseTransactions';
import { PaginationBar } from '../ui/PaginationBar';

interface WarehouseMovementsTableProps {
  movements: WarehouseMovement[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onViewDetails: (movement: WarehouseMovement) => void;
  onEdit: (movement: WarehouseMovement) => void;
  onDelete: (movement: WarehouseMovement) => void;
}

export const WarehouseMovementsTable = ({
  movements,
  isLoading,
  isError,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onViewDetails,
  onEdit,
  onDelete,
}: WarehouseMovementsTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString('ar-EG')} - ${d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}>رقم الإذن</th>
              <th style={{ width: '130px', textAlign: 'center' }}>نوع الحركة</th>
              <th style={{ width: '100px', textAlign: 'center' }}>عدد الأصناف</th>
              <th>الأصناف المشمولة</th>
              <th style={{ width: '180px' }}>التاريخ والوقت</th>
              <th>البيان والسبب</th>
              <th style={{ width: '120px', textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                  <div className="spinner" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ margin: 0, color: '#64748b' }}>جاري تحميل حركات المخزن...</p>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>
                  <AlertCircle size={28} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <p style={{ margin: 0 }}>فشل في تحميل حركات المخزن. يرجى إعادة المحاولة.</p>
                </td>
              </tr>
            ) : movements.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                  لا توجد حركات مخزنية مسجلة حالياً
                </td>
              </tr>
            ) : (
              movements.map((movement) => {
                const isIn = movement.movementType === 'In';
                const itemsCount = movement.items?.length || 0;
                const previewItems = (movement.items || []).slice(0, 3);
                const remainingCount = itemsCount - previewItems.length;

                return (
                  <tr key={movement.movementGroupId}>
                    {/* Voucher ID */}
                    <td style={{ textAlign: 'center', fontWeight: 700, color: '#0d1527' }}>
                      #{movement.movementGroupId}
                    </td>

                    {/* Movement Type Badge */}
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: isIn ? '#ecfdf5' : '#fff7ed',
                          color: isIn ? '#059669' : '#ea580c',
                          border: `1px solid ${isIn ? '#a7f3d0' : '#fed7aa'}`,
                        }}
                      >
                        {isIn ? <ArrowDownRight size={14} /> : <ArrowUpLeft size={14} />}
                        {isIn ? 'إذن وارد' : 'إذن صادر'}
                      </span>
                    </td>

                    {/* Items Count */}
                    <td style={{ textAlign: 'center', fontWeight: 600, color: '#475569' }}>
                      {itemsCount} صنف
                    </td>

                    {/* Included Items Preview Chips */}
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
                        {previewItems.map((item, idx) => (
                          <span
                            key={item.id ?? idx}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              backgroundColor: '#f1f5f9',
                              color: '#1e293b',
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            <span>{item.inventoryItemName || `صنف #${item.inventoryItemId}`}</span>
                            <span
                              style={{
                                fontWeight: 700,
                                color: isIn ? '#059669' : '#ea580c',
                              }}
                            >
                              ({isIn ? `+${item.quantity}` : `-${item.quantity}`})
                            </span>
                          </span>
                        ))}
                        {remainingCount > 0 && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: '#64748b',
                              fontWeight: 600,
                            }}
                          >
                            +{remainingCount} آخر
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date and Time */}
                    <td style={{ fontSize: '0.82rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      {formatDateTime(movement.movementDate)}
                    </td>

                    {/* Description */}
                    <td
                      style={{
                        maxWidth: '220px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#334155',
                        fontSize: '0.85rem',
                      }}
                      title={movement.description}
                    >
                      {movement.description || '—'}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="عرض تفاصيل الإذن"
                          onClick={() => onViewDetails(movement)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="تعديل الإذن"
                          onClick={() => onEdit(movement)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action delete"
                          title="حذف الإذن"
                          onClick={() => onDelete(movement)}
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

      <PaginationBar
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        label="إجمالي أذونات الحركة"
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    </div>
  );
};

