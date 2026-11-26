import { apiClient } from '@/shared/services/api/client';
import { UserValuationResponse } from '@/shared/types/api';

export const dashboardService = {
  getUserValuation: async (userId: string): Promise<UserValuationResponse> => {
    const { data } = await apiClient.get<UserValuationResponse>(`/v1/users/${userId}/valuation`);
    return data;
  },
};
