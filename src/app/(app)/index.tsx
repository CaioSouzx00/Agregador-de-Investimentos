import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Wallet } from 'lucide-react-native';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';
import { useAuthStore } from '@/shared/stores/authStore';
import { ValuationHeader } from '@/features/dashboard/components/ValuationHeader';
import { AccountSummaryCard } from '@/features/dashboard/components/AccountSummaryCard';
import { Avatar } from '@/shared/components/ui/Avatar';
import { Skeleton, SkeletonCard } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { haptic } from '@/shared/utils/haptics';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const {
    data: valuation,
    totalNetWorth,
    accounts,
    totalAccounts,
    totalPositionsCount,
    isLoading,
    isRefetching,
    error,
    handleRefresh,
  } = useDashboardData();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Top App Bar */}
      <View className="flex-row items-center justify-between px-5 py-3.5 border-b border-border/40">
        <View className="flex-row items-center gap-3">
          <Avatar name={user?.username || 'Usuário'} size="md" showOnlineDot />
          <View>
            <Text className="text-xs text-muted-foreground font-medium">
              Olá, investidor(a)
            </Text>
            <Text className="text-base font-bold text-foreground">
              {user?.username || 'Minha Carteira'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            haptic.light();
            router.push('/(app)/accounts/create' as any);
          }}
          className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 active:bg-primary/20"
        >
          <Plus size={16} color="#3B82F6" />
          <Text className="text-xs font-bold text-primary">Nova Conta</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
      >
        {isLoading ? (
          <View className="pt-5 gap-4">
            <Skeleton width="100%" height={150} borderRadius={24} />
            <View className="flex-row gap-3">
              <Skeleton width="31%" height={85} borderRadius={16} />
              <Skeleton width="31%" height={85} borderRadius={16} />
              <Skeleton width="31%" height={85} borderRadius={16} />
            </View>
            <View className="mt-4 gap-3">
              <Skeleton width={160} height={20} borderRadius={6} />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          </View>
        ) : error ? (
          <View className="pt-10">
            <ErrorState onRetry={handleRefresh} />
          </View>
        ) : (
          <View className="pt-5 gap-6">
            {/* Hero Valuation */}
            <ValuationHeader
              totalNetWorth={totalNetWorth}
              totalAccounts={totalAccounts}
              totalPositions={totalPositionsCount}
              isLoading={isRefetching}
              onRefresh={handleRefresh}
            />

            {/* Accounts Breakdown Section */}
            <View>
              <View className="flex-row items-center justify-between mb-3.5">
                <Text className="text-base font-bold text-foreground tracking-tight">
                  Contas de Investimento
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    haptic.selection();
                    router.push('/(app)/accounts' as any);
                  }}
                >
                  <Text className="text-xs font-semibold text-primary">
                    Ver todas ({totalAccounts})
                  </Text>
                </TouchableOpacity>
              </View>

              {accounts.length === 0 ? (
                <EmptyState
                  icon={<Wallet size={32} color="#64748B" />}
                  title="Nenhuma conta cadastrada"
                  description="Crie sua primeira conta de investimento para começar a consolidar seus ativos e acompanhar seu patrimônio."
                  actionLabel="Criar Primeira Conta"
                  onAction={() => {
                    haptic.light();
                    router.push('/(app)/accounts/create' as any);
                  }}
                />
              ) : (
                accounts.map((account) => (
                  <AccountSummaryCard
                    key={account.accountId}
                    account={account}
                    totalNetWorth={totalNetWorth}
                  />
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
