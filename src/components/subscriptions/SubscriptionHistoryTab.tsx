import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Search, Filter } from 'lucide-react';
import {
  subscriptionDuePaymentsApi,
  subscriptionDuePaymentKeys,
} from '../../modules/subscriptions';
import {
  paymentMethodLabel,
  paymentMethodBadgeStyle,
  cashboxNameLabel,
  type PaymentMethod,
  PAYMENT_METHODS,
} from '../../modules/duePayments';
import { PaginationBar } from '../ui/PaginationBar';

export const SubscriptionHistoryTab = () => {
  const [historyPage, setHistoryPage] = useState(1);
  const historyPageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | ''>('');

  const { data: historyData, isLoading: isHistoryLoading, isError: isHistoryError } = useQuery({
    queryKey: subscriptionDuePaymentKeys.history({
      page: historyPage,
      pageSize: historyPageSize,
    }),
    queryFn: () =>
      subscriptionDuePaymentsApi.getPaymentHistory({
        page: historyPage,
        pageSize: historyPageSize,
      }),
  });

  const rawItems = historyData?.items || [];

  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesName = item.payerName && item.payerName.toLowerCase().includes(term);
        const matchesSubId = item.subscriptionId.toString().includes(term);
        const matchesDueId = item.duePaymentId.toString().includes(term);
        if (!matchesName && !matchesSubId && !matchesDueId) return false;
      }
      if (methodFilter) {
        const hasMethod = item.payments && item.payments.some((p) => p.paymentMethod === methodFilter);
        if (!hasMethod) return false;
      }
      return true;
    });
  }, [rawItems, searchTerm, methodFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: 220, maxWidth: 320, flex: 1 }}>
            <Search
              size={15}
              color="#94a3b8"
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                insetInlineEnd: '0.75rem',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="البحث باسم المشترك أو رقم الاشتراك..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingInlineEnd: '2.25rem', fontSize: '0.82rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Filter size={15} color="#64748b" />
            <select
              className="form-input"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as PaymentMethod | '')}
              style={{ fontSize: '0.82rem', padding: '0.35rem 0.65rem', minWidth: 150 }}
            >
              <option value="">كافة طرق الدفع</option>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{paymentMethodLabel(m)}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          إجمالي المسجل: <strong>{historyData?.totalCount || 0}</strong> عملية تحصيل
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper" style={{ backgroundColor: '#ffffff' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>تاريخ وساعة السداد</th>
              <th>اسم المشترك</th>
              <th>الاشتراك المرتبط</th>
              <th>طرق السداد والتوزيع</th>
              <th>المبلغ المحصل</th>
              <th>الخزينة المستلمة</th>
            </tr>
          </thead>
          <tbody>
            {isHistoryLoading ? (
              <tr>
                <td colSpan={6} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل سجل التحصيلات...</span>
                  </div>
                </td>
              </tr>
            ) : isHistoryError ? (
              <tr>
                <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <span>تعذر تحميل سجل التحصيلات</span>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty-row">
                  <span>لا توجد عمليات سداد مسجلة حالياً {searchTerm || methodFilter ? 'مطابقة للبحث والتصفية' : ''}</span>
                </td>
              </tr>
            ) : (
              filteredItems.map((h) => {
                const dateFormatted = new Date(h.paymentDate).toLocaleString('ar-EG', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });

                return (
                  <tr key={h.id}>
                    <td style={{ fontSize: '0.85rem', color: '#475569' }}>{dateFormatted}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0d1527' }}>{h.payerName}</span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: '#f1f5f9',
                          color: '#0284c7',
                          fontWeight: 700,
                          border: '1px solid #e0f2fe',
                        }}
                      >
                        اشتراك #{h.subscriptionId}
                      </span>
                    </td>
                    <td>
                      {h.payments && h.payments.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {h.payments.map((p, idx) => {
                            const badge = paymentMethodBadgeStyle(p.paymentMethod);
                            return (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '4px',
                                  backgroundColor: badge.bg,
                                  color: badge.color,
                                  border: `1px solid ${badge.border}`,
                                  fontWeight: 700,
                                }}
                              >
                                {paymentMethodLabel(p.paymentMethod)}: {p.amount.toLocaleString('ar-EG')} ج.م
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>نقداً</span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.95rem' }}>
                        + {h.amountPaid.toLocaleString('ar-EG')} ج.م
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          backgroundColor: '#f8fafc',
                          color: '#334155',
                          fontWeight: 600,
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {cashboxNameLabel(h.cashboxType || h.cashboxName || undefined)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {(historyData?.totalPages || 1) > 1 && (
          <PaginationBar
            page={historyPage}
            totalPages={historyData?.totalPages || 1}
            totalCount={historyData?.totalCount || 0}
            label="إجمالي سجلات السداد"
            isLoading={isHistoryLoading}
            onPageChange={setHistoryPage}
          />
        )}
      </div>
    </div>
  );
};
