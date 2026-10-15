import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, User, Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { Input, PasswordInput } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Divider } from '@/shared/components/ui/Divider';
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { registerSchema, RegisterFormData } from '@/features/auth/schemas/authSchemas';
import { useRegisterMutation } from '@/features/auth/hooks/useAuthMutations';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export default function RegisterScreen() {
  const registerMutation = useRegisterMutation();
  const { mode } = useThemeStore();
  const isPink = mode === 'pink';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-black"
    >
      <DismissibleWrapper>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="p-6 bg-black"
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar with Theme Toggle */}
          <View className="flex-row justify-end mb-4">
            <ThemeToggle />
          </View>

          {/* Header */}
          <View className="items-center mb-6">
            <View
              style={{
                backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
                borderColor: isPink ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 255, 255, 0.3)',
                shadowColor: isPink ? '#FF007F' : '#FFFFFF',
                shadowOpacity: 0.45,
                shadowRadius: 16,
              }}
              className="w-18 h-18 rounded-3xl border items-center justify-center mb-3 p-4"
            >
              <UserPlus size={36} color={isPink ? '#FF007F' : '#FFFFFF'} />
            </View>
            <Text className="text-3xl font-black text-white tracking-tight text-center">
              Criar Nova Conta
            </Text>
            <Text className="text-sm text-zinc-400 mt-1 text-center">
              Consolide todos os seus ativos em um único lugar
            </Text>
          </View>

          {/* Form Card */}
          <View
            style={{
              backgroundColor: '#09090C',
              borderColor: isPink ? '#261426' : '#272727',
              borderWidth: 1,
              shadowColor: isPink ? '#FF007F' : '#000000',
              shadowOpacity: isPink ? 0.25 : 0.4,
              shadowRadius: 24,
            }}
            className="p-6 rounded-3xl"
          >
            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome de Usuário"
                  placeholder="Ex: caio_silva"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.username?.message}
                  leftIcon={<User size={18} color="#71717A" />}
                  containerClassName="mb-3.5"
                />
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-mail"
                  placeholder="seuemail@exemplo.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  leftIcon={<Mail size={18} color="#71717A" />}
                  containerClassName="mb-3.5"
                />
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Senha de Acesso"
                  placeholder="No mínimo 6 caracteres"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  leftIcon={<Lock size={18} color="#71717A" />}
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              isLoading={registerMutation.isPending}
              leftIcon={<UserPlus size={18} color={isPink ? '#FFFFFF' : '#000000'} />}
              onPress={handleSubmit(onSubmit)}
              className="w-full"
            >
              Criar Minha Conta
            </Button>

            <Divider label="já é cadastrado?" className="my-5" />

            {/* Back to Login */}
            <Link href="/(auth)/login" asChild onPress={() => haptic.light()}>
              <TouchableOpacity className="flex-row items-center justify-center gap-2 py-1">
                <ArrowLeft size={16} color="#A1A1AA" />
                <Text className="text-xs font-semibold text-zinc-400 hover:text-white">
                  Voltar para tela de login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </DismissibleWrapper>
    </KeyboardAvoidingView>
  );
}
