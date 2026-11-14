import type { ReactNode } from 'react';
import { Search, FileText, FileSpreadsheet, RotateCcw } from 'lucide-react';

interface ReportFilterBarProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (val: string) => void;
  onToDateChange: (val: string) => void;
  onSearch: () => void;
  onReset?: () => void;
  onDownloadPdf?: () => void;
  onDownloadExcel?: () => void;
  isDownloadingPdf?: boolean;
  isDownloadingExcel?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
}

export const ReportFilterBar = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onSearch,
  onReset,
  onDownloadPdf,
  onDownloadExcel,
  isDownloadingPdf = false,
  isDownloadingExcel = false,
  isLoading = false,
  children,
}: ReportFilterBarProps) => {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          gap: '1rem',
        }}
      >
        {/* Date From */}
        <div style={{ minWidth: '160px', flex: '1 1 160px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.375rem',
            }}
          >
            من تاريخ
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          />
        </div>

        {/* Date To */}
        <div style={{ minWidth: '160px', flex: '1 1 160px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '0.375rem',
            }}
          >
            إلى تاريخ
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="input-field"
            style={{ width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
          />
        </div>

        {/* Extra children filters (e.g. products, transaction types) */}
        {children}

        {/* Search & Reset Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onSearch}
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#0D1527',
              color: '#ffffff',
              border: 'none',
              padding: '0.55rem 1.15rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'background 0.2s',
            }}
          >
            <Search size={16} />
            <span>عرض التقرير</span>
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={isLoading}
              title="إعادة تعيين"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                padding: '0.55rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={15} />
              <span>إعادة ضبط</span>
            </button>
          )}
        </div>

        {/* Export buttons */}
        {(onDownloadPdf || onDownloadExcel) && (
          <div
            style={{
              marginInlineStart: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            {onDownloadPdf && (
              <button
                type="button"
                onClick={onDownloadPdf}
                disabled={isDownloadingPdf}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isDownloadingPdf ? 'not-allowed' : 'pointer',
                  opacity: isDownloadingPdf ? 0.6 : 1,
                }}
              >
                <FileText size={16} />
                <span>{isDownloadingPdf ? 'جاري التحميل...' : 'تصدير PDF'}</span>
              </button>
            )}

            {onDownloadExcel && (
              <button
                type="button"
                onClick={onDownloadExcel}
                disabled={isDownloadingExcel}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  background: '#f0fdf4',
                  color: '#16a34a',
                  border: '1px solid #bbf7d0',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isDownloadingExcel ? 'not-allowed' : 'pointer',
                  opacity: isDownloadingExcel ? 0.6 : 1,
                }}
              >
                <FileSpreadsheet size={16} />
                <span>{isDownloadingExcel ? 'جاري التحميل...' : 'تصدير Excel'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
