import type { EditionTimelineEntry } from '@/types/festival';

/**
 * A linha do tempo das edições.
 *
 * Cada entrada carrega seu **estado de acervo**, e é o estado que decide o que
 * a entrada oferece: só uma edição com página própria vira link, de modo que a
 * linha do tempo nunca aponta para uma página que não existe.
 *
 * A linha do tempo é **histórica por definição**: ela vai da fundação até a
 * edição vigente, e a edição vigente é uma entre muitas — não o assunto da
 * tela. Nenhuma entrada anterior sai daqui quando uma nova edição entra.
 *
 * A descrição de cada entrada é texto de interface, e vive em `messages/` sob
 * `memoria.entries.<id>` — não aqui.
 */
export const editionTimeline: readonly EditionTimelineEntry[] = [
  {
    id: '2024',
    firstYear: 2024,
    lastYear: 2024,
    edition: 20,
    editionCount: 1,
    startDate: '2024-10-13',
    endDate: '2024-10-20',
    archiveState: 'edicao-vigente',
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
