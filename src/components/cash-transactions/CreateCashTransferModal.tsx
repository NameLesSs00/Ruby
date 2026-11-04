import { useState, type FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeftRight, X, AlertCircle } from 'lucide-react';
import {
  cashTransfersApi,
  cashTransferKeys,
  cashTransactionsApi,
  cashTransactionKeys,
  cashboxLabel,
  type CashboxType,
} from '../../modules/cashTransactions';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

interface CreateCashTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateCashTransferModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateCashTransferModalProps) => {
  useModalEscape(onClose, isOpen);

  const [fromCashbox, setFromCashbox] = useState<CashboxType>('Subscriptions');
  const [toCashbox, setToCashbox] = useState<CashboxType>('Main');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch live balances to know available funds
  const { data: balances = [] } = useQuery({
    queryKey: cashTransactionKeys.balances(),
    queryFn: cashTransactionsApi.getBalances,
    enabled: isOpen,
  });

  const sourceBox = balances.find((b) => b.cashboxType === fromCashbox);
  const availableBalance = sourceBox?.balance ?? 0;

  const transferMutation = useMutation({
    mutationFn: cashTransfersApi.create,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: cashTransactionKeys.all });
      queryClient.invalidateQueries({ queryKey: cashTransferKeys.all });
      showToast.success(res.message || 'تم تحويل النقدية بين الخزن بنجاح');
      onSuccess?.();
      onClose();
      setAmount('');
      setNotes('');
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في إتمام عملية التحويل');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (fromCashbox === toCashbox) {
      showToast.warning('لا يمكن التحويل إلى نفس الخزينة');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast.warning('يرجى إدخال مبلغ تحويل صحيح أكبر من الصفر');
      return;
    }

    if (numAmount > availableBalance) {
      showToast.warning(`المبلغ المطلوب (${numAmount} ج.م) يتجاوز الرصيد المتاح (${availableBalance} ج.م)`);
      return;
    }

    transferMutation.mutate({
      fromCashboxType: fromCashbox,
      toCashboxType: toCashbox,
      amount: numAmount,
      notes: notes.trim() || undefined,
    });
  };

  const cashboxOptions: CashboxType[] = ['Main', 'Subscriptions', 'POS'];

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
                backgroundColor: '#eff6ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeftRight size={20} />
            </div>
            <div>
              <h3 className="modal-title">إجراء تحويل نقدية بين الخزن</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                نقل سيولة نقدية من خزينة فرعية إلى الخزينة الرئيسية أو العكس
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} title="إغلاق">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* From & To Box selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label required">من خزينة (المصدر)</label>
                <select
                  className="form-input"
                  value={fromCashbox}
                  onChange={(e) => {
                    const newFrom = e.target.value as CashboxType;
                    setFromCashbox(newFrom);
                    if (newFrom === toCashbox) {
                      const next = cashboxOptions.find((c) => c !== newFrom) || 'Main';
                      setToCashbox(next);
                    }
                  }}
                  disabled={transferMutation.isPending}
                >
                  {cashboxOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {cashboxLabel(opt)}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  الرصيد المتاح:{' '}
                  <strong style={{ color: availableBalance > 0 ? '#16a34a' : '#dc2626' }}>
                    {availableBalance.toLocaleString('ar-EG')} ج.م
                  </strong>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label required">إلى خزينة (الوجهة)</label>
                <select
                  className="form-input"
                  value={toCashbox}
                  onChange={(e) => setToCashbox(e.target.value as CashboxType)}
                  disabled={transferMutation.isPending}
                >
                  {cashboxOptions
                    .filter((opt) => opt !== fromCashbox)
                    .map((opt) => (
                      <option key={opt} value={opt}>
                        {cashboxLabel(opt)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {availableBalance <= 0 && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={15} />
                <span>رصيد خزينة المصدر المحددة صفر أو سالب، لا يمكن التحويل منها</span>
              </div>
            )}

            {/* Amount */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label required">المبلغ المراد تحويله (ج.م)</label>
                {availableBalance > 0 && (
                  <button
                    type="button"
                    onClick={() => setAmount(availableBalance.toString())}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    تحويل كامل الرصيد ({availableBalance.toLocaleString('ar-EG')} ج.م)
                  </button>
                )}
              </div>
              <input
                type="number"
                step="any"
                min="0.01"
                max={availableBalance > 0 ? availableBalance : undefined}
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={transferMutation.isPending || availableBalance <= 0}
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">ملاحظات التحويل (اختياري)</label>
              <input
                type="text"
                className="form-input"
                placeholder="مثال: توريد إيراد نهاية الوردية، تغذية عهدة..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={transferMutation.isPending}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={transferMutation.isPending}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={transferMutation.isPending || availableBalance <= 0}
            >
              {transferMutation.isPending ? 'جاري التحويل...' : 'تأكيد إتمام التحويل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

