import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { DayProgram } from '@/components/sections/day-program';
import { PageHeader } from '@/components/sections/page-header';
import { ArchiveText } from '@/components/ui/archive-text';
import { buttonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { DefinitionList } from '@/components/ui/definition-list';
import { EmptyState } from '@/components/ui/empty-state';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Text } from '@/components/ui/text';
import { activities } from '@/content/activities';
import { findVenue, venues } from '@/content/venues';
import { Link } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';
import { festivalDayOf, groupByDay } from '@/lib/utils/schedule';

import type { Metadata } from 'next';

interface EspacoPageProps {
  readonly params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => venues.map((venue) => ({ locale, id: venue.id })));
}

export async function generateMetadata({ params }: EspacoPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const venue = findVenue(id);

  if (venue === undefined) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'espacos' });

  return { title: venue.name, description: `${t(`kinds.${venue.kind}`)} — ${venue.address}` };
}

/** A página de um espaço: identidade, endereço e a programação própria. */
export default async function EspacoPage({ params }: EspacoPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const venue = findVenue(id);

  if (venue === undefined) {
    notFound();
  }

  const t = await getTranslations('espacos');
  const tNav = await getTranslations('nav');
  const parent = venue.parentVenueId === null ? undefined : findVenue(venue.parentVenueId);

  const venueActivities = activities.filter((activity) => activity.venueId === venue.id);
  const days = groupByDay(venueActivities);
  const firstDay = venueActivities[0];

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <PageHeader
        title={venue.name}
        isArchiveTitle
        kicker={t(`kinds.${venue.kind}`)}
        back={{ href: '/espacos', label: tNav('backToEspacos') }}
      >
        {/*
         * Sem fotografia identificada deste espaço, a área de imagem recebe
         * tratamento neutro e **nada é dito ao visitante sobre a ausência**:
         * "foto ainda não disponível" é recado para quem produz o site, não
         * informação sobre o teatro.
         */}
        <div
          aria-hidden="true"
          className="mt-6 h-32 rounded-lg border border-outline-variant bg-[linear-gradient(120deg,var(--color-surface-container-lowest),var(--color-surface-container-high))]"
        />
      </PageHeader>

      <Container className="pb-stack-lg">
        <DefinitionList
          items={[
            {
              id: 'endereco',
              term: t('addressLabel'),
              description: <ArchiveText>{venue.address}</ArchiveText>,
            },
            { id: 'tipo', term: t('kindLabel'), description: t(`kinds.${venue.kind}`) },
            ...(parent === undefined
              ? []
              : [
                  {
                    id: 'dentro-de',
                    term: t('parentLabel'),
                    description: (
                      <Link href={`/espacos/${parent.id}`}>
                        <ArchiveText>{parent.name}</ArchiveText>
                      </Link>
                    ),
                  },
                ]),
            {
              id: 'atividades',
              term: t('activitiesLabel'),
              description: t('activityCount', { count: venueActivities.length }),
            },
          ]}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={
              firstDay === undefined
                ? '/programacao/grade'
                : `/programacao/grade?visao=espaco&dia=${festivalDayOf(firstDay.startsAt)}`
            }
            className={buttonClassName('secondary')}
          >
            {t('gridCta')}
          </Link>
          <Link href="/espacos" className={buttonClassName('ghost')}>
            {t('mapCta')}
          </Link>
        </div>

        <section aria-labelledby="programacao-espaco" className="mt-stack-md">
          <Text variant="headline-lg" as="h2" id="programacao-espaco" className="text-foreground">
            {t('programTitle')}
          </Text>

          {days.length === 0 ? (
            <EmptyState className="mt-6" title={t('noActivities')} />
          ) : (
            days.map((day) => <DayProgram key={day.date} day={day} withCreativeProcesses={false} />)
          )}
        </section>
      </Container>
    </main>
  );
}
