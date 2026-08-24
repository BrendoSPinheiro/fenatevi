import { getTranslations } from 'next-intl/server';

/** Id da região principal, compartilhado entre o skip link e o `<main>`. */
export const MAIN_CONTENT_ID = 'conteudo-principal';

/**
 * Primeiro elemento focável da página (WCAG 2.2 — 2.4.1 Bypass Blocks).
 *
 * Fica fora da tela até receber foco pelo teclado. É um `<a>` nativo de propósito:
 * o pulo precisa funcionar mesmo se o JavaScript não carregar.
 */
export async function SkipLink() {
  const t = await getTranslations('common');

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only rounded-sm bg-secondary px-4 py-2 text-sm font-medium text-on-secondary focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[var(--z-skip-link)] focus-visible:inline-flex focus-visible:min-h-11 focus-visible:items-center"
    >
      {t('skipToContent')}
    </a>
  );
}
