import { activities } from '@/content/activities';
import { creativeProcesses } from '@/content/creative-processes';
import { workshops } from '@/content/workshops';
import { STRANDS } from '@/lib/utils/program-query';
import { festivalDayOf, workshopHappensOn } from '@/lib/utils/schedule';

import type { ActivityFilters } from '@/lib/utils/schedule';
import type {
  Activity,
  CreativeProcessItem,
  IsoDate,
  IsoDateTime,
  ProgramStrand,
  Workshop,
} from '@/types/festival';

/**
 * A programação da edição exibida, reunida por frente.
 *
 * **Por que este módulo existe.** As cinco frentes do festival são reais, mas o
 * acervo as guarda em três arquivos diferentes: espetáculos e lançamentos em
 * `activities.ts`, ações formativas em `workshops.ts`, demonstrações em
 * `creative-processes.ts`. Uma listagem que lesse só o primeiro ofereceria
 * "Oficina" e "Processo criativo" como filtros que nunca devolvem nada — que é
 * como a tela se comportava. Aqui as três fontes viram um único modelo, e a
 * frente deixa de ser um rótulo para virar a estrutura da página.
 *
 * Funções puras, sem componente e sem relógio: o instante nunca entra, então
 * servidor e cliente não podem discordar.
 */

/**
 * Um item da programação, na frente a que pertence.
 *
 * É união discriminada, e não um objeto achatado com campos opcionais, porque
 * os três não têm a mesma forma: uma oficina tem várias sessões e não tem
 * classificação, e uma demonstração de processo criativo não tem título nem
 * horário — o programa impresso a registra como "após a sessão". Achatar os
 * três obrigaria a inventar os campos que faltam.
 */
export type ProgramItem =
  | { readonly kind: 'activity'; readonly key: string; readonly activity: Activity }
  | { readonly kind: 'workshop'; readonly key: string; readonly workshop: Workshop }
  | {
      readonly kind: 'process';
      readonly key: string;
      readonly date: IsoDate;
      readonly item: CreativeProcessItem;
    };

/** Uma frente e os itens que ela reúne sob os filtros vigentes. */
export interface ProgramStrandGroup {
  readonly strand: ProgramStrand;
  readonly items: readonly ProgramItem[];
}

/** O primeiro instante de uma oficina — é por ele que ela se ordena. */
function workshopStart(workshop: Workshop): number {
  const first = workshop.sessions[0];

  return first === undefined ? 0 : new Date(first.startsAt).getTime();
}

/**
 * A oficina passa pelos filtros?
 *
 * A frente é sempre `oficina`, e o dia casa quando **alguma** sessão acontece
 * nele: uma imersão de dois dias pertence aos dois.
 */
function workshopMatches(workshop: Workshop, filters: ActivityFilters): boolean {
  if (filters.strand !== undefined && filters.strand !== 'oficina') {
    return false;
  }

  if (filters.day !== undefined && !workshopHappensOn(workshop, filters.day)) {
    return false;
  }

  if (filters.venueId !== undefined && workshop.venueId !== filters.venueId) {
    return false;
  }

  return (
    filters.accessibility === undefined || workshop.accessibility.includes(filters.accessibility)
  );
}

/**
 * A demonstração de processo criativo passa pelos filtros?
 *
 * O acervo não declara recursos de acessibilidade para as demonstrações. Um
 * filtro de acessibilidade ativo, portanto, **as exclui**: dizer que uma delas
 * tem Libras porque a sessão anterior tinha seria informar algo que o programa
 * não diz.
 */
function processMatches(
  item: CreativeProcessItem,
  date: IsoDate,
  filters: ActivityFilters,
): boolean {
  if (filters.strand !== undefined && filters.strand !== 'processo-criativo') {
    return false;
  }

  if (filters.day !== undefined && filters.day !== date) {
    return false;
  }

  if (filters.venueId !== undefined && item.venueId !== filters.venueId) {
    return false;
  }

  return filters.accessibility === undefined;
}

/** A atividade passa pelos filtros? */
function activityMatches(activity: Activity, filters: ActivityFilters): boolean {
  if (filters.strand !== undefined && activity.strand !== filters.strand) {
    return false;
  }

  if (filters.day !== undefined && festivalDayOf(activity.startsAt) !== filters.day) {
    return false;
  }

  if (filters.venueId !== undefined && activity.venueId !== filters.venueId) {
    return false;
  }

  return (
    filters.accessibility === undefined || activity.accessibility.includes(filters.accessibility)
  );
}

/** Os itens de uma frente, já filtrados e em ordem cronológica. */
function itemsOfStrand(strand: ProgramStrand, filters: ActivityFilters): readonly ProgramItem[] {
  if (strand === 'oficina') {
    return workshops
      .filter((workshop) => workshopMatches(workshop, filters))
      .sort((a, b) => workshopStart(a) - workshopStart(b))
      .map((workshop) => ({ kind: 'workshop', key: workshop.id, workshop }) as const);
  }

  if (strand === 'processo-criativo') {
    return creativeProcesses
      .flatMap((entry) =>
        entry.items
          .filter((item) => processMatches(item, entry.date, filters))
          /*
           * A ordem dentro do dia é a do programa impresso — o acervo não
           * declara horário para as demonstrações, e ordená-las por qualquer
           * outro critério inventaria uma sequência.
           */
          .map(
            (item) =>
              ({
                kind: 'process',
                key: `${entry.date}-${item.company}-${item.venueId}`,
                date: entry.date,
                item,
              }) as const,
          ),
      )
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  return activities
    .filter((activity) => activity.strand === strand && activityMatches(activity, filters))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .map((activity) => ({ kind: 'activity', key: activity.id, activity }) as const);
}

/**
 * A programação sob os filtros, por frente, na ordem curatorial de `STRANDS`.
 *
 * Frentes sem nenhum item **não** entram: uma seção vazia não é informação,
 * é ruído. A ausência é dita uma vez só, pelo estado vazio da tela.
 */
export function programGroups(filters: ActivityFilters): readonly ProgramStrandGroup[] {
  return STRANDS.map((strand) => ({ strand, items: itemsOfStrand(strand, filters) })).filter(
    (group) => group.items.length > 0,
  );
}

/** Quantos itens a programação tem sob estes filtros. */
export function programCount(filters: ActivityFilters): number {
  return STRANDS.reduce((total, strand) => total + itemsOfStrand(strand, filters).length, 0);
}

/**
 * Quantos itens cada frente teria, mantidos os demais filtros.
 *
 * A contagem ignora o filtro de frente de propósito: o número ao lado de
 * "Mostra Paralela" precisa dizer quanto aquele caminho devolve, e não quanto
 * a frente atualmente escolhida devolve.
 */
export function countsByStrand(filters: ActivityFilters): Readonly<Record<ProgramStrand, number>> {
  const base: ActivityFilters = { ...filters, strand: undefined };

  return Object.fromEntries(
    STRANDS.map((strand) => [strand, itemsOfStrand(strand, base).length]),
  ) as Record<ProgramStrand, number>;
}

/**
 * A escala da edição exibida — o colofão da abertura.
 *
 * Todos os quatro números são contagem do que a tela apresenta, e nenhum é
 * escrito à mão: quando a edição vigente publicar a sua programação, eles
 * passam a descrevê-la sem que ninguém precise atualizar um texto.
 */
export interface EditionScale {
  readonly items: number;
  readonly days: number;
  readonly venues: number;
  readonly strands: number;
}

export function editionScale(days: readonly IsoDate[]): EditionScale {
  const usedVenues = new Set<string>([
    ...activities.map((activity) => activity.venueId),
    ...workshops.map((workshop) => workshop.venueId),
    ...creativeProcesses.flatMap((entry) => entry.items.map((item) => item.venueId)),
  ]);

  const counts = countsByStrand({});

  return {
    items: programCount({}),
    days: days.length,
    venues: usedVenues.size,
    strands: STRANDS.filter((strand) => counts[strand] > 0).length,
  };
}

/**
 * Um item do dia, com o espaço e o horário resolvidos.
 *
 * `startsAt` é `null` nas demonstrações de processo criativo: o programa
 * impresso não lhes dá hora, apenas "após a sessão" daquele espaço. Manter o
 * `null` é o que impede a grade de inventar um horário para poder ordená-las.
 */
export interface DayScheduleEntry {
  readonly item: ProgramItem;
  readonly venueId: string;
  readonly startsAt: IsoDateTime | null;
}

/** O instante em que uma oficina começa neste dia, se ela acontecer nele. */
function workshopStartOn(workshop: Workshop, day: IsoDate): IsoDateTime | null {
  return (
    workshop.sessions.find((session) => festivalDayOf(session.startsAt) === day)?.startsAt ?? null
  );
}

/**
 * Tudo o que acontece em um dia, em ordem de horário.
 *
 * **É a fonte única da grade diária.** Antes, a grade lia apenas `activities`,
 * e por isso 14, 15 e 16 de outubro apareciam sem as oficinas do Teatro
 * Estrelas e nenhum dia mostrava as demonstrações de processo criativo — a tela
 * que responde "o que acontece hoje?" respondia por metade da programação.
 *
 * Os itens sem horário vão para o fim, que é onde eles acontecem.
 */
export function daySchedule(day: IsoDate): readonly DayScheduleEntry[] {
  const entries: DayScheduleEntry[] = [
    ...activities
      .filter((activity) => festivalDayOf(activity.startsAt) === day)
      .map((activity) => ({
        item: { kind: 'activity', key: activity.id, activity } as const,
        venueId: activity.venueId,
        startsAt: activity.startsAt,
      })),
    ...workshops
      .filter((workshop) => workshopHappensOn(workshop, day))
      .map((workshop) => ({
        item: { kind: 'workshop', key: workshop.id, workshop } as const,
        venueId: workshop.venueId,
        startsAt: workshopStartOn(workshop, day),
      })),
    ...(creativeProcesses
      .find((entry) => entry.date === day)
      ?.items.map((item) => ({
        item: {
          kind: 'process',
          key: `${day}-${item.company}-${item.venueId}`,
          date: day,
          item,
        } as const,
        venueId: item.venueId,
        startsAt: null,
      })) ?? []),
  ];

  return entries.sort((a, b) => {
    if (a.startsAt === null || b.startsAt === null) {
      return a.startsAt === b.startsAt ? 0 : a.startsAt === null ? 1 : -1;
    }

    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  });
}

/**
 * Quantos itens cada espaço recebe, mantidos os demais filtros.
 *
 * Conta as três fontes, e não só as sessões. Sem isso o Teatro Estrelas
 * apareceria com "sem atividades" numa edição em que ele recebe as duas
 * oficinas — a contagem estaria dizendo que o espaço está fora do festival.
 */
export function countsByVenue(
  filters: ActivityFilters,
  venueIds: readonly string[],
): Readonly<Record<string, number>> {
  return Object.fromEntries(
    venueIds.map((venueId) => [venueId, programCount({ ...filters, venueId })]),
  ) as Record<string, number>;
}

/** Quantos itens cada dia teria, mantidos os demais filtros. */
export function countsByDay(
  filters: ActivityFilters,
  days: readonly IsoDate[],
): Readonly<Record<IsoDate, number>> {
  return Object.fromEntries(days.map((day) => [day, programCount({ ...filters, day })])) as Record<
    IsoDate,
    number
  >;
}
