import { useState } from 'react';
import { Plus, X, FileText, User, Clock } from 'lucide-react';
import type { PosInvoiceSession } from '../../modules/posStore';
import { DeleteModal } from '../ui/DeleteModal';

interface PosInvoiceTabsBarProps {
  invoices: PosInvoiceSession[];
  activeInvoiceId: string;
  onSelectInvoice: (id: string) => void;
  onCreateInvoice: () => void;
  onCloseInvoice: (id: string) => void;
}

export const PosInvoiceTabsBar = ({
  invoices,
  activeInvoiceId,
  onSelectInvoice,
  onCreateInvoice,
  onCloseInvoice,
}: PosInvoiceTabsBarProps) => {
  const [invoiceToDelete, setInvoiceToDelete] = useState<PosInvoiceSession | null>(null);

  const handleRequestClose = (e: React.MouseEvent, inv: PosInvoiceSession) => {
    e.stopPropagation();
    if (inv.cart.length > 0) {
      setInvoiceToDelete(inv);
    } else {
      onCloseInvoice(inv.id);
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.5rem 1.25rem',
          backgroundColor: '#f1f5f9',
          borderBottom: '1px solid #cbd5e1',
          minHeight: 50,
        }}
      >
        {/* Open Invoices Horizontal List */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            flex: 1,
            paddingBottom: '2px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#475569',
              paddingInlineEnd: '0.4rem',
              borderInlineEnd: '2px solid #cbd5e1',
              whiteSpace: 'nowrap',
            }}
          >
            <FileText size={15} color="#0d1527" />
            <span>الفواتير النشطة ({invoices.length})</span>
          </div>

          {invoices.map((inv) => {
            const isActive = inv.id === activeInvoiceId;
            const itemCount = inv.cart.reduce((sum, i) => sum + i.quantity, 0);
            const subtotal = inv.cart.reduce(
              (sum, i) => sum + i.product.salePrice * i.quantity,
              0
            );
            const netTotal = Math.max(0, subtotal - (inv.discountAmount || 0));
            const hasReference = Boolean(inv.referenceName.trim());

            return (
              <div
                key={inv.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectInvoice(inv.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectInvoice(inv.id);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.38rem 0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  backgroundColor: isActive ? '#0d1527' : '#ffffff',
                  color: isActive ? '#ffffff' : '#1e293b',
                  border: isActive
                    ? '1.5px solid #38bdf8'
                    : itemCount > 0
                    ? '1px solid #94a3b8'
                    : '1px solid #cbd5e1',
                  boxShadow: isActive
                    ? '0 2px 8px rgba(13, 21, 39, 0.22)'
                    : 'var(--shadow-sm)',
                }}
              >
                {/* Reference Number Badge */}
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '5px',
                    backgroundColor: isActive ? '#16223e' : '#f1f5f9',
                    color: isActive ? '#38bdf8' : '#0d1527',
                    border: isActive ? '1px solid #1e293b' : '1px solid #e2e8f0',
                  }}
                >
                  #{inv.referenceNumber}
                </span>

                {/* Reference Name or Default Label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {hasReference && (
                    <User size={13} color={isActive ? '#38bdf8' : '#0284c7'} />
                  )}
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      maxWidth: 140,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {inv.referenceName.trim() || `فاتورة #${inv.referenceNumber}`}
                  </span>
                </div>

                {/* Items & Total Pill if non-empty */}
                {itemCount > 0 ? (
                  <span
                    style={{
                      fontSize: '0.73rem',
                      fontWeight: 800,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '999px',
                      backgroundColor: isActive ? 'rgba(56, 189, 248, 0.18)' : '#ecfdf5',
                      color: isActive ? '#38bdf8' : '#059669',
                      border: isActive ? '1px solid rgba(56,189,248,0.35)' : '1px solid #a7f3d0',
                    }}
                  >
                    {itemCount} قطع • {netTotal.toLocaleString('ar-EG')} ج.م
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      color: isActive ? '#94a3b8' : '#94a3b8',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}
                  >
                    <Clock size={11} />
                    {formatTime(inv.createdAt)}
                  </span>
                )}

                {/* Close / Discard Invoice Button */}
                {(invoices.length > 1 || itemCount > 0 || hasReference) && (
                  <button
                    type="button"
                    onClick={(e) => handleRequestClose(e, inv)}
                    title="إغلاق / إلغاء هذه الفاتورة"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: '1px solid #fecaca',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      cursor: 'pointer',
                      marginInlineStart: '0.15rem',
                      padding: 0,
                    }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Create New Invoice Session Button */}
        <button
          type="button"
          onClick={onCreateInvoice}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#0d1527',
            color: '#ffffff',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 6px rgba(13, 21, 39, 0.2)',
            flexShrink: 0,
          }}
        >
          <Plus size={16} color="#38bdf8" />
          <span>فاتورة جديدة</span>
        </button>
      </div>

      {/* Confirmation Modal Before Closing Non-Empty Invoice */}
      <DeleteModal
        isOpen={Boolean(invoiceToDelete)}
        title="إلغاء فاتورة مفتوحة"
        message={
          invoiceToDelete
            ? `هذه الفاتورة (#${invoiceToDelete.referenceNumber}${
                invoiceToDelete.referenceName
                  ? ` - ${invoiceToDelete.referenceName}`
                  : ''
              }) تحتوي على أصناف مسجلة لم يتم تحصيلها بعد. هل أنت متأكد من إلغاء وحذف هذه الفاتورة؟`
            : ''
        }
        confirmLabel="نعم، إلغاء الفاتورة"
        isPending={false}
        onClose={() => setInvoiceToDelete(null)}
        onConfirm={() => {
          if (invoiceToDelete) {
            onCloseInvoice(invoiceToDelete.id);
            setInvoiceToDelete(null);
          }
        }}
      />
    </>
  );
};

