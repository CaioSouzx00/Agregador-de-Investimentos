import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { PieChart, Layers, ArrowUpRight } from 'lucide-react-native';
import { AccountValuationResponse } from '@/shared/types/api';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export interface AssetAllocationChartProps {
  accounts: AccountValuationResponse[];
  totalNetWorth: number;
}

interface AggregatedAsset {
  stockId: string;
  totalQuantity: number;
  currentPrice: number;
  totalValue: number;
  percentage: number;
  color: string;
}

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({
  accounts,
  totalNetWorth,
}) => {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  // Palettes tailored to theme
  const pinkColors = [
    '#FF007F', // Hot Pink
    '#A855F7', // Neon Purple
    '#06B6D4', // Vibrant Cyan
    '#10B981', // Emerald Glow
    '#F59E0B', // Amber
    '#E11D48', // Crimson Rose
    '#6366F1', // Indigo
    '#F43F5E', // Rose
  ];

  const monoColors = [
    '#FFFFFF', // Pure White
    '#E4E4E7', // Zinc 200
    '#A1A1AA', // Zinc 400
    '#71717A', // Zinc 500
    '#52525B', // Zinc 600
    '#3F3F46', // Zinc 700
  ];

  const palette = isPink ? pinkColors : monoColors;

  // Aggregate positions across all broker accounts
  const assets: AggregatedAsset[] = useMemo(() => {
    const map = new Map<string, { quantity: number; currentPrice: number; total: number }>();

    for (const acc of accounts) {
      if (!acc.positions) continue;
      for (const pos of acc.positions) {
        const existing = map.get(pos.stockId);
        if (existing) {
          existing.quantity += pos.quantity;
          existing.total += pos.total;
        } else {
          map.set(pos.stockId, {
            quantity: pos.quantity,
            currentPrice: pos.currentPrice,
            total: pos.total,
          });
        }
      }
    }

    const effectiveTotal = totalNetWorth > 0 ? totalNetWorth : 1;
    const sorted = Array.from(map.entries())
      .map(([stockId, data], index) => {
        const pct = (data.total / effectiveTotal) * 100;
        return {
          stockId,
          totalQuantity: data.quantity,
          currentPrice: data.currentPrice,
          totalValue: data.total,
          percentage: Math.round(pct * 10) / 10,
          color: palette[index % palette.length],
        };
      })
      .sort((a, b) => b.totalValue - a.totalValue);

    return sorted;
  }, [accounts, totalNetWorth, palette]);

  // Donut geometry constants
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate SVG stroke dashes for each slice
  let accumulatedPercent = 0;
  const slices = assets.map((asset) => {
    const strokeDasharray = `${(asset.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += asset.percentage;
    return {
      ...asset,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeAsset = selectedStock
    ? assets.find((a) => a.stockId === selectedStock)
    : assets[0];

  if (assets.length === 0) {
    return null;
  }

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
      {/* Title */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <PieChart size={16} color={isPink ? '#FF007F' : '#FFFFFF'} />
          <Text
            style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
            className="text-[11px] font-bold uppercase tracking-wider"
          >
            Alocação por Ativo
          </Text>
        </View>

        <Text className="text-xs text-zinc-400 font-medium">
          {assets.length} {assets.length === 1 ? 'ativo' : 'ativos'}
        </Text>
      </View>

      {/* Donut and Active Item summary */}
      <View className="flex-row items-center justify-around py-2">
        {/* SVG Donut */}
        <View className="relative items-center justify-center">
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
              {/* Background circle track */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#18181B"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Slices */}
              {slices.map((slice) => {
                const isSelected = selectedStock === slice.stockId;
                return (
                  <Circle
                    key={slice.stockId}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={slice.color}
                    strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    opacity={selectedStock && !isSelected ? 0.45 : 1}
                  />
                );
              })}
            </G>
          </Svg>

          {/* Center Text inside Donut */}
          <View className="absolute items-center justify-center pointer-events-none">
            <Text
              style={{ color: activeAsset ? activeAsset.color : '#FFFFFF' }}
              className="text-base font-black"
            >
              {activeAsset ? `${activeAsset.percentage}%` : '100%'}
            </Text>
            <Text className="text-[10px] text-zinc-400 font-bold uppercase">
              {activeAsset ? activeAsset.stockId : 'Total'}
            </Text>
          </View>
        </View>

        {/* Selected Asset Details Panel */}
        {activeAsset && (
          <View className="flex-1 ml-5">
            <View className="flex-row items-center gap-2 mb-1">
              <View
                style={{ backgroundColor: activeAsset.color }}
                className="w-2.5 h-2.5 rounded-full"
              />
              <Text className="text-base font-black text-white">
                {activeAsset.stockId}
              </Text>
            </View>

            <Text className="text-xs text-zinc-400 mb-1">
              {activeAsset.totalQuantity} cotas a{' '}
              <Text className="text-zinc-300 font-bold">
                R$ {activeAsset.currentPrice.toFixed(2)}
              </Text>
            </Text>

            <CurrencyText value={activeAsset.totalValue} size="lg" color="default" />

            <View
              style={{
                backgroundColor: isPink ? 'rgba(255, 0, 127, 0.12)' : 'rgba(255, 255, 255, 0.1)',
                borderColor: isPink ? 'rgba(255, 0, 127, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
              }}
              className="mt-2.5 px-2.5 py-1 rounded-xl self-start"
            >
              <Text
                style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
                className="text-[10px] font-black"
              >
                {activeAsset.percentage}% da sua carteira
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Breakdown Legend List */}
      <View className="mt-4 pt-3 border-t border-zinc-900 gap-2">
        {assets.map((asset) => {
          const isSelected = selectedStock === asset.stockId;
          return (
            <TouchableOpacity
              key={asset.stockId}
              onPress={() => {
                haptic.selection();
                setSelectedStock(isSelected ? null : asset.stockId);
              }}
              style={{
                backgroundColor: isSelected ? '#141418' : 'transparent',
                borderColor: isSelected
                  ? isPink
                    ? '#FF007F'
                    : '#FFFFFF'
                  : 'transparent',
                borderWidth: 1,
              }}
              className="flex-row items-center justify-between p-2 rounded-2xl active:bg-zinc-900"
            >
              <View className="flex-row items-center gap-2.5">
                <View
                  style={{ backgroundColor: asset.color }}
                  className="w-2.5 h-2.5 rounded-full"
                />
                <View>
                  <Text className="text-xs font-black text-white">{asset.stockId}</Text>
                  <Text className="text-[10px] text-zinc-400">
                    {asset.totalQuantity} cotas
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-xs font-bold text-white">
                  R$ {asset.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Text>
                <View
                  style={{
                    backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
                  }}
                  className="px-1.5 py-0.5 rounded-md mt-0.5"
                >
                  <Text
                    style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
                    className="text-[9px] font-black"
                  >
                    {asset.percentage}%
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
