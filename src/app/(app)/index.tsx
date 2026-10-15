import React, { useState } from 'react';
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
import { useThemeStore } from '@/shared/stores/themeStore';
import { ValuationHeader } from '@/features/dashboard/components/ValuationHeader';
import { PortfolioPerformanceChart } from '@/features/dashboard/components/PortfolioPerformanceChart';
import { AssetAllocationChart } from '@/features/dashboard/components/AssetAllocationChart';
import { DividendYieldWidget } from '@/features/dashboard/components/DividendYieldWidget';
import { MarketIndicatorsBar } from '@/features/dashboard/components/MarketIndicatorsBar';
import { MarketMoversWidget } from '@/features/dashboard/components/MarketMoversWidget';
import { QuickActionsBar } from '@/features/dashboard/components/QuickActionsBar';
import { AccountSummaryCard } from '@/features/dashboard/components/AccountSummaryCard';
import { DashboardAddPositionModal } from '@/features/dashboard/components/DashboardAddPositionModal';
import { ExportPortfolioModal } from '@/features/dashboard/components/ExportPortfolioModal';
import { Avatar } from '@/shared/components/ui/Avatar';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { Skeleton, SkeletonCard } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { haptic } from '@/shared/utils/haptics';

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const [addPositionModalVisible, setAddPositionModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [prefilledTicker, setPrefilledTicker] = useState('');

  const {
    totalNetWorth,
    accounts,
    totalAccounts,
    totalPositionsCount,
    isLoading,
    isRefetching,
    error,
    handleRefresh,
    addPosition,
    isAddingPosition,
  } = useDashboardData();

  const handleOpenAddPosition = (ticker?: string) => {
    setPrefilledTicker(ticker || '');
    setAddPositionModalVisible(true);
  };

  const handleConfirmAddPosition = (accountId: string, stockId: string, quantity: number) => {
    addPosition({ accountId, stockId, quantity });
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      {/* Top App Bar */}
      <View
        style={{
          borderBottomColor: isPink ? '#261426' : '#222222',
          borderBottomWidth: 1,
        }}
        className="flex-row items-center justify-between px-5 py-3.5 bg-black"
      >
        <View className="flex-row items-center gap-3">
          <Avatar name={user?.username || 'Usuário'} size="md" showOnlineDot />
          <View>
            <Text className="text-xs text-zinc-400 font-medium">
              Olá, investidor(a)
            </Text>
            <Text className="text-base font-bold text-white">
              {user?.username || 'Minha Carteira'}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Theme Toggle Button */}
          <ThemeToggle compact />

          <TouchableOpacity
            onPress={() => {
              haptic.light();
              router.push('/(app)/accounts/create' as any);
            }}
            style={{
              backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
              borderColor: isPink ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 255, 255, 0.3)',
            }}
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border"
          >
            <Plus size={15} color={isPink ? '#FF007F' : '#FFFFFF'} />
            <Text
              style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
              className="text-xs font-bold"
            >
              Nova Conta
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 bg-black"
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={isPink ? '#FF007F' : '#FFFFFF'}
            colors={[isPink ? '#FF007F' : '#FFFFFF']}
          />
        }
      >
        {isLoading ? (
          <View className="pt-5 gap-4">
            <Skeleton width="100%" height={160} borderRadius={24} />
            <View className="flex-row gap-3">
              <Skeleton width="31%" height={85} borderRadius={16} />
              <Skeleton width="31%" height={85} borderRadius={16} />
              <Skeleton width="31%" height={85} borderRadius={16} />
            </View>
            <Skeleton width="100%" height={220} borderRadius={24} />
            <Skeleton width="100%" height={180} borderRadius={24} />
          </View>
        ) : error ? (
          <View className="pt-10">
            <ErrorState onRetry={handleRefresh} />
          </View>
        ) : (
          <View className="pt-4 gap-5">
            {/* Market Indicators Ribbon */}
            <MarketIndicatorsBar />

            {/* Hero Valuation Balance & Metrics */}
            <ValuationHeader
              totalNetWorth={totalNetWorth}
              totalAccounts={totalAccounts}
              totalPositions={totalPositionsCount}
              isLoading={isRefetching}
              onRefresh={handleRefresh}
            />

            {/* Quick Actions Bar */}
            <QuickActionsBar
              onAddPosition={() => handleOpenAddPosition()}
              onOpenExport={() => setExportModalVisible(true)}
            />

            {/* Interactive Portfolio Performance Curve Chart */}
            <PortfolioPerformanceChart totalNetWorth={totalNetWorth} />

            {/* Asset Allocation Donut Chart */}
            <AssetAllocationChart accounts={accounts} totalNetWorth={totalNetWorth} />

            {/* Projected Dividends & Yield Widget */}
            <DividendYieldWidget accounts={accounts} totalNetWorth={totalNetWorth} />

            {/* B3 Volume Leaders & Movers */}
            <MarketMoversWidget onSelectTicker={(ticker) => handleOpenAddPosition(ticker)} />

            {/* Accounts Breakdown Section */}
            <View>
              <View className="flex-row items-center justify-between mb-3.5">
                <Text className="text-base font-bold text-white tracking-tight">
                  Contas de Investimento
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    haptic.selection();
                    router.push('/(app)/accounts' as any);
                  }}
                >
                  <Text
                    style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
                    className="text-xs font-bold"
                  >
                    Ver todas ({totalAccounts})
                  </Text>
                </TouchableOpacity>
              </View>

              {accounts.length === 0 ? (
                <EmptyState
                  icon={<Wallet size={32} color={isPink ? '#FF007F' : '#FFFFFF'} />}
                  title="Nenhuma conta cadastrada"
                  description="Crie sua primeira conta de investimento para consolidar seus ativos e acompanhar seu patrimônio."
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

      {/* Dashboard Add Position Modal */}
      <DashboardAddPositionModal
        visible={addPositionModalVisible}
        onClose={() => setAddPositionModalVisible(false)}
        accounts={accounts}
        onConfirm={handleConfirmAddPosition}
        isLoading={isAddingPosition}
        initialTicker={prefilledTicker}
      />

      {/* Export Portfolio Modal */}
      <ExportPortfolioModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        accounts={accounts}
        totalNetWorth={totalNetWorth}
        username={user?.username || 'Investidor'}
      />
    </SafeAreaView>
  );
}
