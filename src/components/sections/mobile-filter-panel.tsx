'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Dialog } from '@/components/ui/dialog';

import type { ReactNode } from 'react';

interface MobileFilterPanelProps {
  /** A barra de filtros, renderizada no servidor e apenas apresentada aqui. */
  readonly children: ReactNode;
  /** Quantos resultados os filtros atuais deixam — fica visível no controle. */
  readonly resultLabel: string;
}

/**
 * Os filtros da programação em telas estreitas, num painel sobreposto.
 *
 * O painel é apresentação, não lógica: os filtros que ele mostra são os mesmos
 * `Link`s renderizados no servidor, passados como `children`. Nada é
 * reimplementado para o mobile, e com o JavaScript desligado os filtros
 * continuam ali — a barra completa aparece sem o painel, porque a classe que a
 * esconde vale só a partir de `md`.
 *
 * Foco preso, `Escape` e devolução de foco vêm de `Dialog`.
 */
export function MobileFilterPanel({ children, resultLabel }: MobileFilterPanelProps) {
  const t = useTranslations('programacao');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="js-only md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        className="inline-flex min-h-11 w-full items-center justify-between gap-3 rounded-sm border border-outline-variant px-4 font-sans text-sm font-semibold tracking-[0.08em] text-foreground uppercase"
      >
        {t('openFilters')}
        <span className="font-normal text-foreground-subtle normal-case">{resultLabel}</span>
      </button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('filtersLabel')}>
        <div className="flex min-h-dvh flex-col">
          {/*
           * A barra de resultado fica fixa no topo do painel: ao mexer nos
           * filtros, quem está com o polegar embaixo continua vendo quantas
           * atividades sobraram, sem rolar de volta.
           */}
          <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-outline-variant bg-surface px-margin-mobile py-4">
            <p className="font-sans text-sm text-foreground-muted">{resultLabel}</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="min-h-11 rounded-sm border border-outline-variant px-4 font-sans text-xs font-semibold tracking-[0.16em] text-foreground uppercase"
            >
              {t('openFilters')}
            </button>
          </div>

          <div className="flex-1 px-margin-mobile py-6">{children}</div>
        </div>
      </Dialog>
    </div>
  );
}
