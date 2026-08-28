import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { activityHref } from '@/components/sections/activity-row';
import { PageHeader } from '@/components/sections/page-header';
import { ArchiveText } from '@/components/ui/archive-text';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Divider } from '@/components/ui/divider';
import { ProvenancedImage } from '@/components/ui/provenanced-image';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Tag } from '@/components/ui/tag';
import { Text } from '@/components/ui/text';
import { activities } from '@/content/activities';
import { books } from '@/content/books';
import { creativeProcesses } from '@/content/creative-processes';
import { editionCredits } from '@/content/edition-credits';
import { editionPageYears, findEditionEntry } from '@/content/editions';
import { edition2024 } from '@/content/festival';
import { honorees } from '@/content/honorees';
import { findVenue, venues } from '@/content/venues';
import { workshops } from '@/content/workshops';
import { Link } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';
import { formatFestivalDate, formatSessionTime, formatWeekday } from '@/lib/utils/format';
import { countByCategory } from '@/lib/utils/schedule';

import type { Metadata } from 'next';

interface EdicaoPageProps {
  readonly params: Promise<{ locale: string; ano: string }>;
}

/**
 * Só as edições com acervo completo têm página.
 *
 * É o mesmo critério que a linha do tempo usa para decidir o que vira link:
 * as duas leem `hasEditionPage`, e por isso é impossível a linha do tempo
 * apontar para uma página que este `generateStaticParams` não gerou.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    editionPageYears.map((year) => ({ locale, ano: String(year) })),
  );
}

export async function generateMetadata({ params }: EdicaoPageProps): Promise<Metadata> {
  const { locale, ano } = await params;
  const t = await getTranslations({ locale, namespace: 'edicao' });

  return {
    title: `FENATEVI ${ano}`,
    description: t('headline', {
      edition: edition2024.edition,
      start: edition2024.startDate,
      end: edition2024.endDate,
    }),
  };
}

/** A página completa de uma edição encerrada. */
export default async function EdicaoPage({ params }: EdicaoPageProps) {
  const { locale: routeLocale, ano } = await params;
  setRequestLocale(routeLocale);

  const year = Number(ano);
  const entry = Number.isInteger(year) ? findEditionEntry(year) : undefined;

  if (entry === undefined) {
    notFound();
  }

  const locale = await getLocale();
  const edition = edition2024;
  const t = await getTranslations('edicao');
  const tAcervo = await getTranslations('acervo');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');

  const counts = countByCategory(activities);
  const official = activities.filter((activity) => activity.strand === 'mostra-oficial');
  const parallel = activities.filter((activity) => activity.strand === 'mostra-paralela');

  const summary = [
    { id: 'oficial', label: tAcervo('strands.mostra-oficial'), value: official.length },
    { id: 'paralela', label: tAcervo('strands.mostra-paralela'), value: parallel.length },
    { id: 'oficinas', label: tAcervo('strands.oficina'), value: workshops.length },
    { id: 'espacos', label: t('venuesLabel'), value: venues.length },
  ];

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <PageHeader
        title={String(edition.year)}
        kicker={t('kicker')}
        back={{ href: '/memoria', label: tNav('backToMemoria') }}
      >
        <p className="mt-4 font-serif text-2xl text-primary">
          {t('headline', {
            edition: edition.edition,
            start: formatFestivalDate(edition.startDate, locale),
            end: formatFestivalDate(edition.endDate, locale),
          })}
        </p>

        {edition.motto !== null && (
          <p className="mt-2 font-serif text-xl text-secondary italic">
            {tCommon('freeEntry')} · <ArchiveText>{`“${edition.motto}”`}</ArchiveText>
          </p>
        )}

        <dl className="mt-8 flex flex-wrap gap-8">
          {summary.map((item) => (
            <div key={item.id}>
              <dd className="font-serif text-3xl text-foreground tabular-nums">
                {String(item.value).padStart(2, '0')}
              </dd>
              <dt className="mt-1 font-sans text-xs tracking-[0.14em] text-foreground-subtle uppercase">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </PageHeader>

      <Container className="pb-stack-lg">
        {edition.coverImage !== null && (
          <figure className="m-0 mb-stack-md">
            <ProvenancedImage
              image={edition.coverImage}
              sizes="(min-width: 768px) 420px, 80vw"
              maxRenderedWidth={420}
              className="aspect-square rounded-lg border border-outline-variant"
            />
            <figcaption className="mt-2 font-sans text-sm text-foreground-subtle">
              {t('coverCaption', { year: edition.year })}
            </figcaption>
          </figure>
        )}

        {edition.statement !== null && (
          <section aria-labelledby="apresentacao">
            <Text variant="headline-lg" as="h2" id="apresentacao" className="text-foreground">
              {t('statementTitle')}
            </Text>
            <p className="mt-2 font-sans text-sm text-foreground-subtle">
              {tAcervo('languageNotice')}
            </p>
            <blockquote className="mt-4 max-w-prose border-l-2 border-primary pl-4">
              <ArchiveText
                as="p"
                className="block font-sans text-lg leading-relaxed text-foreground-muted"
              >
                {edition.statement.quote}
              </ArchiveText>
              <footer className="mt-3 font-sans text-sm tracking-[0.08em] text-primary uppercase">
                <ArchiveText>
                  {edition.statement.author} · {edition.statement.authorRole}
                </ArchiveText>
              </footer>
            </blockquote>
          </section>
        )}

        <section aria-labelledby="nucleos" className="mt-stack-md">
          <Text variant="headline-lg" as="h2" id="nucleos" className="text-foreground">
            {t('strandsTitle')}
          </Text>
          <dl className="mt-6">
            {Object.entries(counts).map(([strand, count]) => (
              <div
                key={strand}
                className="flex justify-between gap-4 border-b border-outline-variant/60 py-3"
              >
                <dt className="font-sans text-base text-foreground">
                  {tAcervo(`strands.${strand}`)}
                </dt>
                <dd className="font-sans text-sm tracking-[0.1em] text-secondary uppercase">
                  {count}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {honorees.length > 0 && (
          <section aria-labelledby="homenageados" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="homenageados" className="text-foreground">
              {t('honoreesTitle', { year: edition.year })}
            </Text>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {honorees.map((honoree) => (
                <li key={honoree.id}>
                  <Card as="article" className="flex flex-col gap-4 p-6">
                    {honoree.portrait !== null && (
                      <ProvenancedImage
                        image={honoree.portrait}
                        sizes="96px"
                        maxRenderedWidth={96}
                        className="size-24 rounded-full border border-primary/50"
                      />
                    )}
                    <div>
                      <h3 className="font-serif text-xl text-foreground">
                        <ArchiveText>{honoree.name}</ArchiveText>
                      </h3>
                      <ArchiveText
                        as="p"
                        className="mt-1 block font-sans text-sm tracking-[0.08em] text-secondary uppercase"
                      >
                        {honoree.role}
                      </ArchiveText>
                      <ArchiveText
                        as="p"
                        className="mt-3 block font-sans text-base text-foreground-muted"
                      >
                        {honoree.biography}
                      </ArchiveText>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ActivityListSection
          id="mostra-oficial"
          title={t('officialTitle')}
          items={official}
          locale={locale}
        />

        <ActivityListSection
          id="mostra-paralela"
          // Nome cerimonial da mostra nesta edição: nome próprio, não traduzido.
          title={edition.parallelShowcaseName ?? t('parallelTitle')}
          isArchiveTitle={edition.parallelShowcaseName !== null}
          items={parallel}
          locale={locale}
        />

        <section aria-labelledby="formativas" className="mt-stack-md">
          <Text variant="headline-lg" as="h2" id="formativas" className="text-foreground">
            {t('workshopsTitle')}
          </Text>
          <ul className="mt-6 flex flex-col gap-3">
            {workshops.map((workshop) => (
              <li key={workshop.id}>
                <Link
                  href={`/oficinas/${workshop.id}`}
                  className="inline-flex min-h-11 items-center font-sans text-lg"
                >
                  <ArchiveText>{workshop.title}</ArchiveText>
                </Link>
                <span className="ml-2 font-sans text-sm text-foreground-subtle">
                  <ArchiveText>{workshop.teachers}</ArchiveText>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="livros" className="mt-stack-md">
          <Text variant="headline-lg" as="h2" id="livros" className="text-foreground">
            {t('booksTitle')}
          </Text>
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {books.map((book) => (
              <li key={book.id}>
                <Card as="article" className="h-full p-4">
                  <h3 className="font-serif text-lg text-foreground">
                    <ArchiveText>{book.title}</ArchiveText>
                  </h3>
                  <ArchiveText as="p" className="mt-1 block font-sans text-sm text-secondary">
                    {book.author}
                  </ArchiveText>
                  <ArchiveText
                    as="p"
                    className="mt-2 block font-sans text-sm text-foreground-muted"
                  >
                    {book.description}
                  </ArchiveText>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="processos" className="mt-stack-md">
          <Text variant="headline-lg" as="h2" id="processos" className="text-foreground">
            {t('creativeProcessesTitle')}
          </Text>
          <div className="mt-6 flex flex-col gap-5">
            {creativeProcesses.map((day) => (
              <article key={day.date}>
                <h3 className="font-sans text-sm font-semibold tracking-[0.12em] text-secondary uppercase">
                  {formatFestivalDate(day.date, locale)} · {formatWeekday(day.date, locale)}
                </h3>
                <ul className="mt-2 flex flex-col gap-1">
                  {day.items.map((item) => {
                    const venue = findVenue(item.venueId);

                    return (
                      <li
                        key={`${item.company}-${item.venueId}`}
                        className="font-sans text-base text-foreground-muted"
                      >
                        <ArchiveText>{item.company}</ArchiveText>
                        {venue !== undefined && (
                          <>
                            {' · '}
                            <ArchiveText className="text-foreground-subtle">
                              {venue.name}
                            </ArchiveText>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <Divider className="mt-stack-md" />

        <section aria-labelledby="ficha-edicao" className="mt-stack-md">
          <Text variant="headline-lg" as="h2" id="ficha-edicao" className="text-foreground">
            {t('creditsTitle')}
          </Text>
          <dl className="mt-6">
            {editionCredits.map((line) => (
              <div
                key={line.label}
                className="grid gap-1 border-b border-outline-variant/60 py-3 sm:grid-cols-[14rem_1fr]"
              >
                <dt className="font-sans text-xs font-semibold tracking-[0.12em] text-foreground-subtle uppercase">
                  <ArchiveText>{line.label}</ArchiveText>
                </dt>
                <dd className="font-sans text-base text-foreground">
                  <ArchiveText>{line.value}</ArchiveText>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Container>
    </main>
  );
}

/**
 * Uma mostra da edição, como lista nomeada e navegável.
 *
 * As duas mostras são listas **distintas** e com nome próprio: reuni-las numa
 * só apagaria a curadoria, que é justamente o que a edição registra.
 */
async function ActivityListSection({
  id,
  title,
  items,
  locale,
  isArchiveTitle = false,
}: {
  readonly id: string;
  readonly title: string;
  readonly items: readonly (typeof activities)[number][];
  readonly locale: string;
  readonly isArchiveTitle?: boolean;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby={id} className="mt-stack-md">
      <Text variant="headline-lg" as="h2" id={id} className="text-foreground">
        {isArchiveTitle ? <ArchiveText>{title}</ArchiveText> : title}
      </Text>
      <ul className="mt-6 flex flex-col gap-3">
        {items.map((activity) => (
          <li key={activity.id} className="flex flex-wrap items-baseline gap-3">
            <Link
              href={activityHref(activity)}
              className="inline-flex min-h-11 items-center font-sans text-lg"
            >
              <ArchiveText>{activity.title}</ArchiveText>
            </Link>
            <span className="font-sans text-sm text-foreground-subtle">
              <ArchiveText>{activity.company}</ArchiveText>
              {' · '}
              {formatFestivalDate(activity.startsAt.slice(0, 10), locale)}
              {' · '}
              {formatSessionTime(activity.startsAt, locale)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-sans text-sm text-foreground-subtle">
        <Tag>{items.length}</Tag>
      </p>
    </section>
  );
}
