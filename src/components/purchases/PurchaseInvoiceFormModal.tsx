import { useState, useEffect, useMemo } from 'react';
import type { FormEvent } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { X, ShoppingCart } from 'lucide-react';
import {
  purchaseInvoicesApi,
  purchaseInvoiceKeys,
  type PurchaseInvoice,
  type CreatePurchaseInvoicePayload,
  type UpdatePurchaseInvoicePayload,
} from '../../modules/purchases';
import { suppliersApi, supplierKeys } from '../../modules/suppliers';
import { inventoryItemsApi, inventoryKeys } from '../../modules/inventory';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { PurchaseInvoiceLineItems, type FormItemLine } from './PurchaseInvoiceLineItems';
import { useModalEscape } from '../../lib/useModalEscape';

interface PurchaseInvoiceFormModalProps {
  isOpen: boolean;
  editingInvoice: PurchaseInvoice | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PurchaseInvoiceFormModal = ({
  isOpen,
  editingInvoice,
  onClose,
  onSuccess,
}: PurchaseInvoiceFormModalProps) => {
  useModalEscape(onClose, isOpen);

  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<FormItemLine[]>([
    { inventoryItemId: '', quantity: 1, unitCost: 0 },
  ]);

  const { data: suppliersData } = useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: () => suppliersApi.getAll({ pageSize: 100 }),
    enabled: isOpen,
  });

  const { data: inventoryData } = useQuery({
    queryKey: inventoryKeys.items(),
    queryFn: () => inventoryItemsApi.getAll({ pageSize: 100, isActive: true }),
    enabled: isOpen,
  });

  const suppliers = suppliersData?.items || [];
  const inventoryItems = inventoryData?.items || [];

  useEffect(() => {
    if (editingInvoice && isOpen) {
      setSupplierId(editingInvoice.supplierId);
      setInvoiceNumber(editingInvoice.invoiceNumber);
      const d = editingInvoice.invoiceDate
        ? new Date(editingInvoice.invoiceDate).toISOString().slice(0, 10)
        : '';
      setInvoiceDate(d);
      setNotes(editingInvoice.notes || '');

      if (editingInvoice.items && editingInvoice.items.length > 0) {
        setItems(
          editingInvoice.items.map((i) => ({
            inventoryItemId: i.inventoryItemId,
            quantity: i.quantity,
            unitCost: i.unitCost,
          }))
        );
      } else {
        setItems([{ inventoryItemId: '', quantity: 1, unitCost: 0 }]);
      }
    } else if (isOpen) {
      setSupplierId('');
      setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
      setInvoiceDate(new Date().toISOString().slice(0, 10));
      setNotes('');
      setItems([{ inventoryItemId: '', quantity: 1, unitCost: 0 }]);
    }
  }, [editingInvoice, isOpen]);

  const grandTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitCost || 0), 0);
  }, [items]);

  const createMutation = useMutation({
    mutationFn: (payload: CreatePurchaseInvoicePayload) => purchaseInvoicesApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: purchaseInvoiceKeys.lists() });
      showToast.success(res.message || 'تم إنشاء فاتورة المشتريات بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في إنشاء فاتورة المشتريات');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePurchaseInvoicePayload }) =>
      purchaseInvoicesApi.update(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: purchaseInvoiceKeys.lists() });
      showToast.success(res.message || 'تم تحديث فاتورة المشتريات بنجاح');
      onSuccess();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في تحديث فاتورة المشتريات');
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleAddItemLine = () => {
    setItems((prev) => [...prev, { inventoryItemId: '', quantity: 1, unitCost: 0 }]);
  };

  const handleRemoveItemLine = (index: number) => {
    if (items.length <= 1) {
      showToast.warning('يجب أن تحتوي الفاتورة على صنف واحد على الأقل');
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof FormItemLine, value: unknown) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!supplierId) {
      showToast.warning('يرجى اختيار المورد');
      return;
    }

    if (!invoiceNumber.trim()) {
      showToast.warning('يرجى إدخال رقم الفاتورة');
      return;
    }

    if (!invoiceDate) {
      showToast.warning('يرجى تحديد تاريخ الفاتورة');
      return;
    }

    const validItems = items.filter(
      (item) => item.inventoryItemId !== '' && item.quantity > 0 && item.unitCost >= 0
    );

    if (validItems.length === 0) {
      showToast.warning('يرجى تحديد صنف مخزني واحد على الأقل بكمية وسعر صحيح');
      return;
    }

    const payloadItems = validItems.map((item) => ({
      inventoryItemId: Number(item.inventoryItemId),
      quantity: Number(item.quantity),
      unitCost: Number(item.unitCost),
    }));

    if (editingInvoice) {
      updateMutation.mutate({
        id: editingInvoice.id,
        payload: {
          supplierId: Number(supplierId),
          invoiceNumber: invoiceNumber.trim(),
          invoiceDate: new Date(invoiceDate).toISOString(),
          notes: notes.trim() || undefined,
          items: payloadItems,
        },
      });
    } else {
      createMutation.mutate({
        supplierId: Number(supplierId),
        invoiceNumber: invoiceNumber.trim(),
        invoiceDate: new Date(invoiceDate).toISOString(),
        notes: notes.trim() || undefined,
        items: payloadItems,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingCart size={20} color="#ff6b22" />
            <h3 className="modal-title">
              {editingInvoice ? 'تعديل فاتورة المشتريات' : 'إنشاء فاتورة مشتريات جديدة'}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: 'calc(80vh - 120px)', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="supplier-select">
                  المورد <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  id="supplier-select"
                  className="form-input"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value ? Number(e.target.value) : '')}
                  required
                  disabled={isSaving}
                >
                  <option value="">اختر المورد...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.companyName || 'مورد فردي'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inv-number">
                  رقم الفاتورة <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="inv-number"
                  type="text"
                  className="form-input"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  required
                  disabled={isSaving}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="inv-date">
                  تاريخ الفاتورة <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  id="inv-date"
                  type="date"
                  className="form-input"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="inv-notes">
                  ملاحظات
                </label>
                <input
                  id="inv-notes"
                  type="text"
                  className="form-input"
                  placeholder="ملاحظات اختيارية..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Line Items Subcomponent */}
            <PurchaseInvoiceLineItems
              items={items}
              inventoryItems={inventoryItems}
              isSaving={isSaving}
              onAddItem={handleAddItemLine}
              onRemoveItem={handleRemoveItemLine}
              onItemChange={handleItemChange}
            />

            {/* Total Banner */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                backgroundColor: '#fff7ed',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #fed7aa',
              }}
            >
              <span style={{ fontWeight: 800, color: '#9a3412', fontSize: '0.95rem' }}>
                إجمالي قيمة الفاتورة:
              </span>
              <span style={{ fontWeight: 900, color: '#ea580c', fontSize: '1.25rem' }}>
                {grandTotal.toLocaleString('ar-EG')}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>ج.م</span>
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>
              إلغاء
            </button>
            <button type="submit" className="btn-add" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="spinner" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>{editingInvoice ? 'حفظ التعديلات' : 'حفظ الفاتورة'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
