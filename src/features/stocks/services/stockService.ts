import { apiClient } from '@/shared/services/api/client';
import { StockResponse, CreateStockRequest } from '@/shared/types/api';

export const stockService = {
  listStocks: async (): Promise<StockResponse[]> => {
    const { data } = await apiClient.get<StockResponse[]>('/v1/stocks');
    return data;
  },

  getStockById: async (stockId: string): Promise<StockResponse> => {
    const { data } = await apiClient.get<StockResponse>(`/v1/stocks/${stockId}`);
    return data;
  },

  createStock: async (payload: CreateStockRequest): Promise<void> => {
    await apiClient.post('/v1/stocks', payload);
  },
};
