import { editionTimeline } from '@/content/editions';

import type { TimelineStation } from '@/lib/utils/timeline';
import type { EditionTimelineEntry } from '@/types/festival';

/**
 * Conteúdo de **prévia** da linha do tempo — ilustrativo, não acervo.
 *
 * Este arquivo existe para que o layout da tela de memória possa ser julgado
 * com as 22 edições no lugar, enquanto o acervo real de 2005 a 2023 ainda não
 * foi digitalizado. Nada aqui é registro do festival.
 *
 * **É o único arquivo a apagar no dia da substituição.** O plano completo está
 * em `openspec/changes/redesenhar-linha-do-tempo-da-memoria/design.md`; em
 * resumo: preencher `src/content/editions.ts` com as edições reais, apagar este
 * arquivo, remover as chaves `memoria.preview.*` e `imagens.previa*` dos três
 * `messages/`, e remover `images.remotePatterns` de `next.config.ts`.
 *
 * As estações de 2024, 2025 e 2026 **não são inventadas**: vêm de
 * `editionTimeline`, o acervo real, e continuam valendo depois da substituição.
 */

/**
 * A prévia está ligada?
 *
 * Enquanto for `true`, a tela de memória apresenta as 22 estações e **declara
 * na própria tela** que edições e imagens de 2005 a 2023 são ilustrativas.
 * Virar para `false` devolve a linha do tempo ao acervo real, sem apagar nada.
 */
export const TIMELINE_PREVIEW_ENABLED = true;

/**
 * A grade de anos — derivada, não chutada.
 *
 * Três fontes do repositório precisam fechar ao mesmo tempo: `festival.ts` fixa
 * 2024 como 20ª edição, `editions.ts` declara 19 edições em 2004–2023, e
 * `PRODUCT.md` diz "realizado desde 2004". Só existe um mapeamento consistente
 * com os três: **2004 é o ano de fundação, sem edição**, e a 1ª edição é 2005.
 * Daí 1ª = 2005 … 19ª = 2023, 20ª = 2024, 21ª = 2025, 22ª = 2026.
 *
 * É por isso que a substituição pelos dados reais não muda a grade: muda
 * título, imagem e completude.
 */
const FIRST_EDITION_YEAR = 2005;

/** O ano da primeira edição registrada no acervo real (2024, a 20ª). */
const FIRST_ARCHIVED_YEAR = Math.min(
  ...editionTimeline.filter((entry) => entry.edition !== null).map((entry) => entry.firstYear),
);

/**
 * Fotografias de teatro do Unsplash, usadas como ilustração das estações de
 * prévia.
 *
 * Não retratam o FENATEVI e não são acervo. Foram escolhidas dentro do que o
 * `DESIGN.md` admite — sala de espetáculo, cortina, plateia, corpo em cena — e
 * deliberadamente **fora** da estética de festival de música, que o documento
 * proíbe como deriva.
 *
 * A chave é a mesma usada em `messages/imagens`, para que cada fotografia tenha
 * seu próprio texto alternativo em vez de um rótulo genérico repetido.
 */
export const PREVIEW_PHOTOS = [
  { key: 'previaSilhuetas', id: 'photo-1503095396549-807759245b35' },
  { key: 'previaCortina', id: 'photo-1514306191717-452ec28c7814' },
  { key: 'previaPlateiaVazia', id: 'photo-1507924538820-ede94a04019d' },
  { key: 'previaTeatroHistorico', id: 'photo-1580809361436-42a7ec204889' },
  { key: 'previaPlateiaDoPalco', id: 'photo-1594122230689-45899d9e6f69' },
  { key: 'previaCasaCheia', id: 'photo-1516307365426-bea591f05011' },
  { key: 'previaCorpoEmCena', id: 'photo-1547153760-18fc86324498' },
] as const;

/** A URL de uma fotografia de prévia, no tamanho que a estação usa. */
export function previewPhotoUrl(id: string): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=960&q=70`;
}

/** O texto alternativo de uma fotografia de prévia, pela chave de `messages`. */
export function previewPhotoAltKey(id: string): string {
  return PREVIEW_PHOTOS.find((photo) => photo.id === id)?.key ?? 'previaCortina';
}

/**
 * Quantos resumos de prévia existem em `messages/memoria.preview.summaries`.
 *
 * Os resumos rodam entre as estações em vez de haver um texto por edição: 19
 * blurbs de festival inventados, em três idiomas, seriam 57 afirmações que
 * ninguém escreveu — e ficção sobre acervo é exatamente o que o portal não faz.
 */
const SUMMARY_COUNT = 4;

/**
 * Uma edição de prévia.
 *
 * A completude varia de forma determinística — mesma edição, mesmo valor — para
 * que a barra tenha alturas diferentes na tela sem depender de `Math.random`,
 * que produziria servidor e cliente discordando.
 */
function previewStation(edition: number): TimelineStation {
  const year = FIRST_EDITION_YEAR + edition - 1;

  return {
    id: String(year),
    firstYear: year,
    lastYear: year,
    edition,
    editionCount: 1,
    startDate: null,
    endDate: null,
    archiveState: 'em-digitalizacao',
    completeness: 0.04 + ((edition * 7) % 6) * 0.05,
    hasEditionPage: false,
    /* Uma fotografia a cada três estações: a ausência é o estado normal do
     * acervo em digitalização, e repetir sete imagens em dezenove estações
     * pareceria catálogo, não arquivo. */
    imageId: edition % 3 === 1 ? (PREVIEW_PHOTOS[Math.floor(edition / 3)]?.id ?? null) : null,
    summaryKey: `preview.summaries.${edition % SUMMARY_COUNT}`,
    isPreview: true,
  };
}

/** Uma edição real de `editionTimeline`, promovida a estação. */
function archivedStation(entry: EditionTimelineEntry): TimelineStation {
  return {
    ...entry,
    imageId: null,
    summaryKey: `entries.${entry.id}`,
    isPreview: false,
  };
}

/**
 * As 22 estações, da 1ª à vigente.
 *
 * As edições anteriores a 2024 são prévia; de 2024 em diante é acervo real,
 * copiado de `editionTimeline` sem alteração — inclusive `hasEditionPage`, que
 * é o que garante que nenhuma estação de prévia vire link para uma página de
 * edição inexistente.
 */
export const previewStations: readonly TimelineStation[] = [
  ...editionTimeline
    .filter((entry) => entry.edition !== null && entry.firstYear >= FIRST_ARCHIVED_YEAR)
    .map(archivedStation),
  ...Array.from({ length: FIRST_ARCHIVED_YEAR - FIRST_EDITION_YEAR }, (_, index) =>
    previewStation(FIRST_ARCHIVED_YEAR - FIRST_EDITION_YEAR - index),
  ),
];
