import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  productsApi,
  productCategoriesApi,
  productKeys,
  categoryKeys,
  type Product,
} from '../../modules/products';
import { posSalesApi, posKeys, type SaleRecord, type CreateSalePayload } from '../../modules/pos';
import { queryClient } from '../../lib/query-client';
import { showToast } from '../../lib/sonner';
import { ReceiptModal } from '../../components/pos/ReceiptModal';
import { PosProductCatalog, type PosCartItem } from '../../components/pos/PosProductCatalog';
import { PosCartDrawer } from '../../components/pos/PosCartDrawer';

export const PosRegisterPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');

  // Cart state
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Pay Later / Debt State
  const [isPayLater, setIsPayLater] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [debtDescription, setDebtDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [partialAmountPaid, setPartialAmountPaid] = useState<number>(0);
  const [saleNotes, setSaleNotes] = useState('');

  // Receipt Modal State
  const [createdSale, setCreatedSale] = useState<SaleRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

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
  const remainingDebt = isPayLater ? Math.max(0, finalAmount - (partialAmountPaid || 0)) : 0;

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is PosCartItem => item !== null)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setIsPayLater(false);
    setPayerName('');
    setDebtDescription('');
    setDueDate('');
    setPartialAmountPaid(0);
    setSaleNotes('');
  };

  const saleMutation = useMutation({
    mutationFn: (payload: CreateSalePayload) => posSalesApi.create(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: posKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: posKeys.duePayments.all });
      showToast.success('تم إتمام عملية البيع وإصدار الفاتورة بنجاح');
      setCreatedSale(res.data);
      setIsReceiptOpen(true);
      clearCart();
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

    if (isPayLater) {
      if (!payerName.trim()) {
        showToast.warning('يرجى إدخال اسم العميل / المدين في حالة البيع الآجل');
        return;
      }
      if (partialAmountPaid > finalAmount) {
        showToast.warning('المبلغ المدفوع لا يمكن أن يتجاوز صافي الفاتورة');
        return;
      }
    }

    const payload: CreateSalePayload = {
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      discountAmount: Number(discountAmount) || 0,
      amountPaid: isPayLater ? Number(partialAmountPaid) || 0 : finalAmount,
      payerName: isPayLater ? payerName.trim() : null,
      debtDescription: isPayLater ? debtDescription.trim() || null : null,
      dueDate: isPayLater && dueDate ? dueDate : null,
      notes: saleNotes.trim() || null,
    };

    saleMutation.mutate(payload);
  };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', height: 'calc(100vh - 62px)' }}>
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
        onClearCart={clearCart}
        onCheckout={handleCheckout}
      />

      <ReceiptModal
        sale={createdSale}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
