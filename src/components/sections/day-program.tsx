import { getLocale, getTranslations } from 'next-intl/server';

import { ActivityRow } from '@/components/sections/activity-row';
import { ArchiveText } from '@/components/ui/archive-text';
import { Tag } from '@/components/ui/tag';
import { creativeProcesses } from '@/content/creative-processes';
import { findVenue } from '@/content/venues';
import { formatShortDay, formatWeekday } from '@/lib/utils/format';

import type { ActivityDay } from '@/lib/utils/schedule';

interface DayProgramProps {
  readonly day: ActivityDay;
  /** Mostrar as demonstrações de processo criativo ao fim do dia? */
  readonly withCreativeProcesses?: boolean;
}

/**
 * Um dia de programação: cabeçalho do dia, as sessões e o que vem depois delas.
 *
 * Os processos criativos ficam **ao fim do dia**, e não intercalados por
 * horário, porque é onde eles acontecem: o programa não lhes dá hora marcada,
 * eles vêm "após a sessão" daquele espaço. Inventar um horário para ordená-los
 * junto seria informar algo que o acervo não diz.
 */
export async function DayProgram({ day, withCreativeProcesses = true }: DayProgramProps) {
  const locale = await getLocale();
  const t = await getTranslations('acervo');
  const tSessao = await getTranslations('sessao');

  const processes = creativeProcesses.find((entry) => entry.date === day.date);

  return (
    <section aria-labelledby={`dia-${day.date}`}>
      <h2 id={`dia-${day.date}`} className="flex flex-wrap items-baseline gap-3 pt-stack-md">
        <span className="font-serif text-3xl text-foreground">
          {formatShortDay(day.date, locale)}
        </span>
        <span className="font-sans text-sm text-foreground-subtle">
          {formatWeekday(day.date, locale)}
        </span>
      </h2>

      <div className="mt-4">
        {day.activities.map((activity) => (
          <ActivityRow key={activity.id} activity={activity} />
        ))}
      </div>

      {withCreativeProcesses && processes !== undefined && processes.items.length > 0 && (
        <div className="mt-4 rounded-lg border border-outline-variant/60 bg-surface-container-low p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Tag tone="secondary">{t('strands.processo-criativo')}</Tag>
            <span className="font-sans text-sm text-foreground-subtle">
              {tSessao('afterSession')}
            </span>
          </div>
          <ul className="mt-3 flex flex-col gap-1">
            {processes.items.map((item) => {
              const venue = findVenue(item.venueId);

              return (
                <li key={`${item.company}-${item.venueId}`} className="font-sans text-sm">
                  <ArchiveText className="text-foreground">{item.company}</ArchiveText>
                  {venue !== undefined && (
                    <>
                      {' · '}
                      <ArchiveText className="text-foreground-subtle">{venue.name}</ArchiveText>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
