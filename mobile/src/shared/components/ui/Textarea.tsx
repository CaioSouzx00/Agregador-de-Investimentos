import React, { forwardRef } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

export interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<TextInput, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName = '',
      className = '',
      numberOfLines = 4,
      ...rest
    },
    ref
  ) => {
    return (
      <View className={`w-full ${containerClassName}`}>
        {label && (
          <Text className="text-xs font-medium text-muted-foreground mb-1.5 ml-1">
            {label}
          </Text>
        )}

        <View
          className={`w-full px-3.5 py-3 rounded-xl bg-card border ${
            error ? 'border-danger' : 'border-border'
          }`}
        >
          <TextInput
            ref={ref}
            multiline
            numberOfLines={numberOfLines}
            textAlignVertical="top"
            placeholderTextColor="#64748B"
            className={`text-foreground text-sm font-normal min-h-[96px] ${className}`}
            {...rest}
          />
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

Textarea.displayName = 'Textarea';
