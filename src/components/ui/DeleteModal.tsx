import { X } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { useModalEscape } from '../../lib/useModalEscape';

interface DeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'نعم، حذف',
  isPending,
  onClose,
  onConfirm,
}: DeleteModalProps) => {
  useModalEscape(onClose, isOpen && !isPending);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ color: '#ef4444' }}>{title}</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="confirm-delete-box">
            <div className="delete-warning-icon">
              <AlertTriangle size={32} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0d1527', marginBottom: '0.4rem' }}>
                {message}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                لا يمكن التراجع عن هذا الإجراء.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isPending}>
            إلغاء
          </button>
          <button type="button" className="btn-danger" onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <><div className="spinner" /><span>جاري الحذف...</span></>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

