'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { portalAreas } from '@/components/layout/portal-areas';
import { Dialog } from '@/components/ui/dialog';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { Link } from '@/lib/i18n/navigation';

/**
 * O menu do cabeçalho em telas estreitas — o hambúrguer.
 *
 * Abaixo de `md` a navegação principal do cabeçalho está oculta, e a barra
 * inferior leva só quatro destinos: quem estava no celular não alcançava
 * "Início" nem "Notícias". Este menu é o que fecha esse buraco — ele lista as
 * **seis** áreas do portal, numeradas como o programa impresso, e traz junto o
 * seletor de idioma, que em 375px não cabia na barra sem quebrá-la em duas
 * linhas.
 *
 * Client Component de folha, como `A11yMenu`: é estado e nada mais. O foco
 * preso, o `Escape`, a inércia do fundo e a devolução do foco ao botão vêm de
 * `Dialog`.
 *
 * **Sem JavaScript não sobra nada oculto:** os mesmos seis destinos e a mesma
 * troca de idioma estão no rodapé, e os quatro principais na barra inferior.
 */
export function NavMenu() {
  const t = useTranslations('nav');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-outline-variant px-2 text-foreground transition-colors hover:border-outline md:hidden"
      >
        {/* O pictograma é decorativo: o nome acessível vem do rótulo ao lado. */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
          <rect x="3" y="5.25" width="18" height="1.75" rx="0.875" />
          <rect x="3" y="11.125" width="18" height="1.75" rx="0.875" />
          <rect x="3" y="17" width="18" height="1.75" rx="0.875" />
        </svg>
        <span className="sr-only">{t('openMenu')}</span>
      </button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('menuTitle')}>
        <div className="mx-auto flex w-full max-w-(--container-max) flex-col px-margin-mobile py-6 lg:px-margin-desktop">
          <div className="flex items-center justify-between gap-4">
            <p className="font-serif text-3xl text-foreground">{t('menuTitle')}</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="min-h-11 shrink-0 rounded-sm border border-outline-variant px-4 font-sans text-xs font-semibold tracking-[0.16em] text-foreground uppercase"
            >
              {t('closeMenu')}
            </button>
          </div>

          <nav aria-label={t('primaryLabel')} className="mt-8">
            <ul className="flex flex-col">
              {portalAreas.map((area) => (
                <li key={area.id} className="border-b border-outline-variant/60">
                  <Link
                    href={area.href}
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-14 items-baseline gap-4 py-4 no-underline"
                  >
                    <span
                      aria-hidden="true"
                      className="font-sans text-xs font-bold tracking-[0.2em] text-secondary"
                    >
                      {area.number}
                    </span>
                    <span className="font-serif text-2xl text-foreground">{t(area.id)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8">
            <LocaleSwitcher />
          </div>
        </div>
      </Dialog>
    </>
  );
}
