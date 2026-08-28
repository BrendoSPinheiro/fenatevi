import { getLocale, getTranslations } from 'next-intl/server';

import { activityHref } from '@/components/sections/activity-row';
import { ArchiveText } from '@/components/ui/archive-text';
import { Card } from '@/components/ui/card';
import { ProvenancedImage } from '@/components/ui/provenanced-image';
import { Tag } from '@/components/ui/tag';
import { findVenue } from '@/content/venues';
import { Link } from '@/lib/i18n/navigation';
import { formatSessionTime, formatShortDay, formatWeekday } from '@/lib/utils/format';
import { festivalDayOf, sessionEndsAt } from '@/lib/utils/schedule';

import type { Activity } from '@/types/festival';

interface SessionCardProps {
  readonly activity: Activity;
  /**
   * A sessão está em cena agora?
   *
   * O cartão então anuncia **até que horas** ela vai, e não que está em cena: o
   * título da seção já disse isso, e repeti-lo no cartão seria eco. A pergunta
   * que sobra para quem lê é se ainda dá tempo de chegar.
   *
   * O estado é servido pelo servidor, não pelo relógio do navegador: quem
   * chega sem JavaScript recebe a mesma informação.
   */
  readonly isLive?: boolean;
}

/**
 * Uma sessão como cartão, com a fotografia da própria sessão.
 *
 * **A fotografia vem da atividade, nunca de uma escolha desta tela.** É o que
 * garante que "A Metamorfose" apareça com a mesma fotografia na home, na
 * programação e na grade — e que nenhuma tela possa emprestar a fotografia de
 * um espetáculo a outro. Quando o acervo não tem fotografia, o cartão
 * simplesmente não tem moldura: a ausência não é preenchida com imagem alheia.
 *
 * A moldura é quadrada e recorta a partir do terço superior. As fotografias de
 * cena da edição vão de 2:3 a 3:2, e é onde os rostos costumam estar.
 */
export async function SessionCard({ activity, isLive = false }: SessionCardProps) {
  const locale = await getLocale();
  const t = await getTranslations('acervo');
  const venue = findVenue(activity.venueId);
  const day = festivalDayOf(activity.startsAt);
  const endsAt = sessionEndsAt(activity);

  return (
    <Card as="article" className="flex h-full flex-col overflow-hidden">
      {activity.image === null ? (
        /*
         * Sem fotografia, uma lâmina tipográfica — nunca a fotografia de outro
         * espetáculo. O acervo não tem registro desta atividade, e emprestar
         * uma imagem alheia seria afirmar algo falso sobre ela. A lâmina mantém
         * o ritmo da grade, que de outro modo abriria um vazio ao lado dos
         * cartões com foto.
         */
        <span
          aria-hidden="true"
          className="flex aspect-square w-full items-center justify-center bg-[linear-gradient(140deg,var(--color-surface-container-lowest),var(--color-surface-container-high))] p-6"
        >
          <span className="text-center font-sans text-xs font-semibold tracking-[0.2em] text-foreground-subtle uppercase">
            {t(`strands.${activity.strand}`)}
          </span>
        </span>
      ) : (
        <ProvenancedImage
          image={activity.image}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          maxRenderedWidth={320}
          position="50% 35%"
          className="aspect-square w-full"
        />
      )}

      <div className="flex flex-1 flex-col p-4">
        {isLive && endsAt !== null && (
          <p className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-secondary px-3 py-1 font-sans text-xs font-bold tracking-[0.12em] text-secondary uppercase">
            <span aria-hidden="true" className="size-2 rounded-full bg-secondary" />
            {t('endsAt', { time: formatSessionTime(endsAt.toISOString(), locale) })}
          </p>
        )}

        <time dateTime={activity.startsAt} className="block">
          <span className="block font-sans text-xs tracking-[0.12em] text-foreground-subtle uppercase">
            {formatShortDay(day, locale)}
            {' · '}
            {formatWeekday(day, locale)}
          </span>
          <span className="mt-0.5 block font-serif text-xl text-secondary">
            {formatSessionTime(activity.startsAt, locale)}
          </span>
        </time>

        {/*
         * O título é o único controle do cartão, então pode ocupar os 44px do
         * alvo mínimo sem engolir outro — e o nome acessível continua sendo só
         * o título.
         */}
        <h3 className="mt-2 font-serif text-lg leading-tight text-balance text-foreground">
          <Link
            href={activityHref(activity)}
            className="flex min-h-11 items-center no-underline hover:underline"
          >
            <ArchiveText>{activity.title}</ArchiveText>
          </Link>
        </h3>

        <ArchiveText as="p" className="mt-1 block font-sans text-sm text-foreground-muted">
          {activity.company}
        </ArchiveText>

        {venue !== undefined && (
          <ArchiveText as="p" className="mt-1 block font-sans text-sm text-foreground-subtle">
            {venue.name}
          </ArchiveText>
        )}

        <div className="mt-3 flex flex-wrap gap-2 pt-1">
          <Tag tone="primary">{t(`strands.${activity.strand}`)}</Tag>
          {activity.rating !== null && <Tag>{t(`ratings.${activity.rating}`)}</Tag>}
        </div>
      </div>
    </Card>
  );
}
