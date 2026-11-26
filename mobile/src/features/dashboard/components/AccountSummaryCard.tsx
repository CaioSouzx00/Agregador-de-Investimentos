import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Landmark } from 'lucide-react-native';
import { Card } from '@/shared/components/ui/Card';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { Badge } from '@/shared/components/ui/Badge';
import { AccountValuationResponse } from '@/shared/types/api';
import { useThemeStore } from '@/shared/stores/themeStore';

export interface AccountSummaryCardProps {
  account: AccountValuationResponse;
  totalNetWorth: number;
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  account,
  totalNetWorth,
}) => {
  const router = useRouter();
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const percentage =
    totalNetWorth > 0
      ? ((account.totalPortfolioValue / totalNetWorth) * 100).toFixed(1)
      : '0.0';

  const positionsCount = account.positions?.length ?? 0;

  return (
    <Card
      onPress={() => router.push(`/(app)/accounts/${account.accountId}` as any)}
      style={{
        backgroundColor: '#09090C',
        borderColor: isPink ? '#261426' : '#222222',
        borderWidth: 1,
      }}
      className="p-4 mb-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 pr-3">
          <View
            style={{
              backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
              borderColor: isPink ? 'rgba(255, 0, 127, 0.35)' : 'rgba(255, 255, 255, 0.25)',
              borderWidth: 1,
            }}
            className="w-11 h-11 rounded-2xl items-center justify-center mr-3.5"
          >
            <Landmark size={20} color={isPink ? '#FF007F' : '#FFFFFF'} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-white" numberOfLines={1}>
              {account.description}
            </Text>
            <Text className="text-xs text-zinc-400 mt-0.5">
              {positionsCount === 1 ? '1 ativo' : `${positionsCount} ativos`}
            </Text>
          </View>
        </View>

        <View className="items-end flex-row gap-2">
          <View className="items-end">
            <CurrencyText value={account.totalPortfolioValue} size="md" />
            <Badge
              label={`${percentage}% da carteira`}
              variant="muted"
              size="sm"
              className="mt-1"
            />
          </View>
          <View className="justify-center items-center pl-1">
            <ChevronRight size={18} color={isPink ? '#FF007F' : '#A1A1AA'} />
          </View>
        </View>
      </View>
    </Card>
  );
};
