import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

import { activityHref } from '@/components/sections/activity-row';
import { LiveNowRefinement } from '@/components/sections/live-now-refinement';
import { Reveal } from '@/components/sections/reveal';
import { StageIntro } from '@/components/sections/stage-intro';
import { VenueSchematic } from '@/components/sections/venue-schematic';
import { ArchiveText } from '@/components/ui/archive-text';
import { buttonClassName } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { DemoContentNotice } from '@/components/ui/demo-content-notice';
import { EmptyState } from '@/components/ui/empty-state';
import { ProvenancedImage } from '@/components/ui/provenanced-image';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Tag } from '@/components/ui/tag';
import { Text } from '@/components/ui/text';
import { activities } from '@/content/activities';
import { currentEdition, displayedEdition } from '@/content/festival';
import { stagePhotos } from '@/content/images';
import { newsNewestFirst } from '@/content/news';
import { partners } from '@/content/partners';
import { findVenue, venues } from '@/content/venues';
import { Link } from '@/lib/i18n/navigation';
import { displayedEditionPhase, isEditionRunning } from '@/lib/utils/edition-phase';
import {
  formatFestivalDate,
  formatSessionTime,
  formatShortDay,
  formatWeekday,
} from '@/lib/utils/format';
import { countByCategory, festivalDayOf, festivalDays, sessionEndsAt } from '@/lib/utils/schedule';

interface HomePageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * A home do portal, em atos.
 *
 * Estática. Isso vale para a seção "em cena agora" também, e é a decisão mais
 * delicada da tela: o estado de tempo é derivado da **janela da edição
 * exibida**, não de `Date.now()`, sempre que a janela já esteja inteiramente no
 * passado ou no futuro. A edição exibida hoje é a de 2024 — o servidor sabe
 * disso no build, com certeza que não expira, e grava "edição encerrada" no
 * HTML sem relógio nenhum. Quando a edição exibida contiver o instante
 * corrente, um Client Component de folha refina o distintivo depois da
 * montagem, sem mudar o primeiro render.
 *
 * `StageIntro` permanece intocada: é a materialização de "The Reveal" do
 * design system, segue exclusiva da home, ausente sob movimento reduzido, e se
 * encerra sozinha sem JavaScript.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);

  const locale = await getLocale();
  const t = await getTranslations('home');
  const tIntro = await getTranslations('intro');
  const tAcervo = await getTranslations('acervo');
  const tNoticias = await getTranslations('noticias');
  const tPartners = await getTranslations('parceiros');
  const tFeatures = await getTranslations('accessibilityFeatures');

  const days = festivalDays(activities);
  const counts = countByCategory(activities);
  const chronological = [...activities].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
  const featured =
    chronological.find((activity) => activity.accessibility.length > 0) ?? chronological[0];
  const secondary = chronological.filter((activity) => activity.id !== featured?.id).slice(0, 3);
  const firstDay = days[0] ?? '';

  const dates = t('dates', {
    start: formatFestivalDate(currentEdition.startDate, locale),
    end: formatFestivalDate(currentEdition.endDate, locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  });

  return (
    <>
      {/*
       * Irmã de `<main>`, não do layout: quem chegar de um link para uma rota
       * interna não deve assistir à abertura. O posicionamento é `fixed`, então
       * a ordem no DOM não afeta a cobertura da tela.
       */}
      <StageIntro line={tIntro('line')} hint={tIntro('hint')} />

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        {/* ---------------------------------------------------- Ato I: abertura */}
        <section aria-labelledby="abertura" className="relative overflow-hidden">
          {/*
           * A fotografia é atmosfera, não informação: `aria-hidden`, e sob duas
           * camadas de escurecimento. É o que garante que o ivory do título
           * mantenha 4,5:1 em qualquer viewport — e que a abertura continue
           * legível se a imagem não carregar, porque o fundo sólido embaixo já
           * é a superfície do tema.
           */}
          <span aria-hidden="true" className="absolute inset-0 bg-surface" />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-[position:50%_45%] opacity-40"
            style={{ backgroundImage: `url(${stagePhotos.hero})` }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,19,18,0.82)_0%,rgba(19,19,18,0.94)_70%,var(--color-surface)_100%)]"
          />

          <Container className="relative py-stack-lg">
            <Text variant="label-md" as="p" className="text-primary">
              {t('eyebrow', { edition: currentEdition.edition, year: currentEdition.year })}
            </Text>

            <Text variant="display-lg" as="h1" id="abertura" className="mt-4 text-foreground">
              {t('title')}
            </Text>

            <Text variant="headline-lg" as="p" className="mt-2 text-foreground-muted">
              {t('subtitle')}
            </Text>

            <Text variant="body-lg" className="mt-6 max-w-prose text-foreground-muted">
              {t('signature')}
            </Text>

            <p className="mt-6 font-serif text-2xl text-secondary">{dates}</p>
            <p className="mt-1 font-sans text-base text-foreground-muted">{t('city')}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/programacao" className={buttonClassName('primary')}>
                {t('ctaProgramacao')}
              </Link>
              <Link href={`/programacao?dia=${firstDay}`} className={buttonClassName('secondary')}>
                {t('ctaHoje')}
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap gap-2">
              {currentEdition.accessibility.map((feature) => (
                <li key={feature}>
                  <Tag tone="secondary">{tFeatures(feature)}</Tag>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <Container className="pb-stack-lg">
          <DemoContentNotice className="mt-stack-md" />

          {/* ------------------------------------------ Ato II: o que está em cena */}
          <Reveal as="section" aria-labelledby="em-cena" className="mt-stack-md">
            {displayedEditionPhase === 'after' ? (
              <>
                <Text variant="headline-lg" as="h2" id="em-cena" className="text-foreground">
                  {t('nowEndedTitle')}
                </Text>
                <Text variant="body-lg" className="mt-3 max-w-prose text-foreground-muted">
                  {t('nowEndedBody', { year: displayedEdition.year })}
                </Text>
                <Link href="/memoria" className={`${buttonClassName('secondary')} mt-6`}>
                  {t('nowEndedCta')}
                </Link>
              </>
            ) : (
              <>
                <Text variant="headline-lg" as="h2" id="em-cena" className="text-foreground">
                  {t('nowTitle')}
                </Text>

                {/*
                 * O baseline do servidor é a programação completa do dia, com
                 * todos os horários — informação completa e independente de
                 * relógio. O refino abaixo só acrescenta o distintivo.
                 */}
                {isEditionRunning && featured !== undefined && (
                  <div className="mt-4">
                    <LiveNowRefinement
                      liveLabel={t('nowTitle')}
                      emptyLabel={t('nowEmptyTitle')}
                      sessions={chronological.map((activity) => ({
                        id: activity.id,
                        startsAt: new Date(activity.startsAt).getTime(),
                        endsAt: sessionEndsAt(activity)?.getTime() ?? null,
                      }))}
                    />
                  </div>
                )}
              </>
            )}
          </Reveal>

          {/* ------------------------------------------------- Ato III: a seguir */}
          <Reveal as="section" aria-labelledby="a-seguir" className="mt-stack-lg">
            <Text variant="headline-lg" as="h2" id="a-seguir" className="text-foreground">
              {isEditionRunning ? t('nextTitleToday') : t('nextTitleUpcoming')}
            </Text>

            {secondary.length === 0 ? (
              <p className="mt-4 font-sans text-base text-foreground-muted">{t('nextEmpty')}</p>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {secondary.map((activity) => {
                  const venue = findVenue(activity.venueId);

                  return (
                    <li key={activity.id}>
                      <Card as="article" className="h-full p-4">
                        <p className="font-serif text-xl text-secondary">
                          <time dateTime={activity.startsAt}>
                            {formatSessionTime(activity.startsAt, locale)}
                          </time>
                        </p>
                        <h3 className="mt-2 font-serif text-lg text-foreground">
                          <Link
                            href={activityHref(activity)}
                            className="no-underline hover:underline"
                          >
                            <ArchiveText>{activity.title}</ArchiveText>
                          </Link>
                        </h3>
                        {venue !== undefined && (
                          <ArchiveText
                            as="p"
                            className="mt-1 block font-sans text-sm text-foreground-subtle"
                          >
                            {venue.name}
                          </ArchiveText>
                        )}
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </Reveal>

          {/* --------------------------------------- Ato IV: programação em destaque */}
          {featured !== undefined && (
            <Reveal as="section" aria-labelledby="destaque" className="mt-stack-lg">
              <Text variant="headline-lg" as="h2" id="destaque" className="text-foreground">
                {t('featuredTitle')}
              </Text>

              <div className="mt-6 grid gap-6 sm:grid-cols-[auto_1fr]">
                {featured.image !== null && (
                  <ProvenancedImage
                    image={featured.image}
                    sizes="(min-width: 640px) 240px, 50vw"
                    maxRenderedWidth={240}
                    className="aspect-[3/4] w-full rounded-lg border border-outline-variant sm:w-60"
                  />
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Tag tone="primary">{tAcervo(`strands.${featured.strand}`)}</Tag>
                    {featured.rating !== null && <Tag>{tAcervo(`ratings.${featured.rating}`)}</Tag>}
                    {featured.accessibility.map((feature) => (
                      <Tag key={feature} tone="secondary">
                        {tFeatures(feature)}
                      </Tag>
                    ))}
                  </div>

                  <h3 className="mt-4 font-serif text-3xl text-foreground">
                    <ArchiveText>{featured.title}</ArchiveText>
                  </h3>
                  <ArchiveText
                    as="p"
                    className="mt-2 block font-sans text-base text-foreground-muted"
                  >
                    {featured.company}
                  </ArchiveText>

                  <Link
                    href={activityHref(featured)}
                    className={`${buttonClassName('primary')} mt-6`}
                  >
                    {t('editorialCta')}
                  </Link>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/programacao" className={buttonClassName('secondary')}>
                  {t('featuredAll')}
                </Link>
                <Link href="/programacao/grade" className={buttonClassName('ghost')}>
                  {t('featuredGrid')}
                </Link>
              </div>
            </Reveal>
          )}

          {/* ------------------------------------------------ Ato V: os oito dias */}
          <Reveal as="section" aria-labelledby="dias" className="mt-stack-lg">
            <Text variant="headline-lg" as="h2" id="dias" className="text-foreground">
              {t('daysTitle')}
            </Text>

            <ul className="scroll-x -mx-margin-mobile mt-6 flex gap-3 px-margin-mobile pb-2 lg:mx-0 lg:flex-wrap lg:px-0">
              {days.map((day) => {
                const count = activities.filter(
                  (activity) => festivalDayOf(activity.startsAt) === day,
                ).length;

                return (
                  <li key={day} className="shrink-0">
                    <Link
                      href={`/programacao?dia=${day}`}
                      className="flex min-h-11 min-w-32 flex-col gap-1 rounded-lg border border-outline-variant bg-surface-container-low p-4 no-underline transition-colors hover:border-outline"
                    >
                      <span className="font-serif text-xl text-foreground">
                        {formatShortDay(day, locale)}
                      </span>
                      <span className="font-sans text-xs text-foreground-subtle">
                        {formatWeekday(day, locale)}
                      </span>
                      <span className="font-sans text-xs text-secondary">
                        {t('daysCount', { count })}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* ----------------------------------- Ato VI: frentes de programação */}
          <Reveal as="section" aria-labelledby="frentes" className="mt-stack-lg">
            <Text variant="headline-lg" as="h2" id="frentes" className="text-foreground">
              {t('strandsTitle')}
            </Text>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(counts).map(([strand, count]) => (
                <li key={strand}>
                  <Link
                    href={`/programacao?frente=${strand}`}
                    className="flex min-h-11 items-baseline justify-between gap-4 border-b border-outline-variant/60 py-3 no-underline"
                  >
                    <span className="font-serif text-xl text-foreground">
                      {tAcervo(`strands.${strand}`)}
                    </span>
                    <span className="font-sans text-sm tracking-[0.1em] text-secondary uppercase">
                      {t('strandsCount', { count })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* --------------------------------- Ato VII: a cidade vira palco */}
          <Reveal as="section" aria-labelledby="cidade" className="mt-stack-lg">
            <Text variant="headline-lg" as="h2" id="cidade" className="text-foreground">
              {t('cityTitle')}
            </Text>
            <Text variant="body-lg" className="mt-3 max-w-prose text-foreground-muted">
              {t('cityBody')}
            </Text>

            <div className="mt-6 grid gap-stack-md lg:grid-cols-2">
              <VenueSchematic />

              <div>
                <ul className="flex flex-col gap-2">
                  {venues.slice(0, 4).map((venue) => (
                    <li key={venue.id}>
                      <Link
                        href={`/espacos/${venue.id}`}
                        className="inline-flex min-h-11 items-center font-sans text-base"
                      >
                        <ArchiveText>{venue.name}</ArchiveText>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/espacos" className={`${buttonClassName('secondary')} mt-6`}>
                  {t('cityCta')}
                </Link>
              </div>
            </div>
          </Reveal>

          {/* ------------------------------------------- Ato VIII: a memória */}
          <Reveal as="section" aria-labelledby="memoria" className="mt-stack-lg">
            <Text variant="headline-lg" as="h2" id="memoria" className="text-foreground">
              {t('memoriaTitle')}
            </Text>
            <Text variant="body-lg" className="mt-3 max-w-prose text-foreground-muted">
              {t('memoriaBody')}
            </Text>
            <Link href="/memoria" className={`${buttonClassName('secondary')} mt-6`}>
              {t('memoriaCta')}
            </Link>
          </Reveal>

          {/* --------------------------------------------- Ato IX: notícias */}
          <Reveal as="section" aria-labelledby="noticias" className="mt-stack-lg">
            <Text variant="headline-lg" as="h2" id="noticias" className="text-foreground">
              {t('noticiasTitle')}
            </Text>

            {newsNewestFirst.length === 0 ? (
              <EmptyState
                className="mt-6"
                title={tNoticias('emptyTitle')}
                description={tNoticias('emptyBody')}
              />
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {newsNewestFirst.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    <Card as="article" className="h-full p-4">
                      <h3 className="font-serif text-lg text-foreground">
                        <ArchiveText>{item.title}</ArchiveText>
                      </h3>
                    </Card>
                  </li>
                ))}
              </ul>
            )}

            <Link href="/noticias" className={`${buttonClassName('ghost')} mt-6`}>
              {t('noticiasCta')}
            </Link>
          </Reveal>

          {/* ------------------------------ Ato X: realização e parceiros */}
          <Reveal as="section" aria-labelledby="realizadores" className="mt-stack-lg">
            <Text variant="headline-lg" as="h2" id="realizadores" className="text-foreground">
              {t('partnersTitle')}
            </Text>

            <dl className="mt-6 grid gap-6 sm:grid-cols-2">
              {partners.map((partner) => (
                <div key={partner.id}>
                  <dt className="font-sans text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    {tPartners(`roles.${partner.role}`)}
                  </dt>
                  <dd className="mt-2">
                    <ArchiveText className="font-sans text-lg text-foreground">
                      {partner.name}
                    </ArchiveText>
                    {partner.noteKey !== null && (
                      <p className="mt-1 font-sans text-sm text-foreground-subtle">
                        {tPartners(`notes.${partner.noteKey}`)}
                      </p>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </main>
    </>
  );
}
