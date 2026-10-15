import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { TrendingUp } from 'lucide-react-native';
import { queryClient } from '@/shared/lib/queryClient';
import { useAuthStore } from '@/shared/stores/authStore';
import { toastConfig } from '@/shared/components/feedback/ToastConfig';
import '../global.css';

function RootLayoutNav() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redireciona para o login se não estiver autenticado
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redireciona para o app autenticado se já estiver logado
      router.replace('/(app)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <View className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 items-center justify-center mb-6 shadow-2xl shadow-primary/40">
          <TrendingUp size={40} color="#3B82F6" />
        </View>
        <Text className="text-xl font-bold text-foreground tracking-tight mb-2">
          Agregador de Investimentos
        </Text>
        <Text className="text-xs text-muted-foreground mb-6">
          Sua carteira inteligente de investimentos
        </Text>
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B1120' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Não Encontrado' }} />
      </Stack>
      <Toast config={toastConfig} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" backgroundColor="#0B1120" />
        <RootLayoutNav />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
