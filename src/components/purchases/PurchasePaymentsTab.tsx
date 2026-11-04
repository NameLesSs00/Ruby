import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Search,
  Trash2,
  AlertCircle,
  Calendar,
  Coins,
  Layers,
} from 'lucide-react';
import {
  purchasePaymentsApi,
  purchasePaymentKeys,
  purchaseInvoiceKeys,
  type PurchaseInvoicePayment,
} from '../../modules/purchases';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { DeleteModal } from '../ui/DeleteModal';
import { PaginationBar } from '../ui/PaginationBar';

export const PurchasePaymentsTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');

  const [deletingPayment, setDeletingPayment] = useState<PurchaseInvoicePayment | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: purchasePaymentKeys.list({ page, pageSize }),
    queryFn: () => purchasePaymentsApi.getAll({ page, pageSize }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems;
    const term = searchTerm.toLowerCase().trim();
    return rawItems.filter(
      (item) =>
        (item.invoiceNumber && item.invoiceNumber.toLowerCase().includes(term)) ||
        (item.supplierName && item.supplierName.toLowerCase().includes(term))
    );
  }, [rawItems, searchTerm]);

  const totalPaidSum = useMemo(() => {
    return rawItems.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
  }, [rawItems]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => purchasePaymentsApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: purchasePaymentKeys.all });
      queryClient.invalidateQueries({ queryKey: purchaseInvoiceKeys.all });
      showToast.success(res.message || 'تم حذف دفعة السداد بنجاح');
      setDeletingPayment(null);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في حذف دفعة السداد');
    },
  });

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
      {/* Financial Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي الدفعات المسددة (الصفحة)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#047857' }}>
              {totalPaidSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>عدد عمليات السداد</div>
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
              style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', insetInlineStart: '0.75rem' }}
            />
            <input
              type="text"
              placeholder="البحث برقم الفاتورة أو اسم المورد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingInlineStart: '2.25rem' }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>تاريخ ووقت السداد</th>
              <th>رقم الفاتورة المرتبطة</th>
              <th>اسم المورد</th>
              <th>المبلغ المسدد</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل سجل الدفعات...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <span>تعذر تحميل سجل مدفوعات المشتريات، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="table-empty-row">
                  <span>لا توجد دفعات مسجلة حالياً {searchTerm ? 'مطابقة للبحث' : ''}</span>
                </td>
              </tr>
            ) : (
              filteredItems.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
                      <Calendar size={13} color="#94a3b8" />
                      {new Date(payment.paymentDate).toLocaleString('ar-EG', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0d1527' }}>
                      #{payment.invoiceNumber}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#334155' }}>
                      {payment.supplierName}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 900, color: '#047857', fontSize: '0.95rem' }}>
                      + {payment.amountPaid.toLocaleString('ar-EG')}{' '}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>ج.م</span>
                    </span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="btn-icon-action"
                        title="حذف عملية السداد"
                        onClick={() => setDeletingPayment(payment)}
                        style={{ color: '#ef4444', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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
            label="إجمالي عمليات السداد"
            isLoading={isLoading}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingPayment)}
        title="تأكيد حذف دفعة السداد"
        message={`هل أنت متأكد من حذف دفعة السداد بقيمة (${deletingPayment?.amountPaid} ج.م) للفاتورة "${deletingPayment?.invoiceNumber}"؟`}
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingPayment(null)}
        onConfirm={() => {
          if (deletingPayment) deleteMutation.mutate(deletingPayment.id);
        }}
      />
    </>
  );
};

