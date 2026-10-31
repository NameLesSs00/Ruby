import { useMemo } from 'react';
import {
  Clock,
  Search,
  AlertCircle,
  Coins,
  DollarSign,
  User,
  Percent,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import type { PosDuePayment, DuePaymentStatus } from '../../modules/pos';

interface PosDebtsTabProps {
  items: PosDuePayment[];
  totalCount: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  statusFilter: DuePaymentStatus | '';
  onStatusFilterChange: (status: DuePaymentStatus | '') => void;
  onPageChange: (page: number) => void;
  onOpenPaymentModal: (due: PosDuePayment) => void;
}

const getStatusBadge = (status: DuePaymentStatus) => {
  const map: Record<DuePaymentStatus, { bg: string; color: string; border: string; text: string }> = {
    Unpaid: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca', text: 'غير مدفوع' },
    PartiallyPaid: { bg: '#fef3c7', color: '#b45309', border: '#fde68a', text: 'مدفوع جزئياً' },
    Paid: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', text: 'مسدد بالكامل' },
  };
  const style = map[status];
  if (!style) return <span>{status}</span>;
  return (
    <span
      style={{
        padding: '0.2rem 0.65rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
      }}
    >
      {style.text}
    </span>
  );
};

export const PosDebtsTab = ({
  items,
  totalCount,
  page,
  totalPages,
  isLoading,
  isError,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onPageChange,
  onOpenPaymentModal,
}: PosDebtsTabProps) => {
  const filteredItems = items.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      item.payerName.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  });

  const { totalRemainingSum, totalPaidSum, unpaidCount, collectionRate } = useMemo(() => {
    let rem = 0;
    let paid = 0;
    let count = 0;
    items.forEach((d) => {
      rem += d.remainingAmount || 0;
      paid += d.paidAmount || 0;
      if (d.status !== 'Paid') count += 1;
    });
    const total = rem + paid;
    const rate = total > 0 ? Math.round((paid / total) * 100) : 100;
    return { totalRemainingSum: rem, totalPaidSum: paid, unpaidCount: count, collectionRate: rate };
  }, [items]);

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '1rem 1.25rem',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الديون المتبقية</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b91c1c' }}>
              {totalRemainingSum.toLocaleString('ar-EG')} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي المبالغ المسددة</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857' }}>
              {totalPaidSum.toLocaleString('ar-EG')} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '6px', backgroundColor: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Percent size={16} />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>نسبة التحصيل الكلية</span>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7' }}>{collectionRate}%</span>
          </div>
          <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${collectionRate}%`,
                borderRadius: 999,
                backgroundColor: collectionRate >= 75 ? '#10b981' : collectionRate >= 40 ? '#f59e0b' : '#ef4444',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#fff7ed', color: '#ff6b22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>الفواتير ذات المتبقي</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ff6b22' }}>
              {unpaidCount} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>فاتورة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '0.75rem' }} />
            <input
              type="text"
              placeholder="البحث باسم المدين أو البيان..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-input"
              style={{ paddingInlineStart: '2.25rem' }}
            />
          </div>

          <select
            className="form-input"
            style={{ width: 180 }}
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as DuePaymentStatus | '')}
          >
            <option value="">جميع الحالات</option>
            <option value="Unpaid">غير مدفوع</option>
            <option value="PartiallyPaid">مدفوع جزئياً</option>
            <option value="Paid">مسدد بالكامل</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          إجمالي السجلات: <strong>{totalCount}</strong>
        </div>
      </div>

      {/* Due Payments Table */}
      <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>اسم المدين</th>
              <th>الفاتورة المرتبطة</th>
              <th>البيان والوصف</th>
              <th>إجمالي المبلغ</th>
              <th>المسدد</th>
              <th>المتبقي</th>
              <th style={{ width: 140 }}>نسبة السداد</th>
              <th>تاريخ الاستحقاق</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل فواتير الديون...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={10} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <span>تعذر تحميل سجل الديون، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="table-empty-row">
                  <span>لا توجد ديون مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              filteredItems.map((due) => {
                const itemPercent =
                  due.totalAmount > 0
                    ? Math.min(100, Math.round(((due.paidAmount || 0) / due.totalAmount) * 100))
                    : 100;

                return (
                  <tr key={due.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={14} color="#16a34a" />
                        </div>
                        <span>{due.payerName}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                        فاتورة #{due.saleId}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{due.description || '—'}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0d1527' }}>{due.totalAmount.toLocaleString('ar-EG')} ج.م</span>
                    </td>
                    <td>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>{due.paidAmount.toLocaleString('ar-EG')} ج.م</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: due.remainingAmount > 0 ? '#ef4444' : '#16a34a' }}>
                        {due.remainingAmount.toLocaleString('ar-EG')} ج.م
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                          <span>{itemPercent}%</span>
                        </div>
                        <div style={{ width: '100%', height: 5, borderRadius: 999, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${itemPercent}%`, backgroundColor: itemPercent >= 100 ? '#10b981' : itemPercent > 0 ? '#f59e0b' : '#ef4444', borderRadius: 999 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {due.dueDate ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={13} color="#94a3b8" />
                          {new Date(due.dueDate).toLocaleDateString('ar-EG')}
                        </span>
                      ) : (
                        'غير محدد'
                      )}
                    </td>
                    <td>{getStatusBadge(due.status)}</td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        {due.remainingAmount > 0 ? (
                          <button type="button" className="btn-add" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }} onClick={() => onOpenPaymentModal(due)}>
                            <span>سداد دفعة</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle2 size={14} />
                            تم السداد بالكامل
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {!isLoading && totalCount > 0 && (
          <div className="pagination-wrapper">
            <span>
              إجمالي السجلات: <strong>{totalCount}</strong> (صفحة {page} من {totalPages})
            </span>
            <div className="pagination-controls">
              <button type="button" className="btn-page" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
                السابق
              </button>
              <button type="button" className="btn-page" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
