import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, Wallet, Layers, TrendingUp, RefreshCw } from 'lucide-react-native';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { Card } from '@/shared/components/ui/Card';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export interface ValuationHeaderProps {
  totalNetWorth: number;
  totalAccounts: number;
  totalPositions: number;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const ValuationHeader: React.FC<ValuationHeaderProps> = ({
  totalNetWorth,
  totalAccounts,
  totalPositions,
  isLoading = false,
  onRefresh,
}) => {
  const [showValues, setShowValues] = useState(true);
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const toggleVisibility = () => {
    haptic.selection();
    setShowValues((prev) => !prev);
  };

  return (
    <View className="w-full gap-4">
      {/* Main Net Worth Hero */}
      <View
        style={{
          backgroundColor: '#09090C',
          borderColor: isPink ? '#2E152E' : '#272727',
          borderWidth: 1.5,
          shadowColor: isPink ? '#FF007F' : '#FFFFFF',
          shadowOpacity: isPink ? 0.3 : 0.15,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 6 },
        }}
        className="p-5 rounded-3xl"
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Text
              style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              Patrimônio Total
            </Text>
            <TouchableOpacity
              onPress={toggleVisibility}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={showValues ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {showValues ? (
                <Eye size={16} color="#A1A1AA" />
              ) : (
                <EyeOff size={16} color="#A1A1AA" />
              )}
            </TouchableOpacity>
          </View>

          {onRefresh && (
            <TouchableOpacity
              onPress={onRefresh}
              disabled={isLoading}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                backgroundColor: isPink ? 'rgba(255, 0, 127, 0.12)' : 'rgba(255, 255, 255, 0.1)',
                borderColor: isPink ? 'rgba(255, 0, 127, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
              }}
              className="w-8 h-8 rounded-full items-center justify-center"
            >
              <RefreshCw size={14} color={isPink ? '#FF007F' : '#FFFFFF'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Big Balance */}
        <View className="my-2">
          <CurrencyText
            value={totalNetWorth}
            size="3xl"
            privacyMask={!showValues}
            color="default"
          />
        </View>

        <View className="flex-row items-center gap-2 mt-2 pt-3 border-t border-zinc-900">
          <View
            style={{ backgroundColor: isPink ? '#FF007F' : '#FFFFFF' }}
            className="w-2 h-2 rounded-full"
          />
          <Text className="text-xs text-zinc-400 font-medium">
            Preços atualizados em tempo real via B3
          </Text>
        </View>
      </View>

      {/* Metric Cards Row */}
      <View className="flex-row gap-3">
        {/* Contas */}
        <Card
          style={{
            backgroundColor: '#09090C',
            borderColor: isPink ? '#261426' : '#222222',
            borderWidth: 1,
          }}
          className="flex-1 p-3.5"
        >
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-semibold text-zinc-400">Contas</Text>
            <View
              style={{
                backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
              }}
              className="w-6 h-6 rounded-lg items-center justify-center"
            >
              <Wallet size={13} color={isPink ? '#FF007F' : '#FFFFFF'} />
            </View>
          </View>
          <Text className="text-xl font-black text-white">{totalAccounts}</Text>
          <Text className="text-[11px] text-zinc-500 mt-0.5">
            {totalAccounts === 1 ? '1 cadastrada' : `${totalAccounts} cadastradas`}
          </Text>
        </Card>

        {/* Ativos / Posições */}
        <Card
          style={{
            backgroundColor: '#09090C',
            borderColor: isPink ? '#261426' : '#222222',
            borderWidth: 1,
          }}
          className="flex-1 p-3.5"
        >
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-semibold text-zinc-400">Posições</Text>
            <View
              style={{
                backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
              }}
              className="w-6 h-6 rounded-lg items-center justify-center"
            >
              <Layers size={13} color={isPink ? '#FF007F' : '#FFFFFF'} />
            </View>
          </View>
          <Text className="text-xl font-black text-white">{totalPositions}</Text>
          <Text className="text-[11px] text-zinc-500 mt-0.5">
            {totalPositions === 1 ? '1 ativo' : `${totalPositions} ativos`}
          </Text>
        </Card>

        {/* Alocação */}
        <Card
          style={{
            backgroundColor: '#09090C',
            borderColor: isPink ? '#261426' : '#222222',
            borderWidth: 1,
          }}
          className="flex-1 p-3.5"
        >
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-semibold text-zinc-400">Alocação</Text>
            <View
              style={{
                backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
              }}
              className="w-6 h-6 rounded-lg items-center justify-center"
            >
              <TrendingUp size={13} color={isPink ? '#FF007F' : '#FFFFFF'} />
            </View>
          </View>
          <Text className="text-xl font-black text-white">100%</Text>
          <Text className="text-[11px] text-zinc-500 mt-0.5">Ações / B3</Text>
        </Card>
      </View>
    </View>
  );
};
