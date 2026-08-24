import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Bodoni_Moda, Hanken_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';

import { CurtainTransition } from '@/components/layout/curtain-transition';
import { MobileNav } from '@/components/layout/mobile-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/ui/skip-link';
import { localeHtmlLang, routing, type Locale } from '@/lib/i18n/routing';
import { SITE_URL } from '@/lib/seo/site';
import { SmoothScrollProvider } from '@/providers/smooth-scroll-provider';
import '@/styles/globals.css';

import type { Metadata } from 'next';

/*
 * As duas famílias do Nocturne Stage, baixadas e auto-hospedadas em build por
 * `next/font/google`: nenhuma requisição a terceiros em runtime, `font-display:
 * swap` e preload automáticos, nenhum pacote novo no `package.json`.
 *
 * Ambas são variáveis — carrega-se apenas o eixo de peso, no subset latino, o
 * que mantém as duas dentro do orçamento do caminho crítico.
 */
const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-bodoni-moda',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hanken-grotesk',
});

interface LocaleLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

/** Gera as três variantes de idioma em tempo de build (renderização estática). */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Caminho desta versão de idioma: `pt-BR` mora na raiz (`localePrefix: 'as-needed'`).
  const path = locale === routing.defaultLocale ? '/' : `/${locale}`;

  return {
    /*
     * Base para toda URL relativa desta árvore. Sem ela o Next não consegue
     * gerar as URLs absolutas que canonical, hreflang e `og:image` exigem.
     */
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      // Rotas futuras informam só o próprio título; o sufixo vem daqui.
      template: `%s — ${tCommon('festivalName')}`,
    },
    description: t('description'),
    /*
     * Canonical consolida as variações de URL da mesma página — sobretudo os
     * parâmetros de campanha (`?utm_source=...`), que de outro modo o buscador
     * trataria como endereços distintos.
     *
     * Atenção ao criar rota nova: o Next **substitui** `alternates` inteiro em
     * vez de mesclá-lo, então a rota que declarar `canonical` precisa declarar
     * `languages` junto.
     */
    alternates: {
      canonical: path,
      // Sinaliza aos buscadores as versões equivalentes em cada idioma.
      languages: Object.fromEntries(
        routing.locales.map((item) => [item, item === routing.defaultLocale ? '/' : `/${item}`]),
      ),
    },
    /*
     * Open Graph e Twitter Card definem como o link aparece ao ser colado em
     * rede social ou mensageiro. `openGraph` também é substituído, não mesclado.
     * A imagem é resolvida pelo arquivo `opengraph-image.tsx` deste segmento.
     */
    openGraph: {
      type: 'website',
      siteName: tCommon('festivalName'),
      title: t('title'),
      description: t('description'),
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

/**
 * Layout raiz da aplicação — o segmento `[locale]` é o topo da árvore de rotas.
 *
 * Server Component: os únicos trechos que rodam no cliente são o seletor de
 * idioma, o provider de smooth scroll e as seções animadas.
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // O segmento vem da URL: valide antes de confiar nele.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Necessário para que as páginas abaixo possam ser renderizadas estaticamente.
  setRequestLocale(locale);

  return (
    <html
      lang={localeHtmlLang[locale as Locale]}
      className={`${bodoniModa.variable} ${hankenGrotesk.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <SkipLink />
          <SmoothScrollProvider />
          <CurtainTransition />
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <MobileNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
