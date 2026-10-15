import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewProps,
  TouchableOpacityProps,
} from 'react-native';
import { haptic } from '@/shared/utils/haptics';

export interface CardProps extends ViewProps {
  onPress?: TouchableOpacityProps['onPress'];
  activeOpacity?: number;
  enableHaptic?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  activeOpacity = 0.85,
  enableHaptic = true,
  className = '',
  ...props
}) => {
  const baseClasses = `bg-card border border-border rounded-2xl p-4 shadow-sm ${className}`;

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={(e) => {
          if (enableHaptic) haptic.light();
          onPress(e);
        }}
        className={`${baseClasses} active:bg-card-hover`}
        {...(props as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={baseClasses} {...props}>
      {children}
    </View>
  );
};

export interface CardHeaderProps extends ViewProps {
  title?: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  rightAction,
  children,
  className = '',
  ...props
}) => {
  return (
    <View className={`flex-row items-center justify-between mb-3 ${className}`} {...props}>
      {children ? (
        children
      ) : (
        <View className="flex-1 pr-2">
          {title && (
            <Text className="text-base font-bold text-foreground tracking-tight">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-xs text-muted-foreground mt-0.5">{subtitle}</Text>
          )}
        </View>
      )}
      {rightAction && <View className="items-center justify-center">{rightAction}</View>}
    </View>
  );
};

export interface CardContentProps extends ViewProps {}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <View className={`w-full ${className}`} {...props}>
      {children}
    </View>
  );
};
