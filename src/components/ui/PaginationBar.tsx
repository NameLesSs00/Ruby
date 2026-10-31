interface PaginationBarProps {
  page: number;
  totalPages: number;
  totalCount: number;
  label: string;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export const PaginationBar = ({
  page,
  totalPages,
  totalCount,
  label,
  isLoading,
  onPageChange,
}: PaginationBarProps) => {
  if (isLoading || totalCount === 0) return null;

  return (
    <div className="pagination-wrapper">
      <span>
        {label}: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
      </span>
      <div className="pagination-controls">
        <button
          type="button"
          className="btn-page"
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(page - 1, 1))}
        >
          السابق
        </button>
        <button
          type="button"
          className="btn-page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          التالي
        </button>
      </div>
    </div>
  );
};

