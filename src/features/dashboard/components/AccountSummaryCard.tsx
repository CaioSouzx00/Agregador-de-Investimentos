import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Landmark } from 'lucide-react-native';
import { Card } from '@/shared/components/ui/Card';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { Badge } from '@/shared/components/ui/Badge';
import { AccountValuationResponse } from '@/shared/types/api';

export interface AccountSummaryCardProps {
  account: AccountValuationResponse;
  totalNetWorth: number;
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  account,
  totalNetWorth,
}) => {
  const router = useRouter();

  // Calcula a porcentagem do total do portfólio
  const percentage =
    totalNetWorth > 0
      ? ((account.totalPortfolioValue / totalNetWorth) * 100).toFixed(1)
      : '0.0';

  const positionsCount = account.positions?.length ?? 0;

  return (
    <Card
      onPress={() => router.push(`/(app)/accounts/${account.accountId}` as any)}
      className="p-4 mb-3 bg-card border-border active:bg-card-hover"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-3">
          <View className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 items-center justify-center mr-3">
            <Landmark size={20} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-foreground" numberOfLines={1}>
              {account.description}
            </Text>
            <Text className="text-xs text-muted-foreground mt-0.5">
              {positionsCount === 1 ? '1 ativo' : `${positionsCount} ativos`}
            </Text>
          </View>
        </View>

        <View className="items-end flex-row gap-2">
          <View className="items-end">
            <CurrencyText value={account.totalPortfolioValue} size="md" />
            <Badge
              label={`${percentage}% do total`}
              variant="muted"
              size="sm"
              className="mt-1"
            />
          </View>
          <View className="justify-center items-center pl-1">
            <ChevronRight size={18} color="#64748B" />
          </View>
        </View>
      </View>
    </Card>
  );
};
