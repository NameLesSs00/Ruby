import { apiClient } from '../lib/axios';
import type { SaleRecord } from './pos';

export interface SaleReturnItem {
  id: number;
  movementGroupId: number;
  saleId: number;
  saleInvoiceNumber: string;
  saleItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  returnDate: string;
  notes?: string | null;
}

export interface SaleReturnGroup {
  movementGroupId: number;
  saleId: number;
  saleInvoiceNumber: string;
  returnDate: string;
  notes?: string | null;
  totalRefund: number;
  items: SaleReturnItem[];
}

export interface ItemReturnStats {
  saleItemId: number;
  productId: number;
  productName: string;
  unitPrice: number;
  soldQuantity: number;
  previouslyReturnedQuantity: number;
  remainingReturnableQuantity: number;
}

export interface SaleReturnStats {
  saleId: number;
  invoiceNumber: string;
  items: ItemReturnStats[];
  totalSoldPieces: number;
  totalReturnedPieces: number;
  totalRemainingPieces: number;
  totalPreviouslyRefunded: number;
  remainingRefundableAmount: number;
  isFullyReturned: boolean;
}

export const getSaleReturnStats = (
  sale: SaleRecord,
  returnGroups: SaleReturnGroup[] = []
): SaleReturnStats => {
  const relevantGroups = returnGroups.filter((g) => g.saleId === sale.id);

  const returnedByItemMap: Record<number, number> = {};
  relevantGroups.forEach((group) => {
    (group.items || []).forEach((item) => {
      returnedByItemMap[item.saleItemId] =
        (returnedByItemMap[item.saleItemId] || 0) + item.quantity;
    });
  });

  const totalPreviouslyRefunded = relevantGroups.reduce(
    (sum, g) => sum + (g.totalRefund || 0),
    0
  );

  let totalSoldPieces = 0;
  let totalReturnedPieces = 0;
  let totalRemainingPieces = 0;

  const items: ItemReturnStats[] = (sale.items || []).map((item) => {
    const previouslyReturnedQuantity = returnedByItemMap[item.id] || 0;
    const remainingReturnableQuantity = Math.max(
      0,
      item.quantity - previouslyReturnedQuantity
    );

    totalSoldPieces += item.quantity;
    totalReturnedPieces += previouslyReturnedQuantity;
    totalRemainingPieces += remainingReturnableQuantity;

    return {
      saleItemId: item.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      soldQuantity: item.quantity,
      previouslyReturnedQuantity,
      remainingReturnableQuantity,
    };
  });

  const remainingRefundableAmount = Math.max(
    0,
    sale.finalAmount - totalPreviouslyRefunded
  );
  const isFullyReturned =
    totalRemainingPieces === 0 || sale.status === 'FullyReturned';

  return {
    saleId: sale.id,
    invoiceNumber: sale.invoiceNumber,
    items,
    totalSoldPieces,
    totalReturnedPieces,
    totalRemainingPieces,
    totalPreviouslyRefunded,
    remainingRefundableAmount,
    isFullyReturned,
  };
};

export interface CreateSaleReturnItemPayload {
  saleItemId: number;
  quantity: number;
}

export interface CreateSaleReturnPayload {
  saleId: number;
  items: CreateSaleReturnItemPayload[];
  notes?: string;
}

export interface UpdateSaleReturnPayload {
  returnDate: string;
  items: CreateSaleReturnItemPayload[];
  notes?: string;
}

export interface SaleReturnResponse {
  message?: string;
  data: {
    returns: SaleReturnItem[];
    totalRefund: number;
  };
}

export const posReturnsApi = {
  getAll: async (): Promise<SaleReturnGroup[]> => {
    const response = await apiClient.get<SaleReturnGroup[]>('/api/salereturns');
    return response.data;
  },

  getById: async (id: number): Promise<SaleReturnGroup> => {
    const response = await apiClient.get<SaleReturnGroup>(`/api/salereturns/${id}`);
    return response.data;
  },

  create: async (payload: CreateSaleReturnPayload): Promise<SaleReturnResponse> => {
    const response = await apiClient.post<SaleReturnResponse>('/api/salereturns', payload);
    return response.data;
  },

  update: async (id: number, payload: UpdateSaleReturnPayload): Promise<SaleReturnResponse> => {
    const response = await apiClient.put<SaleReturnResponse>(`/api/salereturns/${id}`, payload);
    return response.data;
  },

  delete: async (id: number): Promise<{ message?: string; data: string }> => {
    const response = await apiClient.delete<{ message?: string; data: string }>(`/api/salereturns/${id}`);
    return response.data;
  },
};

