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
import { TrendingUp, User, Lock, LogIn } from 'lucide-react-native';
import { Input, PasswordInput } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Divider } from '@/shared/components/ui/Divider';
import { loginSchema, LoginFormData } from '@/features/auth/schemas/authSchemas';
import { useLoginMutation } from '@/features/auth/hooks/useAuthMutations';
import { haptic } from '@/shared/utils/haptics';

export default function LoginScreen() {
  const loginMutation = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
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
          {/* Logo & Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <TrendingUp size={32} color="#3B82F6" />
            </View>
            <Text className="text-2xl font-bold text-foreground tracking-tight text-center">
              Agregador de Investimentos
            </Text>
            <Text className="text-sm text-muted-foreground mt-1.5 text-center">
              Acesse sua carteira e acompanhe seu patrimônio
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-card border border-border p-6 rounded-3xl shadow-xl shadow-black/40">
            {/* Username / Email */}
            <Controller
              control={control}
              name="usernameOrEmail"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Usuário ou E-mail"
                  placeholder="Seu usuário ou e-mail cadastrado"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.usernameOrEmail?.message}
                  leftIcon={<User size={18} color="#64748B" />}
                  containerClassName="mb-4"
                />
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <PasswordInput
                  label="Senha"
                  placeholder="Sua senha de acesso"
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
              isLoading={loginMutation.isPending}
              leftIcon={<LogIn size={18} color="#FFFFFF" />}
              onPress={handleSubmit(onSubmit)}
              className="w-full"
            >
              Entrar na Conta
            </Button>

            <Divider label="novo por aqui?" className="my-6" />

            {/* Register Link */}
            <View className="flex-row items-center justify-center gap-1.5">
              <Text className="text-xs text-muted-foreground">
                Não tem uma conta cadastrada?
              </Text>
              <Link
                href="/(auth)/register"
                asChild
                onPress={() => haptic.light()}
              >
                <TouchableOpacity>
                  <Text className="text-xs font-bold text-primary">
                    Criar conta grátis
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
