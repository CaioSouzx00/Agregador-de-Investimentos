import { apiClient } from '@/shared/services/api/client';
import {
  AccountResponse,
  CreateAccountRequest,
  AccountValuationResponse,
  AccountStockResponse,
  AssociateAccountStockRequest,
} from '@/shared/types/api';

export const accountService = {
  getUserAccounts: async (userId: string): Promise<AccountResponse[]> => {
    const { data } = await apiClient.get<AccountResponse[]>(`/v1/users/${userId}/accounts`);
    return data;
  },

  createAccount: async (userId: string, payload: CreateAccountRequest): Promise<void> => {
    await apiClient.post(`/v1/users/${userId}/accounts`, payload);
  },

  getAccountValuation: async (accountId: string): Promise<AccountValuationResponse> => {
    const { data } = await apiClient.get<AccountValuationResponse>(`/v1/accounts/${accountId}/valuation`);
    return data;
  },

  getAccountStocks: async (accountId: string): Promise<AccountStockResponse[]> => {
    const { data } = await apiClient.get<AccountStockResponse[]>(`/v1/accounts/${accountId}/stocks`);
    return data;
  },

  associateStock: async (
    accountId: string,
    payload: AssociateAccountStockRequest
  ): Promise<void> => {
    const stockId = payload.stockId.trim().toUpperCase();
    try {
      await apiClient.post(`/v1/accounts/${accountId}/stocks`, {
        ...payload,
        stockId,
      });
    } catch (err: any) {
      // If stock not registered in backend catalog, auto-register it and retry association
      const message = err?.response?.data?.message || '';
      if (err?.response?.status === 404 && (message.includes('Stock not found') || message.includes('not found with id'))) {
        try {
          await apiClient.post('/v1/stocks', {
            stockId,
            description: `${stockId} - Ação / Ativo`,
          });
          // Retry associating with freshly created stock
          await apiClient.post(`/v1/accounts/${accountId}/stocks`, {
            ...payload,
            stockId,
          });
          return;
        } catch (innerError) {
          // If creation fails (e.g. permission or duplicate), rethrow original error
          throw err;
        }
      }
      throw err;
    }
  },
};
