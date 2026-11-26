import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewProps,
  TouchableOpacityProps,
} from 'react-native';
import { haptic } from '@/shared/utils/haptics';
import { useThemeStore } from '@/shared/stores/themeStore';

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
  style,
  ...props
}) => {
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const defaultStyle = {
    backgroundColor: '#09090C',
    borderColor: isPink ? '#261426' : '#222222',
    borderWidth: 1,
    borderRadius: 20,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={(e) => {
          if (enableHaptic) haptic.light();
          onPress(e);
        }}
        style={[defaultStyle, style]}
        className={`p-4 shadow-sm active:bg-zinc-900 ${className}`}
        {...(props as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[defaultStyle, style]} className={`p-4 shadow-sm ${className}`} {...props}>
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
            <Text className="text-base font-extrabold text-white tracking-tight">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-xs text-zinc-400 mt-0.5">{subtitle}</Text>
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
