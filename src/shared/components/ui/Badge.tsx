import React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { useThemeStore } from '@/shared/stores/themeStore';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'muted';

export interface BadgeProps extends ViewProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'md',
  className = '',
  style,
  ...props
}) => {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          containerStyle: {
            backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.15)',
            borderColor: isPink ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 255, 255, 0.3)',
            borderWidth: 1,
          },
          textColor: isPink ? '#FF007F' : '#FFFFFF',
        };
      case 'success':
        return {
          containerStyle: {
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderColor: 'rgba(16, 185, 129, 0.4)',
            borderWidth: 1,
          },
          textColor: '#10B981',
        };
      case 'danger':
        return {
          containerStyle: {
            backgroundColor: 'rgba(255, 23, 68, 0.15)',
            borderColor: 'rgba(255, 23, 68, 0.4)',
            borderWidth: 1,
          },
          textColor: '#FF1744',
        };
      case 'warning':
        return {
          containerStyle: {
            backgroundColor: 'rgba(255, 179, 0, 0.15)',
            borderColor: 'rgba(255, 179, 0, 0.4)',
            borderWidth: 1,
          },
          textColor: '#FFB300',
        };
      case 'muted':
        return {
          containerStyle: {
            backgroundColor: '#09090C',
            borderColor: isPink ? '#261426' : '#272727',
            borderWidth: 1,
          },
          textColor: '#A1A1AA',
        };
      case 'default':
      default:
        return {
          containerStyle: {
            backgroundColor: '#18181B',
            borderColor: '#27272A',
            borderWidth: 1,
          },
          textColor: '#FFFFFF',
        };
    }
  };

  const currentStyles = getStyles();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <View
      style={[currentStyles.containerStyle, style]}
      className={`self-start rounded-full items-center justify-center ${sizeClasses} ${className}`}
      {...props}
    >
      <Text
        style={{ color: currentStyles.textColor }}
        className="font-bold"
      >
        {label}
      </Text>
    </View>
  );
};

export interface StatusBadgeProps extends ViewProps {
  status: 'active' | 'pending' | 'error' | 'success';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
  ...props
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
      case 'success':
        return { dot: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
      case 'error':
        return { dot: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
      case 'pending':
      default:
        return { dot: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    }
  };

  const config = getStatusColor();

  return (
    <View
      className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bg} ${className}`}
      {...props}
    >
      <View className={`w-2 h-2 rounded-full ${config.dot}`} />
      <Text className={`text-xs font-semibold ${config.text}`}>{label}</Text>
    </View>
  );
};
