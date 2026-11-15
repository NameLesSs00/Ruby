import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, QrCode, Copy, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { barcodesApi, barcodeKeys, type BarcodeRecord } from '../../modules/barcodes';
import { showToast } from '../../lib/sonner';

interface GenerateBarcodesCardProps {
  onPreviewBarcode: (barcode: BarcodeRecord) => void;
  onBarcodeGenerated?: () => void;
}

export const GenerateBarcodesCard = ({
  onPreviewBarcode,
  onBarcodeGenerated,
}: GenerateBarcodesCardProps) => {
  const queryClient = useQueryClient();
  const [count, setCount] = useState<number>(1);
  const [generatedList, setGeneratedList] = useState<BarcodeRecord[]>([]);

  const generateMutation = useMutation({
    mutationFn: async (num: number) => {
      return await barcodesApi.generate({ count: num });
    },
    meta: {
      invalidate: barcodeKeys.all,
    },
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: barcodeKeys.all });
      showToast.success(res.message || `تم توليد ${count} باركود بنجاح`);
      setGeneratedList(res.data || []);
      if (onBarcodeGenerated) onBarcodeGenerated();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.response?.data?.message || 'تعذر توليد الباركودات';
      showToast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (count < 1 || count > 50) {
      showToast.error('يرجى تحديد عدد بين 1 و 50');
      return;
    }
    generateMutation.mutate(count);
  };

  const handleCopy = async (val: string) => {
    try {
      await navigator.clipboard.writeText(val);
      showToast.success(`تم نسخ الباركود: ${val}`);
    } catch {
      showToast.error('تعذر نسخ الباركود');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Generation Form Card */}
      <div
        className="card-base"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
          <QrCode size={22} color="#ff6b22" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0d1527', margin: 0 }}>
            توليد باركودات جديدة في النظام
          </h2>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          يقوم النظام بإنشاء رموز باركود قياسية فريدة غير مكررة جاهزة للطباعة والتعيين للعملاء أو الاشتراكات.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ minWidth: '200px', flex: '1 1 200px' }}>
            <label
              htmlFor="barcode-count-input"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0d1527', marginBottom: '0.4rem' }}
            >
              عدد الباركودات المطلوبة (1 - 50)
            </label>
            <input
              id="barcode-count-input"
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              disabled={generateMutation.isPending}
              className="form-input"
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={generateMutation.isPending}
            className="btn-add"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.4rem',
              height: '42px',
            }}
          >
            {generateMutation.isPending ? (
              <span>جاري التوليد...</span>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>توليد الباركودات</span>
              </>
            )}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.25rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fef3c7',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'center',
          }}
        >
          <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', color: '#92400e' }}>
            الباركودات المولدة تنشأ افتراضياً بحالة (نشط) وتكون متاحة للتعيين لأي عميل مسجل.
          </span>
        </div>
      </div>

      {/* Results View */}
      {generatedList.length > 0 && (
        <div
          className="card-base"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} color="#16a34a" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0d1527', margin: 0 }}>
                الباركودات التي تم توليدها مؤخراً ({generatedList.length})
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              جاهزة للاستخدام والطباعة
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {generatedList.map((item) => (
              <div
                key={item.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: '#0d1527',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {item.barcodeValue}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                    رقم التعريف: #{item.id}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  <button
                    type="button"
                    onClick={() => handleCopy(item.barcodeValue)}
                    className="btn-icon-action"
                    style={{ padding: '0.4rem', borderRadius: '6px' }}
                    title="نسخ الرمز"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onPreviewBarcode(item)}
                    className="btn-icon-action"
                    style={{ padding: '0.4rem', borderRadius: '6px', color: '#ff6b22' }}
                    title="عرض وطباعة صورة الباركود"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

