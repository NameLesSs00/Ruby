import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { RotateCcw, X, Check } from 'lucide-react';
import {
  posReturnsApi,
  posSalesApi,
  posKeys,
  getSaleReturnStats,
  type SaleRecord,
  type CreateSaleReturnPayload,
} from '../../modules/pos';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { ReturnInvoicePicker } from './ReturnInvoicePicker';

interface ProcessReturnModalProps {
  isOpen: boolean;
  initialSale?: SaleRecord | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProcessReturnModal = ({
  isOpen,
  initialSale,
  onClose,
  onSuccess,
}: ProcessReturnModalProps) => {
  const [selectedSale, setSelectedSale] = useState<SaleRecord | null>(null);
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  const [returnItemsMap, setReturnItemsMap] = useState<Record<number, number>>({});
  const [returnNotes, setReturnNotes] = useState('');

  const { data: returnGroups = [] } = useQuery({
    queryKey: posKeys.returns.lists(),
    queryFn: () => posReturnsApi.getAll(),
    enabled: isOpen,
  });

  const { data: salesData, isLoading: isSalesLoading } = useQuery({
    queryKey: posKeys.sales.list({ page: 1, pageSize: 50 }),
    queryFn: () => posSalesApi.getAll({ page: 1, pageSize: 50 }),
    enabled: isOpen && !selectedSale,
  });

  const allSales = salesData?.items || [];

  const filteredSales = allSales.filter((sale) => {
    if (!invoiceSearchTerm.trim()) return true;
    const term = invoiceSearchTerm.toLowerCase().trim();
    return (
      sale.invoiceNumber.toLowerCase().includes(term) ||
      (sale.notes && sale.notes.toLowerCase().includes(term)) ||
      (sale.items && sale.items.some((i) => i.productName.toLowerCase().includes(term)))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedSale(initialSale || null);
      setInvoiceSearchTerm('');
      setReturnItemsMap({});
      setReturnNotes('');
    }
  }, [isOpen, initialSale]);

  useEffect(() => {
    setReturnItemsMap({});
  }, [selectedSale]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateSaleReturnPayload) => posReturnsApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: posKeys.returns.all });
      queryClient.invalidateQueries({ queryKey: posKeys.sales.all });
      showToast.success(res.message || 'تم تسجيل المرتجع واسترداد المبلغ بنجاح');
      onSuccess?.();
      onClose();
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      showToast.error(msg || 'فشل في معالجة طلب المرتجع');
    },
  });

  if (!isOpen) return null;

  const selectedSaleStats = selectedSale
    ? getSaleReturnStats(selectedSale, returnGroups)
    : null;

  const calculatedRefund = (selectedSaleStats?.items || []).reduce((sum, item) => {
    const returnQty = returnItemsMap[item.saleItemId] || 0;
    return sum + returnQty * item.unitPrice;
  }, 0);

  const handleSubmitReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSale || !selectedSaleStats) {
      showToast.warning('يرجى اختيار الفاتورة أولاً');
      return;
    }

    for (const item of selectedSaleStats.items) {
      const requestedQty = returnItemsMap[item.saleItemId] || 0;
      if (requestedQty > item.remainingReturnableQuantity) {
        showToast.warning(
          `الكمية المحددة للصنف (${item.productName}) تتجاوز المتبقي المتاح (${item.remainingReturnableQuantity})`
        );
        return;
      }
    }

    const itemsToReturn = Object.entries(returnItemsMap)
      .map(([saleItemIdStr, quantity]) => ({
        saleItemId: Number(saleItemIdStr),
        quantity,
      }))
      .filter((i) => i.quantity > 0);

    if (itemsToReturn.length === 0) {
      showToast.warning('يرجى تحديد كمية صنف واحد على الأقل للمرتجع');
      return;
    }

    createMutation.mutate({
      saleId: selectedSale.id,
      items: itemsToReturn,
      notes: returnNotes.trim() || undefined,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200 }}>
      <div className="modal-card" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RotateCcw size={18} color="#ff6b22" />
            <h3 className="modal-title">إجراء مرتجع مبيعات</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmitReturn}>
          <div className="modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
            {!selectedSale ? (
              <ReturnInvoicePicker
                sales={filteredSales}
                returnGroups={returnGroups}
                isLoading={isSalesLoading}
                searchTerm={invoiceSearchTerm}
                onSearchChange={setInvoiceSearchTerm}
                onSelectSale={setSelectedSale}
              />
            ) : (
              <div>
                {/* Selected Invoice Summary Banner */}
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={16} color="#0284c7" />
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0369a1' }}>
                        الفاتورة المختارة: {selectedSale.invoiceNumber}
                      </span>
                    </div>
                    {!initialSale && (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem' }}
                        onClick={() => setSelectedSale(null)}
                      >
                        تغيير الفاتورة
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                      gap: '0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: '#ffffff',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #e0f2fe',
                    }}
                  >
                    <div>
                      <span style={{ color: '#64748b' }}>إجمالي الفاتورة:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{selectedSale.finalAmount.toLocaleString('ar-EG')} ج.م</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>المسترد سابقاً:</span>
                      <div style={{ fontWeight: 700, color: '#ef4444' }}>{selectedSaleStats?.totalPreviouslyRefunded.toLocaleString('ar-EG')} ج.م</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>المتبقي للاسترداد:</span>
                      <div style={{ fontWeight: 800, color: '#059669' }}>{selectedSaleStats?.remainingRefundableAmount.toLocaleString('ar-EG')} ج.م</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>القطع المتبقية:</span>
                      <div style={{ fontWeight: 800, color: '#0284c7' }}>
                        {selectedSaleStats?.totalRemainingPieces} من أصل {selectedSaleStats?.totalSoldPieces} قطعة
                      </div>
                    </div>
                  </div>
                </div>

                <label className="form-label" style={{ marginBottom: '0.5rem' }}>
                  الخطوة 2: حدد الكمية المرتجعة من كل صنف (بحد أقصى المتبقي الفعلي):
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                  {selectedSaleStats?.items.map((item) => {
                    const currentReturnQty = returnItemsMap[item.saleItemId] || 0;
                    const lineRefund = currentReturnQty * item.unitPrice;
                    const isLocked = item.remainingReturnableQuantity === 0;

                    return (
                      <div
                        key={item.saleItemId}
                        style={{
                          padding: '0.75rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid',
                          borderColor: isLocked ? '#e2e8f0' : currentReturnQty > 0 ? '#ff6b22' : '#cbd5e1',
                          backgroundColor: isLocked ? '#f8fafc' : currentReturnQty > 0 ? '#fff7ed' : '#ffffff',
                          opacity: isLocked ? 0.75 : 1,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isLocked ? '#64748b' : '#0d1527' }}>{item.productName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>سعر الوحدة: {item.unitPrice.toLocaleString('ar-EG')} ج.م</div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                              المباع: {item.soldQuantity}
                            </span>
                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: item.previouslyReturnedQuantity > 0 ? '#fee2e2' : '#f1f5f9', color: item.previouslyReturnedQuantity > 0 ? '#b91c1c' : '#64748b', fontWeight: 600 }}>
                              مرتجع سابقاً: {item.previouslyReturnedQuantity}
                            </span>
                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: isLocked ? '#fee2e2' : '#ecfdf5', color: isLocked ? '#b91c1c' : '#047857', fontWeight: 700 }}>
                              {isLocked ? 'تم استرجاع كامل الكمية' : `متبقي للإرجاع: ${item.remainingReturnableQuantity}`}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px dashed #e2e8f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>الكمية المراد إرجاعها الآن:</span>
                            {isLocked ? (
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>غير متاح (0)</span>
                            ) : (
                              <>
                                <input
                                  type="number"
                                  min="0"
                                  max={item.remainingReturnableQuantity}
                                  value={currentReturnQty}
                                  onChange={(e) => {
                                    const val = Math.min(item.remainingReturnableQuantity, Math.max(0, Number(e.target.value)));
                                    setReturnItemsMap((prev) => ({ ...prev, [item.saleItemId]: val }));
                                  }}
                                  style={{ width: 60, padding: '0.3rem 0.4rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                />
                                {item.remainingReturnableQuantity > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => setReturnItemsMap((prev) => ({ ...prev, [item.saleItemId]: item.remainingReturnableQuantity }))}
                                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '4px', color: '#0f172a', cursor: 'pointer' }}
                                  >
                                    إرجاع الكل ({item.remainingReturnableQuantity})
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: currentReturnQty > 0 ? '#ef4444' : '#94a3b8' }}>
                              {lineRefund.toLocaleString('ar-EG')} ج.م
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="return-notes">سبب الإرجاع / ملاحظات</label>
                  <input
                    id="return-notes"
                    type="text"
                    className="form-input"
                    placeholder="مثال: تلف بالمنتج، استبدال مقاس، رغبة العميل"
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca' }}>
                  <span style={{ fontWeight: 700, color: '#991b1b' }}>إجمالي المبلغ المسترد للعميل:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444' }}>{calculatedRefund.toLocaleString('ar-EG')} ج.م</span>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={createMutation.isPending}>
              إلغاء
            </button>
            {selectedSale && (
              <button type="submit" className="btn-add" disabled={createMutation.isPending || calculatedRefund === 0}>
                {createMutation.isPending ? (
                  <>
                    <div className="spinner" />
                    <span>جاري المعالجة...</span>
                  </>
                ) : (
                  <span>تأكيد المرتجع واسترداد {calculatedRefund.toLocaleString('ar-EG')} ج.م</span>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
