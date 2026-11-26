import { z } from 'zod';

export const createAccountSchema = z.object({
  description: z
    .string({ required_error: 'Informe a descrição ou corretora' })
    .min(2, 'A descrição deve ter no mínimo 2 caracteres')
    .max(100, 'A descrição deve ter no máximo 100 caracteres'),
  street: z
    .string({ required_error: 'Informe a rua ou logradouro' })
    .min(3, 'O endereço deve ter no mínimo 3 caracteres'),
  number: z
    .coerce
    .number({ required_error: 'Informe o número', invalid_type_error: 'Número inválido' })
    .int('Deve ser um número inteiro')
    .positive('O número deve ser maior que zero'),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;

export const associateStockSchema = z.object({
  stockId: z
    .string({ required_error: 'Selecione ou digite o ticker da ação' })
    .min(3, 'O ticker deve ter pelo menos 3 caracteres')
    .max(10, 'O ticker deve ter no máximo 10 caracteres')
    .transform((val) => val.trim().toUpperCase()),
  quantity: z
    .coerce
    .number({ required_error: 'Informe a quantidade', invalid_type_error: 'Quantidade inválida' })
    .int('A quantidade deve ser um número inteiro')
    .positive('A quantidade deve ser maior que zero'),
});

export type AssociateStockFormData = z.infer<typeof associateStockSchema>;
