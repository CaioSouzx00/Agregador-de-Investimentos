import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Wallet, FileText, BarChart2 } from 'lucide-react-native';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export interface QuickActionsBarProps {
  onAddPosition: () => void;
  onOpenExport: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onAddPosition,
  onOpenExport,
}) => {
  const router = useRouter();
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const actions = [
    {
      id: 'add-account',
      label: 'Nova Conta',
      icon: <Wallet size={16} color={isPink ? '#FF007F' : '#FFFFFF'} />,
      onPress: () => {
        haptic.light();
        router.push('/(app)/accounts/create' as any);
      },
    },
    {
      id: 'add-position',
      label: 'Novo Aporte',
      icon: <Plus size={16} color={isPink ? '#FF007F' : '#FFFFFF'} />,
      onPress: () => {
        haptic.light();
        onAddPosition();
      },
    },
    {
      id: 'view-accounts',
      label: 'Minhas Contas',
      icon: <BarChart2 size={16} color={isPink ? '#FF007F' : '#FFFFFF'} />,
      onPress: () => {
        haptic.selection();
        router.push('/(app)/accounts' as any);
      },
    },
    {
      id: 'export-report',
      label: 'Extrato',
      icon: <FileText size={16} color={isPink ? '#FF007F' : '#FFFFFF'} />,
      onPress: () => {
        haptic.selection();
        onOpenExport();
      },
    },
  ];

  return (
    <View className="mb-2">
      <View className="flex-row items-center justify-between gap-2.5">
        {actions.map((act) => (
          <TouchableOpacity
            key={act.id}
            onPress={act.onPress}
            style={{
              backgroundColor: '#09090C',
              borderColor: isPink ? '#261426' : '#222222',
              borderWidth: 1,
            }}
            className="flex-1 py-3 px-2 rounded-2xl items-center justify-center active:bg-zinc-900"
          >
            <View
              style={{
                backgroundColor: isPink ? 'rgba(255, 0, 127, 0.12)' : 'rgba(255, 255, 255, 0.08)',
              }}
              className="w-8 h-8 rounded-xl items-center justify-center mb-1.5"
            >
              {act.icon}
            </View>
            <Text
              style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
              className="text-[11px] font-bold text-center"
              numberOfLines={1}
            >
              {act.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
