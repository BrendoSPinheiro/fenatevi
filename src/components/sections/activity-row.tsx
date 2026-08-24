import { getLocale, getTranslations } from 'next-intl/server';

import { findVenue } from '@/content/venues';
import { ArchiveText } from '@/components/ui/archive-text';
import { Tag } from '@/components/ui/tag';
import { Link } from '@/lib/i18n/navigation';
import { formatDuration, formatSessionTime } from '@/lib/utils/format';

import type { Activity } from '@/types/festival';

interface ActivityRowProps {
  readonly activity: Activity;
}

/** A rota de detalhe de uma atividade, conforme a frente a que ela pertence. */
export function activityHref(activity: Activity): string {
  return `/espetaculos/${activity.id}`;
}

/**
 * Uma linha da listagem de programação.
 *
 * O horário abre a linha porque é por ele que se lê um programa de festival. O
 * título é o destino de navegação — e é ele, e não a linha inteira, que é o
 * link: um alvo do tamanho da linha engoliria qualquer outro controle dentro
 * dela e daria ao leitor de tela um nome acessível gigante.
 *
 * Título, companhia e observação passam por `ArchiveText`: são acervo em pt-BR
 * mesmo nas páginas em inglês e espanhol.
 */
export async function ActivityRow({ activity }: ActivityRowProps) {
  const locale = await getLocale();
  const t = await getTranslations('acervo');
  const tEspetaculo = await getTranslations('espetaculo');
  const venue = findVenue(activity.venueId);

  return (
    <article className="grid gap-3 border-b border-outline-variant/60 py-5 sm:grid-cols-[7rem_1fr]">
      <p className="font-serif text-2xl text-secondary">
        <time dateTime={activity.startsAt}>{formatSessionTime(activity.startsAt, locale)}</time>
      </p>

      <div className="min-w-0">
        <h3 className="font-serif text-xl text-foreground">
          <Link href={activityHref(activity)} className="no-underline hover:underline">
            <ArchiveText>{activity.title}</ArchiveText>
          </Link>
        </h3>

        <p className="mt-1 font-sans text-sm text-foreground-muted">
          <ArchiveText>{activity.company}</ArchiveText>
          {' · '}
          {activity.stateCode}
        </p>

        {venue !== undefined && (
          <p className="mt-1 font-sans text-sm text-foreground-subtle">
            <ArchiveText>{venue.name}</ArchiveText>
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Tag tone="primary">{t(`strands.${activity.strand}`)}</Tag>
          {activity.rating !== null && <Tag>{t(`ratings.${activity.rating}`)}</Tag>}
          {activity.durationInMinutes !== null && (
            <Tag>{formatDuration(activity.durationInMinutes, locale)}</Tag>
          )}
          {activity.accessibility.length > 0 && (
            <Tag tone="secondary">{tEspetaculo('accessibilityTitle')}</Tag>
          )}
        </div>
      </div>
    </article>
  );
}
