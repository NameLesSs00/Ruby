import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, AlertCircle, Calendar, Coins, Layers, User } from 'lucide-react';
import {
  duePaymentTransactionsApi,
  duePaymentTransactionKeys,
  paymentMethodLabel,
  paymentMethodBadgeStyle,
  cashboxNameLabel,
  type PaymentMethod,
} from '../../modules/duePayments';
import { PaginationBar } from '../ui/PaginationBar';

export const DuePaymentTransactionsTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | ''>('');

  const { data, isLoading, isError } = useQuery({
    queryKey: duePaymentTransactionKeys.list({ page, pageSize }),
    queryFn: () => duePaymentTransactionsApi.getAll({ page, pageSize }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const filteredItems = useMemo(() => {
    return rawItems.filter((item) => {
      const matchSearch =
        !searchTerm.trim() ||
        (item.payerName && item.payerName.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        item.duePaymentId.toString().includes(searchTerm.trim());

      const matchMethod =
        !methodFilter ||
        (item.payments && item.payments.some((p) => p.paymentMethod === methodFilter));

      return matchSearch && matchMethod;
    });
  }, [rawItems, searchTerm, methodFilter]);

  const totalCollectedSum = useMemo(() => {
    return rawItems.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  }, [rawItems]);

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
      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#ecfdf5',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي المبالغ المحصلة (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857' }}>
              {totalCollectedSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>عدد عمليات التحصيل المسجلة</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1527' }}>
              {totalCount}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>عملية</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          backgroundColor: '#ffffff',
          padding: '0.85rem 1.1rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: 240, maxWidth: 360, flex: 1 }}>
            <Search
              size={16}
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
              placeholder="البحث باسم المدين أو رقم الدين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingInlineEnd: '2.25rem' }}
            />
          </div>

          <div style={{ minWidth: 170 }}>
            <select
              className="form-input"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as PaymentMethod | '')}
            >
              <option value="">جميع طرق الدفع</option>
              <option value="Cash">نقداً</option>
              <option value="InstaPay">إنستاباي</option>
              <option value="VodafoneCash">فودافون كاش</option>
              <option value="Visa">فيزا</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <table className="data-table" style={{ minWidth: 780 }}>
          <thead>
            <tr>
              <th style={{ whiteSpace: 'nowrap' }}>تاريخ ووقت التحصيل</th>
              <th style={{ whiteSpace: 'nowrap' }}>اسم المدين</th>
              <th style={{ whiteSpace: 'nowrap' }}>رقم الدين المرجعي</th>
              <th style={{ whiteSpace: 'nowrap' }}>طريقة الدفع</th>
              <th style={{ whiteSpace: 'nowrap' }}>الخزينة المستلمة</th>
              <th style={{ whiteSpace: 'nowrap' }}>المبلغ المحصل</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل حركات التحصيل والسداد...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <span>تعذر تحميل سجل التحصيلات، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty-row">
                  <span>لا توجد عمليات سداد مسجلة حالياً {searchTerm || methodFilter ? 'مطابقة للتصفية' : ''}</span>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                      <Calendar size={13} color="#94a3b8" />
                      {new Date(item.paymentDate).toLocaleString('ar-EG', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          backgroundColor: '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <User size={13} color="#475569" />
                      </div>
                      <span style={{ color: '#0d1527' }}>{item.payerName}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor: '#f8fafc',
                        color: '#475569',
                        fontWeight: 700,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      دين #{item.duePaymentId}
                    </span>
                  </td>
                  <td>
                    {item.payments && item.payments.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {item.payments.map((p, idx) => {
                          const badge = paymentMethodBadgeStyle(p.paymentMethod);
                          return (
                            <span
                              key={idx}
                              style={{
                                padding: '0.15rem 0.5rem',
                                borderRadius: '999px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                backgroundColor: badge.bg,
                                color: badge.color,
                                border: `1px solid ${badge.border}`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                              }}
                            >
                              <span>{paymentMethodLabel(p.paymentMethod)}</span>
                              {item.payments!.length > 1 && (
                                <span style={{ opacity: 0.85 }}>({p.amount} ج.م)</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span
                        style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#ecfdf5',
                          color: '#047857',
                          border: '1px solid #a7f3d0',
                        }}
                      >
                        نقداً
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>
                      {cashboxNameLabel(item.cashboxType)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 900, color: '#047857', fontSize: '1rem' }}>
                      + {item.amountPaid.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            label="إجمالي حركات التحصيل"
            isLoading={isLoading}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  );
};
