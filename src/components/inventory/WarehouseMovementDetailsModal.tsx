import { X, ArrowDownRight, ArrowUpLeft, Calendar, FileText, Layers, Hash } from 'lucide-react';
import type { WarehouseMovement } from '../../modules/warehouseTransactions';
import { useModalEscape } from '../../lib/useModalEscape';

interface WarehouseMovementDetailsModalProps {
  isOpen: boolean;
  movement: WarehouseMovement | null;
  onClose: () => void;
}

export const WarehouseMovementDetailsModal = ({
  isOpen,
  movement,
  onClose,
}: WarehouseMovementDetailsModalProps) => {
  useModalEscape(onClose, isOpen);

  if (!isOpen || !movement) return null;

  const isIn = movement.movementType === 'In';

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.toLocaleDateString('ar-EG')} - ${d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card"
        style={{ maxWidth: '650px', width: '92%' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: isIn ? '#ecfdf5' : '#fff7ed',
                color: isIn ? '#059669' : '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isIn ? <ArrowDownRight size={20} /> : <ArrowUpLeft size={20} />}
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: '1.15rem' }}>
                {isIn ? 'إذن توريد مخزني (وارد)' : 'إذن صرف مخزني (صادر)'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                رقم الحركة: #{movement.movementGroupId}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.75rem',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Hash size={16} color="#64748b" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>رقم الإذن</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0d1527' }}>
                  #{movement.movementGroupId}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="#64748b" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>التاريخ والوقت</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0d1527' }}>
                  {formatDateTime(movement.movementDate)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={16} color="#64748b" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>عدد الأصناف</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0d1527' }}>
                  {movement.items?.length || 0} صنف
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  backgroundColor: isIn ? '#ecfdf5' : '#fff7ed',
                  color: isIn ? '#059669' : '#ea580c',
                  border: `1px solid ${isIn ? '#a7f3d0' : '#fed7aa'}`,
                }}
              >
                {isIn ? 'إذن توريد (وارد)' : 'إذن صرف (صادر)'}
              </div>
            </div>
          </div>

          {/* Description Section */}
          {movement.description && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <FileText size={16} color="#64748b" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>
                  البيان والسبب
                </span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: '#1e293b' }}>
                  {movement.description}
                </p>
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div>
            <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.95rem', fontWeight: 700, color: '#0d1527' }}>
              الأصناف المشمولة في الحركة ({movement.items?.length || 0})
            </h4>
            <div className="table-responsive" style={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table className="data-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                    <th>اسم الصنف المخزني</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>الكمية</th>
                  </tr>
                </thead>
                <tbody>
                  {movement.items && movement.items.length > 0 ? (
                    movement.items.map((item, idx) => (
                      <tr key={item.id ?? idx}>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 600, color: '#0d1527' }}>
                          {item.inventoryItemName || `صنف مخزني #${item.inventoryItemId}`}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              backgroundColor: isIn ? '#ecfdf5' : '#fff7ed',
                              color: isIn ? '#059669' : '#ea580c',
                            }}
                          >
                            {isIn ? `+${item.quantity}` : `-${item.quantity}`}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
                        لا توجد أصناف في هذا الإذن
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

