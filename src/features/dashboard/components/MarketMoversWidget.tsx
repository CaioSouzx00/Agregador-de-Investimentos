import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Flame, TrendingUp, Plus } from 'lucide-react-native';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export interface MarketMoversWidgetProps {
  onSelectTicker?: (ticker: string) => void;
}

export const MarketMoversWidget: React.FC<MarketMoversWidgetProps> = ({
  onSelectTicker,
}) => {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const movers = [
    { ticker: 'PETR4', name: 'Petrobras', price: 'R$ 38,50', change: '+2,4%', volume: 'R$ 1,4B' },
    { ticker: 'VALE3', name: 'Vale', price: 'R$ 61,20', change: '+1,8%', volume: 'R$ 980M' },
    { ticker: 'WEGE3', name: 'WEG', price: 'R$ 54,20', change: '+3,1%', volume: 'R$ 420M' },
    { ticker: 'ITUB4', name: 'Itaú Unibanco', price: 'R$ 33,80', change: '+1,2%', volume: 'R$ 650M' },
    { ticker: 'BBAS3', name: 'Banco do Brasil', price: 'R$ 27,90', change: '+0,9%', volume: 'R$ 390M' },
    { ticker: 'PRIO3', name: 'PRIO', price: 'R$ 44,10', change: '+2,1%', volume: 'R$ 310M' },
  ];

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

        <Text className="text-[10px] text-zinc-400 font-bold uppercase">
          Top Negociadas
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {movers.map((item) => (
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
            className="p-3 rounded-2xl min-w-[125px] active:bg-zinc-900"
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs font-black text-white">{item.ticker}</Text>
              <View className="flex-row items-center gap-0.5">
                <TrendingUp size={10} color="#10B981" />
                <Text className="text-[10px] font-black text-emerald-400">
                  {item.change}
                </Text>
              </View>
            </View>

            <Text className="text-[10px] text-zinc-400 mb-1" numberOfLines={1}>
              {item.name}
            </Text>

            <Text className="text-xs font-black text-white">{item.price}</Text>

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
        ))}
      </ScrollView>
    </View>
  );
};
