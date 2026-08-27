import { getLocale, getTranslations } from 'next-intl/server';

import { ProgramEntry } from '@/components/sections/program-entry';
import { Reveal } from '@/components/sections/reveal';
import { ArchiveText } from '@/components/ui/archive-text';
import { Text } from '@/components/ui/text';
import { findVenue } from '@/content/venues';
import { formatShortDay, formatWeekday } from '@/lib/utils/format';

import type { ProgramItem, ProgramStrandGroup } from '@/lib/utils/program';
import type { IsoDate } from '@/types/festival';

interface ProgramSectionProps {
  readonly group: ProgramStrandGroup;
  /**
   * É a primeira frente da página?
   *
   * Entre duas frentes cabe o respiro de um ato inteiro. Entre a linha de
   * resultado e a primeira frente, não: ali a contagem é legenda do que vem
   * logo abaixo, e o vão de 80px a desligaria do conteúdo que ela descreve.
   */
  readonly isFirst?: boolean;
}

/** As demonstrações de um dia, na ordem do programa impresso. */
interface ProcessDay {
  readonly date: IsoDate;
  readonly items: readonly Extract<ProgramItem, { kind: 'process' }>[];
}

function groupProcessesByDay(items: readonly ProgramItem[]): readonly ProcessDay[] {
  const byDay = new Map<IsoDate, Extract<ProgramItem, { kind: 'process' }>[]>();

  for (const item of items) {
    if (item.kind !== 'process') {
      continue;
    }

    const bucket = byDay.get(item.date);

    if (bucket === undefined) {
      byDay.set(item.date, [item]);
    } else {
      bucket.push(item);
    }
  }

  return [...byDay.entries()].map(([date, dayItems]) => ({ date, items: dayItems }));
}

/**
 * As demonstrações de processo criativo, agrupadas por dia.
 *
 * Não recebem a composição das demais atividades porque não têm o que ela
 * apresenta: o acervo registra companhia e espaço, e diz que acontecem "após a
 * sessão" — sem título, sem horário e sem página própria. Repetir a data em
 * vinte linhas seguidas seria ruído; o agrupamento por dia é a forma que o
 * próprio programa impresso lhes dá.
 */
async function CreativeProcessList({ items }: { readonly items: readonly ProgramItem[] }) {
  const locale = await getLocale();
  const days = groupProcessesByDay(items);

  return (
    <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {days.map((day) => (
        <section key={day.date} aria-labelledby={`processos-${day.date}`}>
          <h3
            id={`processos-${day.date}`}
            className="border-b border-outline-variant/60 pb-2 font-sans text-xs font-semibold tracking-[0.12em] text-secondary uppercase"
          >
            <time dateTime={day.date}>
              {formatShortDay(day.date, locale)}
              <span className="text-foreground-subtle"> · </span>
              {formatWeekday(day.date, locale)}
            </time>
          </h3>

          <ul className="mt-3 flex flex-col gap-2">
            {day.items.map((item) => {
              const venue = findVenue(item.item.venueId);

              return (
                <li key={item.key} className="font-sans text-sm">
                  <ArchiveText className="text-foreground">{item.item.company}</ArchiveText>
                  {venue !== undefined && (
                    <>
                      <span className="text-foreground-subtle"> · </span>
                      <ArchiveText className="text-foreground-subtle">{venue.name}</ArchiveText>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * Uma frente da programação, como um caderno do programa impresso.
 *
 * A frente é o cabeçalho da seção — e é por isso que nenhuma atividade repete
 * a frente em forma de etiqueta. A primeira atividade de cada frente abre o
 * caderno em escala maior, com cartaz, release e chamada; as demais seguem em
 * linhas editoriais. A regra é previsível e vem dos dados: a ordem é a
 * cronológica do acervo, e quem abre é quem acontece primeiro.
 */
export async function ProgramSection({ group, isFirst = false }: ProgramSectionProps) {
  const t = await getTranslations('programacao');
  const tAcervo = await getTranslations('acervo');

  const headingId = `frente-${group.strand}`;
  const isProcess = group.strand === 'processo-criativo';
  const titled = group.items.filter(
    (item): item is Extract<ProgramItem, { kind: 'activity' | 'workshop' }> =>
      item.kind !== 'process',
  );

  return (
    <Reveal
      as="section"
      aria-labelledby={headingId}
      className={isFirst ? 'mt-stack-md' : 'mt-stack-lg'}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-outline pt-6">
        <Text variant="display-md" as="h2" id={headingId} className="text-foreground">
          {tAcervo(`strands.${group.strand}`)}
        </Text>
        <Text variant="label-md" as="p" className="text-foreground-subtle">
          {t('resultCount', { count: group.items.length })}
        </Text>
      </header>

      {isProcess ? (
        <>
          <Text variant="body-md" className="mt-4 max-w-prose text-foreground-muted">
            {t('processIntro')}
          </Text>
          <CreativeProcessList items={group.items} />
        </>
      ) : (
        <ul className="mt-10 flex flex-col">
          {titled.map((item, index) => (
            <li
              key={item.key}
              className={
                index === 0 ? '' : 'mt-8 border-t border-outline-variant/60 pt-8 sm:mt-10 sm:pt-10'
              }
            >
              <ProgramEntry item={item} variant={index === 0 ? 'lead' : 'row'} />
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
