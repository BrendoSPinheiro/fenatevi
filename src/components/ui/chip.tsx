import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';

import type { ComponentPropsWithoutRef } from 'react';

const BASE_CLASSES =
  'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 ' +
  'font-sans text-sm font-semibold tracking-[0.04em] whitespace-nowrap transition-colors';

/*
 * O estado ativo não se distingue **só** pela cor: o chip selecionado ganha
 * também preenchimento sólido e um marcador antes do texto. Alguém que não
 * separa o bordô do fundo escuro continua enxergando qual filtro está ligado
 * (WCAG 2.2 — 1.4.1 Uso da cor).
 */
const STATE_CLASSES = {
  active: 'border-secondary bg-secondary text-on-secondary',
  idle: 'border-outline-variant bg-transparent text-foreground-muted hover:border-outline hover:text-foreground',
} as const;

interface ChipProps extends Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> {
  readonly href: ComponentPropsWithoutRef<typeof Link>['href'];
  readonly isActive?: boolean;
}

/**
 * Um filtro da programação — sempre um link, nunca um botão com estado.
 *
 * Cada chip aponta para a mesma rota com a query alterada. É isso que dá ao
 * portal o link profundo que a home precisa, o compartilhamento de um resultado
 * filtrado, e o funcionamento **sem JavaScript** — três coisas que um `useState`
 * não entregaria.
 *
 * O estado ativo é anunciado por `aria-current`, e **não** por `aria-pressed`.
 * `aria-pressed` pertence a `role="button"`: em um link ele é um atributo
 * proibido, e o axe o reporta como violação crítica. `aria-current` é o
 * atributo que existe justamente para dizer "este é o item vigente dentro deste
 * conjunto", que é exatamente o que um filtro aplicado é.
 */
export function Chip({ href, isActive = false, className, children, ...props }: ChipProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'true' : undefined}
      className={cn(BASE_CLASSES, isActive ? STATE_CLASSES.active : STATE_CLASSES.idle, className)}
      {...props}
    >
      {isActive && <span aria-hidden="true">✓</span>}
      {children}
    </Link>
  );
}
