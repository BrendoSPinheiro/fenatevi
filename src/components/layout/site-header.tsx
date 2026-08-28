import { getTranslations } from 'next-intl/server';

import { A11yMenu } from '@/components/layout/a11y-menu';
import { HeaderCondense } from '@/components/layout/header-condense';
import { headerAreas } from '@/components/layout/portal-areas';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { Link } from '@/lib/i18n/navigation';

/**
 * Cabeçalho do portal: marca, navegação principal, idioma e acessibilidade.
 *
 * Server Component. Vão para o cliente apenas três folhas: o seletor de idioma
 * (precisa da rota atual), o painel de acessibilidade (tem estado) e o
 * observador de rolagem — que só escreve um atributo no `<html>`, de onde o CSS
 * tira a moldura e a condensação. Nenhum item muda de posição na rolagem.
 *
 * **A barra é transparente no topo e ganha corpo ao rolar.** Sobre a abertura
 * da home, a fotografia de palco atravessa o cabeçalho; assim que a página
 * anda, a superfície e o filete entram para separar a barra do conteúdo que
 * passa por baixo. Sem JavaScript o cabeçalho fica no estado **opaco**, que é o
 * legível em qualquer fundo — a transparência é o enriquecimento, não a base.
 */
export async function SiteHeader() {
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  return (
    <header className="site-header sticky top-0 z-[var(--z-header)]">
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
          <A11yMenu />
        </div>
      </div>
    </header>
  );
}
