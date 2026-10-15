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
import { Card } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { SkeletonCard } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { haptic } from '@/shared/utils/haptics';

export default function AccountsListScreen() {
  const router = useRouter();
  const { accounts, isLoading, isRefetching, error, handleRefresh } = useAccountsData();
  const [search, setSearch] = useState('');

  const filteredAccounts = accounts.filter((acc) =>
    acc.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3.5 border-b border-border/40">
        <View>
          <Text className="text-xl font-bold text-foreground tracking-tight">
            Contas de Investimento
          </Text>
          <Text className="text-xs text-muted-foreground mt-0.5">
            {accounts.length} {accounts.length === 1 ? 'conta cadastrada' : 'contas cadastradas'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            haptic.light();
            router.push('/(app)/accounts/create' as any);
          }}
          className="flex-row items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary active:opacity-90 shadow-md shadow-primary/25"
        >
          <Plus size={16} color="#FFFFFF" />
          <Text className="text-xs font-bold text-white">Criar Conta</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      {accounts.length > 0 && (
        <View className="px-5 pt-3 pb-1">
          <Input
            placeholder="Filtrar contas por nome..."
            value={search}
            onChangeText={setSearch}
            leftIcon={<Search size={16} color="#64748B" />}
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
              icon={<Landmark size={32} color="#64748B" />}
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
              tintColor="#3B82F6"
              colors={['#3B82F6']}
            />
          }
          renderItem={({ item }) => (
            <Card
              onPress={() => {
                haptic.light();
                router.push(`/(app)/accounts/${item.accountId}` as any);
              }}
              className="p-4 mb-3 bg-card border-border flex-row items-center justify-between active:bg-card-hover"
            >
              <View className="flex-row items-center flex-1 pr-3">
                <View className="w-11 h-11 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mr-3.5">
                  <Landmark size={20} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-foreground" numberOfLines={1}>
                    {item.description}
                  </Text>
                  <Text className="text-[11px] text-muted-foreground mt-0.5">
                    ID: {item.accountId.substring(0, 8)}...
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-1">
                <Text className="text-xs font-semibold text-primary">Ver ativos</Text>
                <ChevronRight size={18} color="#3B82F6" />
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}
