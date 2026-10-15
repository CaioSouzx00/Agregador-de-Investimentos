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
import { PositionItem } from '@/features/portfolio/components/PositionItem';
import { AddPositionModal } from '@/features/accounts/components/AddPositionModal';
import { useAccountDetailData } from '@/features/accounts/hooks/useAccountDetailData';
import { haptic } from '@/shared/utils/haptics';

type SortOption = 'value_desc' | 'ticker_asc' | 'quantity_desc';

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('value_desc');

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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <Header
        title={account?.description || 'Detalhes da Conta'}
        subtitle="Posições e rentabilidade consolidada"
        showBackButton
        onBackPress={() => router.back()}
        rightAction={
          <TouchableOpacity
            onPress={() => {
              haptic.light();
              setIsModalVisible(true);
            }}
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary active:opacity-90 shadow-md shadow-primary/25"
          >
            <Plus size={16} color="#FFFFFF" />
            <Text className="text-xs font-bold text-white">Adicionar</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#3B82F6"
            colors={['#3B82F6']}
          />
        }
      >
        {isLoading ? (
          <View className="pt-5 gap-4">
            <Skeleton width="100%" height={130} borderRadius={24} />
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
            <View className="bg-card border border-border p-5 rounded-3xl shadow-xl shadow-black/40">
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center">
                  <Landmark size={22} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Saldo Total na Corretora
                  </Text>
                  <Text className="text-lg font-bold text-foreground">
                    {account?.description}
                  </Text>
                </View>
              </View>

              <View className="my-1">
                <CurrencyText value={totalPortfolioValue} size="2xl" />
              </View>

              <View className="flex-row items-center justify-between pt-3 border-t border-border/50 mt-3">
                <Text className="text-xs text-muted-foreground">
                  {positions.length} {positions.length === 1 ? 'posição ativa' : 'posições ativas'}
                </Text>
                <Text className="text-xs text-primary font-medium">
                  Cotações B3 em tempo real
                </Text>
              </View>
            </View>

            {/* Positions Section */}
            <View>
              <View className="flex-row items-center justify-between mb-3.5">
                <Text className="text-base font-bold text-foreground tracking-tight">
                  Ativos em Custódia
                </Text>

                {positions.length > 1 && (
                  <TouchableOpacity
                    onPress={toggleSort}
                    className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border"
                  >
                    <ArrowUpDown size={12} color="#94A3B8" />
                    <Text className="text-xs text-muted-foreground">
                      Ordem: <Text className="text-foreground font-semibold">{getSortLabel()}</Text>
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {sortedPositions.length === 0 ? (
                <EmptyState
                  icon={<Layers size={32} color="#64748B" />}
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
