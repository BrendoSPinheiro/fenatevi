import { defineRouting } from 'next-intl/routing';

/**
 * Idiomas suportados pelo site.
 *
 * `pt-BR` é o idioma padrão e não recebe prefixo na URL (`/`).
 * Os demais são prefixados (`/en`, `/es`) — estratégia `as-needed`.
 */
export const locales = ['pt-BR', 'en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = 'pt-BR' satisfies Locale;

/** Rótulo de cada idioma, escrito no próprio idioma (não deve ser traduzido). */
export const localeLabels: Record<Locale, string> = {
  'pt-BR': 'Português',
  en: 'English',
  es: 'Español',
};

/** Valor do atributo `lang` do HTML para cada locale. */
export const localeHtmlLang: Record<Locale, string> = {
  'pt-BR': 'pt-BR',
  en: 'en',
  es: 'es',
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});
