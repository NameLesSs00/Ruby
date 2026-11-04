import { apiClient } from '../lib/axios';

/**
 * Warehouse Transactions & Stock Movements (حركات المخزن - أذونات التوريد والصرف)
 * Based on backendMD/WarehouseTransactions.md
 */

export type MovementType = 'In' | 'Out';

export interface WarehouseMovementItem {
  id?: number;
  inventoryItemId: number;
  inventoryItemName?: string;
  quantity: number;
}

export interface WarehouseMovement {
  movementGroupId: number;
  movementType: MovementType;
  movementDate: string; // ISO date-time
  description: string;
  items: WarehouseMovementItem[];
}

export interface WarehouseTransactionsResponse {
  items: WarehouseMovement[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateWarehouseMovementPayload {
  movementType: MovementType;
  description: string;
  items: {
    inventoryItemId: number;
    quantity: number;
  }[];
}

export interface UpdateWarehouseMovementPayload {
  movementType: MovementType;
  movementDate?: string;
  description: string;
  items: {
    inventoryItemId: number;
    quantity: number;
  }[];
}

export interface WarehouseMovementQueryParams {
  page?: number;
  pageSize?: number;
  movementType?: MovementType;
  inventoryItemId?: number;
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export const movementTypeLabel = (type: MovementType): string => {
  switch (type) {
    case 'In':
      return 'إذن توريد (وارد)';
    case 'Out':
      return 'إذن صرف (صادر)';
    default:
      return type;
  }
};

export const warehouseTransactionKeys = {
  all: ['warehouse-transactions'] as const,
  lists: () => [...warehouseTransactionKeys.all, 'list'] as const,
  list: (params?: WarehouseMovementQueryParams) =>
    [...warehouseTransactionKeys.lists(), params] as const,
  details: () => [...warehouseTransactionKeys.all, 'detail'] as const,
  detail: (id: number) => [...warehouseTransactionKeys.details(), id] as const,
};

export const warehouseTransactionsApi = {
  getAll: async (params?: WarehouseMovementQueryParams): Promise<WarehouseTransactionsResponse> => {
    const res = await apiClient.get<WarehouseTransactionsResponse>('/api/warehousetransactions', {
      params: {
        Page: params?.page ?? 1,
        PageSize: params?.pageSize ?? 10,
        MovementType: params?.movementType,
        InventoryItemId: params?.inventoryItemId,
      },
    });
    return res.data;
  },

  getById: async (id: number): Promise<WarehouseMovement> => {
    const res = await apiClient.get<WarehouseMovement>(`/api/warehousetransactions/${id}`);
    return res.data;
  },

  create: async (
    payload: CreateWarehouseMovementPayload
  ): Promise<ApiResponse<WarehouseMovement>> => {
    const res = await apiClient.post<ApiResponse<WarehouseMovement>>(
      '/api/warehousetransactions',
      payload
    );
    return res.data;
  },

  update: async (
    id: number,
    payload: UpdateWarehouseMovementPayload
  ): Promise<ApiResponse<WarehouseMovement>> => {
    const res = await apiClient.put<ApiResponse<WarehouseMovement>>(
      `/api/warehousetransactions/${id}`,
      payload
    );
    return res.data;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    const res = await apiClient.delete<ApiResponse<string>>(`/api/warehousetransactions/${id}`);
    return res.data;
  },
};

