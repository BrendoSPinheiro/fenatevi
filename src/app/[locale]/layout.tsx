import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/ui/skip-link';
import { localeHtmlLang, routing, type Locale } from '@/lib/i18n/routing';
import { SmoothScrollProvider } from '@/providers/smooth-scroll-provider';
import '@/styles/globals.css';

import type { Metadata } from 'next';

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

  return {
    title: t('title'),
    description: t('description'),
    // Sinaliza aos buscadores as versões equivalentes em cada idioma.
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((item) => [item, item === routing.defaultLocale ? '/' : `/${item}`]),
      ),
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
    <html lang={localeHtmlLang[locale as Locale]}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <SkipLink />
          <SmoothScrollProvider />
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
