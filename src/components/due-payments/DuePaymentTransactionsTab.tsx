import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  AlertCircle,
  Calendar,
  Coins,
  Layers,
  User,
} from 'lucide-react';
import {
  duePaymentTransactionsApi,
  duePaymentTransactionKeys,
} from '../../modules/duePayments';
import { PaginationBar } from '../ui/PaginationBar';

export const DuePaymentTransactionsTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: duePaymentTransactionKeys.list({ page, pageSize }),
    queryFn: () => duePaymentTransactionsApi.getAll({ page, pageSize }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems;
    const term = searchTerm.toLowerCase().trim();
    return rawItems.filter(
      (item) =>
        (item.payerName && item.payerName.toLowerCase().includes(term)) ||
        item.duePaymentId.toString().includes(term)
    );
  }, [rawItems, searchTerm]);

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

      {/* Search Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: 260, maxWidth: 380, flex: 1 }}>
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
        </div>
      </div>

      {/* Transactions Table */}
      <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <table className="data-table" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th style={{ whiteSpace: 'nowrap' }}>تاريخ ووقت التحصيل</th>
              <th style={{ whiteSpace: 'nowrap' }}>اسم المدين</th>
              <th style={{ whiteSpace: 'nowrap' }}>رقم الدين المرجعي</th>
              <th style={{ whiteSpace: 'nowrap' }}>المبلغ المحصل</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل حركات التحصيل والسداد...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <span>تعذر تحميل سجل التحصيلات، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty-row">
                  <span>لا توجد عمليات سداد مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
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

