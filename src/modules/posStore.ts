import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from './products';
import type { PosCartItem } from '../components/pos/PosProductCatalog';

export interface PosInvoiceSession {
  id: string;
  referenceNumber: number;
  referenceName: string;
  createdAt: string;
  cart: PosCartItem[];
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
        const newInvoice = createEmptyInvoice(
          nextReferenceNumber,
          initialReferenceName
        );
        set({
          invoices: [...invoices, newInvoice],
          activeInvoiceId: newInvoice.id,
          nextReferenceNumber: nextReferenceNumber + 1,
        });
        return newInvoice.id;
      },

      switchInvoice: (id: string) => {
        const exists = get().invoices.some((inv) => inv.id === id);
        if (exists) {
          set({ activeInvoiceId: id });
        }
      },

      closeInvoice: (id: string) => {
        const { invoices, activeInvoiceId, nextReferenceNumber } = get();
        const remaining = invoices.filter((inv) => inv.id !== id);

        if (remaining.length === 0) {
          const fallback = createEmptyInvoice(nextReferenceNumber);
          set({
            invoices: [fallback],
            activeInvoiceId: fallback.id,
            nextReferenceNumber: nextReferenceNumber + 1,
          });
          return;
        }

        const nextActiveId =
          activeInvoiceId === id
            ? remaining[remaining.length - 1].id
            : activeInvoiceId;

        set({
          invoices: remaining,
          activeInvoiceId: nextActiveId,
        });
      },

      updateReferenceName: (id: string, referenceName: string) => {
        set((state) => ({
          invoices: state.invoices.map((inv) => {
            if (inv.id !== id) return inv;
            const shouldSyncPayer =
              !inv.payerName.trim() || inv.payerName === inv.referenceName;
            return {
              ...inv,
              referenceName,
              payerName: shouldSyncPayer ? referenceName : inv.payerName,
            };
          }),
        }));
      },

      addToCart: (product: Product) => {
        set((state) =>
          updateActiveSession(state, (inv) => {
            const existing = inv.cart.find(
              (item) => item.product.id === product.id
            );
            const nextCart = existing
              ? inv.cart.map((item) =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                )
              : [...inv.cart, { product, quantity: 1 }];
            return { ...inv, cart: nextCart };
          })
        );
      },

      updateQuantity: (productId: number, delta: number) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({
            ...inv,
            cart: inv.cart
              .map((item) => {
                if (item.product.id === productId) {
                  const nextQty = item.quantity + delta;
                  return nextQty > 0 ? { ...item, quantity: nextQty } : null;
                }
                return item;
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
          updateActiveSession(state, (inv) => ({
            ...inv,
            debtDescription: val,
          }))
        );
      },

      setDueDate: (val: string) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({ ...inv, dueDate: val }))
        );
      },

      setPartialAmountPaid: (val: number) => {
        set((state) =>
          updateActiveSession(state, (inv) => ({
            ...inv,
            partialAmountPaid: val,
          }))
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
      name: 'ruby-pos-open-invoices-v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (!state.invoices || state.invoices.length === 0) {
          const fresh = createEmptyInvoice(1);
          state.invoices = [fresh];
          state.activeInvoiceId = fresh.id;
          state.nextReferenceNumber = 2;
        } else if (
          !state.invoices.some((inv) => inv.id === state.activeInvoiceId)
        ) {
          state.activeInvoiceId = state.invoices[0].id;
        }
      },
    }
  )
);

