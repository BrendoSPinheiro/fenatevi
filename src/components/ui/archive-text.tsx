'use client';

import { useLocale } from 'next-intl';

import { routing } from '@/lib/i18n/routing';

import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ArchiveTextOwnProps = ComponentPropsWithoutRef<'span'>;

interface ArchiveTextProps extends ArchiveTextOwnProps {
  /** Elemento renderizado — `span` por padrão, `p` num release, `dd` numa ficha. */
  readonly as?: ElementType;
}

/**
 * Texto do acervo histórico, marcado com o idioma em que realmente está.
 *
 * O acervo — títulos, releases, fichas técnicas, biografias — permanece em
 * pt-BR mesmo nas páginas em inglês e espanhol. Traduzir release artístico e
 * ficha técnica de terceiros sem revisão humana deturparia o material; marcar o
 * idioma real é o que um leitor de tela precisa para pronunciar o trecho
 * corretamente, e é o comportamento certo (WCAG 2.2 — 3.1.2 Idioma de partes).
 *
 * O `lang` só é aplicado quando o idioma da página **não** é pt-BR: repetir
 * `lang="pt-BR"` dentro de um documento já em pt-BR é ruído.
 *
 * Centralizar isso num componente é o que impede a regra de virar folclore: se
 * o texto do acervo passa por aqui, o `lang` está certo; se não passa, a revisão
 * encontra texto cru no JSX, que já é proibido por outro motivo.
 */
export function ArchiveText({ as, ...props }: ArchiveTextProps) {
  const locale = useLocale();
  const Component = (as ?? 'span') as ElementType<ArchiveTextOwnProps>;

  return <Component lang={locale === routing.defaultLocale ? undefined : 'pt-BR'} {...props} />;
}
