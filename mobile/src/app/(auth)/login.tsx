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
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle';
import { loginSchema, LoginFormData } from '@/features/auth/schemas/authSchemas';
import { useLoginMutation } from '@/features/auth/hooks/useAuthMutations';
import { useThemeStore } from '@/shared/stores/themeStore';
import { haptic } from '@/shared/utils/haptics';

export default function LoginScreen() {
  const loginMutation = useLoginMutation();
  const { mode, colors } = useThemeStore();
  const isPink = mode === 'pink';

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

          {/* Logo & Header */}
          <View className="items-center mb-8">
            <View
              style={{
                backgroundColor: isPink ? 'rgba(255, 0, 127, 0.15)' : 'rgba(255, 255, 255, 0.12)',
                borderColor: isPink ? 'rgba(255, 0, 127, 0.4)' : 'rgba(255, 255, 255, 0.3)',
                shadowColor: isPink ? '#FF007F' : '#FFFFFF',
                shadowOpacity: 0.45,
                shadowRadius: 16,
              }}
              className="w-18 h-18 rounded-3xl border items-center justify-center mb-4 p-4"
            >
              <TrendingUp size={36} color={isPink ? '#FF007F' : '#FFFFFF'} />
            </View>
            <Text className="text-3xl font-black text-white tracking-tight text-center">
              Agregador de Investimentos
            </Text>
            <Text className="text-sm text-zinc-400 mt-1.5 text-center">
              Consolide sua carteira com alta performance
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
                  leftIcon={<User size={18} color="#71717A" />}
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
                  leftIcon={<Lock size={18} color="#71717A" />}
                  containerClassName="mb-6"
                />
              )}
            />

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              isLoading={loginMutation.isPending}
              leftIcon={<LogIn size={18} color={isPink ? '#FFFFFF' : '#000000'} />}
              onPress={handleSubmit(onSubmit)}
              className="w-full"
            >
              Entrar na Conta
            </Button>

            <Divider label="novo por aqui?" className="my-6" />

            {/* Register Link */}
            <View className="flex-row items-center justify-center gap-1.5">
              <Text className="text-xs text-zinc-400">
                Não tem uma conta cadastrada?
              </Text>
              <Link
                href="/(auth)/register"
                asChild
                onPress={() => haptic.light()}
              >
                <TouchableOpacity>
                  <Text
                    style={{ color: isPink ? '#FF007F' : '#FFFFFF' }}
                    className="text-xs font-bold"
                  >
                    Criar conta grátis
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </DismissibleWrapper>
    </KeyboardAvoidingView>
  );
}
