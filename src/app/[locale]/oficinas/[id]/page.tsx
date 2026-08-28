import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/sections/page-header';
import { ArchiveText } from '@/components/ui/archive-text';
import { buttonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { DefinitionList } from '@/components/ui/definition-list';
import { ProvenancedImage } from '@/components/ui/provenanced-image';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Tag } from '@/components/ui/tag';
import { Text } from '@/components/ui/text';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { findActivity } from '@/content/activities';
import { findVenue } from '@/content/venues';
import { findWorkshop, workshops } from '@/content/workshops';
import { Link } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';
import { festivalNow } from '@/lib/utils/festival-clock';
import { formatFestivalDate, formatSessionTime } from '@/lib/utils/format';
import { festivalDayOf, workshopHasEnded } from '@/lib/utils/schedule';

import type { Metadata } from 'next';
import type { Definition } from '@/components/ui/definition-list';

interface OficinaPageProps {
  readonly params: Promise<{ locale: string; id: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    workshops.map((workshop) => ({ locale, id: workshop.id })),
  );
}

export async function generateMetadata({ params }: OficinaPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const workshop = findWorkshop(id);

  if (workshop === undefined) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: 'oficina' });

  return { title: workshop.title, description: `${t('kicker')} — ${workshop.teachers}` };
}

/**
 * A página de uma oficina.
 *
 * A inscrição acontece **fora do portal**, em formulário externo. Nenhum campo
 * de entrada de dados existe aqui: o projeto não tem backend, não tem
 * biblioteca de formulário e não deve coletar dado pessoal nenhum.
 */
export default async function OficinaPage({ params }: OficinaPageProps) {
  const { locale: routeLocale, id } = await params;
  setRequestLocale(routeLocale);

  const workshop = findWorkshop(id);

  if (workshop === undefined) {
    notFound();
  }

  const locale = await getLocale();
  const t = await getTranslations('oficina');
  const tAcervo = await getTranslations('acervo');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');
  const tEspacos = await getTranslations('espacos');
  const tFeatures = await getTranslations('accessibilityFeatures');

  const venue = findVenue(workshop.venueId);
  const relatedActivity =
    workshop.relatedActivityId === null ? undefined : findActivity(workshop.relatedActivityId);

  const days = workshop.sessions.map((session) => festivalDayOf(session.startsAt));
  const firstSession = workshop.sessions[0];

  /*
   * O aviso é **desta oficina**, não da edição: durante o festival umas já
   * aconteceram e outras ainda recebem inscrição, e a diferença é justamente o
   * que quem chega precisa saber.
   */
  const hasEnded = workshopHasEnded(workshop, festivalNow());

  const details: readonly Definition[] = [
    {
      id: 'formato',
      term: t('formatLabel'),
      description: t(`formats.${workshop.format}`),
    },
    {
      id: 'datas',
      term: t('datesLabel'),
      description: days.map((day) => formatFestivalDate(day, locale)).join(' · '),
    },
    ...(firstSession === undefined
      ? []
      : [
          {
            id: 'horario',
            term: t('timeLabel'),
            description: `${formatSessionTime(firstSession.startsAt, locale)} — ${formatSessionTime(
              firstSession.endsAt,
              locale,
            )}`,
          },
        ]),
    ...(venue === undefined
      ? []
      : [
          {
            id: 'espaco',
            term: t('venueLabel'),
            description: <ArchiveText>{venue.name}</ArchiveText>,
          },
        ]),
    {
      id: 'quem-conduz',
      term: t('teachersLabel'),
      description: <ArchiveText>{workshop.teachers}</ArchiveText>,
    },
    {
      id: 'publico',
      term: t('audienceLabel'),
      description: <ArchiveText>{workshop.audience}</ArchiveText>,
    },
    {
      id: 'faixa-etaria',
      term: t('ageLabel'),
      description:
        workshop.minimumAge === null ? t('ageAll') : t('ageValue', { age: workshop.minimumAge }),
    },
    { id: 'turmas', term: t('classesLabel'), description: String(workshop.classCount) },
    {
      id: 'vagas',
      term: t('seatsLabel'),
      description: t('seatsValue', { count: workshop.seatsPerClass }),
    },
  ];

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <PageHeader
        title={workshop.title}
        isArchiveTitle
        // A oficina é identificada como ação formativa, não como espetáculo.
        kicker={t('kicker')}
        back={{ href: '/programacao', label: tNav('backToProgramacao') }}
      >
        <p className="mt-4 font-sans text-lg text-foreground-muted">
          <ArchiveText>{workshop.teachers}</ArchiveText>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Tag tone="primary">{tAcervo('strands.oficina')}</Tag>
          <Tag tone="secondary">{tCommon('freeEntry')}</Tag>
        </div>
      </PageHeader>

      <Container className="pb-stack-lg">
        {/*
         * A fotografia é a mesma que a oficina carrega na programação — vem do
         * acervo, não de uma escolha desta tela, e por isso é a mesma imagem em
         * toda parte.
         */}
        {workshop.image !== null && (
          <ProvenancedImage
            image={workshop.image}
            sizes="(min-width: 768px) 640px, 92vw"
            maxRenderedWidth={280}
            fit={workshop.image.isLowResolution ? 'contain' : 'cover'}
            position="50% 30%"
            className="mb-stack-md aspect-[4/3] w-full max-w-2xl rounded-lg border border-outline-variant"
          />
        )}

        <section aria-labelledby="descricao">
          <Text variant="headline-lg" as="h2" id="descricao" className="text-foreground">
            {t('descriptionTitle')}
          </Text>
          <p className="mt-2 font-sans text-sm text-foreground-subtle">
            {tAcervo('languageNotice')}
          </p>
          <ArchiveText
            as="p"
            className="mt-4 block max-w-prose font-sans text-lg leading-relaxed text-foreground-muted"
          >
            {workshop.description}
          </ArchiveText>
        </section>

        {workshop.accessibility.length > 0 && (
          <section aria-labelledby="acessibilidade" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="acessibilidade" className="text-foreground">
              {tAcervo('accessibilityTitle')}
            </Text>
            <ul className="mt-4 flex flex-wrap gap-2">
              {workshop.accessibility.map((feature) => (
                <li key={feature}>
                  <Tag tone="secondary">{tFeatures(feature)}</Tag>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="inscricao" className="mt-stack-md">
          <Text variant="headline-lg" as="h2" id="inscricao" className="text-foreground">
            {t('registrationTitle')}
          </Text>

          <DefinitionList className="mt-6" items={details} />

          {hasEnded && (
            <p className="mt-6 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 font-sans text-base text-foreground-muted">
              {t('endedNotice')}
            </p>
          )}

          {/*
           * O aviso vem **antes** do link, e não depois: quem usa leitor de tela
           * precisa saber que vai sair do portal enquanto decide se clica, não
           * depois de já ter clicado.
           */}
          <p className="mt-6 max-w-prose font-sans text-base text-foreground-muted">
            {tCommon('externalLinkNotice')}
          </p>

          <a
            href={workshop.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClassName('primary')} mt-4`}
          >
            {t('registrationCta')}
            <VisuallyHidden> ({tCommon('opensInNewTab')})</VisuallyHidden>
          </a>
        </section>

        {workshop.requirements !== null && (
          <section aria-labelledby="requisitos" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="requisitos" className="text-foreground">
              {t('requirementsTitle')}
            </Text>
            <ArchiveText
              as="p"
              className="mt-4 block max-w-prose font-sans text-base text-foreground-muted"
            >
              {workshop.requirements}
            </ArchiveText>
          </section>
        )}

        {venue !== undefined && (
          <section aria-labelledby="espaco-oficina" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="espaco-oficina" className="text-foreground">
              {t('venueLabel')}
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
            <Link href={`/espacos/${venue.id}`} className={`${buttonClassName('secondary')} mt-6`}>
              {tEspacos('mapCta')}
            </Link>
          </section>
        )}

        {relatedActivity !== undefined && (
          <section aria-labelledby="relacionado" className="mt-stack-md">
            <Text variant="headline-lg" as="h2" id="relacionado" className="text-foreground">
              {t('relatedTitle')}
            </Text>
            <Link
              href={`/espetaculos/${relatedActivity.id}`}
              className="mt-4 inline-flex min-h-11 items-center text-lg"
            >
              <ArchiveText>{relatedActivity.title}</ArchiveText>
            </Link>
          </section>
        )}
      </Container>
    </main>
  );
}
