import { type VenueId } from '@/content/venues';

import type { CreativeProcessDay, CreativeProcessItem } from '@/types/festival';

/**
 * As demonstrações de processo criativo — uma por companhia, ao fim do dia.
 *
 * Não têm horário próprio no programa: acontecem **após a sessão** daquele
 * espaço, e é assim que a programação as apresenta e as ordena.
 *
 * O nome da companhia é acervo em pt-BR, com a sigla de origem como o programa
 * a escreve; o espaço é referência por id, verificada pelo compilador.
 */
interface FestivalCreativeProcessItem extends CreativeProcessItem {
  readonly venueId: VenueId;
}

interface FestivalCreativeProcessDay extends CreativeProcessDay {
  readonly items: readonly FestivalCreativeProcessItem[];
}

export const creativeProcesses: readonly FestivalCreativeProcessDay[] = [
  {
    date: '2024-10-13',
    items: [
      { company: 'Cia Peralta — ES', venueId: 'casa' },
      { company: 'Grupo Teatral Gota, Pó e Poeira — ES', venueId: 'sesi' },
    ],
  },
  {
    date: '2024-10-14',
    items: [
      { company: 'Os Tião Grupo de Teatro — ES', venueId: 'casa' },
      { company: 'CIA T21 — ES', venueId: 'casa' },
      { company: 'Grupo Tarahumaras — ES', venueId: 'sesi' },
    ],
  },
  {
    date: '2024-10-15',
    items: [
      { company: 'Grupo de Teatro Experimental Capixaba — ES', venueId: 'milson' },
      { company: 'Trupamba Cia Teatral — ES', venueId: 'sesi' },
      { company: 'Cia Teatral JC — ES', venueId: 'casa' },
    ],
  },
  {
    date: '2024-10-16',
    items: [{ company: 'Cia Da Ideia — Companhia de Dança — RJ', venueId: 'casa' }],
  },
  {
    date: '2024-10-17',
    items: [{ company: 'Boyásha Trupe de Teatro — ES', venueId: 'praca' }],
  },
  {
    date: '2024-10-18',
    items: [
      { company: 'Trupe Ratimbum — ES', venueId: 'casa' },
      { company: 'Preqaria Cia de Teatro — MG', venueId: 'casa' },
    ],
  },
  {
    date: '2024-10-19',
    items: [
      { company: 'Companhia OsViajero — ES', venueId: 'praca' },
      { company: 'Grupo Anônimos de Teatro — ES', venueId: 'casa' },
      { company: 'Grupo de Teatro Arte Oficina — ES', venueId: 'ufes' },
      { company: 'Repertório Artes Cênicas e Cia — ES', venueId: 'ma' },
    ],
  },
  {
    date: '2024-10-20',
    items: [{ company: 'Grupo Rerigtiba — ES', venueId: 'casa' }],
  },
];
