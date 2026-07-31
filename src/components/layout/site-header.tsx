import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/ui/container';
import { LocaleSwitcher } from '@/components/ui/locale-switcher';
import { Link } from '@/lib/i18n/navigation';

/** Cabeçalho do site. Server Component: só o seletor de idioma roda no cliente. */
export async function SiteHeader() {
  const t = await getTranslations('common');

  return (
    <header className="border-b border-border/60">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-[0.18em] text-foreground no-underline"
        >
          {t('festivalName')}
        </Link>
        <LocaleSwitcher />
      </Container>
    </header>
  );
}
