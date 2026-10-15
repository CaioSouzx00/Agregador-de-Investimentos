import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, Wallet, Layers, TrendingUp, RefreshCw } from 'lucide-react-native';
import { CurrencyText } from '@/shared/components/ui/CurrencyText';
import { Card } from '@/shared/components/ui/Card';
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

  const toggleVisibility = () => {
    haptic.selection();
    setShowValues((prev) => !prev);
  };

  return (
    <View className="w-full gap-4">
      {/* Main Net Worth Hero */}
      <View className="bg-gradient-to-b from-card to-card/70 border border-border p-5 rounded-3xl shadow-xl shadow-black/40">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Patrimônio Total
            </Text>
            <TouchableOpacity
              onPress={toggleVisibility}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel={showValues ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {showValues ? (
                <Eye size={16} color="#64748B" />
              ) : (
                <EyeOff size={16} color="#64748B" />
              )}
            </TouchableOpacity>
          </View>

          {onRefresh && (
            <TouchableOpacity
              onPress={onRefresh}
              disabled={isLoading}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="w-8 h-8 rounded-full bg-border/40 items-center justify-center active:bg-border"
            >
              <RefreshCw size={14} color="#94A3B8" />
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

        <View className="flex-row items-center gap-1.5 mt-2">
          <View className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <Text className="text-xs text-muted-foreground font-medium">
            Preços atualizados em tempo real via B3
          </Text>
        </View>
      </View>

      {/* Metric Cards Row */}
      <View className="flex-row gap-3">
        {/* Contas */}
        <Card className="flex-1 p-3.5 bg-card/80 border-border">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-medium text-muted-foreground">Contas</Text>
            <View className="w-6 h-6 rounded-lg bg-primary/10 items-center justify-center">
              <Wallet size={13} color="#3B82F6" />
            </View>
          </View>
          <Text className="text-lg font-bold text-foreground">{totalAccounts}</Text>
          <Text className="text-[11px] text-muted-foreground mt-0.5">
            {totalAccounts === 1 ? '1 cadastrada' : `${totalAccounts} cadastradas`}
          </Text>
        </Card>

        {/* Ativos / Posições */}
        <Card className="flex-1 p-3.5 bg-card/80 border-border">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-medium text-muted-foreground">Posições</Text>
            <View className="w-6 h-6 rounded-lg bg-success/10 items-center justify-center">
              <Layers size={13} color="#10B981" />
            </View>
          </View>
          <Text className="text-lg font-bold text-foreground">{totalPositions}</Text>
          <Text className="text-[11px] text-muted-foreground mt-0.5">
            {totalPositions === 1 ? '1 ativo mantido' : `${totalPositions} ativos mantidos`}
          </Text>
        </Card>

        {/* Alocação */}
        <Card className="flex-1 p-3.5 bg-card/80 border-border">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-medium text-muted-foreground">Alocação</Text>
            <View className="w-6 h-6 rounded-lg bg-warning/10 items-center justify-center">
              <TrendingUp size={13} color="#F59E0B" />
            </View>
          </View>
          <Text className="text-lg font-bold text-foreground">100%</Text>
          <Text className="text-[11px] text-muted-foreground mt-0.5">Renda Variável</Text>
        </Card>
      </View>
    </View>
  );
};
