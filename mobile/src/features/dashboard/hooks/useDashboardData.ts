import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { dashboardService } from '../services/dashboardService';
import { accountService } from '@/features/accounts/services/accountService';
import { useAuthStore } from '@/shared/stores/authStore';
import { getApiErrorMessage } from '@/shared/services/api/client';
import { haptic } from '@/shared/utils/haptics';

export function useDashboardData() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const userId = user?.userId;

  const query = useQuery({
    queryKey: ['dashboardValuation', userId],
    queryFn: () => {
      if (!userId) throw new Error('Usuário não autenticado');
      return dashboardService.getUserValuation(userId);
    },
    enabled: !!userId,
  });

  const addPositionMutation = useMutation({
    mutationFn: ({
      accountId,
      stockId,
      quantity,
    }: {
      accountId: string;
      stockId: string;
      quantity: number;
    }) => accountService.associateStock(accountId, { stockId, quantity }),
    onSuccess: (_, variables) => {
      haptic.success();
      queryClient.invalidateQueries({ queryKey: ['dashboardValuation', userId] });
      queryClient.invalidateQueries({ queryKey: ['accountValuation', variables.accountId] });
      Toast.show({
        type: 'success',
        text1: 'Ativo adicionado à carteira!',
        text2: `${variables.quantity} cotas de ${variables.stockId} vinculadas com sucesso.`,
      });
    },
    onError: (error) => {
      haptic.error();
      const message = getApiErrorMessage(error, 'Erro ao vincular ativo.');
      Toast.show({
        type: 'error',
        text1: 'Erro ao adicionar ativo',
        text2: message,
      });
    },
  });

  const handleRefresh = async () => {
    haptic.light();
    await query.refetch();
  };

  // Cálculos derivados
  const totalNetWorth = query.data?.totalNetWorth ?? 0;
  const accounts = query.data?.accounts ?? [];
  const totalAccounts = accounts.length;

  // Total de ativos calculados somando as posições de todas as contas
  const totalPositionsCount = accounts.reduce((acc, account) => {
    return acc + (account.positions?.length ?? 0);
  }, 0);

  return {
    ...query,
    totalNetWorth,
    accounts,
    totalAccounts,
    totalPositionsCount,
    handleRefresh,
    addPosition: addPositionMutation.mutate,
    isAddingPosition: addPositionMutation.isPending,
  };
}
