import { apiClient } from '@/shared/services/api/client';
import { StockResponse, CreateStockRequest, MarketQuoteResponse } from '@/shared/types/api';

export const stockService = {
  listStocks: async (): Promise<StockResponse[]> => {
    const { data } = await apiClient.get<StockResponse[]>('/v1/stocks');
    return data;
  },

  getStockById: async (stockId: string): Promise<StockResponse> => {
    const { data } = await apiClient.get<StockResponse>(`/v1/stocks/${stockId}`);
    return data;
  },

  getStockQuote: async (stockId: string): Promise<MarketQuoteResponse> => {
    const { data } = await apiClient.get<MarketQuoteResponse>(`/v1/stocks/${stockId}/quote`);
    return data;
  },

  createStock: async (payload: CreateStockRequest): Promise<void> => {
    await apiClient.post('/v1/stocks', payload);
  },
};
