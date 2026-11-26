import React from 'react';
import { View, Text, TextProps } from 'react-native';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react-native';
import { formatPercentage } from '@/shared/utils/percentage';

export interface PercentageTextProps extends TextProps {
  value: number | string | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  decimals?: number;
}

export const PercentageText: React.FC<PercentageTextProps> = ({
  value,
  size = 'md',
  showIcon = true,
  decimals = 2,
  className = '',
  ...props
}) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  const isPositive = numValue > 0;
  const isNegative = numValue < 0;

  const colorClass = isPositive
    ? 'text-success'
    : isNegative
    ? 'text-danger'
    : 'text-muted-foreground';

  const iconColor = isPositive ? '#10B981' : isNegative ? '#EF4444' : '#64748B';

  const getIconSize = () => {
    switch (size) {
      case 'xs':
        return 10;
      case 'sm':
        return 12;
      case 'lg':
        return 18;
      case 'md':
      default:
        return 14;
    }
  };

  const getTextSizeClass = () => {
    switch (size) {
      case 'xs':
        return 'text-[10px]';
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      case 'md':
      default:
        return 'text-sm';
    }
  };

  const iconSize = getIconSize();
  const formattedText = formatPercentage(numValue, { decimals, showSign: true });

  return (
    <View className={`flex-row items-center gap-1 ${className}`}>
      {showIcon && (
        <View className="items-center justify-center">
          {isPositive ? (
            <TrendingUp size={iconSize} color={iconColor} />
          ) : isNegative ? (
            <TrendingDown size={iconSize} color={iconColor} />
          ) : (
            <Minus size={iconSize} color={iconColor} />
          )}
        </View>
      )}
      <Text
        className={`font-semibold ${colorClass} ${getTextSizeClass()}`}
        {...props}
      >
        {formattedText}
      </Text>
    </View>
  );
};
