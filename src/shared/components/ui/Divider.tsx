import React from 'react';
import { View, Text, ViewProps } from 'react-native';

export interface DividerProps extends ViewProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Divider: React.FC<DividerProps> = ({
  label,
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <View
        className={`w-[1px] h-full bg-border ${className}`}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <View className={`flex-row items-center w-full my-4 ${className}`} {...props}>
        <View className="flex-1 h-[1px] bg-border" />
        <Text className="text-xs text-muted-foreground px-3 uppercase tracking-wider font-medium">
          {label}
        </Text>
        <View className="flex-1 h-[1px] bg-border" />
      </View>
    );
  }

  return (
    <View
      className={`w-full h-[1px] bg-border my-2 ${className}`}
      {...props}
    />
  );
};
