import React, { useState, forwardRef, useRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  Pressable,
  Platform,
} from 'react-native';
import { Eye, EyeOff, Search, X } from 'lucide-react-native';
import { haptic } from '@/shared/utils/haptics';
import { useThemeStore } from '@/shared/stores/themeStore';

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
      style,
      ...rest
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const innerRef = useRef<TextInput>(null);
    const { mode, colors } = useThemeStore();
    const isPink = mode === 'pink';

    useImperativeHandle(ref, () => innerRef.current as TextInput);

    const handleContainerPress = () => {
      innerRef.current?.focus();
    };

    const getBorderColor = () => {
      if (error) return '#FF1744';
      if (isFocused) return isPink ? '#FF007F' : '#FFFFFF';
      return isPink ? '#261426' : '#272727';
    };

    return (
      <View className={`w-full ${containerClassName}`}>
        {label && (
          <Text className="text-xs font-semibold text-muted-foreground mb-1.5 ml-1">
            {label}
          </Text>
        )}

        <Pressable
          onPress={handleContainerPress}
          style={{
            borderColor: getBorderColor(),
            borderWidth: 1.5,
            backgroundColor: '#09090C',
            shadowColor: isFocused ? (isPink ? '#FF007F' : '#FFFFFF') : 'transparent',
            shadowOpacity: isFocused ? 0.3 : 0,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 0 },
          }}
          className="flex-row items-center w-full px-3.5 py-3 rounded-2xl cursor-text"
        >
          {leftIcon && <View className="mr-2.5 items-center justify-center">{leftIcon}</View>}

          <TextInput
            ref={innerRef}
            placeholderTextColor="#71717A"
            style={[
              Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : undefined,
              style,
            ]}
            className={`flex-1 text-white text-sm font-normal py-1 ${className}`}
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
        </Pressable>

        {error ? (
          <Text className="text-xs text-danger mt-1.5 ml-1 font-semibold">{error}</Text>
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
            <EyeOff size={18} color="#A1A1AA" />
          ) : (
            <Eye size={18} color="#A1A1AA" />
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
        leftIcon={<Search size={18} color="#71717A" />}
        rightIcon={
          value && value.length > 0 ? (
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Limpar busca"
              accessibilityRole="button"
            >
              <X size={16} color="#A1A1AA" />
            </TouchableOpacity>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
