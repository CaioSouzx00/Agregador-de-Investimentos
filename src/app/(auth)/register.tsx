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
import { registerSchema, RegisterFormData } from '@/features/auth/schemas/authSchemas';
import { useRegisterMutation } from '@/features/auth/hooks/useAuthMutations';
import { haptic } from '@/shared/utils/haptics';

export default function RegisterScreen() {
  const registerMutation = useRegisterMutation();

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="p-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="items-center mb-6">
            <View className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 items-center justify-center mb-3 shadow-lg shadow-primary/30">
              <UserPlus size={32} color="#3B82F6" />
            </View>
            <Text className="text-2xl font-bold text-foreground tracking-tight text-center">
              Criar Nova Conta
            </Text>
            <Text className="text-sm text-muted-foreground mt-1 text-center">
              Consolide todos os seus ativos em um único lugar
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-card border border-border p-6 rounded-3xl shadow-xl shadow-black/40">
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
                  leftIcon={<User size={18} color="#64748B" />}
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
                  leftIcon={<Mail size={18} color="#64748B" />}
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
                  leftIcon={<Lock size={18} color="#64748B" />}
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              isLoading={registerMutation.isPending}
              leftIcon={<UserPlus size={18} color="#FFFFFF" />}
              onPress={handleSubmit(onSubmit)}
              className="w-full"
            >
              Criar Minha Conta
            </Button>

            <Divider label="já é cadastrado?" className="my-5" />

            {/* Back to Login */}
            <Link href="/(auth)/login" asChild onPress={() => haptic.light()}>
              <TouchableOpacity className="flex-row items-center justify-center gap-2 py-1">
                <ArrowLeft size={16} color="#94A3B8" />
                <Text className="text-xs font-semibold text-muted hover:text-foreground">
                  Voltar para tela de login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
