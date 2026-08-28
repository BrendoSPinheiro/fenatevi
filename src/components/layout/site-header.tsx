import { getTranslations } from 'next-intl/server';

import { A11yMenu } from '@/components/layout/a11y-menu';
import { HeaderCondense } from '@/components/layout/header-condense';
import { NavMenu } from '@/components/layout/nav-menu';
import { headerAreas } from '@/components/layout/portal-areas';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { Link } from '@/lib/i18n/navigation';

/**
 * Cabeçalho do portal: marca, navegação principal, idioma e acessibilidade.
 *
 * Server Component. Vão para o cliente apenas quatro folhas: o seletor de
 * idioma (precisa da rota atual), o painel de acessibilidade e o menu de telas
 * estreitas (têm estado) e o observador de rolagem — que só escreve um atributo
 * no `<html>`, de onde o CSS tira a moldura e a condensação. Nenhum item muda
 * de posição na rolagem.
 *
 * **A navegação tem duas formas.** De `md` para cima ela é a lista horizontal
 * de áreas; abaixo disso é o hambúrguer de `NavMenu`, que abre as seis áreas e
 * o seletor de idioma. Uma das duas está sempre visível, nunca as duas.
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
      {/*
       * Sem `flex-wrap`: em 375px a barra quebrava em duas linhas — marca em
       * cima, os três idiomas embaixo — e o cabeçalho comia um terço da tela.
       * Abaixo de `md` sobram três alvos: marca, acessibilidade e hambúrguer.
       */}
      <div className="site-header__bar mx-auto flex w-full max-w-(--container-max) items-center justify-between gap-4 px-margin-mobile py-4 lg:px-margin-desktop">
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

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Em telas estreitas o seletor de idioma vive dentro do hambúrguer. */}
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <A11yMenu />
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
