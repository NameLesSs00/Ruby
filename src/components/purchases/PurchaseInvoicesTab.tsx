import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Search,
  Plus,
  DollarSign,
  Coins,
  Clock,
  Layers,
} from 'lucide-react';
import {
  purchaseInvoicesApi,
  purchaseInvoiceKeys,
  type PurchaseInvoice,
} from '../../modules/purchases';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { PurchaseInvoiceFormModal } from './PurchaseInvoiceFormModal';
import { PurchaseInvoiceDetailsModal } from './PurchaseInvoiceDetailsModal';
import { RecordPurchasePaymentModal } from './RecordPurchasePaymentModal';
import { PurchaseInvoicesTable } from './PurchaseInvoicesTable';
import { DeleteModal } from '../ui/DeleteModal';

export const PurchaseInvoicesTab = () => {
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<PurchaseInvoice | null>(null);
  const [detailsInvoiceId, setDetailsInvoiceId] = useState<number | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<PurchaseInvoice | null>(null);
  const [deletingInvoice, setDeletingInvoice] = useState<PurchaseInvoice | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: purchaseInvoiceKeys.list({ page, pageSize }),
    queryFn: () => purchaseInvoicesApi.getAll({ page, pageSize }),
  });

  const rawItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || Math.ceil(totalCount / pageSize) || 1;

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return rawItems;
    const term = searchTerm.toLowerCase().trim();
    return rawItems.filter(
      (item) =>
        item.invoiceNumber.toLowerCase().includes(term) ||
        (item.supplierName && item.supplierName.toLowerCase().includes(term)) ||
        (item.notes && item.notes.toLowerCase().includes(term))
    );
  }, [rawItems, searchTerm]);

  const { totalPurchasesSum, totalPaidSum, totalRemainingDebt, unpaidInvoicesCount } =
    useMemo(() => {
      let purchases = 0;
      let paid = 0;
      let remaining = 0;
      let unpaid = 0;
      rawItems.forEach((inv) => {
        purchases += inv.totalAmount || 0;
        paid += inv.paidAmount || 0;
        remaining += inv.remainingAmount || 0;
        if (inv.remainingAmount > 0) unpaid += 1;
      });
      return {
        totalPurchasesSum: purchases,
        totalPaidSum: paid,
        totalRemainingDebt: remaining,
        unpaidInvoicesCount: unpaid,
      };
    }, [rawItems]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => purchaseInvoicesApi.delete(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: purchaseInvoiceKeys.all });
      showToast.success(res.message || 'تم حذف فاتورة المشتريات بنجاح');
      setDeletingInvoice(null);
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في حذف الفاتورة');
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي المشتريات (الصفحة)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0d1527' }}>
              {totalPurchasesSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>إجمالي المسدد للموردين</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#047857' }}>
              {totalPaidSum.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>الديون المتبقية للموردين</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#b91c1c' }}>
              {totalRemainingDebt.toLocaleString('ar-EG')}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>ج.م</span>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ width: 44, height: 44, borderRadius: '10px', backgroundColor: '#fff7ed', color: '#ff6b22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>فواتير غير مكتملة السداد</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ea580c' }}>
              {unpaidInvoicesCount}{' '}
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>فاتورة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
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

        <button
          type="button"
          className="btn-add"
          onClick={() => {
            setEditingInvoice(null);
            setIsFormModalOpen(true);
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} />
          <span>إنشاء فاتورة مشتريات جديدة</span>
        </button>
      </div>

      {/* Invoices Table */}
      <PurchaseInvoicesTable
        items={filteredItems}
        isLoading={isLoading}
        isError={isError}
        searchTerm={searchTerm}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
        onViewDetails={(id) => setDetailsInvoiceId(id)}
        onRecordPayment={(inv) => setPaymentInvoice(inv)}
        onEdit={(inv) => {
          setEditingInvoice(inv);
          setIsFormModalOpen(true);
        }}
        onDelete={(inv) => setDeletingInvoice(inv)}
      />

      {/* Form Modal */}
      <PurchaseInvoiceFormModal
        isOpen={isFormModalOpen}
        editingInvoice={editingInvoice}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingInvoice(null);
        }}
        onSuccess={() => {
          setIsFormModalOpen(false);
          setEditingInvoice(null);
        }}
      />

      {/* Details Modal */}
      <PurchaseInvoiceDetailsModal
        invoiceId={detailsInvoiceId}
        isOpen={Boolean(detailsInvoiceId)}
        onClose={() => setDetailsInvoiceId(null)}
        onOpenRecordPayment={(inv) => setPaymentInvoice(inv)}
      />

      {/* Record Payment Modal */}
      <RecordPurchasePaymentModal
        invoice={paymentInvoice}
        isOpen={Boolean(paymentInvoice)}
        onClose={() => setPaymentInvoice(null)}
        onSuccess={() => setPaymentInvoice(null)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingInvoice)}
        title="تأكيد حذف فاتورة المشتريات"
        message={`هل أنت متأكد من حذف فاتورة المشتريات رقم (${deletingInvoice?.invoiceNumber}) للمورد "${deletingInvoice?.supplierName}"؟`}
        isPending={deleteMutation.isPending}
        onClose={() => setDeletingInvoice(null)}
        onConfirm={() => {
          if (deletingInvoice) deleteMutation.mutate(deletingInvoice.id);
        }}
      />
    </>
  );
};
