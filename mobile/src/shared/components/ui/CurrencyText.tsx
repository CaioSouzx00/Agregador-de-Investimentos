import React from 'react';
import { Text, TextProps, View } from 'react-native';
import { formatCurrency, splitCurrencyParts } from '@/shared/utils/currency';

export type CurrencySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

export interface CurrencyTextProps extends TextProps {
  value: number | string | null | undefined;
  size?: CurrencySize;
  color?: 'default' | 'primary' | 'success' | 'danger' | 'muted';
  showPrefix?: boolean;
  privacyMask?: boolean;
}

export const CurrencyText: React.FC<CurrencyTextProps> = ({
  value,
  size = 'md',
  color = 'default',
  showPrefix = true,
  privacyMask = false,
  className = '',
  ...props
}) => {
  if (privacyMask) {
    return (
      <Text className={`font-semibold text-foreground tracking-widest ${className}`} {...props}>
        R$ ••••••
      </Text>
    );
  }

  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'text-primary';
      case 'success':
        return 'text-success';
      case 'danger':
        return 'text-danger';
      case 'muted':
        return 'text-muted-foreground';
      case 'default':
      default:
        return 'text-foreground';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return { prefix: 'text-xs', int: 'text-xs', cents: 'text-[10px]' };
      case 'sm':
        return { prefix: 'text-xs', int: 'text-sm', cents: 'text-xs' };
      case 'lg':
        return { prefix: 'text-base', int: 'text-xl', cents: 'text-sm' };
      case 'xl':
        return { prefix: 'text-lg', int: 'text-2xl', cents: 'text-base' };
      case '2xl':
        return { prefix: 'text-xl', int: 'text-3xl', cents: 'text-lg' };
      case '3xl':
        return { prefix: 'text-2xl', int: 'text-4xl', cents: 'text-xl' };
      case 'md':
      default:
        return { prefix: 'text-sm', int: 'text-base', cents: 'text-xs' };
    }
  };

  const parts = splitCurrencyParts(value);
  const colorClass = getColorClass();
  const sizeClasses = getSizeClasses();

  return (
    <View className="flex-row items-baseline">
      {showPrefix && (
        <Text
          className={`font-medium ${colorClass} ${sizeClasses.prefix} mr-1`}
          {...props}
        >
          {parts.prefix}
        </Text>
      )}
      <Text
        className={`font-bold ${colorClass} ${sizeClasses.int} tracking-tight`}
        {...props}
      >
        {parts.integers}
      </Text>
      <Text
        className={`font-semibold ${colorClass} ${sizeClasses.cents} opacity-85`}
        {...props}
      >
        ,{parts.cents}
      </Text>
    </View>
  );
};
