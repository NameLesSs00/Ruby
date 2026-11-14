import { AlertCircle, HelpCircle } from 'lucide-react';
import type { BarcodeRecord } from '../../modules/barcodes';
import { useModalEscape } from '../../lib/useModalEscape';

export interface DetachBarcodeModalProps {
  barcode: BarcodeRecord | null;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DetachBarcodeModal = ({
  barcode,
  isLoading,
  onConfirm,
  onClose,
}: DetachBarcodeModalProps) => {
  useModalEscape(onClose);

  if (!barcode) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} color="#ef4444" />
            <h3 className="modal-title">تأكيد فك ارتباط الباركود</h3>
          </div>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#0d1527', lineHeight: 1.6 }}>
            هل أنت متأكد من رغبتك في فك ارتباط الباركود{' '}
            <strong>{barcode.barcodeValue}</strong> عن العميل{' '}
            <strong>{barcode.clientFullName || `#${barcode.clientId}`}</strong>؟
          </p>

          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '0.75rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
            }}
          >
            <HelpCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.8rem', color: '#991b1b', lineHeight: 1.5 }}>
              ملاحظة هامة: يشترط النظام ألا يكون لدى العميل أي اشتراكات جارية أو نشطة حالياً. في حال وجود اشتراك نشط، يجب إنهاؤه أو إلغاؤه أولاً.
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.55rem 1rem',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            {isLoading ? 'جاري الفك...' : 'تأكيد فك الارتباط'}
          </button>
        </div>
      </div>
    </div>
  );
};

