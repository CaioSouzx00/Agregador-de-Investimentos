import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '@/shared/components/ui/Card';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { AccountStockResponse } from '@/shared/types/api';
import { useThemeStore } from '@/shared/stores/themeStore';

export interface PositionItemProps {
  position: AccountStockResponse;
  totalAccountValue?: number;
}

export const PositionItem: React.FC<PositionItemProps> = ({
  position,
  totalAccountValue = 0,
}) => {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const shareOfAccount =
    totalAccountValue > 0
      ? ((position.total / totalAccountValue) * 100).toFixed(1)
      : '0.0';

  return (
    <Card
      style={{
        backgroundColor: '#09090C',
        borderColor: isPink ? '#261426' : '#222222',
        borderWidth: 1,
      }}
      className="p-3.5 mb-2.5"
    >
      <View className="flex-row items-center justify-between">
        {/* Left: Ticker & Quantity */}
        <View className="flex-row items-center flex-1 pr-3">
          <View
            style={{
              backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
              borderColor: isPink ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 255, 255, 0.3)',
              borderWidth: 1,
            }}
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
          >
            <Text
              style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
              className="text-xs font-black tracking-wider"
            >
              {position.stockId.substring(0, 5)}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-sm font-extrabold text-white">
              {position.stockId}
            </Text>
            <Text className="text-xs text-zinc-400 mt-0.5">
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
          <Text className="text-[11px] text-zinc-400 font-medium mt-1">
            {shareOfAccount}% da conta
          </Text>
        </View>
      </View>
    </Card>
  );
};
