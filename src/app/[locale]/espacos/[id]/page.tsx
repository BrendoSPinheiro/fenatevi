import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
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
import { workshops } from '@/content/workshops';
import { Link } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';
import { formatSessionTime, formatShortDay } from '@/lib/utils/format';
import { programCount } from '@/lib/utils/program';
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
  const { locale: routeLocale, id } = await params;
  setRequestLocale(routeLocale);

  const venue = findVenue(id);

  if (venue === undefined) {
    notFound();
  }

  const locale = await getLocale();
  const t = await getTranslations('espacos');
  const tNav = await getTranslations('nav');
  const parent = venue.parentVenueId === null ? undefined : findVenue(venue.parentVenueId);

  const venueActivities = activities.filter((activity) => activity.venueId === venue.id);
  const days = groupByDay(venueActivities);
  const firstDay = venueActivities[0];

  /*
   * As oficinas do espaço, à parte das sessões.
   *
   * O Teatro Estrelas **só** recebe ações formativas nesta edição: uma página
   * que lesse apenas `activities` diria que ele está fora do festival. A
   * contagem, por isso, é a da programação inteira — a mesma que o esquema de
   * espaços e a listagem usam.
   */
  const venueWorkshops = workshops.filter((workshop) => workshop.venueId === venue.id);
  const itemCount = programCount({ venueId: venue.id });

  /* O dia que a grade deve abrir para este espaço: o primeiro em que ele tem algo. */
  const firstWorkshopSession = venueWorkshops[0]?.sessions[0];
  const gridDay =
    firstDay !== undefined
      ? festivalDayOf(firstDay.startsAt)
      : firstWorkshopSession === undefined
        ? null
        : festivalDayOf(firstWorkshopSession.startsAt);

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
              description: t('activityCount', { count: itemCount }),
            },
          ]}
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={
              gridDay === null
                ? '/programacao/grade'
                : `/programacao/grade?visao=espaco&dia=${gridDay}`
            }
            className={buttonClassName('secondary')}
          >
            {t('gridCta')}
          </Link>
          <Link href="/espacos" className={buttonClassName('ghost')}>
            {t('mapCta')}
          </Link>
        </div>

        {/*
         * A seção de sessões só existe quando há sessões. Um espaço que recebe
         * apenas ações formativas — o Teatro Estrelas, nesta edição — não deve
         * mostrar um título de programação seguido de nada.
         */}
        {days.length > 0 && (
          <section aria-labelledby="programacao-espaco" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="programacao-espaco" className="text-foreground">
              {t('programTitle')}
            </Text>
            {days.map((day) => (
              <DayProgram key={day.date} day={day} withCreativeProcesses={false} />
            ))}
          </section>
        )}

        {days.length === 0 && venueWorkshops.length === 0 && (
          <section aria-labelledby="programacao-espaco" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="programacao-espaco" className="text-foreground">
              {t('programTitle')}
            </Text>
            <EmptyState className="mt-6" title={t('noActivities')} />
          </section>
        )}

        {venueWorkshops.length > 0 && (
          <section aria-labelledby="oficinas-espaco" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="oficinas-espaco" className="text-foreground">
              {t('workshopsTitle')}
            </Text>
            <ul className="mt-6 flex flex-col gap-4">
              {venueWorkshops.map((workshop) => (
                <li key={workshop.id} className="border-b border-outline-variant/60 pb-4">
                  <h3 className="font-serif text-xl text-foreground">
                    <Link
                      href={`/oficinas/${workshop.id}`}
                      className="no-underline hover:underline"
                    >
                      <ArchiveText>{workshop.title}</ArchiveText>
                    </Link>
                  </h3>
                  <ArchiveText
                    as="p"
                    className="mt-1 block font-sans text-sm text-foreground-muted"
                  >
                    {workshop.teachers}
                  </ArchiveText>
                  <p className="mt-1 font-sans text-sm text-foreground-subtle">
                    {workshop.sessions
                      .map(
                        (session) =>
                          `${formatShortDay(festivalDayOf(session.startsAt), locale)}, ${formatSessionTime(session.startsAt, locale)}`,
                      )
                      .join(' · ')}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </main>
  );
}
