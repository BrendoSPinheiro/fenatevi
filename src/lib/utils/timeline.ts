import type { EditionTimelineEntry } from '@/types/festival';

/**
 * A tradução entre a URL e a forma de percorrer a linha do tempo, e o formato
 * de estação que as duas variantes consomem.
 *
 * **A variante é entrada externa.** Vem de `?linha=` e nada aqui confia no que
 * chegou: um valor desconhecido não é erro, é a variante padrão — pelo mesmo
 * princípio de `program-query.ts`, onde um filtro inventado é ignorado em vez
 * de quebrar a tela.
 */

/** O que a URL pode trazer. Tudo opcional, tudo suspeito. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

/**
 * As duas formas de percorrer a linha do tempo.
 *
 * **Temporário por construção.** As duas existem lado a lado apenas para a
 * decisão visual; a que não for escolhida é apagada por inteiro, junto com este
 * tipo, o parser e a chave de URL. Ver o plano de deleção em
 * `openspec/changes/redesenhar-linha-do-tempo-da-memoria/design.md`.
 */
export const TIMELINE_VARIANTS = ['espinha', 'trilho'] as const;
export type TimelineVariant = (typeof TIMELINE_VARIANTS)[number];

/**
 * A variante padrão.
 *
 * É a espinha porque é a que sobrevive a 320px e a leitor de tela sem
 * asterisco: se alguém esquecer o protótipo ligado, é ela que fica de pé.
 */
export const DEFAULT_TIMELINE_VARIANT: TimelineVariant = 'espinha';

/** O primeiro valor de um parâmetro — a URL pode repetir a mesma chave. */
function single(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** A variante pedida pela URL, ou a padrão quando o valor não é reconhecido. */
export function parseTimelineVariant(params: RawSearchParams): TimelineVariant {
  const raw = single(params.linha);

  return TIMELINE_VARIANTS.includes(raw as TimelineVariant)
    ? (raw as TimelineVariant)
    : DEFAULT_TIMELINE_VARIANT;
}

/**
 * Uma estação da linha do tempo — o lugar de uma edição na sequência.
 *
 * Estende a entrada do acervo em vez de substituí-la, de modo que as duas
 * variantes consumam a mesma forma quer a prévia esteja ligada, quer não.
 */
export interface TimelineStation extends EditionTimelineEntry {
  /** Chave da imagem remota da prévia; `null` quando a estação não tem imagem. */
  readonly imageId: string | null;
  /** Chave do resumo em `messages/`, relativa ao namespace `memoria`. */
  readonly summaryKey: string;
  /** Esta estação é conteúdo de prévia, e não acervo? */
  readonly isPreview: boolean;
}

/**
 * As estações do acervo real, sem prévia nenhuma.
 *
 * É o caminho que sobra quando `src/content/mock/timeline-preview.ts` for
 * apagado: a linha do tempo volta a ser exatamente `editionTimeline`.
 */
export function realStations(entries: readonly EditionTimelineEntry[]): readonly TimelineStation[] {
  return entries.map((entry) => ({
    ...entry,
    imageId: null,
    summaryKey: `entries.${entry.id}`,
    isPreview: false,
  }));
}

/**
 * O rótulo de anos de uma estação.
 *
 * Uma entrada agrupada (`2004–2023`) mostra o intervalo; uma edição única
 * mostra só o seu ano.
 */
export function stationYearLabel(station: TimelineStation): string {
  return station.firstYear === station.lastYear
    ? String(station.firstYear)
    : `${station.firstYear}—${station.lastYear}`;
}

/** A estação leva a algum lugar? É o que decide a forma do seu marco no eixo. */
export function stationHasDestination(station: TimelineStation): boolean {
  return station.hasEditionPage || station.archiveState === 'edicao-vigente';
}
