import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(
  date: string | Date | number | null | undefined,
  pattern = "dd 'de' MMMM 'às' HH:mm"
): string {
  if (!date) return '';

  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(parsedDate, pattern, { locale: ptBR });
  } catch {
    return String(date);
  }
}

export function formatShortDate(date: string | Date | number | null | undefined): string {
  return formatDate(date, 'dd/MM/yyyy');
}
