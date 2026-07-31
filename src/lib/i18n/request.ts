import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

/**
 * Configuração por requisição consumida pelo plugin do next-intl
 * (registrada em `next.config.ts`).
 *
 * O locale recebido vem da URL e é sempre validado antes do uso: um segmento
 * desconhecido cai no idioma padrão em vez de quebrar a renderização.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../../messages/${locale}.json`)).default,
    // Fuso do festival: as datas do evento são sempre exibidas no horário local de Vitória.
    timeZone: 'America/Sao_Paulo',
  };
});
