import { useRef } from 'react';
import { Printer, X, CheckCircle, Receipt as ReceiptIcon } from 'lucide-react';
import logoImg from '../../assets/logo.png';
import type { SaleRecord } from '../../modules/pos';

interface ReceiptModalProps {
  sale: SaleRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal = ({ sale, isOpen, onClose }: ReceiptModalProps) => {
  const receiptPrintRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const saleDateFormatted = new Date(sale.saleDate).toLocaleString('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div
        className="modal-card"
        style={{ maxWidth: 440, padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Header */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#0d1527',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <ReceiptIcon size={18} color="#ff6b22" />
            <span>فاتورة مبيعات - {sale.invoiceNumber}</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            style={{ color: '#ffffff' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div
          ref={receiptPrintRef}
          className="receipt-paper"
          style={{
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            fontFamily: 'var(--font-arabic)',
            fontSize: '0.85rem',
            lineHeight: 1.5,
          }}
        >
          {/* Receipt Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.75rem' }}>
            <img
              src={logoImg}
              alt="Ruby Logo"
              style={{ width: 48, height: 48, objectFit: 'contain', margin: '0 auto 0.4rem', display: 'block' }}
            />
            <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', fontWeight: 800 }}>
              أكاديمية روبي للسباحة
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
              نظام نقاط البيع والمبيعات
            </p>
          </div>

          {/* Invoice Meta */}
          <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span style={{ color: '#64748b' }}>رقم الفاتورة:</span>
              <span style={{ fontWeight: 700 }}>{sale.invoiceNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span style={{ color: '#64748b' }}>التاريخ والوقت:</span>
              <span>{saleDateFormatted}</span>
            </div>
            {sale.notes && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>ملاحظات:</span>
                <span>{sale.notes}</span>
              </div>
            )}
          </div>

          {/* Line Items Table */}
          <div style={{ marginBottom: '0.75rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '0.6rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ textAlign: 'start', paddingBottom: '0.35rem' }}>الصنف</th>
                  <th style={{ textAlign: 'center', paddingBottom: '0.35rem' }}>العدد</th>
                  <th style={{ textAlign: 'end', paddingBottom: '0.35rem' }}>السعر</th>
                  <th style={{ textAlign: 'end', paddingBottom: '0.35rem' }}>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px dotted #f1f5f9' }}>
                    <td style={{ padding: '0.35rem 0', fontWeight: 600 }}>{item.productName}</td>
                    <td style={{ padding: '0.35rem 0', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '0.35rem 0', textAlign: 'end' }}>{item.unitPrice.toLocaleString('ar-EG')}</td>
                    <td style={{ padding: '0.35rem 0', textAlign: 'end', fontWeight: 600 }}>
                      {item.totalPrice.toLocaleString('ar-EG')} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ color: '#64748b' }}>إجمالي الأصناف:</span>
              <span>{sale.totalAmount.toLocaleString('ar-EG')} ج.م</span>
            </div>
            {sale.discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', color: '#ef4444' }}>
                <span>قيمة الخصم:</span>
                <span>- {sale.discountAmount.toLocaleString('ar-EG')} ج.م</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.5rem',
                borderTop: '2px solid #0f172a',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0f172a',
              }}
            >
              <span>الصافي النهائي:</span>
              <span>{sale.finalAmount.toLocaleString('ar-EG')} ج.م</span>
            </div>
          </div>

          {/* Receipt Footer */}
          <div style={{ textAlign: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '0.75rem', color: '#64748b', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.2rem', color: '#16a34a', fontWeight: 600 }}>
              <CheckCircle size={14} />
              <span>تم تسجيل العملية بنجاح</span>
            </div>
            <p style={{ margin: 0 }}>شكراً لتعاملكم مع أكاديمية روبي للسباحة</p>
          </div>
        </div>

        {/* Modal Buttons (Hidden on Print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <button type="button" className="btn-secondary" onClick={onClose}>
            إغلاق
          </button>
          <button
            type="button"
            className="btn-add"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            onClick={handlePrint}
          >
            <Printer size={16} />
            <span>طباعة الإيصال</span>
          </button>
        </div>
      </div>
    </div>
  );
};

