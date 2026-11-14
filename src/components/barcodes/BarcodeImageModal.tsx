import { useState, useEffect } from 'react';
import { X, Copy, Printer } from 'lucide-react';
import { barcodesApi, type BarcodeRecord, type BarcodeImageResponse } from '../../modules/barcodes';
import { getApiMediaUrl } from '../../lib/axios';
import { showToast } from '../../lib/sonner';
import { useModalEscape } from '../../lib/useModalEscape';

export interface BarcodeImageModalProps {
  barcode: BarcodeRecord | null;
  onClose: () => void;
}

export const BarcodeImageModal = ({ barcode, onClose }: BarcodeImageModalProps) => {
  useModalEscape(onClose);

  const [imageData, setImageData] = useState<BarcodeImageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!barcode) return;

    let cancelled = false;
    setIsLoading(true);
    setImageData(null);

    barcodesApi
      .getImage(barcode.id)
      .then((res) => {
        if (!cancelled) setImageData(res);
      })
      .catch(() => {
        if (!cancelled) showToast.error('تعذر تحميل صورة الباركود');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [barcode]);

  if (!barcode) return null;

  const fullUrl = imageData?.barcodeUrl ? getApiMediaUrl(imageData.barcodeUrl) : null;

  const handleCopyLink = async () => {
    if (!fullUrl) return;
    try {
      await navigator.clipboard.writeText(fullUrl);
      showToast.success('تم نسخ رابط صورة الباركود');
    } catch {
      showToast.error('تعذر نسخ الرابط');
    }
  };

  const handlePrint = () => {
    if (!fullUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>طباعة الباركود - ${barcode.barcodeValue}</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { border: 2px dashed #0d1527; padding: 24px; border-radius: 12px; text-align: center; }
            img { max-width: 280px; height: auto; }
            h2 { margin: 0 0 8px; color: #0d1527; font-size: 18px; }
            p { margin: 8px 0 0; color: #64748b; font-size: 14px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>أكاديمية روبي للسباحة</h2>
            <img src="${fullUrl}" onload="window.print(); window.close();" />
            <p>${barcode.barcodeValue}</p>
            ${barcode.clientFullName ? `<p style="color: #ff6b22;">العميل: ${barcode.clientFullName}</p>` : ''}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <h3 className="modal-title">صورة الباركود</h3>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isLoading ? (
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
                جاري تحميل صورة الباركود...
              </p>
            </div>
          ) : (
            <div className="barcode-card-container">
              <span
                className="client-code-badge"
                style={{ fontSize: '1rem', padding: '0.35rem 0.9rem', fontWeight: 700 }}
              >
                {barcode.barcodeValue}
              </span>

              {barcode.clientFullName && (
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0d1527', marginTop: '0.5rem' }}>
                  العميل: {barcode.clientFullName}
                </div>
              )}

              {fullUrl ? (
                <img
                  src={fullUrl}
                  alt={`باركود ${barcode.barcodeValue}`}
                  className="barcode-preview-img"
                  style={{ maxHeight: '140px', objectFit: 'contain', margin: '1rem 0' }}
                />
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '1.5rem 0' }}>
                  لم يتم العثور على صورة الباركود
                </div>
              )}

              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                أكاديمية روبي للسباحة — نظام إدارة وتتبع الباركود
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            إغلاق
          </button>

          {fullUrl && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={handleCopyLink}
                title="نسخ الرابط"
              >
                <Copy size={16} />
                <span>نسخ</span>
              </button>

              <button
                type="button"
                className="btn-add"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={handlePrint}
                title="طباعة كارت الباركود"
              >
                <Printer size={16} />
                <span>طباعة</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
