import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { haptic } from '@/shared/utils/haptics';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  className = '',
}) => {
  const router = useRouter();

  const handleBack = () => {
    haptic.light();
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className={`w-full flex-row items-center justify-between py-3 px-4 bg-background border-b border-border/40 ${className}`}>
      <View className="flex-row items-center flex-1 pr-2">
        {showBackButton && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={handleBack}
            className="w-10 h-10 rounded-xl bg-card border border-border items-center justify-center mr-3 active:bg-card-hover"
          >
            <ChevronLeft size={20} color="#F8FAFC" />
          </TouchableOpacity>
        )}

        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground tracking-tight" numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightAction && <View className="items-center justify-center ml-2">{rightAction}</View>}
    </View>
  );
};
