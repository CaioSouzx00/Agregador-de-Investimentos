import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle, Search } from 'lucide-react-native';
import { BottomSheet } from '@/shared/components/ui/BottomSheet';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { associateStockSchema, AssociateStockFormData } from '../schemas/accountSchemas';
import { useStocksData } from '@/features/stocks/hooks/useStocksData';
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
      subtitle="Vincule ações e ativos mantidos nesta corretora"
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
          <View className="mb-4 bg-card-hover/40 border border-border p-2.5 rounded-xl">
            <Text className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Ativos Encontrados no Catálogo:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {filteredStocks.slice(0, 5).map((stock) => (
                <TouchableOpacity
                  key={stock.stockId}
                  onPress={() => handleSelectStock(stock.stockId)}
                  className="px-3 py-1.5 rounded-lg bg-card border border-border flex-row items-center gap-1.5 active:bg-primary/20"
                >
                  <Text className="text-xs font-bold text-primary">{stock.stockId}</Text>
                  <Text className="text-[10px] text-muted-foreground" numberOfLines={1}>
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
          <Text className="text-xs text-muted-foreground">Atalhos:</Text>
          {[10, 50, 100, 500].map((qty) => (
            <TouchableOpacity
              key={qty}
              onPress={() => {
                haptic.selection();
                setValue('quantity', qty, { shouldValidate: true });
              }}
              className="px-3 py-1 rounded-lg bg-card border border-border active:bg-card-hover"
            >
              <Text className="text-xs font-semibold text-foreground">+{qty}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Button */}
        <Button
          variant="primary"
          size="lg"
          leftIcon={<PlusCircle size={18} color="#FFFFFF" />}
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
