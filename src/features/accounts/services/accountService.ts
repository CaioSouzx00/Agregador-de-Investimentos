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
    await apiClient.post(`/v1/accounts/${accountId}/stocks`, payload);
  },
};
