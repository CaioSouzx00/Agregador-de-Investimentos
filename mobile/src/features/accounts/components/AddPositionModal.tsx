import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react-native';
import { BottomSheet } from '@/shared/components/ui/BottomSheet';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { associateStockSchema, AssociateStockFormData } from '../schemas/accountSchemas';
import { useStocksData } from '@/features/stocks/hooks/useStocksData';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export interface AddPositionModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPosition: (data: { stockId: string; quantity: number }) => void;
  isLoading?: boolean;
}

export const AddPositionModal: React.FC<AddPositionModalProps> = ({
  visible,
  onClose,
  onAddPosition,
  isLoading = false,
}) => {
  const { stocks } = useStocksData();
  const [tickerSearch, setTickerSearch] = useState('');
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
      stockId: '',
      quantity: 10,
    },
  });

  const onSubmit = (data: AssociateStockFormData) => {
    onAddPosition({
      stockId: data.stockId.trim().toUpperCase(),
      quantity: Number(data.quantity),
    });
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
      title="Adicionar Ativo à Conta"
      subtitle="Vincule ações mantidas nesta corretora"
    >
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-[500px]">
        {/* Ticker Input */}
        <Controller
          control={control}
          name="stockId"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Ticker do Ativo (ex: PETR4, VALE3, ITUB4)"
              placeholder="Digite o código do ticker"
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
              Ativos Encontrados no Catálogo:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {filteredStocks.slice(0, 5).map((stock) => (
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
              label="Quantidade de Cotas"
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
          Confirmar Posição
        </Button>
      </ScrollView>
    </BottomSheet>
  );
};
