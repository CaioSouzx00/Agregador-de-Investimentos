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
import { useThemeStore } from '@/shared/stores/themeStore';
import { toastConfig } from '@/shared/components/feedback/ToastConfig';
import '../global.css';

function RootLayoutNav() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center p-6">
        <View
          style={{
            backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
            borderColor: isPink ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 255, 255, 0.3)',
            shadowColor: isPink ? '#FF007F' : '#FFFFFF',
            shadowOpacity: 0.5,
            shadowRadius: 20,
          }}
          className="w-20 h-20 rounded-3xl border items-center justify-center mb-6"
        >
          <TrendingUp size={40} color={isPink ? '#FF007F' : '#FFFFFF'} />
        </View>
        <Text className="text-2xl font-black text-white tracking-tight mb-2">
          Agregador de Investimentos
        </Text>
        <Text className="text-xs text-zinc-400 mb-6">
          Sua carteira inteligente de investimentos
        </Text>
        <ActivityIndicator size="small" color={isPink ? '#FF007F' : '#FFFFFF'} />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
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
        <StatusBar style="light" backgroundColor="#000000" />
        <RootLayoutNav />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
