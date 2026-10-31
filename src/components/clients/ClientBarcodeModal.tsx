import { useState, useEffect } from 'react';
import { X, Copy } from 'lucide-react';
import { clientsApi, type Client, type ClientBarcodeResponse } from '../../modules/clients';
import { showToast } from '../../lib/sonner';

const BASE_URL = 'https://swimming1academy.runasp.net';

function calculateAge(dobString: string): number | null {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export interface ClientBarcodeModalProps {
  client: Client | null;
  onClose: () => void;
}

export const ClientBarcodeModal = ({ client, onClose }: ClientBarcodeModalProps) => {
  const [barcodeData, setBarcodeData] = useState<ClientBarcodeResponse | null>(null);
  const [isLoadingBarcode, setIsLoadingBarcode] = useState(false);

  useEffect(() => {
    if (!client) return;

    let cancelled = false;
    setIsLoadingBarcode(true);
    setBarcodeData(null);

    clientsApi
      .getBarcode(client.id)
      .then((res) => {
        if (!cancelled) setBarcodeData(res);
      })
      .catch(() => {
        if (!cancelled) showToast.error('تعذر تحميل باركود العميل');
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBarcode(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client]);

  const handleCopyBarcodeLink = async () => {
    if (!barcodeData?.barcodeUrl || !client) return;

    const fullUrl = barcodeData.barcodeUrl.startsWith('http')
      ? barcodeData.barcodeUrl
      : `${BASE_URL}${barcodeData.barcodeUrl}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast.success('تم نسخ رابط الباركود إلى الحافظة بنجاح');
    } catch {
      showToast.error('تعذر نسخ الرابط');
    }
  };

  if (!client) return null;

  const age = calculateAge(client.dateOfBirth);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">بطاقة باركود العميل</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isLoadingBarcode ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div
                className="spinner"
                style={{
                  borderTopColor: '#ff6b22',
                  borderColor: 'rgba(255,107,34,0.2)',
                  margin: '0 auto 1rem',
                }}
              />
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                جاري استخراج باركود العميل...
              </p>
            </div>
          ) : (
            <div className="barcode-card-container">
              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0d1527' }}>
                {client.fullName}
              </div>
              <span
                className="client-code-badge"
                style={{ fontSize: '0.95rem', padding: '0.3rem 0.8rem' }}
              >
                {client.clientCode}
              </span>

              {age !== null && (
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {age} سنة
                </span>
              )}

              {barcodeData?.barcodeUrl ? (
                <img
                  src={
                    barcodeData.barcodeUrl.startsWith('http')
                      ? barcodeData.barcodeUrl
                      : `${BASE_URL}${barcodeData.barcodeUrl}`
                  }
                  alt={`باركود ${client.clientCode}`}
                  className="barcode-preview-img"
                />
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  لم يتم العثور على صورة باركود
                </div>
              )}

              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                أكاديمية روبي للسباحة — كارت العضوية والاشتراك
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            إغلاق
          </button>
          {barcodeData && (
            <button
              type="button"
              className="btn-add"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={handleCopyBarcodeLink}
            >
              <Copy size={16} />
              <span>نسخ الرابط</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
