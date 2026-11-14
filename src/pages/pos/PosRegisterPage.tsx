import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productsApi, productCategoriesApi, productKeys, categoryKeys } from '../../modules/products';
import { posSalesApi, posKeys, type SaleRecord, type CreateSalePayload } from '../../modules/pos';
import { employeeSalesApi, employeeSaleKeys, type CreateEmployeeSalePayload } from '../../modules/employeeSales';
import { employeesApi, employeeKeys } from '../../modules/employees';
import { usePosStore } from '../../modules/posStore';
import { queryClient } from '../../lib/query-client';
import { cashTransactionKeys } from '../../modules/cashTransactions';
import { showToast } from '../../lib/sonner';
import { ReceiptModal } from '../../components/pos/ReceiptModal';
import { PosProductCatalog } from '../../components/pos/PosProductCatalog';
import { PosCartDrawer } from '../../components/pos/PosCartDrawer';
import { PosInvoiceTabsBar } from '../../components/pos/PosInvoiceTabsBar';

export const PosRegisterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');

  const [createdSale, setCreatedSale] = useState<SaleRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const {
    invoices, activeInvoiceId, createInvoice, switchInvoice, closeInvoice, updateReferenceName,
    addToCart, updateQuantity, removeFromCart, clearActiveCart, setSaleType, setSelectedEmployee,
    setPaymentMethod, setCustomerPayments, setEmployeePayments, setDiscountAmount, setIsPayLater,
    setPayerName, setDebtDescription, setDueDate, setPartialAmountPaid, setSaleNotes, completeActiveInvoice,
  } = usePosStore();

  const activeInvoice = useMemo(() => {
    return invoices.find((inv) => inv.id === activeInvoiceId) || invoices[0];
  }, [invoices, activeInvoiceId]);

  const {
    referenceNumber, referenceName, cart, saleType, employeeId,
    paymentMethod, customerPayments, employeePayments, discountAmount, isPayLater, payerName, debtDescription, dueDate,
    partialAmountPaid, saleNotes,
  } = activeInvoice;

  const { data: categoriesData } = useQuery({
    queryKey: categoryKeys.list({ page: 1, pageSize: 50 }),
    queryFn: () => productCategoriesApi.getAll({ page: 1, pageSize: 50 }),
  });
  const categories = categoriesData?.items || [];

  const { data: employeesData } = useQuery({
    queryKey: employeeKeys.list({ page: 1, pageSize: 100, isActive: true }),
    queryFn: () => employeesApi.getAll({ page: 1, pageSize: 100, isActive: true }),
  });
  const employees = employeesData?.items || [];

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: productKeys.list({
      page: 1, pageSize: 100, search: searchTerm.trim() || undefined,
      categoryId: selectedCategoryId === 'all' ? undefined : selectedCategoryId,
    }),
    queryFn: () => productsApi.getAll({
      page: 1, pageSize: 100, search: searchTerm.trim() || undefined,
      categoryId: selectedCategoryId === 'all' ? undefined : selectedCategoryId,
    }),
  });
  const products = (productsData?.items || []).filter((p) => p.isActive);

  // Dynamic unit price: use employeePrice if Employee sale and > 0, else customerPrice
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price =
        saleType === 'Employee' && item.product.employeePrice > 0
          ? item.product.employeePrice
          : item.product.customerPrice;
      return sum + price * item.quantity;
    }, 0);
  }, [cart, saleType]);

  const finalAmount = Math.max(0, subtotal - (discountAmount || 0));
  const remainingDebt = isPayLater && saleType === 'Customer'
    ? Math.max(0, finalAmount - (partialAmountPaid || 0))
    : 0;

  const handleHoldAndCreateNew = () => {
    createInvoice();
    showToast.success(
      `تم الاحتفاظ بالفاتورة #${referenceNumber}${referenceName.trim() ? ` (${referenceName.trim()})` : ''} وفتح فاتورة جديدة`
    );
  };

  const saleMutation = useMutation({
    mutationFn: (payload: CreateSalePayload) => posSalesApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: posKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: posKeys.duePayments.all });
      queryClient.invalidateQueries({ queryKey: cashTransactionKeys.all });
      showToast.success('تم إتمام عملية البيع وإصدار الفاتورة بنجاح');
      setCreatedSale(res.data);
      setIsReceiptOpen(true);
      completeActiveInvoice();
    },
    onError: (err: unknown) => showToast.apiError(err, 'فشل في إتمام عملية البيع'),
  });

  const employeeSaleMutation = useMutation({
    mutationFn: (payload: CreateEmployeeSalePayload) => employeeSalesApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: employeeSaleKeys.all });
      queryClient.invalidateQueries({ queryKey: posKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: cashTransactionKeys.all });
      showToast.success('تم إتمام عملية بيع الموظف بنجاح');
      setCreatedSale(res.data as unknown as SaleRecord);
      setIsReceiptOpen(true);
      completeActiveInvoice();
    },
    onError: (err: unknown) => showToast.apiError(err, 'فشل في إتمام عملية بيع الموظف'),
  });

  const isSubmitting = saleMutation.isPending || employeeSaleMutation.isPending;

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast.warning('السلة فارغة، يرجى إضافة منتجات أولاً');
      return;
    }

    if (saleType === 'Employee') {
      if (!employeeId) {
        showToast.warning('يرجى اختيار الموظف المستفيد من الخصم أولاً');
        return;
      }
      const currentPayments = employeePayments && employeePayments.length > 0
        ? employeePayments
        : [{ paymentMethod: paymentMethod || 'Cash', amount: finalAmount }];

      const validPayments = currentPayments
        .map((p) => ({ paymentMethod: p.paymentMethod, amount: Number(p.amount) || 0 }))
        .filter((p) => p.amount > 0);

      const totalPaid = validPayments.reduce((sum, p) => sum + p.amount, 0);

      if (validPayments.length === 0) {
        showToast.warning('يرجى تحديد مبالغ طرق الدفع');
        return;
      }
      if (totalPaid !== finalAmount) {
        showToast.warning(`إجمالي مبالغ الدفع (${totalPaid} ج.م) يجب أن يساوي صافي الفاتورة (${finalAmount} ج.م)`);
        return;
      }

      const employeePayload: CreateEmployeeSalePayload = {
        employeeId,
        items: cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        amountPaid: finalAmount,
        payments: validPayments,
        notes: [referenceName.trim(), saleNotes.trim()].filter(Boolean).join(' | ') || null,
      };
      employeeSaleMutation.mutate(employeePayload);
      return;
    }

    // Normal Customer Sale
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

    const targetPaid = isPayLater ? Number(partialAmountPaid) || 0 : finalAmount;
    let validPayments: { paymentMethod: any; amount: number }[] = [];

    if (targetPaid > 0) {
      const activeCustPayments = customerPayments && customerPayments.length > 0
        ? customerPayments
        : [{ paymentMethod: paymentMethod || 'Cash', amount: targetPaid }];

      validPayments = activeCustPayments
        .map((p) => ({ paymentMethod: p.paymentMethod, amount: Number(p.amount) || 0 }))
        .filter((p) => p.amount > 0);

      const sumPaid = validPayments.reduce((s, p) => s + p.amount, 0);
      if (sumPaid !== targetPaid) {
        showToast.warning(`إجمالي مبالغ طرق الدفع (${sumPaid} ج.م) يجب أن يساوي المبلغ المطلوب (${targetPaid} ج.م)`);
        return;
      }
    }

    const payload: CreateSalePayload = {
      items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      discountAmount: Number(discountAmount) || 0,
      amountPaid: targetPaid,
      payments: validPayments,
      payerName: isPayLater ? effectivePayerName : null,
      debtDescription: isPayLater ? debtDescription.trim() || null : null,
      dueDate: isPayLater && dueDate ? dueDate : null,
      notes: [referenceName.trim() ? `مرجع: ${referenceName.trim()}` : '', saleNotes.trim()].filter(Boolean).join(' | ') || null,
    };
    saleMutation.mutate(payload);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: 'calc(100vh - 62px)' }}>
      <PosInvoiceTabsBar
        invoices={invoices} activeInvoiceId={activeInvoice.id} onSelectInvoice={switchInvoice}
        onCreateInvoice={() => createInvoice()} onCloseInvoice={closeInvoice}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <PosProductCatalog
          searchTerm={searchTerm} onSearchChange={setSearchTerm}
          selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId}
          categories={categories} products={products} isLoading={isProductsLoading}
          cart={cart} isEmployeeSale={saleType === 'Employee'} onAddToCart={addToCart}
        />

        <PosCartDrawer
          referenceNumber={referenceNumber} referenceName={referenceName}
          onReferenceNameChange={(val) => updateReferenceName(activeInvoice.id, val)}
          onHoldAndCreateNew={handleHoldAndCreateNew} cart={cart} subtotal={subtotal}
          discountAmount={discountAmount} setDiscountAmount={setDiscountAmount}
          finalAmount={finalAmount} remainingDebt={remainingDebt} isPayLater={isPayLater}
          setIsPayLater={setIsPayLater} payerName={payerName} setPayerName={setPayerName}
          debtDescription={debtDescription} setDebtDescription={setDebtDescription}
          dueDate={dueDate} setDueDate={setDueDate} partialAmountPaid={partialAmountPaid}
          setPartialAmountPaid={setPartialAmountPaid} saleNotes={saleNotes} setSaleNotes={setSaleNotes}
          isSubmitting={isSubmitting} saleType={saleType} onSaleTypeChange={setSaleType}
          employeeId={employeeId || null} onEmployeeSelect={setSelectedEmployee} employees={employees}
          paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod}
          customerPayments={customerPayments} onCustomerPaymentsChange={setCustomerPayments}
          employeePayments={employeePayments} onEmployeePaymentsChange={setEmployeePayments}
          onUpdateQuantity={updateQuantity} onRemoveFromCart={removeFromCart}
          onClearCart={clearActiveCart} onCheckout={handleCheckout}
        />
      </div>

      <ReceiptModal
        sale={createdSale} isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
