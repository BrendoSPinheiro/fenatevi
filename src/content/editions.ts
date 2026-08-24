import type { EditionTimelineEntry } from '@/types/festival';

/**
 * A linha do tempo das edições.
 *
 * Cada entrada carrega seu **estado de acervo**, e é o estado que decide o que
 * a entrada oferece: só uma edição com `acervo-completo` tem página própria, de
 * modo que a linha do tempo nunca aponta para uma página que não existe.
 *
 * A descrição de cada entrada é texto de interface, e vive em `messages/` sob
 * `memoria.entries.<id>` — não aqui.
 */
export const editionTimeline: readonly EditionTimelineEntry[] = [
  {
    id: '2026',
    firstYear: 2026,
    lastYear: 2026,
    edition: 22,
    editionCount: 1,
    startDate: '2026-10-13',
    endDate: '2026-10-21',
    archiveState: 'edicao-vigente',
    completeness: 0.12,
    hasEditionPage: false,
  },
  {
    id: '2025',
    firstYear: 2025,
    lastYear: 2025,
    edition: 21,
    editionCount: 1,
    startDate: null,
    endDate: null,
    archiveState: 'acervo-pendente',
    completeness: 0.06,
    hasEditionPage: false,
  },
  {
    id: '2024',
    firstYear: 2024,
    lastYear: 2024,
    edition: 20,
    editionCount: 1,
    startDate: '2024-10-13',
    endDate: '2024-10-20',
    archiveState: 'acervo-completo',
    completeness: 1,
    hasEditionPage: true,
  },
  {
    id: '2004-2023',
    firstYear: 2004,
    lastYear: 2023,
    edition: null,
    editionCount: 19,
    startDate: null,
    endDate: null,
    archiveState: 'em-digitalizacao',
    completeness: 0.18,
    hasEditionPage: false,
  },
];

/** Os anos que têm página de edição — a base do `generateStaticParams`. */
export const editionPageYears: readonly number[] = editionTimeline
  .filter((entry) => entry.hasEditionPage)
  .map((entry) => entry.firstYear);

/** A entrada de um ano, ou `undefined` quando o ano não está na linha do tempo. */
export function findEditionEntry(year: number): EditionTimelineEntry | undefined {
  return editionTimeline.find((entry) => entry.hasEditionPage && entry.firstYear === year);
}
