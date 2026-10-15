import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Eye, EyeOff, Search, X } from 'lucide-react-native';
import { haptic } from '@/shared/utils/haptics';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName = '',
      className = '',
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View className={`w-full ${containerClassName}`}>
        {label && (
          <Text className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">
            {label}
          </Text>
        )}

        <View
          className={`flex-row items-center w-full px-3.5 py-3 rounded-xl bg-card border ${
            error
              ? 'border-danger'
              : isFocused
              ? 'border-primary ring-1 ring-primary'
              : 'border-border'
          }`}
        >
          {leftIcon && <View className="mr-2.5 items-center justify-center">{leftIcon}</View>}

          <TextInput
            ref={ref}
            placeholderTextColor="#64748B"
            className={`flex-1 text-foreground text-sm font-normal py-0 ${className}`}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...rest}
          />

          {rightIcon && <View className="ml-2.5 items-center justify-center">{rightIcon}</View>}
        </View>

        {error ? (
          <Text className="text-xs text-danger mt-1.5 ml-1 font-medium">{error}</Text>
        ) : helperText ? (
          <Text className="text-xs text-muted-foreground mt-1.5 ml-1">{helperText}</Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

export interface PasswordInputProps extends Omit<InputProps, 'rightIcon' | 'secureTextEntry'> {}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    haptic.selection();
    setShowPassword((prev) => !prev);
  };

  return (
    <Input
      ref={ref}
      secureTextEntry={!showPassword}
      autoCapitalize="none"
      autoCorrect={false}
      rightIcon={
        <TouchableOpacity
          onPress={toggleShowPassword}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel={showPassword ? 'Ocultar senha' : 'Ver senha'}
          accessibilityRole="button"
        >
          {showPassword ? (
            <EyeOff size={18} color="#94A3B8" />
          ) : (
            <Eye size={18} color="#94A3B8" />
          )}
        </TouchableOpacity>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

export interface SearchInputProps extends InputProps {
  onClear?: () => void;
}

export const SearchInput = forwardRef<TextInput, SearchInputProps>(
  ({ value, onChangeText, onClear, ...props }, ref) => {
    const handleClear = () => {
      haptic.light();
      onChangeText?.('');
      onClear?.();
    };

    return (
      <Input
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar..."
        leftIcon={<Search size={18} color="#64748B" />}
        rightIcon={
          value && value.length > 0 ? (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Limpar busca"
              accessibilityRole="button"
            >
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
