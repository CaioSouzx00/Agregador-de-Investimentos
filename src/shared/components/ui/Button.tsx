import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { haptic } from '@/shared/utils/haptics';

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
  ...rest
}) => {
  const handlePress = (e: any) => {
    if (isLoading || disabled) return;
    if (enableHaptic) {
      haptic.light();
    }
    onPress?.(e);
  };

  const getVariantClasses = (): { container: string; text: string; spinner: string } => {
    switch (variant) {
      case 'secondary':
        return {
          container: 'bg-card border border-border active:bg-card-hover',
          text: 'text-foreground font-semibold',
          spinner: '#F8FAFC',
        };
      case 'outline':
        return {
          container: 'bg-transparent border border-border active:bg-card-hover',
          text: 'text-foreground font-semibold',
          spinner: '#F8FAFC',
        };
      case 'ghost':
        return {
          container: 'bg-transparent active:bg-card',
          text: 'text-muted hover:text-foreground font-medium',
          spinner: '#94A3B8',
        };
      case 'danger':
        return {
          container: 'bg-danger active:opacity-90 shadow-sm shadow-danger/20',
          text: 'text-white font-semibold',
          spinner: '#FFFFFF',
        };
      case 'primary':
      default:
        return {
          container: 'bg-primary active:opacity-90 shadow-md shadow-primary/25',
          text: 'text-white font-semibold',
          spinner: '#FFFFFF',
        };
    }
  };

  const getSizeClasses = (): { container: string; text: string } => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-3 py-2 rounded-lg gap-1.5',
          text: 'text-xs',
        };
      case 'lg':
        return {
          container: 'px-6 py-4 rounded-xl gap-2.5',
          text: 'text-base',
        };
      case 'md':
      default:
        return {
          container: 'px-4 py-3 rounded-xl gap-2',
          text: 'text-sm',
        };
    }
  };

  const variantStyles = getVariantClasses();
  const sizeStyles = getSizeClasses();
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      activeOpacity={0.8}
      disabled={isDisabled}
      onPress={handlePress}
      className={`flex-row items-center justify-center ${variantStyles.container} ${sizeStyles.container} ${
        isDisabled ? 'opacity-50' : ''
      } ${className}`}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={variantStyles.spinner} />
      ) : (
        <>
          {leftIcon && <View className="items-center justify-center">{leftIcon}</View>}
          <Text className={`${variantStyles.text} ${sizeStyles.text} text-center`}>
            {children}
          </Text>
          {rightIcon && <View className="items-center justify-center">{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};
