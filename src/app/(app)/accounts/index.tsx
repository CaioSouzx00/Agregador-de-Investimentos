import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Landmark, ChevronRight, Search } from 'lucide-react-native';
import { useAccountsData } from '@/features/accounts/hooks/useAccountsData';
import { useThemeStore } from '@/shared/stores/themeStore';
import { Card } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { SkeletonCard } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { haptic } from '@/shared/utils/haptics';

export default function AccountsListScreen() {
  const router = useRouter();
  const { accounts, isLoading, isRefetching, error, handleRefresh } = useAccountsData();
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';
  const [search, setSearch] = useState('');

  const filteredAccounts = accounts.filter((acc) =>
    acc.description.toLowerCase().includes(search.toLowerCase())
  );

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
            Contas de Investimento
          </Text>
          <Text className="text-xs text-zinc-400 mt-0.5">
            {accounts.length} {accounts.length === 1 ? 'conta cadastrada' : 'contas cadastradas'}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <ThemeToggle compact />
          <TouchableOpacity
            onPress={() => {
              haptic.light();
              router.push('/(app)/accounts/create' as any);
            }}
            style={{
              backgroundColor: isPink ? '#FF007F' : '#FFFFFF',
              shadowColor: isPink ? '#FF007F' : '#FFFFFF',
              shadowOpacity: 0.35,
              shadowRadius: 10,
            }}
            className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl active:opacity-90"
          >
            <Plus size={16} color={isPink ? '#FFFFFF' : '#000000'} />
            <Text
              style={{ color: isPink ? '#FFFFFF' : '#000000' }}
              className="text-xs font-black"
            >
              Criar Conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      {accounts.length > 0 && (
        <View className="px-5 pt-3 pb-1">
          <Input
            placeholder="Filtrar contas por nome..."
            value={search}
            onChangeText={setSearch}
            leftIcon={<Search size={16} color="#71717A" />}
          />
        </View>
      )}

      {/* Accounts List */}
      {isLoading ? (
        <View className="p-5 gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : error ? (
        <View className="pt-10 px-5">
          <ErrorState onRetry={handleRefresh} />
        </View>
      ) : filteredAccounts.length === 0 ? (
        <View className="flex-1 justify-center px-5">
          {search ? (
            <EmptyState
              title="Nenhuma conta encontrada"
              description={`Nenhuma conta corresponde ao termo "${search}".`}
              actionLabel="Limpar busca"
              onAction={() => setSearch('')}
            />
          ) : (
            <EmptyState
              icon={<Landmark size={32} color={isPink ? '#FF007F' : '#FFFFFF'} />}
              title="Sem contas cadastradas"
              description="Cadastre suas contas em corretoras e bancos para gerenciar seus ativos em um só lugar."
              actionLabel="Cadastrar Primeira Conta"
              onAction={() => {
                haptic.light();
                router.push('/(app)/accounts/create' as any);
              }}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredAccounts}
          keyExtractor={(item) => item.accountId}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={isPink ? '#FF007F' : '#FFFFFF'}
              colors={[isPink ? '#FF007F' : '#FFFFFF']}
            />
          }
          renderItem={({ item }) => (
            <Card
              onPress={() => {
                haptic.light();
                router.push(`/(app)/accounts/${item.accountId}` as any);
              }}
              style={{
                backgroundColor: '#09090C',
                borderColor: isPink ? '#261426' : '#222222',
                borderWidth: 1,
              }}
              className="p-4 mb-3 flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 pr-3">
                <View
                  style={{
                    backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
                    borderColor: isPink ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1,
                  }}
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-3.5"
                >
                  <Landmark size={20} color={isPink ? '#FF007F' : '#FFFFFF'} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-extrabold text-white" numberOfLines={1}>
                    {item.description}
                  </Text>
                  <Text className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                    ID: {item.accountId.substring(0, 8)}...
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-1">
                <Text
                  style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
                  className="text-xs font-bold"
                >
                  Ver ativos
                </Text>
                <ChevronRight size={18} color={isPink ? '#FF007F' : '#FFFFFF'} />
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
