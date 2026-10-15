import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { useAuthStore } from '@/shared/stores/authStore';
import { haptic } from '@/shared/utils/haptics';

export function useDashboardData() {
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
  };
}
