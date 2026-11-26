import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { accountService } from '../services/accountService';
import { useAuthStore } from '@/shared/stores/authStore';
import { CreateAccountRequest } from '@/shared/types/api';
import { getApiErrorMessage } from '@/shared/services/api/client';
import { haptic } from '@/shared/utils/haptics';

export function useAccountsData() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.userId;

  const query = useQuery({
    queryKey: ['userAccounts', userId],
    queryFn: () => {
      if (!userId) throw new Error('Usuário não autenticado');
      return accountService.getUserAccounts(userId);
    },
    enabled: !!userId,
  });

  const handleRefresh = async () => {
    haptic.light();
    await query.refetch();
  };

  return {
    ...query,
    accounts: query.data ?? [],
    handleRefresh,
  };
}

export function useCreateAccountMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userId = user?.userId;

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => {
      if (!userId) throw new Error('Usuário não autenticado');
      return accountService.createAccount(userId, data);
    },
    onSuccess: () => {
      haptic.success();
      // Invalida contas e valuation geral
      queryClient.invalidateQueries({ queryKey: ['userAccounts', userId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardValuation', userId] });

      Toast.show({
        type: 'success',
        text1: 'Conta criada com sucesso!',
        text2: 'Sua nova conta de investimentos foi registrada.',
      });

      router.back();
    },
    onError: (error) => {
      haptic.error();
      const message = getApiErrorMessage(error, 'Erro ao criar conta de investimento.');
      Toast.show({
        type: 'error',
        text1: 'Falha na criação',
        text2: message,
      });
    },
  });
}
