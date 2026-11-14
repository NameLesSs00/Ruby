import { apiClient } from '../lib/axios';

export interface BarcodeRecord {
  id: number;
  barcodeValue: string;
  isActive: boolean;
  isAvailable: boolean;
  clientId: number | null;
  clientFullName: string | null;
  assignedAt: string | null;
  createdAt: string;
}

export interface BarcodeListResponse {
  items: BarcodeRecord[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface BarcodeQueryParams {
  page?: number;
  pageSize?: number;
}

export interface AvailableBarcodeQueryParams {
  isActive?: boolean;
  isAvailable?: boolean;
}

export interface BarcodeImageResponse {
  barcodeId: number;
  barcodeValue: string;
  barcodeUrl: string;
}

export interface BarcodeLookupEligibleSubscription {
  subscriptionId: number;
  subscriptionType: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  status: string;
}

export interface BarcodeLookupResponse {
  clientId: number;
  barcodeValue: string;
  fullName: string;
  eligibleSubscriptions: BarcodeLookupEligibleSubscription[];
}

export interface GenerateBarcodesPayload {
  count: number;
}

export interface GenerateBarcodesResponse {
  message: string;
  data: BarcodeRecord[];
}

export interface AssignClientPayload {
  clientId: number;
}

export interface UpdateBarcodeStatusPayload {
  isActive: boolean;
}

export interface SingleBarcodeResponse {
  message?: string;
  data: BarcodeRecord;
}

export const barcodeKeys = {
  all: ['barcodes'] as const,
  lists: () => [...barcodeKeys.all, 'list'] as const,
  list: (params: BarcodeQueryParams) => [...barcodeKeys.lists(), params] as const,
  available: (params?: AvailableBarcodeQueryParams) => [...barcodeKeys.all, 'available', params] as const,
  details: () => [...barcodeKeys.all, 'detail'] as const,
  detail: (id: number) => [...barcodeKeys.details(), id] as const,
  image: (id: number) => [...barcodeKeys.all, 'image', id] as const,
  byValue: (val: string) => [...barcodeKeys.all, 'by-value', val] as const,
};

export const barcodesApi = {
  generate: async (payload: GenerateBarcodesPayload): Promise<GenerateBarcodesResponse> => {
    const res = await apiClient.post<GenerateBarcodesResponse>('/api/barcodes/generate', payload);
    return res.data;
  },

  getAll: async (params: BarcodeQueryParams = {}): Promise<BarcodeListResponse> => {
    const res = await apiClient.get<BarcodeListResponse>('/api/barcodes', {
      params: {
        Page: params.page ?? 1,
        PageSize: params.pageSize ?? 10,
      },
    });
    return res.data;
  },

  getAvailable: async (params: AvailableBarcodeQueryParams = {}): Promise<BarcodeRecord[]> => {
    const res = await apiClient.get<BarcodeRecord[]>('/api/barcodes/available', {
      params,
    });
    return res.data;
  },

  getById: async (id: number): Promise<BarcodeRecord> => {
    const res = await apiClient.get<BarcodeRecord>(`/api/barcodes/${id}`);
    return res.data;
  },

  getImage: async (id: number): Promise<BarcodeImageResponse> => {
    const res = await apiClient.get<BarcodeImageResponse>(`/api/barcodes/${id}/image`);
    return res.data;
  },

  getByValue: async (barcodeValue: string): Promise<BarcodeLookupResponse> => {
    const res = await apiClient.get<BarcodeLookupResponse>(
      `/api/barcodes/by-value/${encodeURIComponent(barcodeValue)}`
    );
    return res.data;
  },

  assignClient: async (id: number, payload: AssignClientPayload): Promise<SingleBarcodeResponse> => {
    const res = await apiClient.put<SingleBarcodeResponse>(`/api/barcodes/${id}/assign-client`, payload);
    return res.data;
  },

  detach: async (id: number): Promise<SingleBarcodeResponse> => {
    const res = await apiClient.put<SingleBarcodeResponse>(`/api/barcodes/${id}/detach`);
    return res.data;
  },

  updateStatus: async (id: number, payload: UpdateBarcodeStatusPayload): Promise<SingleBarcodeResponse> => {
    const res = await apiClient.put<SingleBarcodeResponse>(`/api/barcodes/${id}/status`, payload);
    return res.data;
  },
};

