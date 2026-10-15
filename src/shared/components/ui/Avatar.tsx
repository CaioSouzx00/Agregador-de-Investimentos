import React from 'react';
import { View, Text, ViewProps } from 'react-native';

export interface AvatarProps extends ViewProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineDot?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  showOnlineDot = false,
  className = '',
  ...props
}) => {
  const getInitials = (str: string): string => {
    if (!str) return '?';
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'w-8 h-8 rounded-full', text: 'text-xs', dot: 'w-2 h-2' };
      case 'lg':
        return { container: 'w-12 h-12 rounded-2xl', text: 'text-base', dot: 'w-3 h-3' };
      case 'xl':
        return { container: 'w-16 h-16 rounded-2xl', text: 'text-xl', dot: 'w-3.5 h-3.5' };
      case 'md':
      default:
        return { container: 'w-10 h-10 rounded-xl', text: 'text-sm', dot: 'w-2.5 h-2.5' };
    }
  };

  const sizeClasses = getSizeClasses();
  const initials = getInitials(name);

  return (
    <View className="relative">
      <View
        className={`${sizeClasses.container} bg-primary/20 border border-primary/30 items-center justify-center ${className}`}
        {...props}
      >
        <Text className={`font-bold text-primary ${sizeClasses.text}`}>
          {initials}
        </Text>
      </View>
      {showOnlineDot && (
        <View
          className={`absolute bottom-0 right-0 ${sizeClasses.dot} rounded-full bg-success ring-2 ring-background`}
        />
      )}
    </View>
  );
};
