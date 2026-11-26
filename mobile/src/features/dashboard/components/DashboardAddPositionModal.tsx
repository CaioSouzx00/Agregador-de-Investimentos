import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Wallet } from 'lucide-react-native';
import { BottomSheet } from '@/shared/components/ui/BottomSheet';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { associateStockSchema, AssociateStockFormData } from '@/features/accounts/schemas/accountSchemas';
import { useStocksData } from '@/features/stocks/hooks/useStocksData';
import { AccountValuationResponse } from '@/shared/types/api';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export interface DashboardAddPositionModalProps {
  visible: boolean;
  onClose: () => void;
  accounts: AccountValuationResponse[];
  onConfirm: (accountId: string, stockId: string, quantity: number) => void;
  isLoading?: boolean;
  initialTicker?: string;
}

export const DashboardAddPositionModal: React.FC<DashboardAddPositionModalProps> = ({
  visible,
  onClose,
  accounts,
  onConfirm,
  isLoading = false,
  initialTicker = '',
}) => {
  const { stocks } = useStocksData();
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.accountId || ''
  );
  const [tickerSearch, setTickerSearch] = useState(initialTicker);
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AssociateStockFormData>({
    resolver: zodResolver(associateStockSchema),
    defaultValues: {
      stockId: initialTicker || '',
      quantity: 10,
    },
  });

  useEffect(() => {
    if (initialTicker) {
      setValue('stockId', initialTicker, { shouldValidate: true });
      setTickerSearch(initialTicker);
    }
  }, [initialTicker, setValue]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].accountId);
    }
  }, [accounts, selectedAccountId]);

  const onSubmit = (data: AssociateStockFormData) => {
    const targetAccId = selectedAccountId || accounts[0]?.accountId;
    if (!targetAccId) return;

    onConfirm(targetAccId, data.stockId.trim().toUpperCase(), Number(data.quantity));
    reset();
    onClose();
  };

  const handleSelectStock = (ticker: string) => {
    haptic.selection();
    setValue('stockId', ticker, { shouldValidate: true });
    setTickerSearch(ticker);
  };

  const filteredStocks = stocks.filter(
    (s) =>
      s.stockId.toLowerCase().includes(tickerSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(tickerSearch.toLowerCase())
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Novo Aporte em Ativos"
      subtitle="Vincule ações e cotas à sua carteira"
    >
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[520px]">
        {/* Account Selector */}
        {accounts.length > 1 && (
          <View className="mb-4">
            <Text className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Selecione a Corretora / Conta de Destino:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {accounts.map((acc) => {
                const isSelected = selectedAccountId === acc.accountId;
                return (
                  <TouchableOpacity
                    key={acc.accountId}
                    onPress={() => {
                      haptic.selection();
                      setSelectedAccountId(acc.accountId);
                    }}
                    style={{
                      backgroundColor: isSelected
                        ? isPink
                          ? '#FF007F'
                          : '#FFFFFF'
                        : '#141418',
                      borderColor: isSelected ? 'transparent' : '#272727',
                      borderWidth: 1,
                    }}
                    className="px-3 py-2 rounded-xl flex-row items-center gap-1.5"
                  >
                    <Wallet size={13} color={isSelected ? (isPink ? '#FFFFFF' : '#000000') : '#A1A1AA'} />
                    <Text
                      style={{
                        color: isSelected ? (isPink ? '#FFFFFF' : '#000000') : '#FFFFFF',
                      }}
                      className="text-xs font-black capitalize"
                    >
                      {acc.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Ticker Input */}
        <Controller
          control={control}
          name="stockId"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Código do Ativo (ex: PETR4, VALE3, WEGE3)"
              placeholder="Digite o ticker"
              value={value}
              onChangeText={(text) => {
                const upper = text.toUpperCase();
                onChange(upper);
                setTickerSearch(upper);
              }}
              autoCapitalize="characters"
              error={errors.stockId?.message}
              containerClassName="mb-3"
            />
          )}
        />

        {/* Quick select from catalog if matches */}
        {filteredStocks.length > 0 && tickerSearch.length > 0 && (
          <View
            style={{
              backgroundColor: '#09090C',
              borderColor: isPink ? '#261426' : '#222222',
              borderWidth: 1,
            }}
            className="mb-4 p-3 rounded-2xl"
          >
            <Text
              style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
              className="text-[11px] font-bold uppercase tracking-wider mb-2"
            >
              Ativos Disponíveis no Catálogo:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {filteredStocks.slice(0, 6).map((stock) => (
                <TouchableOpacity
                  key={stock.stockId}
                  onPress={() => handleSelectStock(stock.stockId)}
                  style={{
                    backgroundColor: '#141418',
                    borderColor: isPink ? '#2E152E' : '#2C2C2C',
                    borderWidth: 1,
                  }}
                  className="px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 active:opacity-80"
                >
                  <Text
                    style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
                    className="text-xs font-black"
                  >
                    {stock.stockId}
                  </Text>
                  <Text className="text-[10px] text-zinc-400" numberOfLines={1}>
                    {stock.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity Input */}
        <Controller
          control={control}
          name="quantity"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Quantidade de Ações / Cotas"
              placeholder="100"
              keyboardType="number-pad"
              value={value ? String(value) : ''}
              onChangeText={onChange}
              error={errors.quantity?.message}
              containerClassName="mb-3"
            />
          )}
        />

        {/* Quick Quantity Chips */}
        <View className="flex-row items-center gap-2 mb-6">
          <Text className="text-xs text-zinc-400">Atalhos:</Text>
          {[10, 50, 100, 500].map((qty) => (
            <TouchableOpacity
              key={qty}
              onPress={() => {
                haptic.selection();
                setValue('quantity', qty, { shouldValidate: true });
              }}
              style={{
                backgroundColor: '#09090C',
                borderColor: isPink ? '#261426' : '#222222',
                borderWidth: 1,
              }}
              className="px-3.5 py-1.5 rounded-xl active:bg-zinc-900"
            >
              <Text className="text-xs font-extrabold text-white">+{qty}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <Button
          variant="primary"
          size="lg"
          leftIcon={<PlusCircle size={18} color={isPink ? '#FFFFFF' : '#000000'} />}
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
          className="w-full mb-2"
        >
          Confirmar e Adicionar à Carteira
        </Button>
      </ScrollView>
    </BottomSheet>
  );
};
