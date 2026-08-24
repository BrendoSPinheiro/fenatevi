import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/sections/page-header';
import { buttonClassName } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Tag } from '@/components/ui/tag';
import { editionTimeline } from '@/content/editions';
import { Link } from '@/lib/i18n/navigation';
import { formatFestivalDate } from '@/lib/utils/format';

import type { Metadata } from 'next';

interface MemoriaPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: MemoriaPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'memoria' });

  return { title: t('title'), description: t('description') };
}

/**
 * A linha do tempo das edições.
 *
 * Cada entrada oferece **a ação coerente com o seu estado de acervo**, e o
 * portal nunca oferece um caminho para uma página de edição que não existe:
 * quando não há página, a entrada diz isso em texto e não vira link.
 */
export default async function MemoriaPage({ params }: MemoriaPageProps) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);

  const locale = await getLocale();
  const t = await getTranslations('memoria');

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <PageHeader title={t('title')} description={t('description')} />

      <Container className="pb-stack-lg">
        <ol aria-label={t('timelineLabel')} className="flex flex-col gap-4">
          {editionTimeline.map((entry) => {
            const yearLabel =
              entry.firstYear === entry.lastYear
                ? String(entry.firstYear)
                : `${entry.firstYear}—${entry.lastYear}`;

            const editionLabel =
              entry.edition === null
                ? t('editionsCount', { count: entry.editionCount })
                : t('editionLabel', { edition: entry.edition });

            const period =
              entry.startDate === null || entry.endDate === null
                ? t('periodUnknown')
                : `${formatFestivalDate(entry.startDate, locale)} — ${formatFestivalDate(
                    entry.endDate,
                    locale,
                  )}`;

            const percent = Math.round(entry.completeness * 100);

            return (
              <li key={entry.id}>
                <Card as="article" className="p-6">
                  <div className="flex flex-wrap items-baseline gap-4">
                    <p className="font-serif text-4xl text-foreground tabular-nums">{yearLabel}</p>
                    <p className="font-sans text-base text-foreground-muted">{editionLabel}</p>
                    {/*
                     * O estado do acervo é **texto**, não uma bolinha colorida:
                     * "Acervo completo" e "Em digitalização" precisam ser lidos,
                     * não deduzidos de uma cor.
                     */}
                    <Tag tone={entry.archiveState === 'acervo-completo' ? 'primary' : 'neutral'}>
                      {t(`states.${entry.archiveState}`)}
                    </Tag>
                  </div>

                  <p className="mt-2 font-sans text-sm text-foreground-subtle">{period}</p>

                  <p className="mt-3 max-w-prose font-sans text-base text-foreground-muted">
                    {t(`entries.${entry.id}`)}
                  </p>

                  <div className="mt-4">
                    <p className="font-sans text-xs tracking-[0.12em] text-foreground-subtle uppercase">
                      {t('completeness', { percent })}
                    </p>
                    {/*
                     * A barra é decorativa: o número acima já é o dado, e um
                     * `role="progressbar"` faria o leitor de tela anunciar duas
                     * vezes a mesma informação.
                     */}
                    <span
                      aria-hidden="true"
                      className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-surface-container-high"
                    >
                      <span
                        className="block h-full bg-secondary"
                        style={{ width: `${percent}%` }}
                      />
                    </span>
                  </div>

                  <div className="mt-6">
                    {entry.hasEditionPage ? (
                      <Link
                        href={`/edicoes/${entry.firstYear}`}
                        className={buttonClassName('secondary')}
                      >
                        {t('actions.acervo-completo')}
                      </Link>
                    ) : entry.archiveState === 'edicao-vigente' ? (
                      <Link href="/programacao" className={buttonClassName('secondary')}>
                        {t('actions.edicao-vigente')}
                      </Link>
                    ) : (
                      <p className="font-sans text-sm text-foreground-subtle">
                        {t('noPageNotice')}
                      </p>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>

        <p className="mt-stack-md max-w-prose font-sans text-sm text-foreground-subtle">
          {t('scopeNote')}
        </p>
      </Container>
    </main>
  );
}
