import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  Landmark,
  ArrowUpDown,
  Layers,
} from 'lucide-react-native';
import { Header } from '@/shared/components/layout/Header';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { Skeleton, SkeletonCard } from '@/shared/components/ui/Skeleton';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { PositionItem } from '@/features/portfolio/components/PositionItem';
import { AddPositionModal } from '@/features/accounts/components/AddPositionModal';
import { useAccountDetailData } from '@/features/accounts/hooks/useAccountDetailData';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

type SortOption = 'value_desc' | 'ticker_asc' | 'quantity_desc';

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('value_desc');
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const {
    account,
    positions,
    totalPortfolioValue,
    isLoading,
    isRefetching,
    error,
    refetch,
    associateStock,
    isAssociating,
  } = useAccountDetailData(id);

  // Ordenação das posições
  const sortedPositions = [...positions].sort((a, b) => {
    switch (sortBy) {
      case 'ticker_asc':
        return a.stockId.localeCompare(b.stockId);
      case 'quantity_desc':
        return b.quantity - a.quantity;
      case 'value_desc':
      default:
        return b.total - a.total;
    }
  });

  const toggleSort = () => {
    haptic.selection();
    if (sortBy === 'value_desc') setSortBy('ticker_asc');
    else if (sortBy === 'ticker_asc') setSortBy('quantity_desc');
    else setSortBy('value_desc');
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'ticker_asc':
        return 'Ticker (A-Z)';
      case 'quantity_desc':
        return 'Maior Qtde';
      case 'value_desc':
      default:
        return 'Maior Valor';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <Header
        title={account?.description || 'Detalhes da Conta'}
        subtitle="Posições e rentabilidade consolidada"
        showBackButton
        onBackPress={() => router.back()}
        rightAction={
          <View className="flex-row items-center gap-2">
            <ThemeToggle compact />
            <TouchableOpacity
              onPress={() => {
                haptic.light();
                setIsModalVisible(true);
              }}
              style={{
                backgroundColor: isPink ? '#FF007F' : '#FFFFFF',
                shadowColor: isPink ? '#FF007F' : '#FFFFFF',
                shadowOpacity: 0.35,
                shadowRadius: 10,
              }}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl active:opacity-90"
            >
              <Plus size={16} color={isPink ? '#FFFFFF' : '#000000'} />
              <Text
                style={{ color: isPink ? '#FFFFFF' : '#000000' }}
                className="text-xs font-black"
              >
                Adicionar
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 bg-black"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={isPink ? '#FF007F' : '#FFFFFF'}
            colors={[isPink ? '#FF007F' : '#FFFFFF']}
          />
        }
      >
        {isLoading ? (
          <View className="pt-5 gap-4">
            <Skeleton width="100%" height={140} borderRadius={24} />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : error ? (
          <View className="pt-10">
            <ErrorState onRetry={refetch} />
          </View>
        ) : (
          <View className="pt-5 gap-6">
            {/* Account Hero Card */}
            <View
              style={{
                backgroundColor: '#09090C',
                borderColor: isPink ? '#2E152E' : '#272727',
                borderWidth: 1.5,
                shadowColor: isPink ? '#FF007F' : '#FFFFFF',
                shadowOpacity: isPink ? 0.3 : 0.15,
                shadowRadius: 24,
              }}
              className="p-5 rounded-3xl"
            >
              <View className="flex-row items-center gap-3 mb-3">
                <View
                  style={{
                    backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
                    borderColor: isPink ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1,
                  }}
                  className="w-12 h-12 rounded-2xl items-center justify-center"
                >
                  <Landmark size={22} color={isPink ? '#FF007F' : '#FFFFFF'} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Saldo Total na Corretora
                  </Text>
                  <Text className="text-xl font-black text-white">
                    {account?.description}
                  </Text>
                </View>
              </View>

              <View className="my-1">
                <CurrencyText value={totalPortfolioValue} size="2xl" />
              </View>

              <View className="flex-row items-center justify-between pt-3 border-t border-zinc-900 mt-3">
                <Text className="text-xs text-zinc-400">
                  {positions.length} {positions.length === 1 ? 'posição ativa' : 'posições ativas'}
                </Text>
                <Text
                  style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
                  className="text-xs font-bold"
                >
                  Cotações B3 em tempo real
                </Text>
              </View>
            </View>

            {/* Positions Section */}
            <View>
              <View className="flex-row items-center justify-between mb-3.5">
                <Text className="text-base font-bold text-white tracking-tight">
                  Ativos em Custódia
                </Text>

                {positions.length > 1 && (
                  <TouchableOpacity
                    onPress={toggleSort}
                    style={{
                      backgroundColor: '#09090C',
                      borderColor: isPink ? '#261426' : '#222222',
                      borderWidth: 1,
                    }}
                    className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl"
                  >
                    <ArrowUpDown size={12} color={isPink ? '#FF007F' : '#A1A1AA'} />
                    <Text className="text-xs text-zinc-400">
                      Ordem: <Text className="text-white font-bold">{getSortLabel()}</Text>
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {sortedPositions.length === 0 ? (
                <EmptyState
                  icon={<Layers size={32} color={isPink ? '#FF007F' : '#FFFFFF'} />}
                  title="Nenhum ativo vinculado"
                  description="Você ainda não adicionou ações ou ativos nesta conta de investimentos."
                  actionLabel="Adicionar Primeiro Ativo"
                  onAction={() => {
                    haptic.light();
                    setIsModalVisible(true);
                  }}
                />
              ) : (
                sortedPositions.map((pos) => (
                  <PositionItem
                    key={pos.stockId}
                    position={pos}
                    totalAccountValue={totalPortfolioValue}
                  />
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal to add position */}
      <AddPositionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        isLoading={isAssociating}
        onAddPosition={(data) => {
          associateStock(data);
        }}
      />
    </SafeAreaView>
  );
}
