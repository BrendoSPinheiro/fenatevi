'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { portalAreas } from '@/components/layout/portal-areas';
import { Dialog } from '@/components/ui/dialog';
import { Link } from '@/lib/i18n/navigation';

/**
 * O menu de áreas do portal, em tela cheia.
 *
 * Client Component **de folha**: é o único trecho do cabeçalho que precisa de
 * estado, e ele não arrasta a marca, a navegação nem o seletor de idioma para o
 * bundle do cliente.
 *
 * Cada área traz número, nome e descrição, e aponta apenas para telas que
 * existem. O foco preso, o `Escape` e a devolução do foco vêm de `Dialog`.
 */
export function AreasMenu() {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-outline-variant px-4 font-sans text-xs font-semibold tracking-[0.16em] text-foreground uppercase transition-colors hover:border-outline"
      >
        {t('openAreas')}
      </button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('areasTitle')}>
        <div className="mx-auto w-full max-w-(--container-max) px-margin-mobile py-10 lg:px-margin-desktop">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-serif text-4xl text-foreground">{t('areasTitle')}</p>
              <p className="mt-2 font-sans text-base text-foreground-muted">
                {t('areasDescription')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="min-h-11 shrink-0 rounded-sm border border-outline-variant px-4 font-sans text-xs font-semibold tracking-[0.16em] text-foreground uppercase"
            >
              {t('closeAreas')}
            </button>
          </div>

          <ul className="mt-10 grid gap-px overflow-hidden rounded-lg bg-outline-variant sm:grid-cols-2">
            {portalAreas.map((area) => (
              <li key={area.id}>
                <Link
                  href={area.href}
                  onClick={() => setIsOpen(false)}
                  className="flex h-full min-h-11 flex-col gap-2 bg-surface-container-low p-6 no-underline transition-colors hover:bg-surface-container"
                >
                  <span className="font-sans text-xs font-bold tracking-[0.2em] text-secondary">
                    {area.number}
                  </span>
                  <span className="font-serif text-2xl text-foreground">{t(area.id)}</span>
                  <span className="font-sans text-sm text-foreground-muted">
                    {t(`areaDescriptions.${area.id}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Dialog>
    </>
  );
}
