import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '@/shared/stores/authStore';
import { ApiErrorResponse } from '@/shared/types/api';
import { haptic } from '@/shared/utils/haptics';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Injeta token Bearer automaticamente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Tratamento global de erros e sessão expirada (401)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const errorData = error.response?.data;

    if (status === 401) {
      const wasAuthenticated = useAuthStore.getState().isAuthenticated;

      if (wasAuthenticated) {
        haptic.error();
        await useAuthStore.getState().logout();

        Toast.show({
          type: 'error',
          text1: 'Sessão expirada',
          text2: 'Sua sessão expirou. Faça login novamente.',
          visibilityTime: 4000,
        });
      }
    } else if (!error.response) {
      // Falha de rede ou servidor offline
      haptic.error();
      Toast.show({
        type: 'error',
        text1: 'Sem conexão com o servidor',
        text2: 'Verifique sua conexão ou se o backend está em execução.',
        visibilityTime: 4000,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Utilitário para extrair mensagem amigável de erro da API
 */
export function getApiErrorMessage(error: unknown, fallbackMessage = 'Ocorreu um erro inesperado'): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiErrorResponse | undefined;

    if (apiError?.validationErrors && apiError.validationErrors.length > 0) {
      return apiError.validationErrors.map((v) => `${v.field}: ${v.message}`).join(', ');
    }

    if (apiError?.message) {
      return apiError.message;
    }

    if (error.response?.status === 401) {
      return 'Credenciais inválidas ou sessão expirada.';
    }

    if (error.response?.status === 403) {
      return 'Você não tem permissão para realizar esta ação.';
    }

    if (error.response?.status === 404) {
      return 'Recurso não encontrado.';
    }

    if (error.response?.status === 409) {
      return 'Já existe um registro com esses dados.';
    }

    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique a internet.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
