import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { UploadCloud, Trash2, Image as ImageIcon, RotateCcw } from 'lucide-react';

interface ProductImageUploadProps {
  previewUrl: string | null;
  removeExistingImage: boolean;
  selectedFile: File | null;
  hasExistingImage: boolean;
  isSaving: boolean;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onRestoreExistingImage: () => void;
}

export const ProductImageUpload = ({
  previewUrl,
  removeExistingImage,
  selectedFile,
  hasExistingImage,
  isSaving,
  onFileChange,
  onRemoveImage,
  onRestoreExistingImage,
}: ProductImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <ImageIcon size={16} color="var(--color-orange)" />
        <span>صورة المنتج (اختياري)</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        style={{ display: 'none' }}
        onChange={onFileChange}
        disabled={isSaving}
      />

      {previewUrl && !removeExistingImage ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg)',
          }}
        >
          <img
            src={previewUrl}
            alt="معاينة المنتج"
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-sm)',
              objectFit: 'cover',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: '0.25rem',
              }}
            >
              {selectedFile ? selectedFile.name : 'الصورة الحالية للمنتج'}
            </div>
            {selectedFile && (
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {(selectedFile.size / 1024).toFixed(1)} ك.ب
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isSaving}
              >
                تغيير الصورة
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.8rem',
                  color: '#ef4444',
                  borderColor: '#fca5a5',
                  backgroundColor: '#fef2f2',
                }}
                onClick={onRemoveImage}
                disabled={isSaving}
              >
                <Trash2 size={13} style={{ marginInlineEnd: '0.25rem' }} />
                إزالة
              </button>
            </div>
          </div>
        </div>
      ) : removeExistingImage ? (
        <div
          style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed #f87171',
            backgroundColor: '#fff1f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: '#b91c1c' }}>
            تم تحديد إزالة الصورة الحالية عند الحفظ
          </span>
          {hasExistingImage && (
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
              onClick={onRestoreExistingImage}
              disabled={isSaving}
            >
              <RotateCcw size={13} style={{ marginInlineEnd: '0.25rem' }} />
              تراجع
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#ffffff',
            transition: 'border-color 0.2s, background-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-orange)';
            e.currentTarget.style.backgroundColor = '#fffaf7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          <UploadCloud size={32} color="var(--color-orange)" style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>
            اضغط هنا لرفع صورة المنتج
          </p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            صيغ مدعومة: JPG, PNG, WebP (بحد أقصى 5 ميجابايت)
          </p>
        </div>
      )}
    </div>
  );
};

