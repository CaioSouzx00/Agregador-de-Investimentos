import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Sparkles, CircleDot } from 'lucide-react-native';
import { useThemeStore } from '@/shared/stores/themeStore';

export interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  compact = false,
  className = '',
}) => {
  const { mode, toggleTheme } = useThemeStore();
  const isPink = mode === 'pink';

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
      className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border ${
        isPink
          ? 'bg-[#FF007F]/15 border-[#FF007F]/40 shadow-sm shadow-[#FF007F]/20'
          : 'bg-white/10 border-white/30 shadow-sm shadow-white/10'
      } ${className}`}
      accessibilityLabel="Alternar entre modo Rosa Forte e modo Preto e Branco"
      accessibilityRole="button"
    >
      <View className="items-center justify-center">
        {isPink ? (
          <Sparkles size={14} color="#FF007F" />
        ) : (
          <CircleDot size={14} color="#FFFFFF" />
        )}
      </View>

      {!compact && (
        <Text
          className={`text-xs font-bold ${
            isPink ? 'text-[#FF007F]' : 'text-white'
          }`}
        >
          {isPink ? 'Rosa Choque' : 'Modo P&B'}
        </Text>
      )}
    </TouchableOpacity>
  );
};
