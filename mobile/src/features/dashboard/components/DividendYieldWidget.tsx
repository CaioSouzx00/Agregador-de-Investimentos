import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { Coins, Sparkles, CalendarCheck } from 'lucide-react-native';
import { AccountValuationResponse } from '@/shared/types/api';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { useThemeStore } from '@/shared/stores/themeStore';

export interface DividendYieldWidgetProps {
  accounts: AccountValuationResponse[];
  totalNetWorth: number;
}

export const DividendYieldWidget: React.FC<DividendYieldWidgetProps> = ({
  accounts,
  totalNetWorth,
}) => {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  // Calculate annual estimated dividends based on holdings
  const { annualDividends, monthlyAverage, averageYieldPercent, monthlyBars } = useMemo(() => {
    // Standard dividend yields for major B3 stocks
    const dividendYieldMap: Record<string, number> = {
      PETR4: 0.148, // 14.8%
      PETR3: 0.145,
      VALE3: 0.089, // 8.9%
      ITUB4: 0.084, // 8.4%
      BBDC4: 0.078,
      BBAS3: 0.096, // 9.6%
      WEGE3: 0.024,
      ABEV3: 0.052,
      PRIO3: 0.035,
      RENT3: 0.038,
      AAPL: 0.006,
      MSFT: 0.008,
    };

    let totalDividends = 0;
    let totalInvested = 0;

    for (const acc of accounts) {
      if (!acc.positions) continue;
      for (const pos of acc.positions) {
        const yieldRate = dividendYieldMap[pos.stockId] || 0.075; // default 7.5% market yield
        totalDividends += pos.total * yieldRate;
        totalInvested += pos.total;
      }
    }

    // Fallback if no positions
    if (totalDividends === 0 && totalNetWorth > 0) {
      totalDividends = totalNetWorth * 0.088; // 8.8%
      totalInvested = totalNetWorth;
    }

    const avgYield = totalInvested > 0 ? (totalDividends / totalInvested) * 100 : 9.5;
    const monthly = totalDividends / 12;

    // Month distribution weights in Brazil (peaks in Apr, Aug, Nov, Dec)
    const monthWeights = [0.05, 0.04, 0.08, 0.18, 0.07, 0.06, 0.05, 0.16, 0.06, 0.05, 0.11, 0.09];
    const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const bars = monthWeights.map((weight, idx) => {
      const monthValue = totalDividends * weight;
      return {
        label: monthLabels[idx],
        value: monthValue,
        weight,
      };
    });

    return {
      annualDividends: Math.round(totalDividends * 100) / 100,
      monthlyAverage: Math.round(monthly * 100) / 100,
      averageYieldPercent: Math.round(avgYield * 10) / 10,
      monthlyBars: bars,
    };
  }, [accounts, totalNetWorth]);

  if (totalNetWorth === 0) {
    return null;
  }

  const barChartHeight = 85;
  const maxBarVal = Math.max(...monthlyBars.map((b) => b.value), 1);

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
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Coins size={16} color={isPink ? '#FF007F' : '#FFFFFF'} />
          <Text
            style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
            className="text-[11px] font-bold uppercase tracking-wider"
          >
            Projeção de Dividendos & Proventos
          </Text>
        </View>

        <View
          style={{
            backgroundColor: isPink ? 'rgba(255, 0, 127, 0.12)' : 'rgba(255, 255, 255, 0.1)',
            borderColor: isPink ? 'rgba(255, 0, 127, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
          }}
          className="px-2.5 py-1 rounded-full flex-row items-center gap-1"
        >
          <Sparkles size={11} color={isPink ? '#FF007F' : '#FFFFFF'} />
          <Text
            style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
            className="text-[10px] font-black"
          >
            Yield ~{averageYieldPercent}% a.a.
          </Text>
        </View>
      </View>

      {/* Figures Row */}
      <View className="flex-row items-center justify-between p-3.5 rounded-2xl bg-black/60 mb-4 border border-zinc-900">
        <View>
          <Text className="text-[10px] text-zinc-400 font-bold uppercase">
            Estimado Anual
          </Text>
          <CurrencyText value={annualDividends} size="xl" color="default" />
        </View>

        <View className="items-end">
          <Text className="text-[10px] text-zinc-400 font-bold uppercase">
            Média Mensal
          </Text>
          <CurrencyText value={monthlyAverage} size="xl" color="default" />
        </View>
      </View>

      {/* Monthly Bar Distribution Chart */}
      <View className="mb-2">
        <Text className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Distribuição Estimada por Mês (B3)
        </Text>

        <View className="flex-row items-end justify-between h-[85px] px-1 pt-2">
          {monthlyBars.map((bar, idx) => {
            const barHeight = Math.max(8, (bar.value / maxBarVal) * 58);
            const isPeak = bar.weight >= 0.14;

            return (
              <View key={idx} className="items-center flex-1">
                {/* Visual Bar */}
                <View
                  style={{
                    height: barHeight,
                    width: 14,
                    backgroundColor: isPeak
                      ? isPink
                        ? '#FF007F'
                        : '#FFFFFF'
                      : isPink
                      ? 'rgba(255, 0, 127, 0.35)'
                      : 'rgba(255, 255, 255, 0.25)',
                    borderRadius: 5,
                    borderWidth: isPeak ? 1 : 0,
                    borderColor: isPeak ? '#FFFFFF' : 'transparent',
                  }}
                />
                <Text
                  className={`text-[9px] mt-1 font-extrabold ${
                    isPeak
                      ? isPink
                        ? 'text-pink-400'
                        : 'text-white'
                      : 'text-zinc-500'
                  }`}
                >
                  {bar.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};
