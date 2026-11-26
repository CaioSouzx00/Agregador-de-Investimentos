import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { stockService } from '../services/stockService';
import { CreateStockRequest } from '@/shared/types/api';
import { getApiErrorMessage } from '@/shared/services/api/client';
import { haptic } from '@/shared/utils/haptics';

export function useStocksData() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['stocksCatalog'],
    queryFn: () => stockService.listStocks(),
  });

  const createStockMutation = useMutation({
    mutationFn: (data: CreateStockRequest) => stockService.createStock(data),
    onSuccess: () => {
      haptic.success();
      queryClient.invalidateQueries({ queryKey: ['stocksCatalog'] });
      Toast.show({
        type: 'success',
        text1: 'Ativo cadastrado!',
        text2: 'O novo ativo já está disponível no catálogo.',
      });
    },
    onError: (error) => {
      haptic.error();
      const message = getApiErrorMessage(error, 'Erro ao registrar ativo no catálogo.');
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar ação',
        text2: message,
      });
    },
  });

  return {
    stocks: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    createStock: createStockMutation.mutate,
    isCreatingStock: createStockMutation.isPending,
  };
}
