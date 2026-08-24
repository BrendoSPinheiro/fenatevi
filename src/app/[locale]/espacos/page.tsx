import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/sections/page-header';
import { VenueSchematic } from '@/components/sections/venue-schematic';
import { ArchiveText } from '@/components/ui/archive-text';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Text } from '@/components/ui/text';
import { activities } from '@/content/activities';
import { findVenue, venues } from '@/content/venues';
import { Link } from '@/lib/i18n/navigation';
import { countByVenue } from '@/lib/utils/schedule';

import type { Metadata } from 'next';

interface EspacosPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: EspacosPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'espacos' });

  return { title: t('title'), description: t('description') };
}

/** Os espaços culturais do festival: o esquema e a lista. */
export default async function EspacosPage({ params }: EspacosPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('espacos');
  const counts = countByVenue(activities);

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <PageHeader title={t('title')} description={t('description')} />

      <Container className="pb-stack-lg">
        <div className="grid gap-stack-md lg:grid-cols-2">
          <VenueSchematic />

          <section aria-labelledby="lista-espacos">
            <Text variant="headline-lg" as="h2" id="lista-espacos" className="text-foreground">
              {t('listTitle')}
            </Text>

            <ul className="mt-6 flex flex-col gap-3">
              {venues.map((venue, index) => {
                const parent =
                  venue.parentVenueId === null ? undefined : findVenue(venue.parentVenueId);

                return (
                  <li key={venue.id}>
                    <Card as="article" className="p-4">
                      <div className="flex items-baseline gap-3">
                        <span
                          aria-hidden="true"
                          className="font-serif text-lg text-secondary tabular-nums"
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-serif text-xl text-foreground">
                          <Link
                            href={`/espacos/${venue.id}`}
                            className="no-underline hover:underline"
                          >
                            <ArchiveText>{venue.name}</ArchiveText>
                          </Link>
                        </h3>
                      </div>

                      {parent !== undefined && (
                        <p className="mt-1 font-sans text-sm text-foreground-subtle">
                          {t('insideOf', { venue: parent.name })}
                        </p>
                      )}

                      <ArchiveText
                        as="p"
                        className="mt-2 block font-sans text-sm text-foreground-muted"
                      >
                        {venue.address}
                      </ArchiveText>

                      <p className="mt-2 font-sans text-sm text-foreground-subtle">
                        {t(`kinds.${venue.kind}`)}
                        {' · '}
                        {t('activityCount', { count: counts[venue.id] ?? 0 })}
                      </p>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </Container>
    </main>
  );
}
