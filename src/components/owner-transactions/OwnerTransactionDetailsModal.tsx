import { X, ArrowUpLeft, ArrowDownRight, Calendar, Landmark, Hash, DollarSign, FileText } from 'lucide-react';
import {
  ownerTransactionTypeLabel,
  ownerCashboxLabel,
  type OwnerTransaction,
} from '../../modules/ownerTransactions';
import { useModalEscape } from '../../lib/useModalEscape';

interface OwnerTransactionDetailsModalProps {
  isOpen: boolean;
  transaction: OwnerTransaction | null;
  onClose: () => void;
}

export const OwnerTransactionDetailsModal = ({
  isOpen,
  transaction,
  onClose,
}: OwnerTransactionDetailsModalProps) => {
  useModalEscape(onClose, isOpen);

  if (!isOpen || !transaction) return null;

  const isWithdrawal = transaction.transactionType === 'Withdrawal';

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
        style={{ maxWidth: '540px', width: '92%' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                backgroundColor: isWithdrawal ? '#fff1f2' : '#ecfdf5',
                color: isWithdrawal ? '#e11d48' : '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isWithdrawal ? <ArrowUpLeft size={20} /> : <ArrowDownRight size={20} />}
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0 }}>
                تفاصيل إيصال حركة المالك
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                رقم القيد المالي: #{transaction.id}
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary Grid */}
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
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>رقم الحركة</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0d1527' }}>
                  #{transaction.id}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark size={16} color="#64748b" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>الخزينة المتأثرة</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0d1527' }}>
                  {ownerCashboxLabel(transaction.cashboxType)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={16} color="#64748b" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>المبلغ المالي</span>
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    color: isWithdrawal ? '#e11d48' : '#059669',
                  }}
                >
                  {isWithdrawal ? '- ' : '+ '}
                  {transaction.amount.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={16} color="#64748b" />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>التاريخ والوقت</span>
                <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0d1527' }}>
                  {formatDateTime(transaction.transactionDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Type Badge Highlight */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
              طبيعة الحركة:
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.82rem',
                fontWeight: 700,
                backgroundColor: isWithdrawal ? '#fff1f2' : '#ecfdf5',
                color: isWithdrawal ? '#e11d48' : '#059669',
                border: `1px solid ${isWithdrawal ? '#fecdd3' : '#a7f3d0'}`,
              }}
            >
              {isWithdrawal ? <ArrowUpLeft size={15} /> : <ArrowDownRight size={15} />}
              {ownerTransactionTypeLabel(transaction.transactionType)}
            </span>
          </div>

          {/* Notes Card */}
          {transaction.notes && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.6rem',
                padding: '0.85rem 1rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <FileText size={17} color="#64748b" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 700 }}>
                  البيان والملاحظات
                </span>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', color: '#1e293b' }}>
                  {transaction.notes}
                </p>
              </div>
            </div>
          )}
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

