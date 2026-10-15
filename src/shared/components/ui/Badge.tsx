import React from 'react';
import { View, Text, ViewProps } from 'react-native';

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
  ...props
}) => {
  const getStyles = (): { bg: string; text: string } => {
    switch (variant) {
      case 'primary':
        return { bg: 'bg-primary/15 border-primary/30', text: 'text-primary' };
      case 'success':
        return { bg: 'bg-success/15 border-success/30', text: 'text-success' };
      case 'danger':
        return { bg: 'bg-danger/15 border-danger/30', text: 'text-danger' };
      case 'warning':
        return { bg: 'bg-warning/15 border-warning/30', text: 'text-warning' };
      case 'muted':
        return { bg: 'bg-card border-border', text: 'text-muted-foreground' };
      case 'default':
      default:
        return { bg: 'bg-border/60 border-border', text: 'text-foreground' };
    }
  };

  const styles = getStyles();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <View
      className={`self-start rounded-full border items-center justify-center ${styles.bg} ${sizeClasses} ${className}`}
      {...props}
    >
      <Text className={`font-semibold ${styles.text}`}>{label}</Text>
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
        return { dot: 'bg-success', text: 'text-success', bg: 'bg-success/10 border-success/20' };
      case 'error':
        return { dot: 'bg-danger', text: 'text-danger', bg: 'bg-danger/10 border-danger/20' };
      case 'pending':
      default:
        return { dot: 'bg-warning', text: 'text-warning', bg: 'bg-warning/10 border-warning/20' };
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
