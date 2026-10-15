import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { authService } from '../services/authService';
import { useAuthStore } from '@/shared/stores/authStore';
import { LoginRequest, CreateUserRequest } from '@/shared/types/api';
import { getApiErrorMessage } from '@/shared/services/api/client';
import { haptic } from '@/shared/utils/haptics';

export function useLoginMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (data, variables) => {
      haptic.success();
      // Salva sessão no store seguro
      await setSession(data.accessToken, data.expiresIn, {
        username: variables.usernameOrEmail,
      });

      // Limpa dados de cache anteriores
      queryClient.clear();

      Toast.show({
        type: 'success',
        text1: 'Bem-vindo(a)!',
        text2: 'Login efetuado com sucesso.',
      });

      router.replace('/(app)');
    },
    onError: (error) => {
      haptic.error();
      const message = getApiErrorMessage(error, 'Falha ao autenticar. Verifique suas credenciais.');
      Toast.show({
        type: 'error',
        text1: 'Erro de autenticação',
        text2: message,
      });
    },
  });
}

export function useRegisterMutation() {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => authService.register(data),
    onSuccess: async (_, variables) => {
      haptic.success();
      Toast.show({
        type: 'success',
        text1: 'Conta criada com sucesso!',
        text2: 'Conectando à sua conta...',
      });

      // Efetua login automaticamente com as credenciais criadas
      loginMutation.mutate({
        usernameOrEmail: variables.username,
        password: variables.password,
      });
    },
    onError: (error) => {
      haptic.error();
      const message = getApiErrorMessage(error, 'Não foi possível criar sua conta. Tente outro usuário ou e-mail.');
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: message,
      });
    },
  });
}
