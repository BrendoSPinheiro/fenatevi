import type { IsoDate } from '@/types/festival';

/**
 * Converte uma data ISO (`YYYY-MM-DD`) em `Date` no fuso UTC.
 *
 * Datas de conteúdo são dias de calendário, não instantes. Interpretá-las em UTC
 * evita que o fuso do servidor ou do navegador desloque o dia exibido — a causa
 * clássica de divergência entre o HTML do servidor e o do cliente.
 */
export function parseIsoDate(value: IsoDate): Date {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Data ISO inválida: "${value}"`);
  }

  return date;
}

/**
 * Formata um dia de calendário para o locale informado.
 *
 * Sempre em UTC, pelo mesmo motivo de `parseIsoDate`.
 */
export function formatFestivalDate(
  value: IsoDate,
  locale: string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' },
): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(
    parseIsoDate(value),
  );
}
