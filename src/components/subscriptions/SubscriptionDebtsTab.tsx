import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, Coins, Search, AlertCircle, User, Percent } from 'lucide-react';
import {
  subscriptionDuePaymentsApi,
  subscriptionDuePaymentKeys,
  duePaymentStatusLabel,
  type DuePaymentStatus,
  type SubscriptionDuePayment,
} from '../../modules/subscriptions';
import { PaginationBar } from '../ui/PaginationBar';

interface SubscriptionDebtsTabProps {
  onSelectForPayment: (item: SubscriptionDuePayment) => void;
}

const getDueStatusBadge = (status: DuePaymentStatus) => {
  const map: Record<DuePaymentStatus, { bg: string; color: string; border: string; text: string }> = {
    Unpaid: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca', text: 'غير مدفوع' },
    PartiallyPaid: { bg: '#fef3c7', color: '#b45309', border: '#fde68a', text: 'مدفوع جزئياً' },
    Paid: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', text: 'مسدد بالكامل' },
  };
  const style = map[status];
  if (!style) return <span>{duePaymentStatusLabel(status)}</span>;
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

export const SubscriptionDebtsTab = ({ onSelectForPayment }: SubscriptionDebtsTabProps) => {
  const [debtPage, setDebtPage] = useState(1);
  const debtPageSize = 15;
  const [debtStatusFilter, setDebtStatusFilter] = useState<DuePaymentStatus | ''>('');
  const [debtSearchTerm, setDebtSearchTerm] = useState('');

  const { data: dueData, isLoading: isDueLoading, isError: isDueError } = useQuery({
    queryKey: subscriptionDuePaymentKeys.list({
      status: debtStatusFilter,
      page: debtPage,
      pageSize: debtPageSize,
    }),
    queryFn: () =>
      subscriptionDuePaymentsApi.getAll({
        status: debtStatusFilter,
        page: debtPage,
        pageSize: debtPageSize,
      }),
  });

  const dueItems = (dueData?.items || []).filter((item) => {
    if (!debtSearchTerm.trim()) return true;
    const term = debtSearchTerm.toLowerCase().trim();
    return (
      item.payerName.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  });

  const dueTotalCount = dueData?.totalCount || 0;
  const dueTotalPages = dueData?.totalPages || 1;

  const { totalDebtRemaining, totalDebtPaid, debtCollectionRate } = useMemo(() => {
    let rem = 0;
    let paid = 0;
    (dueData?.items || []).forEach((d) => {
      rem += d.remainingAmount || 0;
      paid += d.paidAmount || 0;
    });
    const total = rem + paid;
    const rate = total > 0 ? Math.round((paid / total) * 100) : 100;
    return { totalDebtRemaining: rem, totalDebtPaid: paid, debtCollectionRate: rate };
  }, [dueData?.items]);

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
            <CreditCard size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الديون المتبقية</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b91c1c' }}>
              {totalDebtRemaining.toLocaleString('ar-EG')} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
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
              {totalDebtPaid.toLocaleString('ar-EG')} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, flexDirection: 'column', alignItems: 'stretch', justifyContent: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '6px', backgroundColor: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Percent size={16} />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>نسبة تحصيل الديون</span>
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0284c7' }}>{debtCollectionRate}%</span>
          </div>
          <div style={{ width: '100%', height: 6, borderRadius: 999, backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${debtCollectionRate}%`,
                borderRadius: 999,
                backgroundColor: debtCollectionRate >= 75 ? '#10b981' : debtCollectionRate >= 40 ? '#f59e0b' : '#ef4444',
                transition: 'width 0.4s ease',
              }}
            />
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
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineEnd: '0.75rem', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="البحث باسم المشترك أو الوصف..."
              value={debtSearchTerm}
              onChange={(e) => setDebtSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingInlineEnd: '2.25rem' }}
            />
          </div>

          <select
            className="form-input"
            style={{ width: 180 }}
            value={debtStatusFilter}
            onChange={(e) => {
              setDebtStatusFilter(e.target.value as DuePaymentStatus | '');
              setDebtPage(1);
            }}
          >
            <option value="">جميع الحالات</option>
            <option value="Unpaid">غير مدفوع</option>
            <option value="PartiallyPaid">مدفوع جزئياً</option>
            <option value="Paid">مسدد بالكامل</option>
          </select>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          إجمالي السجلات: <strong>{dueTotalCount}</strong>
        </div>
      </div>

      {/* Due Payments Table */}
      <div className="data-table-wrapper" style={{ backgroundColor: '#ffffff' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>اسم المشترك</th>
              <th>الاشتراك المرتبط</th>
              <th>البيان والوصف</th>
              <th>إجمالي المبلغ</th>
              <th>المسدد</th>
              <th>المتبقي</th>
              <th style={{ width: 140 }}>نسبة السداد</th>
              <th>الحالة</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isDueLoading ? (
              <tr>
                <td colSpan={9} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل سجل الديون والمستحقات...</span>
                  </div>
                </td>
              </tr>
            ) : isDueError ? (
              <tr>
                <td colSpan={9} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <span>تعذر تحميل سجل ديون الاشتراكات</span>
                </td>
              </tr>
            ) : dueItems.length === 0 ? (
              <tr>
                <td colSpan={9} className="table-empty-row">
                  <span>لا توجد ديون مسجلة حالياً {debtSearchTerm ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              dueItems.map((item) => {
                const itemPercent =
                  item.totalAmount > 0
                    ? Math.min(100, Math.round(((item.paidAmount || 0) / item.totalAmount) * 100))
                    : 100;

                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={14} color="#16a34a" />
                        </div>
                        <span>{item.payerName}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', padding: '0.15rem 0.5rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#0284c7', fontWeight: 700, border: '1px solid #e0f2fe' }}>
                        اشتراك #{item.subscriptionId}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.description || '—'}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0d1527' }}>{item.totalAmount.toLocaleString('ar-EG')} ج.م</span>
                    </td>
                    <td>
                      <span style={{ color: '#16a34a', fontWeight: 700 }}>{item.paidAmount.toLocaleString('ar-EG')} ج.م</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: item.remainingAmount > 0 ? '#ef4444' : '#16a34a' }}>
                        {item.remainingAmount.toLocaleString('ar-EG')} ج.م
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
                    <td>{getDueStatusBadge(item.status)}</td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        {item.remainingAmount > 0 ? (
                          <button type="button" className="btn-add" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }} onClick={() => onSelectForPayment(item)}>
                            <span>سداد دفعة</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>تم السداد بالكامل</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {dueTotalPages > 1 && (
        <PaginationBar
          page={debtPage}
          totalPages={dueTotalPages}
          totalCount={dueTotalCount}
          label="إجمالي سجلات الديون"
          isLoading={isDueLoading}
          onPageChange={setDebtPage}
        />
      )}
    </>
  );
};
