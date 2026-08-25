import type { Activity, IsoDate, IsoDateTime, ProgramStrand, Workshop } from '@/types/festival';

/**
 * Derivações da programação — funções puras, sem componente e sem relógio.
 *
 * **Nenhuma função aqui lê `Date.now()`.** O instante é sempre parâmetro. É o
 * que as torna testáveis nos limites exatos (o minuto do início, o minuto do
 * fim, o minuto seguinte) e o que impede que uma delas produza HTML diferente
 * no servidor e no cliente.
 */

/** Situação de uma sessão em relação a um instante. */
export type SessionStatus = 'upcoming' | 'live' | 'ended';

/**
 * Filtros da programação, como chegam da URL já validados.
 *
 * Cada campo aceita `undefined` explicitamente (e não apenas ausência) porque é
 * assim que a validação os produz: um filtro que chegou inválido vira
 * `undefined` no lugar de sumir do objeto. Sob `exactOptionalPropertyTypes`, as
 * duas coisas são diferentes — e aqui significam o mesmo: não filtrar.
 */
export interface ActivityFilters {
  readonly day?: IsoDate | undefined;
  readonly strand?: ProgramStrand | undefined;
  readonly venueId?: string | undefined;
}

/**
 * O dia de calendário de um instante, no fuso do festival.
 *
 * Os instantes do acervo são gravados no horário local do festival com o
 * deslocamento explícito (`2024-10-13T19:30:00-03:00`), então os dez primeiros
 * caracteres **já são** o dia local — sem conversão, sem `Intl`, sem depender
 * do fuso de quem executa. Uma sessão às 22h não escorrega para o dia seguinte
 * porque o servidor está em UTC.
 */
export function festivalDayOf(value: IsoDateTime): IsoDate {
  const day = value.slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    throw new TypeError(`Instante ISO inválido: "${value}"`);
  }

  return day;
}

/**
 * Quando a sessão termina, derivado do início mais a duração.
 *
 * `null` quando o programa não declara duração — o portal então informa o
 * início e omite o término, em vez de inventar um.
 */
export function sessionEndsAt(activity: Activity): Date | null {
  if (activity.durationInMinutes === null) {
    return null;
  }

  return new Date(new Date(activity.startsAt).getTime() + activity.durationInMinutes * 60_000);
}

/**
 * A situação da sessão no instante informado.
 *
 * Os limites são fechados no início e no fim: no minuto exato do início a
 * sessão já está em cena, e no minuto exato do término ainda está — quem chega
 * na hora não lê "encerrada".
 *
 * Sem duração declarada a sessão nunca passa a `ended` por decurso de tempo:
 * não sabemos quando ela acaba, e arbitrar uma duração seria informar algo que
 * o programa não diz. Ela permanece `live` depois de começar, e a passagem do
 * dia é o que a tira de cena na listagem.
 */
export function sessionStatus(activity: Activity, now: Date): SessionStatus {
  const startsAt = new Date(activity.startsAt);

  if (now.getTime() < startsAt.getTime()) {
    return 'upcoming';
  }

  const endsAt = sessionEndsAt(activity);

  if (endsAt === null || now.getTime() <= endsAt.getTime()) {
    return 'live';
  }

  return 'ended';
}

/** Uma lista de atividades de um mesmo dia, em ordem de horário. */
export interface ActivityDay {
  readonly date: IsoDate;
  readonly activities: readonly Activity[];
}

/**
 * Agrupa as atividades por dia do festival, em ordem cronológica.
 *
 * Dentro do dia a ordem é por horário de início; empates mantêm a ordem do
 * acervo, que é a do programa impresso.
 */
export function groupByDay(activities: readonly Activity[]): readonly ActivityDay[] {
  const byDay = new Map<IsoDate, Activity[]>();

  for (const activity of activities) {
    const day = festivalDayOf(activity.startsAt);
    const bucket = byDay.get(day);

    if (bucket === undefined) {
      byDay.set(day, [activity]);
    } else {
      bucket.push(activity);
    }
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayActivities]) => ({
      date,
      activities: [...dayActivities].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      ),
    }));
}

/**
 * Aplica os filtros da programação.
 *
 * Filtros ausentes não filtram. Filtros que não deixam nada de pé devolvem uma
 * lista vazia — que é uma resposta, e a tela a apresenta como tal.
 */
export function filterActivities(
  activities: readonly Activity[],
  filters: ActivityFilters,
): readonly Activity[] {
  return activities.filter((activity) => {
    if (filters.day !== undefined && festivalDayOf(activity.startsAt) !== filters.day) {
      return false;
    }

    if (filters.strand !== undefined && activity.strand !== filters.strand) {
      return false;
    }

    return filters.venueId === undefined || activity.venueId === filters.venueId;
  });
}

/**
 * As próximas sessões a partir de um instante, em ordem cronológica.
 *
 * Uma sessão em cena não é "próxima": quem quer saber o que vem a seguir já
 * está vendo o que está acontecendo.
 */
export function nextSessions(
  activities: readonly Activity[],
  now: Date,
  limit = 3,
): readonly Activity[] {
  return activities
    .filter((activity) => sessionStatus(activity, now) === 'upcoming')
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, limit);
}

/** As sessões em cena no instante informado. */
export function liveSessions(activities: readonly Activity[], now: Date): readonly Activity[] {
  return activities.filter((activity) => sessionStatus(activity, now) === 'live');
}

/** Quantas atividades há em cada frente de programação. */
export function countByCategory(
  activities: readonly Activity[],
): Readonly<Partial<Record<ProgramStrand, number>>> {
  const counts: Partial<Record<ProgramStrand, number>> = {};

  for (const activity of activities) {
    counts[activity.strand] = (counts[activity.strand] ?? 0) + 1;
  }

  return counts;
}

/** Quantas atividades há em cada espaço. */
export function countByVenue(
  activities: readonly Activity[],
): Readonly<Record<string, number | undefined>> {
  const counts: Record<string, number | undefined> = {};

  for (const activity of activities) {
    counts[activity.venueId] = (counts[activity.venueId] ?? 0) + 1;
  }

  return counts;
}

/** Os dias distintos em que há programação, em ordem cronológica. */
export function festivalDays(activities: readonly Activity[]): readonly IsoDate[] {
  return [...new Set(activities.map((activity) => festivalDayOf(activity.startsAt)))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/** A oficina acontece neste dia? */
export function workshopHappensOn(workshop: Workshop, day: IsoDate): boolean {
  return workshop.sessions.some((session) => festivalDayOf(session.startsAt) === day);
}

/**
 * A oficina já se encerrou no instante informado?
 *
 * É o estado que a listagem de ações formativas precisa: uma oficina cuja
 * última sessão passou não recebe mais inscrição.
 */
export function workshopHasEnded(workshop: Workshop, now: Date): boolean {
  return workshop.sessions.every((session) => new Date(session.endsAt).getTime() < now.getTime());
}
