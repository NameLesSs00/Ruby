import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  productsApi,
  productCategoriesApi,
  productKeys,
  categoryKeys,
} from '../../modules/products';
import {
  posSalesApi,
  posKeys,
  type SaleRecord,
  type CreateSalePayload,
} from '../../modules/pos';
import { usePosStore } from '../../modules/posStore';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { ReceiptModal } from '../../components/pos/ReceiptModal';
import { PosProductCatalog } from '../../components/pos/PosProductCatalog';
import { PosCartDrawer } from '../../components/pos/PosCartDrawer';
import { PosInvoiceTabsBar } from '../../components/pos/PosInvoiceTabsBar';

export const PosRegisterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');

  // Receipt Modal State
  const [createdSale, setCreatedSale] = useState<SaleRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Zustand Multi-Invoice Persisted Store
  const {
    invoices,
    activeInvoiceId,
    createInvoice,
    switchInvoice,
    closeInvoice,
    updateReferenceName,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearActiveCart,
    setDiscountAmount,
    setIsPayLater,
    setPayerName,
    setDebtDescription,
    setDueDate,
    setPartialAmountPaid,
    setSaleNotes,
    completeActiveInvoice,
  } = usePosStore();

  const activeInvoice = useMemo(() => {
    return (
      invoices.find((inv) => inv.id === activeInvoiceId) || invoices[0]
    );
  }, [invoices, activeInvoiceId]);

  const {
    referenceNumber,
    referenceName,
    cart,
    discountAmount,
    isPayLater,
    payerName,
    debtDescription,
    dueDate,
    partialAmountPaid,
    saleNotes,
  } = activeInvoice;

  const { data: categoriesData } = useQuery({
    queryKey: categoryKeys.list({ page: 1, pageSize: 50 }),
    queryFn: () => productCategoriesApi.getAll({ page: 1, pageSize: 50 }),
  });

  const categories = categoriesData?.items || [];

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: productKeys.list({
      page: 1,
      pageSize: 100,
      search: searchTerm.trim() || undefined,
      categoryId: selectedCategoryId === 'all' ? undefined : selectedCategoryId,
    }),
    queryFn: () =>
      productsApi.getAll({
        page: 1,
        pageSize: 100,
        search: searchTerm.trim() || undefined,
        categoryId: selectedCategoryId === 'all' ? undefined : selectedCategoryId,
      }),
  });

  const products = (productsData?.items || []).filter((p) => p.isActive);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0);
  }, [cart]);

  const finalAmount = Math.max(0, subtotal - (discountAmount || 0));
  const remainingDebt = isPayLater
    ? Math.max(0, finalAmount - (partialAmountPaid || 0))
    : 0;

  const handleHoldAndCreateNew = () => {
    createInvoice();
    showToast.success(
      `تم الاحتفاظ بالفاتورة #${referenceNumber}${
        referenceName.trim() ? ` (${referenceName.trim()})` : ''
      } وفتح فاتورة جديدة`
    );
  };

  const saleMutation = useMutation({
    mutationFn: (payload: CreateSalePayload) => posSalesApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: posKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: posKeys.duePayments.all });
      showToast.success('تم إتمام عملية البيع وإصدار الفاتورة بنجاح');
      setCreatedSale(res.data);
      setIsReceiptOpen(true);
      completeActiveInvoice();
    },
    onError: (err: unknown) => {
      showToast.apiError(err, 'فشل في إتمام عملية البيع');
    },
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast.warning('السلة فارغة، يرجى إضافة منتجات أولاً');
      return;
    }

    const effectivePayerName = payerName.trim() || referenceName.trim();

    if (isPayLater) {
      if (!effectivePayerName) {
        showToast.warning('يرجى إدخال اسم العميل / المدين أو مرجع الفاتورة في حالة البيع الآجل');
        return;
      }
      if (partialAmountPaid > finalAmount) {
        showToast.warning('المبلغ المدفوع لا يمكن أن يتجاوز صافي الفاتورة');
        return;
      }
    }

    const combinedNotes = [
      referenceName.trim() ? `مرجع: ${referenceName.trim()}` : '',
      saleNotes.trim(),
    ]
      .filter(Boolean)
      .join(' | ');

    const payload: CreateSalePayload = {
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      discountAmount: Number(discountAmount) || 0,
      amountPaid: isPayLater ? Number(partialAmountPaid) || 0 : finalAmount,
      payerName: isPayLater ? effectivePayerName : null,
      debtDescription: isPayLater ? debtDescription.trim() || null : null,
      dueDate: isPayLater && dueDate ? dueDate : null,
      notes: combinedNotes || null,
    };

    saleMutation.mutate(payload);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: 'calc(100vh - 62px)',
      }}
    >
      {/* Multi-Invoice Session Switcher Bar */}
      <PosInvoiceTabsBar
        invoices={invoices}
        activeInvoiceId={activeInvoice.id}
        onSelectInvoice={switchInvoice}
        onCreateInvoice={() => createInvoice()}
        onCloseInvoice={closeInvoice}
      />

      {/* Main Split Workspace */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <PosProductCatalog
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          categories={categories}
          products={products}
          isLoading={isProductsLoading}
          cart={cart}
          onAddToCart={addToCart}
        />

        <PosCartDrawer
          referenceNumber={referenceNumber}
          referenceName={referenceName}
          onReferenceNameChange={(val) => updateReferenceName(activeInvoice.id, val)}
          onHoldAndCreateNew={handleHoldAndCreateNew}
          cart={cart}
          subtotal={subtotal}
          discountAmount={discountAmount}
          setDiscountAmount={setDiscountAmount}
          finalAmount={finalAmount}
          remainingDebt={remainingDebt}
          isPayLater={isPayLater}
          setIsPayLater={setIsPayLater}
          payerName={payerName}
          setPayerName={setPayerName}
          debtDescription={debtDescription}
          setDebtDescription={setDebtDescription}
          dueDate={dueDate}
          setDueDate={setDueDate}
          partialAmountPaid={partialAmountPaid}
          setPartialAmountPaid={setPartialAmountPaid}
          saleNotes={saleNotes}
          setSaleNotes={setSaleNotes}
          isSubmitting={saleMutation.isPending}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onClearCart={clearActiveCart}
          onCheckout={handleCheckout}
        />
      </div>

      <ReceiptModal
        sale={createdSale}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
