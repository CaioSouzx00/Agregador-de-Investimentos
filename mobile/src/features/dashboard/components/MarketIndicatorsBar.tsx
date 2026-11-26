import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { TrendingUp, TrendingDown, DollarSign, Activity, Percent } from 'lucide-react-native';
import { useThemeStore } from '@/shared/stores/themeStore';

interface MarketIndex {
  id: string;
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

export const MarketIndicatorsBar: React.FC = () => {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const indices: MarketIndex[] = [
    {
      id: 'ibov',
      name: 'IBOVESPA',
      value: '131.420 pts',
      change: '+0.74%',
      isPositive: true,
      icon: <Activity size={13} color={isPink ? '#FF007F' : '#FFFFFF'} />,
    },
    {
      id: 'dolar',
      name: 'DÓLAR PTAX',
      value: 'R$ 5,44',
      change: '-0.38%',
      isPositive: false,
      icon: <DollarSign size={13} color={isPink ? '#FF007F' : '#FFFFFF'} />,
    },
    {
      id: 'cdi',
      name: 'TAXA CDI',
      value: '10,65% a.a.',
      change: 'Meta',
      isPositive: true,
      icon: <Percent size={13} color={isPink ? '#FF007F' : '#FFFFFF'} />,
    },
    {
      id: 'selic',
      name: 'SELIC',
      value: '10,75% a.a.',
      change: 'Copom',
      isPositive: true,
      icon: <Percent size={13} color={isPink ? '#FF007F' : '#FFFFFF'} />,
    },
    {
      id: 'sp500',
      name: 'S&P 500',
      value: '5.864 pts',
      change: '+0.51%',
      isPositive: true,
      icon: <TrendingUp size={13} color={isPink ? '#FF007F' : '#FFFFFF'} />,
    },
    {
      id: 'ifix',
      name: 'IFIX (FIIs)',
      value: '3.342 pts',
      change: '+0.18%',
      isPositive: true,
      icon: <Activity size={13} color={isPink ? '#FF007F' : '#FFFFFF'} />,
    },
  ];

  return (
    <View className="mb-2">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
          Mercado & Índices de Referência
        </Text>
        <View className="flex-row items-center gap-1.5">
          <View className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <Text className="text-[10px] text-zinc-400 font-medium">B3 Aberta</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 10 }}
      >
        {indices.map((item) => (
          <View
            key={item.id}
            style={{
              backgroundColor: '#09090C',
              borderColor: isPink ? '#261426' : '#222222',
              borderWidth: 1,
            }}
            className="px-3.5 py-2.5 rounded-2xl flex-row items-center gap-2.5 min-w-[140px]"
          >
            <View
              style={{
                backgroundColor: isPink ? 'rgba(255, 0, 127, 0.12)' : 'rgba(255, 255, 255, 0.08)',
              }}
              className="w-7 h-7 rounded-xl items-center justify-center"
            >
              {item.icon}
            </View>

            <View>
              <Text className="text-[10px] text-zinc-400 font-bold uppercase">
                {item.name}
              </Text>
              <Text className="text-xs font-black text-white">{item.value}</Text>
              <View className="flex-row items-center gap-0.5 mt-0.5">
                {item.isPositive ? (
                  <TrendingUp size={10} color="#10B981" />
                ) : (
                  <TrendingDown size={10} color="#EF4444" />
                )}
                <Text
                  className={`text-[10px] font-bold ${
                    item.isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {item.change}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
