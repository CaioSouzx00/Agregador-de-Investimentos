import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { haptic } from '@/shared/utils/haptics';
import { useThemeStore } from '@/shared/stores/themeStore';

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
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const handleBack = () => {
    haptic.light();
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#000000',
        borderBottomColor: isPink ? '#261426' : '#222222',
        borderBottomWidth: 1,
      }}
      className={`w-full flex-row items-center justify-between py-3.5 px-4 ${className}`}
    >
      <View className="flex-row items-center flex-1 pr-2">
        {showBackButton && (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={handleBack}
            style={{
              backgroundColor: '#09090C',
              borderColor: isPink ? '#261426' : '#272727',
              borderWidth: 1,
            }}
            className="w-10 h-10 rounded-xl items-center justify-center mr-3 active:bg-zinc-900"
          >
            <ChevronLeft size={20} color={isPink ? '#FF007F' : '#FFFFFF'} />
          </TouchableOpacity>
        )}

        <View className="flex-1">
          <Text className="text-xl font-black text-white tracking-tight" numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-xs text-zinc-400 mt-0.5" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {rightAction && <View className="items-center justify-center ml-2">{rightAction}</View>}
    </View>
  );
};
