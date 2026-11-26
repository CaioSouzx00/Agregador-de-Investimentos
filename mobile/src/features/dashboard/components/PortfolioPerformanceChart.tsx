import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle } from 'react-native-svg';
import { TrendingUp, Calendar, Eye, EyeOff } from 'lucide-react-native';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export type Timeframe = '1D' | '1S' | '1M' | '6M' | '1A' | 'TUDO';

export interface PortfolioPerformanceChartProps {
  totalNetWorth: number;
}

interface Point {
  x: number;
  y: number;
  value: number;
  label: string;
}

export const PortfolioPerformanceChart: React.FC<PortfolioPerformanceChartProps> = ({
  totalNetWorth,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [chartWidth, setChartWidth] = useState(320);
  const chartHeight = 160;

  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const strokeColor = isPink ? '#FF007F' : '#FFFFFF';
  const gradientStart = isPink ? 'rgba(255, 0, 127, 0.35)' : 'rgba(255, 255, 255, 0.25)';
  const gradientEnd = 'rgba(0, 0, 0, 0.0)';

  // Build curve data points based on timeframe and totalNetWorth
  const { dataPoints, percentChange, nominalChange } = useMemo(() => {
    const baseValue = totalNetWorth > 0 ? totalNetWorth : 1000;
    
    // Multipliers for starting point variation depending on timeframe
    const config: Record<Timeframe, { pointsCount: number; yieldFactor: number; labels: string[] }> = {
      '1D': {
        pointsCount: 7,
        yieldFactor: 0.008, // +0.8%
        labels: ['10h', '11h', '12h', '13h', '14h', '15h', '17h'],
      },
      '1S': {
        pointsCount: 7,
        yieldFactor: 0.024, // +2.4%
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Hoje'],
      },
      '1M': {
        pointsCount: 8,
        yieldFactor: 0.052, // +5.2%
        labels: ['Dia 1', 'Dia 5', 'Dia 10', 'Dia 15', 'Dia 20', 'Dia 25', 'Dia 28', 'Hoje'],
      },
      '6M': {
        pointsCount: 7,
        yieldFactor: 0.118, // +11.8%
        labels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Atual'],
      },
      '1A': {
        pointsCount: 8,
        yieldFactor: 0.185, // +18.5%
        labels: ['Nov', 'Jan', 'Mar', 'Mai', 'Jul', 'Set', 'Out', 'Atual'],
      },
      'TUDO': {
        pointsCount: 8,
        yieldFactor: 0.342, // +34.2%
        labels: ['2023', 'Q1 24', 'Q2 24', 'Q3 24', 'Ago', 'Set', 'Out', 'Hoje'],
      },
    };

    const currentCfg = config[timeframe];
    const count = currentCfg.pointsCount;
    const startValue = baseValue / (1 + currentCfg.yieldFactor);
    const nominal = baseValue - startValue;
    const percent = (nominal / startValue) * 100;

    // Generate natural oscillation curve leading up to current baseValue
    const values: number[] = [];
    for (let i = 0; i < count; i++) {
      if (i === count - 1) {
        values.push(baseValue);
      } else {
        const progress = i / (count - 1);
        // Subtle sinusoidal wave added to linear progression
        const wave = Math.sin(progress * Math.PI * 2.5) * (nominal * 0.12);
        const interpolated = startValue + progress * nominal + wave;
        values.push(Math.max(10, Math.round(interpolated * 100) / 100));
      }
    }

    return {
      dataPoints: values.map((val, idx) => ({
        val,
        label: currentCfg.labels[idx] || `P${idx + 1}`,
      })),
      percentChange: percent,
      nominalChange: nominal,
    };
  }, [timeframe, totalNetWorth]);

  // Transform values into SVG coordinates
  const { pathD, areaD, points, minVal, maxVal } = useMemo(() => {
    const rawVals = dataPoints.map((p) => p.val);
    const min = Math.min(...rawVals);
    const max = Math.max(...rawVals);
    const range = max - min === 0 ? 1 : max - min;
    const paddingY = 20;
    const innerHeight = chartHeight - paddingY * 2;
    const paddingX = 15;
    const innerWidth = chartWidth - paddingX * 2;

    const mappedPoints: Point[] = dataPoints.map((item, index) => {
      const x = paddingX + (index / (dataPoints.length - 1)) * innerWidth;
      const normalizedY = (item.val - min) / range;
      // Invert Y because SVG coordinates have y=0 at top
      const y = paddingY + innerHeight * (1 - normalizedY);
      return {
        x,
        y,
        value: item.val,
        label: item.label,
      };
    });

    // Create smooth cubic Bézier curve SVG path
    let linePath = '';
    if (mappedPoints.length > 0) {
      linePath = `M ${mappedPoints[0].x} ${mappedPoints[0].y}`;
      for (let i = 0; i < mappedPoints.length - 1; i++) {
        const curr = mappedPoints[i];
        const next = mappedPoints[i + 1];
        const controlX = (curr.x + next.x) / 2;
        linePath += ` C ${controlX} ${curr.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
      }
    }

    // Complete area path closing to bottom
    const last = mappedPoints[mappedPoints.length - 1];
    const first = mappedPoints[0];
    const closedArea = `${linePath} L ${last.x} ${chartHeight} L ${first.x} ${chartHeight} Z`;

    return {
      pathD: linePath,
      areaD: closedArea,
      points: mappedPoints,
      minVal: min,
      maxVal: max,
    };
  }, [dataPoints, chartWidth, chartHeight]);

  const activePoint = selectedIndex !== null ? points[selectedIndex] : points[points.length - 1];

  const handleSelectTimeframe = (tf: Timeframe) => {
    haptic.selection();
    setTimeframe(tf);
    setSelectedIndex(null);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    if (width > 0) {
      setChartWidth(width);
    }
  };

  return (
    <View
      onLayout={onLayout}
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
      {/* Header Info */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <View className="flex-row items-center gap-1.5 mb-1">
            <TrendingUp size={14} color={isPink ? '#FF007F' : '#FFFFFF'} />
            <Text
              style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
              className="text-[11px] font-bold uppercase tracking-wider"
            >
              Evolução da Carteira
            </Text>
          </View>
          <View className="flex-row items-baseline gap-2">
            <CurrencyText
              value={activePoint ? activePoint.value : totalNetWorth}
              size="2xl"
              color="default"
            />
            {activePoint && (
              <Text className="text-xs text-zinc-400 font-medium">
                ({activePoint.label})
              </Text>
            )}
          </View>
        </View>

        {/* Performance Badge */}
        <View
          style={{
            backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            borderColor: isPink ? 'rgba(255, 0, 127, 0.4)' : 'rgba(16, 185, 129, 0.4)',
            borderWidth: 1,
          }}
          className="px-2.5 py-1.5 rounded-full items-end"
        >
          <Text
            style={{ color: isPink ? '#FF007F' : '#34D399' }}
            className="text-xs font-black"
          >
            +{percentChange.toFixed(1)}%
          </Text>
          <Text className="text-[9px] text-zinc-400 font-medium">
            +R$ {nominalChange.toFixed(0)} ({timeframe})
          </Text>
        </View>
      </View>

      {/* SVG Interactive Chart */}
      <View className="relative w-full overflow-hidden my-2">
        <Svg width={chartWidth} height={chartHeight}>
          <Defs>
            <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={strokeColor} stopOpacity={isPink ? 0.35 : 0.22} />
              <Stop offset="85%" stopColor={strokeColor} stopOpacity={0.02} />
              <Stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          <Line
            x1="10"
            y1={chartHeight * 0.25}
            x2={chartWidth - 10}
            y2={chartHeight * 0.25}
            stroke="#1c1c22"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <Line
            x1="10"
            y1={chartHeight * 0.65}
            x2={chartWidth - 10}
            y2={chartHeight * 0.65}
            stroke="#1c1c22"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Area Fill */}
          <Path d={areaD} fill="url(#chartGradient)" />

          {/* Stroke Line */}
          <Path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Points */}
          {points.map((pt, idx) => {
            const isSelected = selectedIndex === idx || (selectedIndex === null && idx === points.length - 1);
            return (
              <React.Fragment key={idx}>
                {isSelected && (
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r="8"
                    fill={strokeColor}
                    opacity={0.3}
                  />
                )}
                <Circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? '5' : '3'}
                  fill={isSelected ? strokeColor : '#18181B'}
                  stroke={strokeColor}
                  strokeWidth={isSelected ? '2' : '1.5'}
                />
              </React.Fragment>
            );
          })}
        </Svg>

        {/* Touch Hotspots Overlay */}
        <View className="absolute inset-0 flex-row">
          {points.map((pt, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-1 h-full"
              activeOpacity={1}
              onPress={() => {
                haptic.selection();
                setSelectedIndex(idx);
              }}
            />
          ))}
        </View>
      </View>

      {/* Timeframe Chips Selector */}
      <View className="flex-row items-center justify-between pt-3 border-t border-zinc-900">
        {(['1D', '1S', '1M', '6M', '1A', 'TUDO'] as Timeframe[]).map((tf) => {
          const isActive = timeframe === tf;
          return (
            <TouchableOpacity
              key={tf}
              onPress={() => handleSelectTimeframe(tf)}
              style={{
                backgroundColor: isActive
                  ? isPink
                    ? '#FF007F'
                    : '#FFFFFF'
                  : 'transparent',
                borderColor: isActive ? 'transparent' : '#222222',
                borderWidth: isActive ? 0 : 1,
              }}
              className="px-3 py-1.5 rounded-xl items-center justify-center min-w-[42px]"
            >
              <Text
                style={{
                  color: isActive
                    ? isPink
                      ? '#FFFFFF'
                      : '#000000'
                    : '#71717A',
                }}
                className="text-[11px] font-black"
              >
                {tf}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
