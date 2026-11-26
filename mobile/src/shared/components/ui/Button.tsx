import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { haptic } from '@/shared/utils/haptics';
import { useThemeStore } from '@/shared/stores/themeStore';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  enableHaptic?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  enableHaptic = true,
  disabled,
  onPress,
  className = '',
  style,
  ...rest
}) => {
  const { mode, colors } = useThemeStore();
  const isPink = mode === 'pink';

  const handlePress = (e: any) => {
    if (isLoading || disabled) return;
    if (enableHaptic) {
      haptic.light();
    }
    onPress?.(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          containerStyle: {
            backgroundColor: '#09090C',
            borderColor: isPink ? '#261426' : '#272727',
            borderWidth: 1,
          },
          textStyle: 'text-white font-semibold',
          spinner: '#FFFFFF',
        };
      case 'outline':
        return {
          containerStyle: {
            backgroundColor: 'transparent',
            borderColor: isPink ? '#FF007F' : '#FFFFFF',
            borderWidth: 1.5,
          },
          textStyle: isPink ? 'text-[#FF007F] font-bold' : 'text-white font-bold',
          spinner: isPink ? '#FF007F' : '#FFFFFF',
        };
      case 'ghost':
        return {
          containerStyle: {
            backgroundColor: 'transparent',
          },
          textStyle: 'text-muted-foreground hover:text-white font-medium',
          spinner: '#A1A1AA',
        };
      case 'danger':
        return {
          containerStyle: {
            backgroundColor: '#FF1744',
            shadowColor: '#FF1744',
            shadowOpacity: 0.35,
            shadowRadius: 10,
          },
          textStyle: 'text-white font-bold',
          spinner: '#FFFFFF',
        };
      case 'primary':
      default:
        return {
          containerStyle: {
            backgroundColor: isPink ? '#FF007F' : '#FFFFFF',
            shadowColor: isPink ? '#FF007F' : '#FFFFFF',
            shadowOpacity: 0.45,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 4 },
          },
          textStyle: isPink ? 'text-white font-bold tracking-wide' : 'text-black font-extrabold tracking-wide',
          spinner: isPink ? '#FFFFFF' : '#000000',
        };
    }
  };

  const getSizeClasses = (): { container: string; text: string } => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-3.5 py-2 rounded-xl gap-1.5',
          text: 'text-xs',
        };
      case 'lg':
        return {
          container: 'px-6 py-4 rounded-2xl gap-2.5',
          text: 'text-base',
        };
      case 'md':
      default:
        return {
          container: 'px-4.5 py-3.5 rounded-2xl gap-2',
          text: 'text-sm',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeClasses();
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      activeOpacity={0.85}
      disabled={isDisabled}
      onPress={handlePress}
      style={[variantStyles.containerStyle as any, style]}
      className={`flex-row items-center justify-center ${sizeStyles.container} ${
        isDisabled ? 'opacity-40' : ''
      } ${className}`}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variantStyles.spinner} />
      ) : (
        <>
          {leftIcon && <View className="items-center justify-center">{leftIcon}</View>}
          <Text className={`${variantStyles.textStyle} ${sizeStyles.text} text-center`}>
            {children}
          </Text>
          {rightIcon && <View className="items-center justify-center">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
