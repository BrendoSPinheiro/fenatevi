import { getLocale, getTranslations } from 'next-intl/server';

import { Text } from '@/components/ui/text';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { formatDayNumber, formatMonthShort, formatWeekdayShort } from '@/lib/utils/format';
import { countsByDay } from '@/lib/utils/program';
import { availableDays, programHref } from '@/lib/utils/program-query';

import type { ActivityFilters } from '@/lib/utils/schedule';

interface ProgramDayNavProps {
  readonly filters: ActivityFilters;
  /** O dia de hoje, quando ele cai dentro da edição exibida; `null` quando não. */
  readonly today?: string | null;
}

/**
 * Os dias da edição, como a lombada de um programa impresso.
 *
 * Não são chips. O festival dura pouco mais de uma semana, e essa brevidade é
 * informação: vista de uma vez, a tira de dias diz quanto tempo a edição tem,
 * onde o visitante está e **quanto cada dia oferece sob os filtros vigentes** —
 * um número derivado do acervo, nunca arbitrado.
 *
 * Um dia que os filtros esvaziaram continua na tira, e deixa de ser link: ele
 * ainda desenha a duração da edição, mas levar alguém a um resultado
 * garantidamente vazio seria um beco. É o que faz esta tira responder também
 * "em que dias há oficina?" quando a frente está filtrada.
 *
 * O estado selecionado não depende de cor: o filete sob o dia vigente engrossa,
 * o número muda de tom e `aria-current` o anuncia.
 */
export async function ProgramDayNav({ filters, today = null }: ProgramDayNavProps) {
  const locale = await getLocale();
  const t = await getTranslations('programacao');

  const counts = countsByDay(filters, availableDays);
  const todayIndex = today === null ? -1 : availableDays.indexOf(today);
  const tomorrow = todayIndex >= 0 ? (availableDays[todayIndex + 1] ?? null) : null;

  return (
    <section aria-labelledby="programa-dias">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <Text variant="label-md" as="h2" id="programa-dias" className="text-foreground-subtle">
          {t('daysTitle')}
        </Text>

        {filters.day !== undefined && (
          <Link
            href={programHref(filters, { day: null })}
            className="inline-flex min-h-11 items-center font-sans text-sm text-foreground-muted underline underline-offset-4 hover:text-foreground"
          >
            {t('allDays')}
          </Link>
        )}
      </div>

      {/*
       * Grade, não rolagem horizontal: os oito dias cabem em duas fileiras de
       * quatro em 375px, e escolher o dia é a ação mais frequente desta tela —
       * ela não deve exigir que o polegar procure o dia fora da tela.
       */}
      <ul className="mt-4 grid grid-cols-4 gap-x-3 gap-y-5 md:grid-cols-8">
        {availableDays.map((day) => {
          const count = counts[day] ?? 0;
          const isActive = filters.day === day;
          const moment =
            day === today ? t('momentToday') : day === tomorrow ? t('momentTomorrow') : null;

          const face = (
            <>
              {/*
               * O dia esvaziado recua para `foreground-subtle`, e não para uma
               * opacidade: sobre o palco escuro, alfa arbitrário em texto
               * reprova em AA — os três tons da paleta, não.
               */}
              <span
                className={cn(
                  'font-serif text-[2rem] leading-none transition-colors',
                  isActive
                    ? 'text-secondary'
                    : count === 0
                      ? 'text-foreground-subtle'
                      : 'text-foreground',
                )}
              >
                {formatDayNumber(day, locale)}
              </span>
              <span className="mt-1.5 font-sans text-xs font-semibold tracking-[0.12em] text-foreground-muted uppercase">
                {formatMonthShort(day, locale)}
              </span>
              <span className="font-sans text-xs tracking-[0.08em] text-foreground-subtle uppercase">
                {formatWeekdayShort(day, locale)}
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'mt-2 block w-full transition-colors',
                  isActive
                    ? 'h-0.5 bg-secondary'
                    : 'h-px bg-outline-variant group-hover:bg-outline',
                )}
              />
              <span className="mt-2 font-sans text-xs leading-tight text-foreground-subtle">
                {moment === null
                  ? t('dayCount', { count })
                  : `${moment} · ${t('dayCount', { count })}`}
              </span>
            </>
          );

          return (
            <li key={day}>
              {count === 0 ? (
                /*
                 * Sem atividades sob estes filtros, o dia não é um destino — mas
                 * continua sendo parte da edição. Ele sai do alcance do teclado
                 * em vez de sair da página: um link para um resultado
                 * garantidamente vazio é um beco, e a duração da edição é
                 * informação que a tira precisa continuar desenhando.
                 */
                <p className="flex flex-col items-start">{face}</p>
              ) : (
                <Link
                  href={programHref(filters, { day: isActive ? null : day })}
                  aria-current={isActive ? 'true' : undefined}
                  className="group flex min-h-11 flex-col items-start no-underline"
                >
                  {face}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
