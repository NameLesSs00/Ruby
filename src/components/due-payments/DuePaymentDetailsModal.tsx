import {
  X,
  User,
  Calendar,
  CreditCard,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { useModalEscape } from '../../lib/useModalEscape';
import {
  dueTypeLabel,
  dueStatusLabel,
  type DuePayment,
  type DuePaymentStatus,
  type DueType,
} from '../../modules/duePayments';

interface DuePaymentDetailsModalProps {
  isOpen: boolean;
  duePayment: DuePayment | null;
  onClose: () => void;
  onRecordPayment: (due: DuePayment) => void;
}

const TYPE_STYLES: Record<DueType, { bg: string; color: string; border: string }> = {
  Subscription: { bg: '#eff6ff', color: '#0284c7', border: '#bae6fd' },
  Sale: { bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' },
  ExternalEntity: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
};

const STATUS_STYLES: Record<DuePaymentStatus, { bg: string; color: string; border: string }> = {
  Paid: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
  PartiallyPaid: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  Unpaid: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

export const DuePaymentDetailsModal = ({
  isOpen,
  duePayment,
  onClose,
  onRecordPayment,
}: DuePaymentDetailsModalProps) => {
  useModalEscape(onClose, isOpen);

  if (!isOpen || !duePayment) return null;

  const typeStyle = TYPE_STYLES[duePayment.dueType] || TYPE_STYLES.ExternalEntity;
  const statusStyle = STATUS_STYLES[duePayment.status] || STATUS_STYLES.Unpaid;
  const percent =
    duePayment.totalAmount > 0
      ? Math.min(100, Math.round(((duePayment.paidAmount || 0) / duePayment.totalAmount) * 100))
      : 100;

  return (
    <div className="modal-backdrop">
      <div
        className="modal-card"
        style={{ maxWidth: 560 }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={18} />
            </div>
            <div>
              <h3 className="modal-title">تفاصيل الدين والمستحقات</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                معرف السجل: #{duePayment.id}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Debtor Header Card */}
          <div
            style={{
              padding: '0.9rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <User size={18} color="#334155" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0d1527' }}>
                  {duePayment.payerName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <span
                    style={{
                      padding: '0.15rem 0.55rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: typeStyle.bg,
                      color: typeStyle.color,
                      border: `1px solid ${typeStyle.border}`,
                    }}
                  >
                    {dueTypeLabel(duePayment.dueType)}
                  </span>
                  {duePayment.subscriptionId && (
                    <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>
                      اشتراك #{duePayment.subscriptionId}
                    </span>
                  )}
                  {duePayment.saleId && (
                    <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 700 }}>
                      فاتورة #{duePayment.saleId}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: statusStyle.bg,
                color: statusStyle.color,
                border: `1px solid ${statusStyle.border}`,
              }}
            >
              {dueStatusLabel(duePayment.status)}
            </span>
          </div>

          {/* Financial Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.2rem' }}>إجمالي الدين</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0d1527' }}>
                {duePayment.totalAmount.toLocaleString('ar-EG')}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ج.م</span>
              </div>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#166534', marginBottom: '0.2rem' }}>المبلغ المسدد</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#16a34a' }}>
                {duePayment.paidAmount.toLocaleString('ar-EG')}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ج.م</span>
              </div>
            </div>

            <div style={{ backgroundColor: duePayment.remainingAmount > 0 ? '#fef2f2' : '#f0fdf4', border: `1px solid ${duePayment.remainingAmount > 0 ? '#fecaca' : '#bbf7d0'}`, borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: duePayment.remainingAmount > 0 ? '#991b1b' : '#166534', marginBottom: '0.2rem' }}>المبلغ المتبقي</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: duePayment.remainingAmount > 0 ? '#b91c1c' : '#16a34a' }}>
                {duePayment.remainingAmount.toLocaleString('ar-EG')}{' '}
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ج.م</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ padding: '0.75rem 0.85rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
              <span>نسبة التحصيل والسداد</span>
              <span style={{ color: percent >= 100 ? '#16a34a' : '#0284c7' }}>{percent}%</span>
            </div>
            <div style={{ width: '100%', height: 7, borderRadius: 999, backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percent}%`, borderRadius: 999, backgroundColor: percent >= 100 ? '#10b981' : percent > 0 ? '#f59e0b' : '#ef4444' }} />
            </div>
          </div>

          {/* Details & Dates Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                <Clock size={13} />
                <span>تاريخ الاستحقاق</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                {duePayment.dueDate ? new Date(duePayment.dueDate).toLocaleDateString('ar-EG') : 'غير محدد'}
              </div>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                <Calendar size={13} />
                <span>تاريخ التسجيل بالنظام</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>
                {duePayment.createdAt ? new Date(duePayment.createdAt).toLocaleDateString('ar-EG') : '—'}
              </div>
            </div>
          </div>

          {/* Description Box */}
          <div style={{ padding: '0.85rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
              <Layers size={14} />
              <span>البيان والسبب</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
              {duePayment.description || 'لا يوجد بيان مسجل لهذا الدين'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            إغلاق
          </button>
          {duePayment.remainingAmount > 0 ? (
            <button
              type="button"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              onClick={() => {
                onClose();
                onRecordPayment(duePayment);
              }}
            >
              <CreditCard size={15} />
              <span>تسجيل سداد دفعة</span>
            </button>
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={16} />
              <span>تم سداد هذا الدين بالكامل</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
