import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { activityHref } from '@/components/sections/activity-row';
import { PageHeader } from '@/components/sections/page-header';
import { ArchiveText } from '@/components/ui/archive-text';
import { buttonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { DefinitionList } from '@/components/ui/definition-list';
import { ProvenancedImage } from '@/components/ui/provenanced-image';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Tag } from '@/components/ui/tag';
import { Text } from '@/components/ui/text';
import { activities, findActivity } from '@/content/activities';
import { creativeProcesses } from '@/content/creative-processes';
import { findVenue } from '@/content/venues';
import { workshops } from '@/content/workshops';
import { Link } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';
import {
  formatDuration,
  formatFestivalDate,
  formatSessionTime,
  formatWeekday,
} from '@/lib/utils/format';
import { festivalNow } from '@/lib/utils/festival-clock';
import { festivalDayOf, sessionEndsAt, sessionStatus } from '@/lib/utils/schedule';

import type { Metadata } from 'next';
import type { Definition } from '@/components/ui/definition-list';

interface EspetaculoPageProps {
  readonly params: Promise<{ locale: string; id: string }>;
}

/**
 * As 20 atividades do acervo, nos três idiomas, geradas no build.
 *
 * O acervo é estático e cabe na memória: não há motivo para renderizar uma
 * página de espetáculo sob demanda.
 */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    activities.map((activity) => ({ locale, id: activity.id })),
  );
}

export async function generateMetadata({ params }: EspetaculoPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const activity = findActivity(id);

  if (activity === undefined) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'acervo' });

  return {
    title: activity.title,
    // O release é acervo em pt-BR; a descrição da página o resume sem traduzir.
    description: `${activity.title} — ${activity.company} · ${t(`strands.${activity.strand}`)}`,
  };
}

/** A página de um espetáculo. */
export default async function EspetaculoPage({ params }: EspetaculoPageProps) {
  const { locale: routeLocale, id } = await params;
  setRequestLocale(routeLocale);

  const activity = findActivity(id);

  // O id vem da URL: um espetáculo que não existe é 404, não uma página vazia.
  if (activity === undefined) {
    notFound();
  }

  const locale = await getLocale();
  const t = await getTranslations('espetaculo');
  const tAcervo = await getTranslations('acervo');
  const tSessao = await getTranslations('sessao');
  const tNav = await getTranslations('nav');
  const tEspacos = await getTranslations('espacos');
  const tCommon = await getTranslations('common');
  const tFeatures = await getTranslations('accessibilityFeatures');

  const venue = findVenue(activity.venueId);
  const day = festivalDayOf(activity.startsAt);
  const endsAt = sessionEndsAt(activity);

  /*
   * A situação é **desta sessão**, não da edição inteira: no quinto dia do
   * festival, a sessão de domingo ainda está por vir e a de segunda já
   * terminou, e um rótulo único mentiria para uma das duas. O instante vem de
   * `festival-clock`, decidido no servidor — nada aqui hidrata.
   */
  const status = sessionStatus(activity, festivalNow());
  const sessionLabel =
    status === 'ended'
      ? tSessao('ended')
      : status === 'live'
        ? tSessao('live')
        : tSessao('upcoming');

  const process = creativeProcesses
    .find((entry) => entry.date === day)
    ?.items.find((item) => item.company.startsWith(activity.company.split(' —')[0] ?? ''));

  const otherSessions = activities.filter(
    (other) => other.company === activity.company && other.id !== activity.id,
  );

  const relatedWorkshop = workshops.find((workshop) => workshop.relatedActivityId === activity.id);

  /*
   * Cada ausência é declarada como ausência, e não omitida: "duração não
   * informada" diz que o programa não trouxe o dado; uma linha que some deixa
   * quem lê sem saber se a informação não existe ou se a página falhou.
   */
  const essentials: readonly Definition[] = [
    { id: 'data', term: t('dateLabel'), description: formatFestivalDate(day, locale) },
    {
      id: 'horario',
      term: t('timeLabel'),
      description: (
        <time dateTime={activity.startsAt}>{formatSessionTime(activity.startsAt, locale)}</time>
      ),
    },
    { id: 'semana', term: t('weekdayLabel'), description: formatWeekday(day, locale) },
    {
      id: 'termino',
      term: t('endsLabel'),
      description:
        endsAt === null
          ? tAcervo('endsAtUnknown')
          : formatSessionTime(endsAt.toISOString(), locale),
    },
    {
      id: 'duracao',
      term: tAcervo('durationLabel'),
      description:
        activity.durationInMinutes === null
          ? tAcervo('durationUnknown')
          : formatDuration(activity.durationInMinutes, locale),
    },
    {
      id: 'classificacao',
      term: tAcervo('ratingLabel'),
      description:
        activity.rating === null ? tAcervo('ratingUnknown') : tAcervo(`ratings.${activity.rating}`),
    },
    ...(venue === undefined
      ? []
      : [
          {
            id: 'espaco',
            term: t('venueLabel'),
            description: <ArchiveText>{venue.name}</ArchiveText>,
          },
          {
            id: 'endereco',
            term: t('addressLabel'),
            description: <ArchiveText>{venue.address}</ArchiveText>,
          },
        ]),
  ];

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <PageHeader
        title={activity.title}
        isArchiveTitle
        kicker={`${tAcervo(`strands.${activity.strand}`)} · ${sessionLabel}`}
        back={{ href: '/programacao', label: tNav('backToProgramacao') }}
      >
        <p className="mt-4 font-sans text-lg text-foreground-muted">
          <ArchiveText>{activity.company}</ArchiveText>
          {' · '}
          {activity.stateCode}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag tone="secondary">{tCommon('freeEntry')}</Tag>
          {activity.rating !== null && <Tag>{tAcervo(`ratings.${activity.rating}`)}</Tag>}
        </div>
      </PageHeader>

      <Container className="pb-stack-lg">
        {activity.image !== null && (
          /*
           * A largura é declarada, e não deixada a cargo do container: sem o
           * teto, uma fotografia restaurada ocuparia a coluna inteira num
           * recorte 3:4 e ficaria com mais de 1500px de altura. O recorte é
           * 4:3, a partir do terço superior, que é a proporção em que a maior
           * parte das fotografias de cena foi tirada.
           */
          <ProvenancedImage
            image={activity.image}
            sizes="(min-width: 768px) 640px, 92vw"
            maxRenderedWidth={280}
            fit={activity.image.isLowResolution ? 'contain' : 'cover'}
            position="50% 30%"
            className="mb-stack-md aspect-[4/3] w-full max-w-2xl rounded-lg border border-outline-variant"
          />
        )}

        <section aria-labelledby="sessao">
          <Text variant="headline-lg" as="h2" id="sessao" className="text-foreground">
            {t('essentialsTitle')}
          </Text>
          <DefinitionList className="mt-6" items={essentials} />
        </section>

        {/*
         * A acessibilidade vem **acima** da ficha técnica, e não no fim da
         * página: para quem depende dela, é o dado que decide se vale ir — não
         * um detalhe de produção.
         */}
        {activity.accessibility.length > 0 && (
          <section aria-labelledby="acessibilidade" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="acessibilidade" className="text-foreground">
              {t('accessibilityTitle')}
            </Text>
            <ul className="mt-4 flex flex-wrap gap-2">
              {activity.accessibility.map((feature) => (
                <li key={feature}>
                  <Tag tone="secondary">{tFeatures(feature)}</Tag>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="release" className="mt-stack-md">
          <Text variant="headline-lg" as="h2" id="release" className="text-foreground">
            {t('releaseTitle')}
          </Text>
          <p className="mt-2 font-sans text-sm text-foreground-subtle">
            {tAcervo('languageNotice')}
          </p>
          <ArchiveText
            as="p"
            className="mt-4 block max-w-prose font-sans text-lg leading-relaxed text-foreground-muted"
          >
            {activity.release}
          </ArchiveText>

          {activity.note !== null && (
            <div className="mt-6 border-l-2 border-secondary pl-4">
              <p className="font-sans text-xs font-semibold tracking-[0.16em] text-secondary uppercase">
                {t('noteTitle')}
              </p>
              <ArchiveText as="p" className="mt-1 block font-sans text-base text-foreground-muted">
                {activity.note}
              </ArchiveText>
            </div>
          )}
        </section>

        {activity.technicalSheet.length > 0 && (
          <section aria-labelledby="ficha" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="ficha" className="text-foreground">
              {t('technicalSheetTitle')}
            </Text>
            {/*
             * Ordem e grafia da ficha são as do programa impresso: numa ficha
             * técnica, a ordem é parte da informação.
             */}
            <dl className="mt-6 flex flex-col">
              {activity.technicalSheet.map((line) => (
                <div
                  key={`${line.label}-${line.value}`}
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
        )}

        <section aria-labelledby="companhia" className="mt-stack-md">
          <Text variant="headline-lg" as="h2" id="companhia" className="text-foreground">
            {t('companyTitle')}
          </Text>
          <DefinitionList
            className="mt-6"
            items={[
              {
                id: 'nome',
                term: t('companyTitle'),
                description: <ArchiveText>{activity.company}</ArchiveText>,
              },
              { id: 'origem', term: t('originLabel'), description: activity.stateCode },
              ...(activity.author === null
                ? []
                : [
                    {
                      id: 'autoria',
                      term: t('authorLabel'),
                      description: <ArchiveText>{activity.author}</ArchiveText>,
                    },
                  ]),
              ...(activity.director === null
                ? []
                : [
                    {
                      id: 'direcao',
                      term: t('directorLabel'),
                      description: <ArchiveText>{activity.director}</ArchiveText>,
                    },
                  ]),
            ]}
          />
        </section>

        {venue !== undefined && (
          <section aria-labelledby="espaco" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="espaco" className="text-foreground">
              {t('venueTitle')}
            </Text>
            <ArchiveText as="p" className="mt-4 block font-sans text-lg text-foreground">
              {venue.name}
            </ArchiveText>
            <ArchiveText as="p" className="mt-1 block font-sans text-base text-foreground-muted">
              {venue.address}
            </ArchiveText>
            <p className="mt-2 font-sans text-sm text-foreground-subtle">
              {tEspacos(`kinds.${venue.kind}`)}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/espacos/${venue.id}`} className={buttonClassName('secondary')}>
                {t('mapCta')}
              </Link>
              <Link
                href={`/programacao/grade?visao=espaco&dia=${day}`}
                className={buttonClassName('ghost')}
              >
                {t('gridCta')}
              </Link>
            </div>
          </section>
        )}

        {process !== undefined && (
          <section aria-labelledby="processo" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="processo" className="text-foreground">
              {t('creativeProcessTitle')}
            </Text>
            <p className="mt-4 max-w-prose font-sans text-base text-foreground-muted">
              {t('creativeProcessBody')}
            </p>
          </section>
        )}

        {relatedWorkshop !== undefined && (
          <section aria-labelledby="oficina-relacionada" className="mt-stack-md">
            <Text
              variant="headline-lg"
              as="h2"
              id="oficina-relacionada"
              className="text-foreground"
            >
              {tAcervo('strands.oficina')}
            </Text>
            <Link
              href={`/oficinas/${relatedWorkshop.id}`}
              className="mt-4 inline-flex min-h-11 items-center text-lg"
            >
              <ArchiveText>{relatedWorkshop.title}</ArchiveText>
            </Link>
          </section>
        )}

        {/* Omitida quando não houver — não existe seção vazia dizendo "nenhuma". */}
        {otherSessions.length > 0 && (
          <section aria-labelledby="outras" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="outras" className="text-foreground">
              {t('otherSessionsTitle')}
            </Text>
            <ul className="mt-6 flex flex-col gap-3">
              {otherSessions.map((other) => (
                <li key={other.id}>
                  <Link
                    href={activityHref(other)}
                    className="inline-flex min-h-11 items-center font-sans text-base"
                  >
                    <ArchiveText>{other.title}</ArchiveText>
                  </Link>
                  <span className="ml-2 font-sans text-sm text-foreground-subtle">
                    {formatFestivalDate(festivalDayOf(other.startsAt), locale)} ·{' '}
                    {formatSessionTime(other.startsAt, locale)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </main>
  );
}
