'use client';

import { useLocale, useTranslations } from 'next-intl';

import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Link, usePathname } from '@/lib/i18n/navigation';
import { localeLabels, locales, type Locale } from '@/lib/i18n/routing';
import { cn } from '@/lib/utils/cn';

/**
 * Troca de idioma preservando a rota atual.
 *
 * Implementado com links, não com um menu em JavaScript: cada idioma passa a ter
 * uma URL real, rastreável e navegável pelo teclado, e a troca continua
 * funcionando sem JS. É Client Component apenas porque precisa saber qual é a
 * rota atual (`usePathname`).
 */
export function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher');
  const activeLocale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <nav aria-label={t('label')}>
      <ul className="flex items-center gap-1">
        {locales.map((locale) => {
          const isActive = locale === activeLocale;

          return (
            <li key={locale}>
              <Link
                href={pathname}
                locale={locale}
                lang={locale}
                hrefLang={locale}
                // O link do idioma ativo aponta para a página atual.
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'font-medium text-accent'
                    : 'text-muted underline underline-offset-4 hover:text-foreground',
                )}
              >
                {localeLabels[locale]}
                {isActive && <VisuallyHidden> ({t('current')})</VisuallyHidden>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
