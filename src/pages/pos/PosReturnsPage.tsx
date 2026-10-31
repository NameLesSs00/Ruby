import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  RotateCcw,
  Plus,
  AlertCircle,
  Receipt,
  X,
  Trash2,
} from 'lucide-react';
import {
  posReturnsApi,
  posKeys,
  type SaleReturnGroup,
} from '../../modules/pos';
import { ProcessReturnModal } from '../../components/pos/ProcessReturnModal';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';

export const PosReturnsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReturnGroup, setSelectedReturnGroup] = useState<SaleReturnGroup | null>(null);

  // 1. Fetch Return Groups
  const { data: returnGroups = [], isLoading, isError } = useQuery({
    queryKey: posKeys.returns.lists(),
    queryFn: () => posReturnsApi.getAll(),
  });

  // Delete Return Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => posReturnsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: posKeys.returns.all });
      queryClient.invalidateQueries({ queryKey: posKeys.sales.all });
      showToast.success('تم حذف سجل المرتجع بنجاح');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في حذف المرتجع');
    },
  });

  return (
    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={22} color="#ff6b22" />
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0d1527' }}>
              سجل مرتجعات المبيعات
            </h2>
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
            إدارة المرتجعات، استرداد المبالغ للعملاء، وإرجاع الكميات للمخزون
          </p>
        </div>

        <button
          type="button"
          className="btn-add"
          onClick={() => setIsModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} />
          <span>إجراء مرتجع جديد</span>
        </button>
      </div>

      {/* Return Groups Table */}
      <div className="data-table-wrapper" style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>حركة المرتجع</th>
              <th>رقم الفاتورة</th>
              <th>تاريخ المرتجع</th>
              <th>الأصناف المرتجعة</th>
              <th>قيمة الاسترداد</th>
              <th>ملاحظات</th>
              <th style={{ textAlign: 'center' }}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="table-loading-row">
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="spinner" style={{ borderTopColor: '#ff6b22', borderColor: 'rgba(255,107,34,0.2)' }} />
                    <span>جاري تحميل سجل المرتجعات...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="table-empty-row" style={{ color: '#ef4444' }}>
                  <AlertCircle size={22} style={{ margin: '0 auto 0.5rem', display: 'block' }} />
                  <span>تعذر تحميل المرتجعات، يرجى المحاولة لاحقاً</span>
                </td>
              </tr>
            ) : returnGroups.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty-row">
                  <span>لا توجد عمليات مرتجع مسجلة حالياً</span>
                </td>
              </tr>
            ) : (
              returnGroups.map((group) => {
                const dateFormatted = new Date(group.returnDate).toLocaleString('ar-EG', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });
                const totalReturnedPieces = (group.items || []).reduce((sum, i) => sum + i.quantity, 0);

                return (
                  <tr key={group.movementGroupId}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#0d1527' }}>
                        حركة #{group.movementGroupId}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#0284c7' }}>
                        {group.saleInvoiceNumber}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{dateFormatted}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: '#fff1f2',
                          color: '#e11d48',
                          fontWeight: 700,
                        }}
                      >
                        {totalReturnedPieces} قطعة مرتجعة
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#ef4444' }}>
                        {group.totalRefund.toLocaleString('ar-EG')} ج.م
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {group.notes || '—'}
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center', gap: '0.4rem' }}>
                        <button
                          type="button"
                          className="btn-icon-action"
                          title="عرض تفاصيل الأصناف المرتجعة"
                          onClick={() => setSelectedReturnGroup(group)}
                        >
                          <Receipt size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon-action delete"
                          title="حذف حركة المرتجع"
                          onClick={() => {
                            if (window.confirm('هل أنت متأكد من حذف حركة المرتجع هذه؟')) {
                              deleteMutation.mutate(group.movementGroupId);
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Return Group Details Modal */}
      {selectedReturnGroup && (
        <div className="modal-backdrop" onClick={() => setSelectedReturnGroup(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: 500 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">
                تفاصيل حركة المرتجع #{selectedReturnGroup.movementGroupId}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedReturnGroup(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                <div>الفاتورة الأصلية: <strong>{selectedReturnGroup.saleInvoiceNumber}</strong></div>
                <div>التاريخ: {new Date(selectedReturnGroup.returnDate).toLocaleString('ar-EG')}</div>
                <div>الملاحظات: {selectedReturnGroup.notes || '—'}</div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>الأصناف المسترجعة:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {selectedReturnGroup.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span>{item.productName} ({item.quantity} قطعة)</span>
                      <span style={{ fontWeight: 700, color: '#ef4444' }}>
                        {item.totalPrice.toLocaleString('ar-EG')} ج.م
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '2px solid #0d1527',
                  fontSize: '1rem',
                  fontWeight: 800,
                }}
              >
                <span>إجمالي المبلغ المسترد:</span>
                <span style={{ color: '#ef4444' }}>
                  {selectedReturnGroup.totalRefund.toLocaleString('ar-EG')} ج.م
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedReturnGroup(null)}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Return Modal */}
      <ProcessReturnModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
