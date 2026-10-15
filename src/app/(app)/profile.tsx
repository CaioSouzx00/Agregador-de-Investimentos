import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Mail,
  Shield,
  Server,
  LogOut,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { useAuthStore } from '@/shared/stores/authStore';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { haptic } from '@/shared/utils/haptics';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    haptic.warning();
    Alert.alert(
      'Encerrar Sessão',
      'Tem certeza de que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-3.5 border-b border-border/40">
        <Text className="text-xl font-bold text-foreground tracking-tight">
          Meu Perfil
        </Text>
        <Text className="text-xs text-muted-foreground mt-0.5">
          Configurações da conta e segurança
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* User Card */}
        <View className="bg-card border border-border p-5 rounded-3xl mb-5 items-center">
          <Avatar name={user?.username || 'Usuário'} size="xl" showOnlineDot className="mb-3" />
          <Text className="text-lg font-bold text-foreground">{user?.username}</Text>
          <Text className="text-xs text-muted-foreground mt-0.5">{user?.email || 'Investidor Cadastrado'}</Text>
          <Badge label="Investidor Verificado" variant="primary" size="sm" className="mt-2.5" />
        </View>

        {/* Account Details */}
        <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 ml-1">
          Dados Cadastrais
        </Text>
        <Card className="p-4 bg-card border-border mb-5 gap-3.5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <User size={16} color="#64748B" />
              <Text className="text-xs text-muted-foreground">Nome de Usuário</Text>
            </View>
            <Text className="text-xs font-bold text-foreground">{user?.username}</Text>
          </View>

          <View className="h-[1px] bg-border/50" />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <Mail size={16} color="#64748B" />
              <Text className="text-xs text-muted-foreground">E-mail</Text>
            </View>
            <Text className="text-xs font-bold text-foreground">{user?.email || 'Não informado'}</Text>
          </View>

          <View className="h-[1px] bg-border/50" />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <Shield size={16} color="#64748B" />
              <Text className="text-xs text-muted-foreground">ID do Usuário</Text>
            </View>
            <Text className="text-xs font-mono text-muted-foreground">
              {user?.userId ? `${user.userId.substring(0, 13)}...` : 'N/A'}
            </Text>
          </View>
        </Card>

        {/* Server Status */}
        <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 ml-1">
          Ambiente e Conexão
        </Text>
        <Card className="p-4 bg-card border-border mb-6 gap-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <Server size={16} color="#64748B" />
              <Text className="text-xs text-muted-foreground">Backend API</Text>
            </View>
            <Text className="text-xs font-mono text-primary">{apiUrl}</Text>
          </View>

          <View className="h-[1px] bg-border/50" />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <Info size={16} color="#64748B" />
              <Text className="text-xs text-muted-foreground">Versão do App</Text>
            </View>
            <Text className="text-xs font-semibold text-foreground">1.0.0 (SDK 52)</Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          variant="danger"
          size="lg"
          leftIcon={<LogOut size={18} color="#FFFFFF" />}
          onPress={handleLogout}
          className="w-full"
        >
          Sair da Conta
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
