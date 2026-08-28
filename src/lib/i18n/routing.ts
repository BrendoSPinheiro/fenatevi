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

  /*
   * **O português é o padrão, e não o palpite do navegador.**
   *
   * Com a detecção ligada, quem chegava em `/` com o navegador em inglês ou
   * espanhol era redirecionado para `/en` ou `/es` — inclusive dentro de
   * Vitória, onde um celular configurado em inglês é coisa comum. O festival é
   * brasileiro, o acervo está em pt-BR e é isso que a raiz do site apresenta;
   * os outros dois idiomas continuam a um clique, no seletor do cabeçalho, e
   * `/en` e `/es` continuam sendo URLs de primeira classe para quem chega nelas
   * por link ou por buscador.
   */
  localeDetection: false,
});
