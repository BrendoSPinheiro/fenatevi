import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

import { activityHref } from '@/components/sections/activity-row';
import { PageHeader } from '@/components/sections/page-header';
import { ArchiveText } from '@/components/ui/archive-text';
import { Chip } from '@/components/ui/chip';
import { Container } from '@/components/ui/container';
import { DemoContentNotice } from '@/components/ui/demo-content-notice';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Tag } from '@/components/ui/tag';
import { activities } from '@/content/activities';
import { venues } from '@/content/venues';
import { Link } from '@/lib/i18n/navigation';
import { formatSessionTime, formatShortDay, formatWeekday } from '@/lib/utils/format';
import {
  availableDays,
  GRID_VIEWS,
  gridHref,
  parseGridQuery,
  type RawSearchParams,
} from '@/lib/utils/program-query';
import { festivalDayOf } from '@/lib/utils/schedule';

import type { Metadata } from 'next';
import type { Activity, IsoDate } from '@/types/festival';

interface GradePageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({
  params,
}: Pick<GradePageProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'grade' });

  return { title: t('title'), description: t('description') };
}

/** As atividades de um dia, em ordem de horário. */
function activitiesOfDay(day: IsoDate): readonly Activity[] {
  return activities
    .filter((activity) => festivalDayOf(activity.startsAt) === day)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

/**
 * A grade diária, em três visões.
 *
 * Server Component. A visão e o dia vêm da URL, e a troca de visão **preserva
 * o dia** — quem estava lendo a quinta-feira por espaço continua na quinta ao
 * pedir por horário.
 */
export default async function GradePage({ params, searchParams }: GradePageProps) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);

  const locale = await getLocale();
  const t = await getTranslations('grade');
  const tProgramacao = await getTranslations('programacao');
  const query = parseGridQuery(await searchParams);
  const dayActivities = activitiesOfDay(query.day);

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <PageHeader title={t('title')} description={t('description')} />

      <Container>
        <DemoContentNotice className="mb-stack-md" />

        <div role="group" aria-labelledby="grade-visao">
          <p
            id="grade-visao"
            className="font-sans text-xs font-semibold tracking-[0.16em] text-foreground-subtle uppercase"
          >
            {t('viewLabel')}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {GRID_VIEWS.map((view) => (
              <li key={view}>
                <Chip href={gridHref(query, { view })} isActive={query.view === view}>
                  {t(`view${view.charAt(0).toUpperCase()}${view.slice(1)}`)}
                </Chip>
              </li>
            ))}
          </ul>
        </div>

        {query.view !== 'semana' && (
          <div role="group" aria-labelledby="grade-dia" className="mt-5">
            <p
              id="grade-dia"
              className="font-sans text-xs font-semibold tracking-[0.16em] text-foreground-subtle uppercase"
            >
              {tProgramacao('dayLabel')}
            </p>
            {/*
             * Os dias rolam na horizontal **dentro deste container**, não com o
             * documento: em 375px o polegar percorre os oito dias sem que a
             * página inteira ande para o lado.
             */}
            <ul className="scroll-x -mx-margin-mobile mt-2 flex gap-2 px-margin-mobile pb-2 lg:mx-0 lg:flex-wrap lg:px-0">
              {availableDays.map((day) => (
                <li key={day}>
                  <Chip href={gridHref(query, { day })} isActive={query.day === day}>
                    {formatShortDay(day, locale)}
                  </Chip>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-stack-md border-t border-outline-variant/60 pt-6 pb-stack-lg">
          {query.view === 'espaco' && <ByVenueView day={query.day} />}
          {query.view === 'horario' && <ByTimeView activities={dayActivities} />}
          {query.view === 'semana' && <WeekView />}
        </div>
      </Container>
    </main>
  );
}

/**
 * Visão por espaço: **todos** os espaços aparecem, sempre.
 *
 * Um espaço sem programação no dia não some da grade — ele diz, com texto, que
 * não recebe atividades naquele dia. Sumir seria indistinguível de um erro de
 * carregamento, e obrigaria quem procura o Teatro Estrelas a adivinhar.
 */
async function ByVenueView({ day }: { readonly day: IsoDate }) {
  const locale = await getLocale();
  const t = await getTranslations('grade');
  const dayActivities = activitiesOfDay(day);

  return (
    <section aria-labelledby="grade-conteudo">
      <h2 id="grade-conteudo" className="font-serif text-2xl text-foreground">
        {formatShortDay(day, locale)} · {formatWeekday(day, locale)}
      </h2>

      <div className="mt-6 flex flex-col gap-6">
        {venues.map((venue) => {
          const venueActivities = dayActivities.filter((activity) => activity.venueId === venue.id);

          return (
            <article key={venue.id} className="border-t border-outline-variant/60 pt-4">
              <h3 className="font-serif text-xl text-foreground">
                <ArchiveText>{venue.name}</ArchiveText>
              </h3>

              {venueActivities.length === 0 ? (
                <p className="mt-2 font-sans text-sm text-foreground-subtle">
                  {t('noActivitiesInVenue')}
                </p>
              ) : (
                <ul className="mt-3 flex flex-col gap-2">
                  {venueActivities.map((activity) => (
                    <li key={activity.id} className="flex flex-wrap items-baseline gap-3">
                      <span className="font-serif text-lg text-secondary">
                        <time dateTime={activity.startsAt}>
                          {formatSessionTime(activity.startsAt, locale)}
                        </time>
                      </span>
                      <Link
                        href={activityHref(activity)}
                        className="inline-flex min-h-11 items-center font-sans text-base"
                      >
                        <ArchiveText>{activity.title}</ArchiveText>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

/** Visão por horário: o que acontece ao mesmo tempo, junto. */
async function ByTimeView({
  activities: dayActivities,
}: {
  readonly activities: readonly Activity[];
}) {
  const locale = await getLocale();
  const t = await getTranslations('grade');

  const byTime = new Map<string, Activity[]>();

  for (const activity of dayActivities) {
    const time = formatSessionTime(activity.startsAt, locale);
    const bucket = byTime.get(time);

    if (bucket === undefined) {
      byTime.set(time, [activity]);
    } else {
      bucket.push(activity);
    }
  }

  if (byTime.size === 0) {
    return <p className="font-sans text-base text-foreground-muted">{t('emptyDay')}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {[...byTime.entries()].map(([time, timeActivities]) => (
        <section key={time} className="border-t border-outline-variant/60 pt-4">
          <h2 className="font-serif text-2xl text-secondary">{time}</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {timeActivities.map((activity) => {
              const venue = venues.find((item) => item.id === activity.venueId);

              return (
                <li key={activity.id}>
                  <Link
                    href={activityHref(activity)}
                    className="inline-flex min-h-11 items-center font-sans text-base"
                  >
                    <ArchiveText>{activity.title}</ArchiveText>
                  </Link>
                  {venue !== undefined && (
                    <span className="ml-2 font-sans text-sm text-foreground-subtle">
                      <ArchiveText>{venue.name}</ArchiveText>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * Visão da semana: espaços × dias.
 *
 * É uma `<table>` de verdade, com cabeçalhos de linha e de coluna: numa matriz,
 * a relação entre a célula e os dois cabeçalhos é a informação, e só a marcação
 * de tabela a carrega.
 *
 * A rolagem horizontal acontece **dentro do container**, que é focável pelo
 * teclado (`tabIndex={0}`) para que quem não usa mouse consiga rolá-lo. O
 * documento nunca rola para o lado.
 */
async function WeekView() {
  const locale = await getLocale();
  const t = await getTranslations('grade');

  return (
    <section aria-labelledby="grade-semana">
      <h2 id="grade-semana" className="font-serif text-2xl text-foreground">
        {t('viewSemana')}
      </h2>

      <p className="mt-2 max-w-prose font-sans text-sm text-foreground-muted">
        {t('wideTableNotice')}
      </p>

      <div
        tabIndex={0}
        role="region"
        aria-label={t('weekTableLabel')}
        className="scroll-x mt-6 rounded-lg border border-outline-variant"
      >
        <table className="w-full min-w-[48rem] border-collapse text-left">
          <caption className="sr-only">{t('weekTableLabel')}</caption>
          <thead>
            <tr>
              <th scope="col" className="p-3 font-sans text-xs tracking-[0.12em] uppercase">
                {t('venueColumn')}
              </th>
              {availableDays.map((day) => (
                <th
                  key={day}
                  scope="col"
                  className="p-3 font-sans text-xs tracking-[0.12em] whitespace-nowrap uppercase"
                >
                  {formatShortDay(day, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {venues.map((venue) => (
              <tr key={venue.id} className="border-t border-outline-variant/60">
                <th scope="row" className="p-3 align-top font-sans text-sm font-semibold">
                  <ArchiveText>{venue.name}</ArchiveText>
                </th>
                {availableDays.map((day) => {
                  const cell = activitiesOfDay(day).filter(
                    (activity) => activity.venueId === venue.id,
                  );

                  return (
                    <td key={day} className="p-3 align-top">
                      {cell.length === 0 ? (
                        <span className="sr-only">{t('noActivitiesInVenue')}</span>
                      ) : (
                        <ul className="flex flex-col gap-2">
                          {cell.map((activity) => (
                            <li key={activity.id}>
                              <Link
                                href={activityHref(activity)}
                                className="inline-flex min-h-11 items-center font-sans text-sm"
                              >
                                <ArchiveText>{activity.title}</ArchiveText>
                              </Link>
                              <Tag className="mt-1 block w-fit">
                                {formatSessionTime(activity.startsAt, locale)}
                              </Tag>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
