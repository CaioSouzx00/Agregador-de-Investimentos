import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Landmark, MapPin, Hash, Check } from 'lucide-react-native';
import { Header } from '@/shared/components/layout/Header';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import {
  createAccountSchema,
  CreateAccountFormData,
} from '@/features/accounts/schemas/accountSchemas';
import { useCreateAccountMutation } from '@/features/accounts/hooks/useAccountsData';
import { useThemeStore } from '@/shared/stores/themeStore';

export default function CreateAccountScreen() {
  const router = useRouter();
  const createMutation = useCreateAccountMutation();
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      description: '',
      street: '',
      number: undefined,
    },
  });

  const onSubmit = (data: CreateAccountFormData) => {
    createMutation.mutate({
      description: data.description.trim(),
      street: data.street.trim(),
      number: Number(data.number),
    });
  };

  const DismissibleWrapper = ({ children }: { children: React.ReactNode }) => {
    if (Platform.OS === 'web') {
      return <View style={{ flex: 1 }}>{children}</View>;
    }
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>{children}</View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <Header
        title="Nova Conta de Investimento"
        subtitle="Vincule uma corretora com endereço de faturamento"
        showBackButton
        onBackPress={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-black"
      >
        <DismissibleWrapper>
          <ScrollView
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Account Info Card */}
            <View
              style={{
                backgroundColor: '#09090C',
                borderColor: isPink ? '#261426' : '#222222',
                borderWidth: 1,
              }}
              className="p-5 rounded-3xl mb-5"
            >
              <Text className="text-sm font-extrabold text-white mb-1">
                Identificação da Conta
              </Text>
              <Text className="text-xs text-zinc-400 mb-4">
                Informe o nome da instituição ou corretora financeira
              </Text>

              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Nome da Conta / Corretora"
                    placeholder="Ex: XP Investimentos, BTG Pactual, NuInvest"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.description?.message}
                    leftIcon={<Landmark size={18} color="#71717A" />}
                  />
                )}
              />
            </View>

            {/* Billing Address Card */}
            <View
              style={{
                backgroundColor: '#09090C',
                borderColor: isPink ? '#261426' : '#222222',
                borderWidth: 1,
              }}
              className="p-5 rounded-3xl mb-6"
            >
              <Text className="text-sm font-extrabold text-white mb-1">
                Endereço de Cobrança / Faturamento
              </Text>
              <Text className="text-xs text-zinc-400 mb-4">
                Requisito regulatório exigido pela instituição
              </Text>

              <Controller
                control={control}
                name="street"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Logradouro / Rua"
                    placeholder="Ex: Avenida Brigadeiro Faria Lima"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.street?.message}
                    leftIcon={<MapPin size={18} color="#71717A" />}
                    containerClassName="mb-3.5"
                  />
                )}
              />

              <Controller
                control={control}
                name="number"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Número"
                    placeholder="Ex: 3477"
                    keyboardType="number-pad"
                    value={value !== undefined ? String(value) : ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.number?.message}
                    leftIcon={<Hash size={18} color="#71717A" />}
                  />
                )}
              />
            </View>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              isLoading={createMutation.isPending}
              leftIcon={<Check size={18} color={isPink ? '#FFFFFF' : '#000000'} />}
              onPress={handleSubmit(onSubmit)}
              className="w-full"
            >
              Registrar Conta
            </Button>
          </ScrollView>
        </DismissibleWrapper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
