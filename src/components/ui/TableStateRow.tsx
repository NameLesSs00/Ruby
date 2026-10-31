import { AlertCircle } from 'lucide-react';

interface TableStateRowProps {
  colSpan: number;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  loadingText?: string;
  errorText?: string;
  emptyText?: string;
}

export const TableStateRow = ({
  colSpan,
  isLoading,
  isError,
  isEmpty,
  loadingText = 'جاري التحميل...',
  errorText = 'تعذر تحميل البيانات، يرجى المحاولة لاحقاً',
  emptyText = 'لا توجد بيانات مسجلة حالياً',
}: TableStateRowProps) => {
  if (isLoading) {
    return (
      <tr>
        <td colSpan={colSpan} className="table-loading-row">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
            <span>{loadingText}</span>
          </div>
        </td>
      </tr>
    );
  }

  if (isError) {
    return (
      <tr>
        <td colSpan={colSpan} className="table-empty-row" style={{ color: '#ef4444' }}>
          <AlertCircle size={24} style={{ marginBottom: '0.5rem', display: 'block', marginInline: 'auto' }} />
          <span>{errorText}</span>
        </td>
      </tr>
    );
  }

  if (isEmpty) {
    return (
      <tr>
        <td colSpan={colSpan} className="table-empty-row">
          <span>{emptyText}</span>
        </td>
      </tr>
    );
  }

  return null;
};

