import { getLocale, getTranslations } from 'next-intl/server';

import { ArchiveText } from '@/components/ui/archive-text';
import { buttonClassName } from '@/components/ui/button';
import { ProvenancedImage } from '@/components/ui/provenanced-image';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { findVenue } from '@/content/venues';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import {
  formatDayNumber,
  formatDuration,
  formatMonthShort,
  formatSessionTime,
  formatShortDay,
  formatWeekday,
  formatWeekdayShort,
} from '@/lib/utils/format';
import { festivalDayOf } from '@/lib/utils/schedule';

import type { ProgramItem } from '@/lib/utils/program';
import type { AccessibilityFeatureId, ImageAsset, IsoDate } from '@/types/festival';
import type { ReactNode } from 'react';

/**
 * Como a atividade ocupa a página.
 *
 * `lead` abre uma frente: escala maior, cartaz maior, release e chamada para o
 * detalhe. `row` é o corpo do programa. A escolha entre as duas não é
 * decorativa nem alternada ao acaso — é a primeira atividade de cada frente,
 * na ordem cronológica do acervo, que abre a seção.
 */
type EntryVariant = 'lead' | 'row';

/**
 * As atividades que têm título, cartaz e página própria.
 *
 * As demonstrações de processo criativo ficam de fora porque não têm nenhuma
 * das três: o programa impresso as registra como companhia e espaço, "após a
 * sessão". Elas são apresentadas em agrupamento por dia, em `program-section`.
 */
type TitledItem = Extract<ProgramItem, { kind: 'activity' | 'workshop' }>;

interface ProgramEntryProps {
  readonly item: TitledItem;
  readonly variant: EntryVariant;
}

/** A rota de detalhe de uma atividade da programação. */
export function activityDetailHref(id: string): string {
  return `/espetaculos/${id}`;
}

/**
 * A data em coluna — o numeral do programa impresso.
 *
 * A programação agrupa por frente, não por dia; sem esta coluna, "19h30" seria
 * um horário de dia nenhum. Ela também substitui a numeração ordinal de seção:
 * a data já é o número da atividade, e carrega informação de verdade.
 */
async function DateRail({
  day,
  variant,
}: {
  readonly day: IsoDate;
  readonly variant: EntryVariant;
}) {
  const locale = await getLocale();

  if (variant === 'lead') {
    return (
      <p className="font-sans text-sm font-semibold tracking-[0.12em] text-secondary uppercase">
        <time dateTime={day}>
          {formatShortDay(day, locale)}
          <span className="text-foreground-subtle"> · </span>
          {formatWeekday(day, locale)}
        </time>
      </p>
    );
  }

  return (
    <time dateTime={day} className="flex flex-col items-start">
      <span className="font-serif text-2xl leading-none text-secondary">
        {formatDayNumber(day, locale)}
      </span>
      <span className="mt-1 font-sans text-xs font-semibold tracking-[0.12em] text-foreground-muted uppercase">
        {formatMonthShort(day, locale)}
      </span>
      <span className="font-sans text-xs tracking-[0.08em] text-foreground-subtle uppercase">
        {formatWeekdayShort(day, locale)}
      </span>
    </time>
  );
}

/** Os recursos de acessibilidade declarados pela atividade, como texto. */
async function AccessibilityLine({
  features,
}: {
  readonly features: readonly AccessibilityFeatureId[];
}) {
  const t = await getTranslations('accessibilityFeatures');

  if (features.length === 0) {
    return null;
  }

  return (
    <span className="text-secondary">{features.map((feature) => t(feature)).join(' · ')}</span>
  );
}

/**
 * A imagem da atividade, no tratamento que o arquivo sustenta.
 *
 * A moldura é sempre **quadrada**, e é o que dá à lista o ritmo de catálogo:
 * as proporções do acervo vão de 3:5 a 3:2, e sem uma moldura comum cada linha
 * teria uma altura diferente. O que muda entre um arquivo e outro é o que
 * acontece dentro dela, e a diferença não é de gosto:
 *
 * - **Fotografia de cena restaurada** preenche a moldura (`cover`), recortada a
 *   partir do terço superior, onde os rostos costumam estar. É foto de
 *   espetáculo, e enquadrá-la é o gesto editorial normal.
 * - **Extração do programa impresso** é contida (`contain`) e limitada à
 *   largura do arquivo: são digitalizações de 151 a 269px, e ampliá-las só
 *   aumentaria o borrão. Recortar uma reprodução de cartaz, além disso, entrega
 *   um pedaço do cartaz em vez do cartaz.
 */
function Cover({ image, variant }: { readonly image: ImageAsset; readonly variant: EntryVariant }) {
  return (
    <ProvenancedImage
      image={image}
      fit={image.isLowResolution ? 'contain' : 'cover'}
      position="50% 35%"
      sizes={variant === 'lead' ? '208px' : '160px'}
      maxRenderedWidth={variant === 'lead' ? 152 : 112}
      className={cn(
        'aspect-square rounded-lg border border-outline-variant',
        variant === 'lead' ? 'w-full max-w-[13rem]' : 'w-40',
      )}
    />
  );
}

/**
 * O esqueleto comum das duas composições.
 *
 * `lead` monta cartaz e texto lado a lado; `row` monta a data em coluna, o
 * texto no meio e o cartaz à direita — e em telas estreitas o cartaz desce
 * para baixo do texto, alinhado à mesma coluna, em vez de espremer os dois.
 */
function EntryLayout({
  variant,
  cover,
  rail,
  children,
}: {
  readonly variant: EntryVariant;
  readonly cover: ReactNode;
  readonly rail: ReactNode;
  readonly children: ReactNode;
}) {
  if (variant === 'lead') {
    return (
      <article className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
        {cover}
        <div className="min-w-0">
          {rail}
          {children}
        </div>
      </article>
    );
  }

  return (
    <article className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-4 gap-y-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:gap-x-8">
      {/*
       * Em telas estreitas a data cobre as duas fileiras, para que o cartaz
       * desça sob o texto sem deixar um buraco ao lado dela. A partir de `sm`
       * tudo volta a uma fileira só, com o cartaz à direita.
       */}
      <div className="row-span-2 sm:row-span-1">{rail}</div>
      <div className="min-w-0">{children}</div>
      {cover !== null && <div className="col-start-2 sm:col-start-3 sm:row-start-1">{cover}</div>}
    </article>
  );
}

/** Título da atividade: sempre o link, sempre o acervo em pt-BR. */
function EntryTitle({
  href,
  title,
  variant,
}: {
  readonly href: string;
  readonly title: string;
  readonly variant: EntryVariant;
}) {
  return (
    <h3
      className={cn(
        'font-serif text-foreground',
        variant === 'lead' ? 'text-[clamp(2rem,4.5vw,2.5rem)] leading-[1.15]' : 'text-2xl',
      )}
    >
      <Link
        href={href}
        className="no-underline decoration-1 underline-offset-[6px] hover:underline"
      >
        <ArchiveText>{title}</ArchiveText>
      </Link>
    </h3>
  );
}

/**
 * A linha de dados práticos: separadores de programa, não caixas empilhadas.
 *
 * Frente, classificação, duração e acessibilidade viriam naturalmente como
 * quatro etiquetas concorrendo entre si. Como texto separado por `·` elas
 * ficam na ordem em que se lê um programa — e a hierarquia continua com o
 * título, que é quem responde "o que eu quero assistir?".
 *
 * `tone="primary"` é o "quando e onde" da atividade que abre a frente: ali a
 * informação precisa de um degrau a mais do que a nota de duração.
 */
function MetaLine({
  children,
  tone = 'secondary',
}: {
  readonly children: ReactNode;
  readonly tone?: 'primary' | 'secondary';
}) {
  return (
    <p
      className={cn(
        'mt-2 font-sans',
        tone === 'primary' ? 'text-base text-foreground-muted' : 'text-sm text-foreground-subtle',
      )}
    >
      {children}
    </p>
  );
}

/**
 * Uma atividade da programação, em composição editorial.
 *
 * A hierarquia é deliberada e é o que separa esta tela da grade diária: aqui o
 * **nome** vem primeiro e o horário vem depois, porque a pergunta é "o que eu
 * quero assistir?". Na grade, é o horário que abre a linha, porque lá a
 * pergunta é "quando e onde".
 *
 * Frente, classificação, duração e acessibilidade não viram quatro retângulos
 * concorrendo entre si: são texto separado por `·`, como no programa impresso.
 * A frente já é o cabeçalho da seção, e por isso não se repete no item.
 */
export async function ProgramEntry({ item, variant }: ProgramEntryProps) {
  const locale = await getLocale();
  const t = await getTranslations('programacao');
  const tAcervo = await getTranslations('acervo');
  const tOficina = await getTranslations('oficina');

  if (item.kind === 'workshop') {
    const { workshop } = item;
    const venue = findVenue(workshop.venueId);
    const firstSession = workshop.sessions[0];
    const day = firstSession === undefined ? '' : festivalDayOf(firstSession.startsAt);

    return (
      <EntryLayout
        variant={variant}
        cover={workshop.image === null ? null : <Cover image={workshop.image} variant={variant} />}
        rail={<DateRail day={day} variant={variant} />}
      >
        <EntryTitle href={`/oficinas/${workshop.id}`} title={workshop.title} variant={variant} />

        <p className="mt-2 font-sans text-base text-foreground-muted">
          <ArchiveText>{workshop.teachers}</ArchiveText>
        </p>

        <MetaLine tone={variant === 'lead' ? 'primary' : 'secondary'}>
          {workshop.sessions
            .map(
              (session) =>
                `${formatShortDay(festivalDayOf(session.startsAt), locale)}, ${formatSessionTime(session.startsAt, locale)}`,
            )
            .join(' · ')}
          {venue !== undefined && (
            <>
              {' · '}
              <ArchiveText>{venue.name}</ArchiveText>
            </>
          )}
        </MetaLine>

        <MetaLine>
          {tOficina('seatsValue', { count: workshop.seatsPerClass })}
          {' · '}
          {workshop.minimumAge === null
            ? tOficina('ageAll')
            : tOficina('ageValue', { age: workshop.minimumAge })}
          {workshop.accessibility.length > 0 && (
            <>
              {' · '}
              <AccessibilityLine features={workshop.accessibility} />
            </>
          )}
        </MetaLine>

        {variant === 'lead' && (
          <>
            <ArchiveText
              as="p"
              className="mt-5 line-clamp-3 max-w-prose font-sans text-base text-foreground-muted"
            >
              {workshop.description}
            </ArchiveText>
            {/*
             * A chamada repete o destino do título de propósito — é o alvo
             * grande que o polegar procura. O nome do espetáculo entra oculto
             * para que "conhecer a oficina", lido fora de contexto numa lista
             * de links, ainda diga de qual oficina se trata.
             */}
            <Link
              href={`/oficinas/${workshop.id}`}
              className={buttonClassName('secondary', 'mt-6')}
            >
              {t('workshopCta')}
              <VisuallyHidden>
                <ArchiveText>{workshop.title}</ArchiveText>
              </VisuallyHidden>
            </Link>
          </>
        )}
      </EntryLayout>
    );
  }

  const { activity } = item;
  const venue = findVenue(activity.venueId);
  const day = festivalDayOf(activity.startsAt);

  return (
    <EntryLayout
      variant={variant}
      cover={activity.image === null ? null : <Cover image={activity.image} variant={variant} />}
      rail={<DateRail day={day} variant={variant} />}
    >
      <EntryTitle href={activityDetailHref(activity.id)} title={activity.title} variant={variant} />

      <p className="mt-2 font-sans text-base text-foreground-muted">
        <ArchiveText>{activity.company}</ArchiveText>
        {' · '}
        {activity.stateCode}
      </p>

      <MetaLine tone={variant === 'lead' ? 'primary' : 'secondary'}>
        <time dateTime={activity.startsAt}>{formatSessionTime(activity.startsAt, locale)}</time>
        {venue !== undefined && (
          <>
            {' · '}
            <ArchiveText>{venue.name}</ArchiveText>
          </>
        )}
      </MetaLine>

      {(activity.durationInMinutes !== null ||
        activity.rating !== null ||
        activity.accessibility.length > 0) && (
        <MetaLine>
          {[
            activity.durationInMinutes === null
              ? null
              : formatDuration(activity.durationInMinutes, locale),
            activity.rating === null ? null : tAcervo(`ratings.${activity.rating}`),
          ]
            .filter((part): part is string => part !== null)
            .join(' · ')}
          {activity.accessibility.length > 0 && (
            <>
              {activity.durationInMinutes !== null || activity.rating !== null ? ' · ' : null}
              <AccessibilityLine features={activity.accessibility} />
            </>
          )}
        </MetaLine>
      )}

      {variant === 'lead' && (
        <>
          <ArchiveText
            as="p"
            className="mt-5 line-clamp-3 max-w-prose font-sans text-base text-foreground-muted"
          >
            {activity.release}
          </ArchiveText>
          <Link
            href={activityDetailHref(activity.id)}
            className={buttonClassName('secondary', 'mt-6')}
          >
            {t('activityCta')}
            <VisuallyHidden>
              <ArchiveText>{activity.title}</ArchiveText>
            </VisuallyHidden>
          </Link>
        </>
      )}
    </EntryLayout>
  );
}
