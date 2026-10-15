import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { accountService } from '../services/accountService';
import { useAuthStore } from '@/shared/stores/authStore';
import { AssociateAccountStockRequest } from '@/shared/types/api';
import { getApiErrorMessage } from '@/shared/services/api/client';
import { haptic } from '@/shared/utils/haptics';

export function useAccountDetailData(accountId: string) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = user?.userId;

  const valuationQuery = useQuery({
    queryKey: ['accountValuation', accountId],
    queryFn: () => accountService.getAccountValuation(accountId),
    enabled: !!accountId,
  });

  const associateMutation = useMutation({
    mutationFn: (data: AssociateAccountStockRequest) =>
      accountService.associateStock(accountId, data),
    onSuccess: () => {
      haptic.success();
      // Invalida a conta e o valuation geral do dashboard
      queryClient.invalidateQueries({ queryKey: ['accountValuation', accountId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardValuation', userId] });

      Toast.show({
        type: 'success',
        text1: 'Posição adicionada!',
        text2: 'Os ativos foram vinculados à sua conta com sucesso.',
      });
    },
    onError: (error) => {
      haptic.error();
      const message = getApiErrorMessage(error, 'Não foi possível associar a ação.');
      Toast.show({
        type: 'error',
        text1: 'Erro ao associar ação',
        text2: message,
      });
    },
  });

  const handleRefresh = async () => {
    haptic.light();
    await valuationQuery.refetch();
  };

  return {
    account: valuationQuery.data,
    positions: valuationQuery.data?.positions ?? [],
    totalPortfolioValue: valuationQuery.data?.totalPortfolioValue ?? 0,
    isLoading: valuationQuery.isLoading,
    isRefetching: valuationQuery.isRefetching,
    error: valuationQuery.error,
    refetch: handleRefresh,
    associateStock: associateMutation.mutate,
    isAssociating: associateMutation.isPending,
  };
}
