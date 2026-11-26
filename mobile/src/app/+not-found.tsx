import React from 'react';
import { View, Text } from 'react-native';
import { Link, Stack } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página Não Encontrada' }} />
      <View className="flex-1 bg-background items-center justify-center p-6">
        <View className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 items-center justify-center mb-4">
          <AlertCircle size={32} color="#EF4444" />
        </View>
        <Text className="text-xl font-bold text-foreground text-center mb-2">
          Esta tela não existe
        </Text>
        <Text className="text-sm text-muted-foreground text-center max-w-[280px] mb-6">
          O caminho solicitado não foi encontrado ou foi movido.
        </Text>
        <Link href="/(app)" className="px-5 py-3 rounded-xl bg-primary text-white font-semibold text-sm">
          Voltar ao Início
        </Link>
      </View>
    </>
  );
}
