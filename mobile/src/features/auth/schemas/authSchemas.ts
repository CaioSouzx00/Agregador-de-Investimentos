import { z } from 'zod';

export const loginSchema = z.object({
  usernameOrEmail: z
    .string({ required_error: 'Informe seu usuário ou e-mail' })
    .min(1, 'Informe seu usuário ou e-mail'),
  password: z
    .string({ required_error: 'Informe sua senha' })
    .min(6, 'A senha deve conter no mínimo 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z
    .string({ required_error: 'Informe um nome de usuário' })
    .min(3, 'O usuário deve ter pelo menos 3 caracteres')
    .max(50, 'O usuário deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'O usuário deve conter apenas letras, números e sublinhados'),
  email: z
    .string({ required_error: 'Informe um e-mail válido' })
    .email('Formato de e-mail inválido'),
  password: z
    .string({ required_error: 'Crie uma senha segura' })
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .max(100, 'A senha deve ter no máximo 100 caracteres'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
