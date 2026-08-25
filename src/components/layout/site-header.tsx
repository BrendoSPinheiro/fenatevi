import { getTranslations } from 'next-intl/server';

import { AreasMenu } from '@/components/layout/areas-menu';
import { HeaderCondense } from '@/components/layout/header-condense';
import { headerAreas } from '@/components/layout/portal-areas';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { Link } from '@/lib/i18n/navigation';

/**
 * Cabeçalho do portal: marca, navegação principal, idioma e acesso às áreas.
 *
 * Server Component. Vão para o cliente apenas três folhas: o seletor de idioma
 * (precisa da rota atual), o menu de áreas (tem estado) e o observador de
 * rolagem — que só escreve um atributo no `<html>`, de onde o CSS abaixo tira a
 * condensação. Nenhum item muda de posição na rolagem.
 *
 * **Sem o controle "A11y" do protótipo.** Lá ele é rotulado "estado de
 * demonstração": alto contraste, aumento de texto, redução de movimento e
 * Libras são quatro funcionalidades anunciadas e não desenhadas. O portal já
 * entrega WCAG 2.2 AA e respeita `prefers-reduced-motion` nativamente;
 * implementá-las de verdade é uma change própria. Exclusão registrada na
 * proposta.
 */
export async function SiteHeader() {
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  return (
    <header className="sticky top-0 z-[var(--z-header)] border-b border-outline-variant/60 bg-surface/90 backdrop-blur-sm">
      <HeaderCondense />
      {/* A classe é o gancho da regra de condensação, em `globals.css`. */}
      <div className="site-header__bar mx-auto flex w-full max-w-(--container-max) flex-wrap items-center justify-between gap-4 px-margin-mobile py-4 lg:px-margin-desktop">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center font-serif text-xl font-bold tracking-[0.16em] text-foreground no-underline"
        >
          {tCommon('festivalName')}
        </Link>

        <nav aria-label={tNav('primaryLabel')} className="hidden md:block">
          <ul className="flex items-center gap-6">
            {headerAreas.map((area) => (
              <li key={area.id}>
                <Link
                  href={area.href}
                  className="inline-flex min-h-11 items-center font-sans text-xs font-semibold tracking-[0.14em] text-foreground-muted uppercase no-underline transition-colors hover:text-foreground"
                >
                  {tNav(area.id)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <AreasMenu />
        </div>
      </div>
    </header>
  );
}
