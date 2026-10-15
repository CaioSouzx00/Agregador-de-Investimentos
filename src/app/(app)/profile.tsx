import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Mail,
  Shield,
  Server,
  LogOut,
  Palette,
  Info,
} from 'lucide-react-native';
import { useAuthStore } from '@/shared/stores/authStore';
import { useThemeStore } from '@/shared/stores/themeStore';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { haptic } from '@/shared/utils/haptics';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

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
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      {/* Header */}
      <View
        style={{
          borderBottomColor: isPink ? '#261426' : '#222222',
          borderBottomWidth: 1,
        }}
        className="flex-row items-center justify-between px-5 py-3.5 bg-black"
      >
        <View>
          <Text className="text-2xl font-black text-white tracking-tight">
            Meu Perfil
          </Text>
          <Text className="text-xs text-zinc-400 mt-0.5">
            Configurações e personalização
          </Text>
        </View>
        <ThemeToggle compact />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* User Card */}
        <View
          style={{
            backgroundColor: '#09090C',
            borderColor: isPink ? '#261426' : '#222222',
            borderWidth: 1,
          }}
          className="p-5 rounded-3xl mb-5 items-center"
        >
          <Avatar name={user?.username || 'Usuário'} size="xl" showOnlineDot className="mb-3" />
          <Text className="text-xl font-black text-white">{user?.username}</Text>
          <Text className="text-xs text-zinc-400 mt-0.5">{user?.email || 'Investidor Cadastrado'}</Text>
          <Badge label="Investidor Verificado" variant="primary" size="sm" className="mt-2.5" />
        </View>

        {/* Theme Preference Card */}
        <Text className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5 ml-1">
          Tema Visual
        </Text>
        <Card
          style={{
            backgroundColor: '#09090C',
            borderColor: isPink ? '#261426' : '#222222',
            borderWidth: 1,
          }}
          className="p-4 mb-5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View
                style={{
                  backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
                }}
                className="w-10 h-10 rounded-xl items-center justify-center"
              >
                <Palette size={20} color={isPink ? '#FF007F' : '#FFFFFF'} />
              </View>
              <View>
                <Text className="text-sm font-bold text-white">Esquema de Cores</Text>
                <Text className="text-xs text-zinc-400">
                  {isPink ? 'Rosa Choque & Black Puro' : 'Modo Preto & Branco Minimalista'}
                </Text>
              </View>
            </View>
            <ThemeToggle />
          </View>
        </Card>

        {/* Account Details */}
        <Text className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5 ml-1">
          Dados Cadastrais
        </Text>
        <Card
          style={{
            backgroundColor: '#09090C',
            borderColor: isPink ? '#261426' : '#222222',
            borderWidth: 1,
          }}
          className="p-4 mb-5 gap-3.5"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <User size={16} color="#71717A" />
              <Text className="text-xs text-zinc-400">Nome de Usuário</Text>
            </View>
            <Text className="text-xs font-bold text-white">{user?.username}</Text>
          </View>

          <View className="h-[1px] bg-zinc-900" />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <Mail size={16} color="#71717A" />
              <Text className="text-xs text-zinc-400">E-mail</Text>
            </View>
            <Text className="text-xs font-bold text-white">{user?.email || 'Não informado'}</Text>
          </View>

          <View className="h-[1px] bg-zinc-900" />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <Shield size={16} color="#71717A" />
              <Text className="text-xs text-zinc-400">ID do Usuário</Text>
            </View>
            <Text className="text-xs font-mono text-zinc-400">
              {user?.userId ? `${user.userId.substring(0, 13)}...` : 'N/A'}
            </Text>
          </View>
        </Card>

        {/* Server Status */}
        <Text className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5 ml-1">
          Ambiente e Conexão
        </Text>
        <Card
          style={{
            backgroundColor: '#09090C',
            borderColor: isPink ? '#261426' : '#222222',
            borderWidth: 1,
          }}
          className="p-4 mb-6 gap-3"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <Server size={16} color="#71717A" />
              <Text className="text-xs text-zinc-400">Backend API</Text>
            </View>
            <Text
              style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
              className="text-xs font-mono font-bold"
            >
              {apiUrl}
            </Text>
          </View>

          <View className="h-[1px] bg-zinc-900" />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5">
              <Info size={16} color="#71717A" />
              <Text className="text-xs text-zinc-400">Versão do App</Text>
            </View>
            <Text className="text-xs font-semibold text-white">1.0.0 (SDK 52)</Text>
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
