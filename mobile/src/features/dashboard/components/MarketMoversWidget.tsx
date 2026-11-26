import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Flame, TrendingUp, TrendingDown, Plus, Radio } from 'lucide-react-native';
import { useThemeStore } from '@/shared/stores/themeStore';
import { useMarketQuotes } from '@/features/stocks/hooks/useMarketQuotes';
import { haptic } from '@/shared/utils/haptics';

export interface MarketMoversWidgetProps {
  onSelectTicker?: (ticker: string) => void;
}

const DEFAULT_MOVERS = [
  { ticker: 'PETR4', defaultName: 'Petrobras', defaultPrice: 57.36, defaultChange: -1.29, volume: 'R$ 1,4B' },
  { ticker: 'VALE3', defaultName: 'Vale', defaultPrice: 61.20, defaultChange: 1.84, volume: 'R$ 980M' },
  { ticker: 'WEGE3', defaultName: 'WEG', defaultPrice: 54.20, defaultChange: 3.12, volume: 'R$ 420M' },
  { ticker: 'ITUB4', defaultName: 'Itaú Unibanco', defaultPrice: 33.80, defaultChange: 1.25, volume: 'R$ 650M' },
  { ticker: 'BBAS3', defaultName: 'Banco do Brasil', defaultPrice: 27.90, defaultChange: 0.90, volume: 'R$ 390M' },
  { ticker: 'PRIO3', defaultName: 'PRIO', defaultPrice: 44.10, defaultChange: 2.15, volume: 'R$ 310M' },
];

export const MarketMoversWidget: React.FC<MarketMoversWidgetProps> = ({
  onSelectTicker,
}) => {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const tickers = DEFAULT_MOVERS.map((m) => m.ticker);
  const { data: quotes } = useMarketQuotes(tickers);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <View
      style={{
        backgroundColor: '#09090C',
        borderColor: isPink ? '#261426' : '#222222',
        borderWidth: 1.5,
        shadowColor: isPink ? '#FF007F' : '#FFFFFF',
        shadowOpacity: isPink ? 0.2 : 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
      }}
      className="p-5 rounded-3xl mb-1"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Flame size={16} color={isPink ? '#FF007F' : '#FFFFFF'} />
          <Text
            style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
            className="text-[11px] font-bold uppercase tracking-wider"
          >
            Destaques de Volume na B3
          </Text>
        </View>

        <View className="flex-row items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <Text className="text-[9px] text-emerald-400 font-black tracking-wider uppercase">
            Cotações ao Vivo
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {DEFAULT_MOVERS.map((item) => {
          const liveQuote = quotes?.[item.ticker];
          const price = liveQuote ? liveQuote.price : item.defaultPrice;
          const changePercent = liveQuote ? liveQuote.changePercent : item.defaultChange;
          const name = liveQuote?.name || item.defaultName;
          const isPositive = changePercent >= 0;
          const formattedChange = `${isPositive ? '+' : ''}${changePercent.toFixed(2).replace('.', ',')}%`;

          return (
            <TouchableOpacity
              key={item.ticker}
              onPress={() => {
                haptic.selection();
                onSelectTicker?.(item.ticker);
              }}
              style={{
                backgroundColor: '#111115',
                borderColor: isPink ? '#261426' : '#222222',
                borderWidth: 1,
              }}
              className="p-3 rounded-2xl min-w-[130px] active:bg-zinc-900"
            >
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs font-black text-white">{item.ticker}</Text>
                <View className="flex-row items-center gap-0.5">
                  {isPositive ? (
                    <TrendingUp size={10} color="#10B981" />
                  ) : (
                    <TrendingDown size={10} color="#EF4444" />
                  )}
                  <Text
                    className={`text-[10px] font-black ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formattedChange}
                  </Text>
                </View>
              </View>

              <Text className="text-[10px] text-zinc-400 mb-1" numberOfLines={1}>
                {name}
              </Text>

              <Text className="text-xs font-black text-white">{formatCurrency(price)}</Text>

              <View className="flex-row items-center justify-between mt-2 pt-1.5 border-t border-zinc-900">
                <Text className="text-[9px] text-zinc-500 font-medium">Vol {item.volume}</Text>
                <View
                  style={{
                    backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.15)',
                  }}
                  className="w-4 h-4 rounded-full items-center justify-center"
                >
                  <Plus size={10} color={isPink ? '#FF007F' : '#FFFFFF'} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
