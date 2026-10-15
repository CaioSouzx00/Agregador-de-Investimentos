import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/shared/components/ui/Card';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { AccountStockResponse } from '@/shared/types/api';

export interface PositionItemProps {
  position: AccountStockResponse;
  totalAccountValue?: number;
}

export const PositionItem: React.FC<PositionItemProps> = ({
  position,
  totalAccountValue = 0,
}) => {
  const shareOfAccount =
    totalAccountValue > 0
      ? ((position.total / totalAccountValue) * 100).toFixed(1)
      : '0.0';

  return (
    <Card className="p-3.5 mb-2.5 bg-card border-border">
      <View className="flex-row items-center justify-between">
        {/* Left: Ticker & Quantity */}
        <View className="flex-row items-center flex-1 pr-3">
          <View className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 items-center justify-center mr-3">
            <Text className="text-xs font-bold text-primary tracking-wider">
              {position.stockId.substring(0, 5)}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-sm font-bold text-foreground">
              {position.stockId}
            </Text>
            <Text className="text-xs text-muted-foreground mt-0.5">
              {position.quantity} {position.quantity === 1 ? 'cota' : 'cotas'} • Preço:{' '}
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(position.currentPrice)}
            </Text>
          </View>
        </View>

        {/* Right: Total Value & Share % */}
        <View className="items-end">
          <CurrencyText value={position.total} size="sm" />
          <Text className="text-[11px] text-muted-foreground font-medium mt-1">
            {shareOfAccount}% da conta
          </Text>
        </View>
      </View>
    </Card>
  );
};
