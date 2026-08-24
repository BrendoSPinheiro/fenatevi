import { activities } from '@/content/activities';
import { venues } from '@/content/venues';
import { festivalDayOf } from '@/lib/utils/schedule';

import type { ActivityFilters } from '@/lib/utils/schedule';
import type { IsoDate, ProgramStrand } from '@/types/festival';

/**
 * A tradução entre a URL e os filtros da programação.
 *
 * Os filtros vivem em `searchParams` (`?dia=`, `?frente=`, `?espaco=`), e não
 * em estado de cliente. Isso resolve de uma vez o link profundo que a home
 * precisa, o compartilhamento de um resultado filtrado, o funcionamento sem
 * JavaScript, e a ausência de estado na tela mais complexa do portal.
 *
 * **Todo valor que chega da URL é entrada externa.** Nada aqui confia no que
 * veio: um dia que não existe na edição, uma frente inventada ou um espaço
 * desconhecido são simplesmente ignorados, e a tela responde com a programação
 * sem aquele filtro — nunca com um erro, nunca com uma lista vazia enganosa.
 */

/** O que a URL pode trazer. Tudo opcional, tudo suspeito. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

export const STRANDS: readonly ProgramStrand[] = [
  'mostra-oficial',
  'mostra-paralela',
  'oficina',
  'lancamento',
  'processo-criativo',
];

/** Os dias que a edição exibida realmente tem. */
export const availableDays: readonly IsoDate[] = [
  ...new Set(activities.map((activity) => festivalDayOf(activity.startsAt))),
].sort((a, b) => a.localeCompare(b));

/** O primeiro valor de um parâmetro — a URL pode repetir a mesma chave. */
function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Os filtros válidos de uma URL.
 *
 * Cada campo só sobrevive se corresponder a algo que existe no acervo.
 */
export function parseProgramFilters(params: RawSearchParams): ActivityFilters {
  const day = single(params.dia);
  const strand = single(params.frente);
  const venueId = single(params.espaco);

  return {
    day: day !== undefined && availableDays.includes(day) ? day : undefined,
    strand:
      strand !== undefined && STRANDS.includes(strand as ProgramStrand)
        ? (strand as ProgramStrand)
        : undefined,
    venueId:
      venueId !== undefined && venues.some((venue) => venue.id === venueId) ? venueId : undefined,
  };
}

/** Algum filtro está ativo? É o que decide se "limpar filtros" aparece. */
export function hasActiveFilters(filters: ActivityFilters): boolean {
  return filters.day !== undefined || filters.strand !== undefined || filters.venueId !== undefined;
}

/**
 * Monta a URL da programação com os filtros alterados.
 *
 * Passar `null` remove o filtro. Os parâmetros são escritos sempre na mesma
 * ordem para que dois caminhos até o mesmo recorte produzam a mesma URL — o que
 * torna o link compartilhável estável.
 */
export function programHref(
  filters: ActivityFilters,
  changes: Partial<Record<'day' | 'strand' | 'venueId', string | null>> = {},
  basePath = '/programacao',
): string {
  const merged = {
    dia: 'day' in changes ? changes.day : filters.day,
    frente: 'strand' in changes ? changes.strand : filters.strand,
    espaco: 'venueId' in changes ? changes.venueId : filters.venueId,
  };

  const query = new URLSearchParams();

  for (const key of ['dia', 'frente', 'espaco'] as const) {
    const value = merged[key];

    if (value !== null && value !== undefined) {
      query.set(key, value);
    }
  }

  const search = query.toString();

  return search === '' ? basePath : `${basePath}?${search}`;
}

/** As visões da grade diária. */
export const GRID_VIEWS = ['espaco', 'horario', 'semana'] as const;
export type GridView = (typeof GRID_VIEWS)[number];

export interface GridQuery {
  readonly view: GridView;
  readonly day: IsoDate;
}

/**
 * A visão e o dia da grade, validados.
 *
 * O padrão é a visão por espaço no primeiro dia da edição — é o que o protótipo
 * abre, e é a leitura mais próxima do programa impresso.
 */
export function parseGridQuery(params: RawSearchParams): GridQuery {
  const view = single(params.visao);
  const day = single(params.dia);
  const firstDay = availableDays[0] ?? '';

  return {
    view: GRID_VIEWS.includes(view as GridView) ? (view as GridView) : 'espaco',
    day: day !== undefined && availableDays.includes(day) ? day : firstDay,
  };
}

/** A URL da grade com visão e dia — a troca de visão preserva o dia. */
export function gridHref(query: GridQuery, changes: Partial<GridQuery> = {}): string {
  const merged = { ...query, ...changes };

  return `/programacao/grade?visao=${merged.view}&dia=${merged.day}`;
}
