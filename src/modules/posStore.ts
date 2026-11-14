import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from './products';
import type { PosCartItem } from '../components/pos/PosProductCatalog';
import type { PaymentMethod, PaymentMethodItem } from './duePayments';
import type { EmployeeSalePaymentItem } from './employeeSales';

export type PosSaleType = 'Customer' | 'Employee';

export interface PosInvoiceSession {
  id: string;
  referenceNumber: number;
  referenceName: string;
  createdAt: string;
  cart: PosCartItem[];
  saleType: PosSaleType;
  employeeId?: number | null;
  employeeName?: string | null;
  paymentMethod: PaymentMethod;
  customerPayments?: PaymentMethodItem[];
  employeePayments?: EmployeeSalePaymentItem[];
  discountAmount: number;
  isPayLater: boolean;
  payerName: string;
  debtDescription: string;
  dueDate: string;
  partialAmountPaid: number;
  saleNotes: string;
}

interface PosStoreState {
  invoices: PosInvoiceSession[];
  activeInvoiceId: string;
  nextReferenceNumber: number;

  // Multi-Invoice Session Actions
  createInvoice: (initialReferenceName?: string) => string;
  switchInvoice: (id: string) => void;
  closeInvoice: (id: string) => void;
  updateReferenceName: (id: string, referenceName: string) => void;

  // Cart Item Actions (operate on active invoice)
  addToCart: (product: Product) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  clearActiveCart: () => void;

  // Payment & Metadata Actions (operate on active invoice)
  setSaleType: (saleType: PosSaleType) => void;
  setSelectedEmployee: (employeeId: number | null, employeeName: string) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCustomerPayments: (payments: PaymentMethodItem[]) => void;
  setEmployeePayments: (payments: EmployeeSalePaymentItem[]) => void;
  setDiscountAmount: (val: number) => void;
  setIsPayLater: (val: boolean) => void;
  setPayerName: (val: string) => void;
  setDebtDescription: (val: string) => void;
  setDueDate: (val: string) => void;
  setPartialAmountPaid: (val: number) => void;
  setSaleNotes: (val: string) => void;

  // Checkout Completion
  completeActiveInvoice: () => void;
}

const generateSessionId = (): string =>
  `inv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

const createEmptyInvoice = (
  referenceNumber: number,
  referenceName = ''
): PosInvoiceSession => ({
  id: generateSessionId(),
  referenceNumber,
  referenceName,
  createdAt: new Date().toISOString(),
  cart: [],
  saleType: 'Customer',
  employeeId: null,
  employeeName: null,
  paymentMethod: 'Cash',
  customerPayments: [],
  discountAmount: 0,
  isPayLater: false,
  payerName: referenceName.trim(),
  debtDescription: '',
  dueDate: '',
  partialAmountPaid: 0,
  saleNotes: '',
});

const initialInvoice = createEmptyInvoice(1);

const updateActiveSession = (
  state: PosStoreState,
  updater: (session: PosInvoiceSession) => PosInvoiceSession
): Partial<PosStoreState> => ({
  invoices: state.invoices.map((inv) =>
    inv.id === state.activeInvoiceId ? updater(inv) : inv
  ),
});

export const usePosStore = create<PosStoreState>()(
  persist(
    (set, get) => ({
      invoices: [initialInvoice],
      activeInvoiceId: initialInvoice.id,
      nextReferenceNumber: 2,

      createInvoice: (initialReferenceName = '') => {
        const { nextReferenceNumber, invoices } = get();
        const newInvoice = createEmptyInvoice(nextReferenceNumber, initialReferenceName);
        set({
          invoices: [...invoices, newInvoice],
          activeInvoiceId: newInvoice.id,
          nextReferenceNumber: nextReferenceNumber + 1,
        });
        return newInvoice.id;
      },

      switchInvoice: (id: string) => {
        const exists = get().invoices.some((inv) => inv.id === id);
        if (exists) set({ activeInvoiceId: id });
      },

      closeInvoice: (id: string) => {
        const { invoices, activeInvoiceId, nextReferenceNumber } = get();
        if (invoices.length === 1) {
          const fresh = createEmptyInvoice(nextReferenceNumber);
          set({
            invoices: [fresh],
            activeInvoiceId: fresh.id,
            nextReferenceNumber: nextReferenceNumber + 1,
          });
          return;
        }
        const filtered = invoices.filter((inv) => inv.id !== id);
        const nextActiveId = activeInvoiceId === id ? filtered[0].id : activeInvoiceId;
        set({ invoices: filtered, activeInvoiceId: nextActiveId });
      },

      updateReferenceName: (id: string, referenceName: string) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, referenceName } : inv
          ),
        }));
      },

      addToCart: (product: Product) => {
        set((state) =>
          updateActiveSession(state, (inv) => {
            const existingIdx = inv.cart.findIndex((i) => i.product.id === product.id);
            if (existingIdx >= 0) {
              const updatedCart = [...inv.cart];
              updatedCart[existingIdx] = {
                ...updatedCart[existingIdx],
                quantity: updatedCart[existingIdx].quantity + 1,
              };
              return { ...inv, cart: updatedCart };
            }
            return { ...inv, cart: [...inv.cart, { product, quantity: 1 }] };
          })
        );
      },

      updateQuantity: (productId: number, delta: number) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({
            ...inv,
            cart: inv.cart
              .map((item) => {
                if (item.product.id !== productId) return item;
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              })
              .filter((item): item is PosCartItem => item !== null),
          }))
        );
      },

      removeFromCart: (productId: number) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({
            ...inv,
            cart: inv.cart.filter((item) => item.product.id !== productId),
          }))
        );
      },

      clearActiveCart: () => {
        set((state) =>
          updateActiveSession(state, (inv) => ({
            ...inv,
            cart: [],
            discountAmount: 0,
            isPayLater: false,
            payerName: inv.referenceName.trim(),
            debtDescription: '',
            dueDate: '',
            partialAmountPaid: 0,
            saleNotes: '',
          }))
        );
      },

      setSaleType: (saleType: PosSaleType) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({
            ...inv,
            saleType,
            // If switching back to customer, clear employee
            employeeId: saleType === 'Customer' ? null : inv.employeeId,
            employeeName: saleType === 'Customer' ? null : inv.employeeName,
          }))
        );
      },

      setSelectedEmployee: (employeeId: number | null, employeeName: string) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({
            ...inv,
            employeeId,
            employeeName,
            payerName: employeeName || inv.payerName,
          }))
        );
      },

      setPaymentMethod: (method: PaymentMethod) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, paymentMethod: method }))
        );
      },

      setCustomerPayments: (payments: PaymentMethodItem[]) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, customerPayments: payments }))
        );
      },

      setEmployeePayments: (payments: EmployeeSalePaymentItem[]) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, employeePayments: payments }))
        );
      },

      setDiscountAmount: (val: number) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, discountAmount: val }))
        );
      },

      setIsPayLater: (val: boolean) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({
            ...inv,
            isPayLater: val,
            payerName:
              val && !inv.payerName.trim() && inv.referenceName.trim()
                ? inv.referenceName.trim()
                : inv.payerName,
          }))
        );
      },

      setPayerName: (val: string) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, payerName: val }))
        );
      },

      setDebtDescription: (val: string) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, debtDescription: val }))
        );
      },

      setDueDate: (val: string) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, dueDate: val }))
        );
      },

      setPartialAmountPaid: (val: number) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, partialAmountPaid: val }))
        );
      },

      setSaleNotes: (val: string) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, saleNotes: val }))
        );
      },

      completeActiveInvoice: () => {
        const { activeInvoiceId } = get();
        get().closeInvoice(activeInvoiceId);
      },
    }),
    {
      name: 'ruby-pos-open-invoices-v3',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.invoices || state.invoices.length === 0) {
          const fresh = createEmptyInvoice(1);
          state.invoices = [fresh];
          state.activeInvoiceId = fresh.id;
          state.nextReferenceNumber = 2;
        } else if (!state.invoices.some((inv) => inv.id === state.activeInvoiceId)) {
          state.activeInvoiceId = state.invoices[0].id;
        }
      },
    }
  )
);
