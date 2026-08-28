import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

import { activityHref } from '@/components/sections/activity-row';
import { LiveNowRefinement } from '@/components/sections/live-now-refinement';
import { Reveal } from '@/components/sections/reveal';
import { SessionCard } from '@/components/sections/session-card';
import { StageIntro } from '@/components/sections/stage-intro';
import { VenueMap } from '@/components/sections/venue-map';
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
import { editionTimeline } from '@/content/editions';
import { currentEdition, displayedEdition } from '@/content/festival';
import { honorees } from '@/content/honorees';
import { stagePhotos } from '@/content/images';
import { newsNewestFirst } from '@/content/news';
import { partners } from '@/content/partners';
import { findVenue, mappedVenues } from '@/content/venues';
import { Link } from '@/lib/i18n/navigation';
import { displayedEditionPhase, isEditionRunning } from '@/lib/utils/edition-phase';
import { festivalNow } from '@/lib/utils/festival-clock';
import {
  festivalDayFromDate,
  formatFestivalDate,
  formatSessionTime,
  formatShortDay,
  formatWeekday,
} from '@/lib/utils/format';
import { countsByDay, countsByStrand } from '@/lib/utils/program';
import { availableDays, STRANDS } from '@/lib/utils/program-query';
import { festivalDayOf, liveSessions, nextSessions, sessionEndsAt } from '@/lib/utils/schedule';

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
  const tCommon = await getTranslations('common');
  const tIntro = await getTranslations('intro');
  const tAcervo = await getTranslations('acervo');
  const tNoticias = await getTranslations('noticias');
  const tPartners = await getTranslations('parceiros');
  const tFeatures = await getTranslations('accessibilityFeatures');

  /*
   * Dias e contagens vêm da programação inteira — sessões, oficinas e
   * demonstrações de processo criativo —, e não só de `activities`. É a mesma
   * fonte que `/programacao` usa, e é o que impede a home de anunciar três
   * frentes numa edição que tem cinco.
   */
  const days = availableDays;
  const counts = countsByStrand({});
  const dayCounts = countsByDay({}, days);
  const chronological = [...activities].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  /*
   * Os três recortes de tempo da home, derivados de um único instante.
   *
   * O instante vem de `festival-clock`, não de `new Date()`, e por isso
   * servidor e cliente chegam ao mesmo resultado. Os três recortes são
   * disjuntos de propósito: o que está em cena não se repete em "ainda hoje", e
   * o destaque de "em cartaz" é o primeiro que sobra depois dos dois — três
   * seções seguidas mostrando a mesma sessão pareceriam um erro de dados.
   */
  const now = festivalNow();
  const today = festivalDayFromDate(now);
  const live = liveSessions(chronological, now);
  const upcomingToday = nextSessions(
    chronological.filter((activity) => festivalDayOf(activity.startsAt) === today),
    now,
    3,
  );
  const isToday = upcomingToday.length > 0;
  /*
   * Numa edição já encerrada não existe "a seguir": a seção passa a apresentar
   * as primeiras sessões da edição, e o título acompanha.
   */
  const upcoming =
    displayedEditionPhase === 'after'
      ? chronological.slice(0, 3)
      : isToday
        ? upcomingToday
        : nextSessions(chronological, now, 3);

  const shown = new Set([...live, ...upcoming].map((activity) => activity.id));
  const remaining = chronological.filter((activity) => !shown.has(activity.id));
  const featured = nextSessions(remaining, now, 1)[0] ?? remaining[0] ?? chronological[0];
  const featuredVenue = featured === undefined ? undefined : findVenue(featured.venueId);

  /* O atalho de "hoje" só é honesto se hoje for um dia da edição. */
  const shortcutDay = days.includes(today) ? today : (days[0] ?? '');

  /*
   * A prévia da memória, derivada da linha do tempo — nenhum número à mão.
   *
   * O ano de fundação é o menor da linha do tempo (2004, sem edição); a
   * primeira edição é a do ano seguinte. É a mesma grade que `/memoria`
   * apresenta, e por isso as duas telas não podem discordar.
   */
  const foundingYear = Math.min(...editionTimeline.map((entry) => entry.firstYear));
  const editionsCount = editionTimeline.reduce((total, entry) => total + entry.editionCount, 0);
  const publishedEditions = editionTimeline.filter((entry) => entry.hasEditionPage).length;
  const editionsBeingDigitised = editionTimeline
    .filter((entry) => entry.archiveState === 'em-digitalizacao')
    .reduce((total, entry) => total + entry.editionCount, 0);
  const timelineYears = Array.from(
    { length: currentEdition.year - foundingYear + 1 },
    (_, index) => foundingYear + index,
  );

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
        {/*
         * A abertura sobe para debaixo do cabeçalho e devolve a mesma medida em
         * respiro interno: a fotografia atravessa a faixa transparente do topo
         * sem que uma linha de texto chegue a ficar por baixo dela.
         */}
        <section
          aria-labelledby="abertura"
          className="relative -mt-(--header-height) overflow-hidden pt-(--header-height)"
        >
          {/*
           * A fotografia é atmosfera, não informação: `aria-hidden`, e sob um
           * véu que a deixa aparecer onde não há texto e a segura onde há. O
           * orçamento de contraste dessas duas camadas está calculado em
           * `globals.css`, na seção "A fotografia da abertura" — mexer na
           * opacidade aqui sem refazer aquela conta quebra o piso de 4,5:1.
           *
           * O fundo sólido embaixo é a superfície do tema: a abertura continua
           * legível se a imagem não carregar.
           */}
          <span aria-hidden="true" className="absolute inset-0 bg-surface" />
          <span
            aria-hidden="true"
            className="hero-photo absolute inset-0"
            style={{ backgroundImage: `url(${stagePhotos.hero})` }}
          />
          <span aria-hidden="true" className="hero-scrim absolute inset-0" />

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
              <Link
                href={`/programacao?dia=${shortcutDay}`}
                className={buttonClassName('secondary')}
              >
                {t('ctaHoje')}
              </Link>
            </div>

            {/*
             * A entrada franca abre a lista porque é a informação que mais muda
             * a decisão de quem lê — vem antes dos recursos de acessibilidade,
             * que respondem a outra pergunta.
             */}
            <ul className="mt-8 flex flex-wrap gap-2">
              {currentEdition.freeEntry && (
                <li>
                  <Tag tone="primary">{tCommon('freeEntry')}</Tag>
                </li>
              )}
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
                {/*
                 * O ano vive **no título**, não só no corpo. Logo acima desta
                 * seção o herói anuncia a edição vigente; um "esta edição está
                 * encerrada" sem ano é lido como se fosse ela que terminou.
                 */}
                <Text variant="headline-lg" as="h2" id="em-cena" className="text-foreground">
                  {t('nowEndedTitle', { year: displayedEdition.year })}
                </Text>
                <Text variant="body-lg" className="mt-3 max-w-prose text-foreground-muted">
                  {t('nowEndedBody')}
                </Text>
                <Link href="/memoria" className={`${buttonClassName('secondary')} mt-6`}>
                  {t('nowEndedCta')}
                </Link>
              </>
            ) : (
              <>
                <Text variant="headline-lg" as="h2" id="em-cena" className="text-foreground">
                  {live.length > 0 ? t('nowTitle') : t('nowEmptyTitle')}
                </Text>

                {/*
                 * O servidor já sabe o que está em cena e escreve os cartões no
                 * HTML — quem chega sem JavaScript recebe a mesma informação. O
                 * refino do cliente só reconfere o distintivo minuto a minuto.
                 */}
                {live.length === 0 ? (
                  <>
                    <Text variant="body-lg" className="mt-3 max-w-prose text-foreground-muted">
                      {t('nowEmptyBody')}
                    </Text>

                    {/*
                     * O refino só entra onde ainda pode acrescentar algo: o
                     * servidor não tinha nada em cena, e uma sessão pode ter
                     * começado desde então. Onde há cartão em cena, o
                     * distintivo já está neles — repeti-lo aqui seria ruído.
                     */}
                    {isEditionRunning && (
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
                ) : (
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {live.map((activity) => (
                      <li key={activity.id}>
                        <SessionCard activity={activity} isLive />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </Reveal>

          {/* ------------------------------------------------- Ato III: a seguir */}
          <Reveal as="section" aria-labelledby="a-seguir" className="mt-stack-lg">
            {/*
             * Três estados, não dois. Enquanto a edição exibida for um acervo
             * já encerrado, "nos próximos dias" é falso: estas são as primeiras
             * sessões de uma edição que aconteceu.
             */}
            <Text variant="headline-lg" as="h2" id="a-seguir" className="text-foreground">
              {displayedEditionPhase === 'after'
                ? t('nextTitleArchive', { year: displayedEdition.year })
                : isToday
                  ? t('nextTitleToday')
                  : t('nextTitleUpcoming')}
            </Text>

            {upcoming.length === 0 ? (
              <p className="mt-4 font-sans text-base text-foreground-muted">{t('nextEmpty')}</p>
            ) : (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((activity) => (
                  <li key={activity.id}>
                    <SessionCard activity={activity} />
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          {/* --------------------------------------- Ato IV: programação em destaque */}
          {featured !== undefined && (
            <Reveal as="section" aria-labelledby="destaque" className="mt-stack-lg">
              <Text variant="headline-lg" as="h2" id="destaque" className="text-foreground">
                {t('featuredTitle')}
              </Text>

              <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,22rem)_1fr] sm:gap-8">
                {featured.image !== null && (
                  <ProvenancedImage
                    image={featured.image}
                    sizes="(min-width: 640px) 352px, 92vw"
                    maxRenderedWidth={240}
                    position="50% 35%"
                    className="aspect-[4/3] w-full rounded-lg border border-outline-variant"
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

                  {/*
                   * Quando e onde: a pergunta que traz o público de Vitória ao
                   * portal. O destaque a respondia só depois de um clique.
                   */}
                  <p className="mt-3 font-sans text-sm text-foreground-subtle">
                    <time dateTime={featured.startsAt}>
                      {formatShortDay(festivalDayOf(featured.startsAt), locale)}
                      {', '}
                      {formatSessionTime(featured.startsAt, locale)}
                    </time>
                    {featuredVenue !== undefined && (
                      <>
                        {' · '}
                        <ArchiveText>{featuredVenue.name}</ArchiveText>
                      </>
                    )}
                  </p>

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
                const count = dayCounts[day] ?? 0;

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

            {/*
             * Coluna única. Em duas colunas, uma frente ímpar sobra na segunda
             * linha e a régua dela fica pendurada sob metade da página — e a
             * lista de frentes é curta o bastante para não precisar da divisão.
             */}
            <ul className="mt-6 flex flex-col">
              {STRANDS.filter((strand) => counts[strand] > 0).map((strand) => (
                <li key={strand}>
                  <Link
                    href={`/programacao?frente=${strand}`}
                    className="flex min-h-11 items-baseline justify-between gap-4 border-b border-outline-variant/60 py-3 no-underline transition-colors hover:border-outline"
                  >
                    <span className="font-serif text-xl text-foreground">
                      {tAcervo(`strands.${strand}`)}
                    </span>
                    <span className="font-sans text-sm tracking-[0.1em] text-secondary uppercase">
                      {t('strandsCount', { count: counts[strand] })}
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
              <VenueMap />

              <div>
                {/*
                 * Com o endereço, e **numerada como o mapa ao lado**: o número
                 * aqui e o marcador lá são o mesmo espaço, o que é o que torna
                 * o mapa legível sem rótulo em cima de cada ponto.
                 */}
                <ol className="flex flex-col">
                  {mappedVenues.map((venue, index) => (
                    <li key={venue.id}>
                      <Link
                        href={`/espacos/${venue.id}`}
                        className="group flex min-h-11 items-baseline gap-3 border-b border-outline-variant/60 py-3 no-underline transition-colors hover:border-outline"
                      >
                        <span
                          aria-hidden="true"
                          className="w-5 shrink-0 font-sans text-sm font-bold text-secondary tabular-nums"
                        >
                          {index + 1}
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <ArchiveText className="font-sans text-base text-foreground group-hover:underline">
                            {venue.name}
                          </ArchiveText>
                          <ArchiveText className="font-sans text-sm text-foreground-subtle">
                            {venue.address}
                          </ArchiveText>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
                <Link href="/espacos" className={`${buttonClassName('secondary')} mt-6`}>
                  {t('cityCta')}
                </Link>
              </div>
            </div>
          </Reveal>

          {/* ------------------------------ Ato VIII: a edição, por quem a assina */}
          {currentEdition.statement !== null && (
            <Reveal as="section" aria-labelledby="a-edicao" className="mt-stack-lg">
              <Text variant="headline-lg" as="h2" id="a-edicao" className="text-foreground">
                {t('editionTitle', { edition: currentEdition.edition })}
              </Text>

              <div className="mt-6 grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
                {currentEdition.statement.portrait !== null && (
                  <ProvenancedImage
                    image={currentEdition.statement.portrait}
                    sizes="128px"
                    maxRenderedWidth={128}
                    className="size-32 rounded-full border border-primary/50"
                  />
                )}

                <blockquote className="m-0 min-w-0 border-l-2 border-primary pl-5">
                  {/*
                   * Acervo em pt-BR: a apresentação é assinada, e traduzi-la
                   * mudaria o que a pessoa escreveu. `ArchiveText` marca o
                   * idioma real do trecho para o leitor de tela.
                   */}
                  <ArchiveText
                    as="p"
                    className="block max-w-prose font-sans text-lg leading-relaxed text-foreground-muted"
                  >
                    {currentEdition.statement.quote}
                  </ArchiveText>
                  <footer className="mt-4 font-sans text-sm tracking-[0.08em] text-primary uppercase">
                    <ArchiveText>
                      {currentEdition.statement.author} · {currentEdition.statement.authorRole}
                    </ArchiveText>
                  </footer>
                </blockquote>
              </div>

              <Link
                href={`/edicoes/${currentEdition.year}`}
                className={`${buttonClassName('secondary')} mt-8`}
              >
                {t('editionCta')}
              </Link>
            </Reveal>
          )}

          {/* --------------------------------------- Ato IX: os homenageados */}
          {honorees.length > 0 && (
            <Reveal as="section" aria-labelledby="homenageados" className="mt-stack-lg">
              <Text variant="headline-lg" as="h2" id="homenageados" className="text-foreground">
                {t('honoreesTitle', { year: currentEdition.year })}
              </Text>
              <Text variant="body-lg" className="mt-3 max-w-prose text-foreground-muted">
                {t('honoreesBody')}
              </Text>

              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {honorees.map((honoree) => (
                  <li key={honoree.id}>
                    <Card as="article" className="flex h-full items-start gap-4 p-5">
                      {honoree.portrait !== null && (
                        <ProvenancedImage
                          image={honoree.portrait}
                          sizes="72px"
                          maxRenderedWidth={72}
                          className="size-18 shrink-0 rounded-full border border-primary/50"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="font-serif text-xl leading-tight text-foreground">
                          <ArchiveText>{honoree.name}</ArchiveText>
                        </h3>
                        <ArchiveText
                          as="p"
                          className="mt-1 block font-sans text-xs tracking-[0.1em] text-secondary uppercase"
                        >
                          {honoree.role}
                        </ArchiveText>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* ------------------------------------------- Ato X: a memória */}
          <Reveal as="section" aria-labelledby="memoria" className="mt-stack-lg">
            <Text variant="headline-lg" as="h2" id="memoria" className="text-foreground">
              {t('memoriaTitle')}
            </Text>
            <Text variant="body-lg" className="mt-3 max-w-prose text-foreground-muted">
              {t('memoriaBody')}
            </Text>

            {/*
             * A prévia da linha do tempo, e não só um botão para ela.
             *
             * Cada número aqui é **derivado de `editionTimeline`** — quantas
             * edições existem, quantas têm acervo publicado, quantas ainda
             * estão sendo digitalizadas. Nada é escrito à mão, e por isso nada
             * envelhece: quando uma edição sair da digitalização, os três
             * números e o trilho mudam juntos.
             */}
            {/*
             * O trilho é **decorativo**, e por isso `aria-hidden`: vinte e um
             * itens de lista anunciando só um ano cada seriam ruído para quem
             * usa leitor de tela. A informação que ele carrega — o intervalo e o
             * quanto do acervo está publicado — está logo abaixo, em texto.
             */}
            <div aria-hidden="true" className="mt-8 max-w-xl">
              <div className="flex items-end gap-1.5">
                {timelineYears.map((year) => {
                  const isCurrent = year === currentEdition.year;

                  return (
                    <span
                      key={year}
                      className={
                        isCurrent
                          ? 'h-12 flex-1 rounded-full bg-secondary'
                          : 'h-5 flex-1 rounded-full bg-outline-variant'
                      }
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between font-sans text-xs tracking-[0.08em] tabular-nums">
                <span className="text-foreground-subtle">{foundingYear}</span>
                <span className="text-secondary">{currentEdition.year}</span>
              </div>
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
              {[
                { id: 'edicoes', value: editionsCount, label: t('memoriaEditions') },
                { id: 'publicadas', value: publishedEditions, label: t('memoriaPublished') },
                {
                  id: 'digitalizacao',
                  value: editionsBeingDigitised,
                  label: t('memoriaDigitising'),
                },
              ].map((item) => (
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

            <Link href="/memoria" className={`${buttonClassName('secondary')} mt-8`}>
              {t('memoriaCta')}
            </Link>
          </Reveal>

          {/* --------------------------------------------- Ato XI: notícias */}
          <Reveal as="section" aria-labelledby="noticias" className="mt-stack-lg">
            <Text variant="headline-lg" as="h2" id="noticias" className="text-foreground">
              {t('noticiasTitle')}
            </Text>

            {/*
             * Sem notícias, sem chamada. O estado vazio já diz tudo o que a
             * rota de notícias diria; o botão só levaria ao mesmo vazio.
             */}
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

            {newsNewestFirst.length > 0 && (
              <Link href="/noticias" className={`${buttonClassName('ghost')} mt-6`}>
                {t('noticiasCta')}
              </Link>
            )}
          </Reveal>

          {/* ------------------------------ Ato XII: realização e parceiros */}
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
