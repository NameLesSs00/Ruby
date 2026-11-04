import { ReceiptText, X, Landmark, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { useModalEscape } from '../../lib/useModalEscape';
import {
  type CashTransaction,
  cashboxLabel,
  referenceTypeLabel,
} from '../../modules/cashTransactions';

interface CashTransactionDetailsModalProps {
  isOpen: boolean;
  transaction: CashTransaction | null;
  onClose: () => void;
}

export const CashTransactionDetailsModal = ({
  isOpen,
  transaction,
  onClose,
}: CashTransactionDetailsModalProps) => {
  useModalEscape(onClose, isOpen);

  if (!isOpen || !transaction) return null;

  const isIncome = transaction.transactionType === 'Income';

  const date = new Date(transaction.transactionDate);
  const formattedDate = date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                backgroundColor: isIncome ? '#ecfdf5' : '#fee2e2',
                color: isIncome ? '#059669' : '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReceiptText size={20} />
            </div>
            <div>
              <h3 className="modal-title">تفاصيل حركة النقدية #{transaction.id}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                بيان تفصيلي لحركة الصرف أو التوريد بالخزينة
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {transaction.isVoided && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-sm)',
                color: '#b91c1c',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginBottom: '1rem',
              }}
            >
              <AlertTriangle size={16} />
              <span>
                هذه الحركة ملغاة (Voided) بتاريخ:{' '}
                {transaction.voidedAt ? new Date(transaction.voidedAt).toLocaleString('ar-EG') : '—'}
              </span>
            </div>
          )}

          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.25rem' }}>
              {isIncome ? 'مبلغ التوريد (وارد)' : 'مبلغ الصرف (صادر)'}
            </div>
            <div
              style={{
                fontSize: '1.9rem',
                fontWeight: 900,
                color: isIncome ? '#16a34a' : '#dc2626',
              }}
            >
              {isIncome ? '+' : '-'}
              {transaction.amount.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>الخزينة:</span>
              <strong style={{ color: '#0d1527', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Landmark size={14} color="#64748b" />
                {cashboxLabel(transaction.cashboxType)}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>نوع المعاملة المرجعية:</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.55rem',
                  borderRadius: 999,
                  backgroundColor: '#eff6ff',
                  color: '#0284c7',
                }}
              >
                {referenceTypeLabel(transaction.referenceType)}
              </span>
            </div>

            {transaction.referenceId > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>رقم المرجع / الإيصال:</span>
                <strong style={{ color: '#0d1527' }}>#{transaction.referenceId}</strong>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>تاريخ ووقت المعاملة:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0d1527', fontWeight: 700 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={13} color="#64748b" />
                  {formattedDate}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#64748b' }}>
                  <Clock size={13} />
                  {formattedTime}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ color: '#64748b' }}>البيان والملاحظات:</span>
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #e2e8f0',
                  color: transaction.notes ? '#334155' : '#94a3b8',
                  lineHeight: 1.5,
                }}
              >
                {transaction.notes || 'لا توجد ملاحظات مسجلة على هذه الحركة'}
              </div>
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

