import type { Venue } from '@/types/festival';

/**
 * Os espaços da edição 2024, como o programa impresso os lista.
 *
 * Nome e endereço são acervo em pt-BR; o tipo é chave de tradução. As posições
 * são as do esquema do protótipo — porcentagens dentro do container, **não**
 * coordenadas geográficas.
 */
const RAW_VENUES = [
  {
    id: 'casa',
    name: 'Casa da Música Sônia Cabral',
    parentVenueId: null,
    address: 'Praça João Clímaco, s/n — Centro, Vitória/ES',
    kind: 'teatro-casa-de-musica',
    position: { x: 46, y: 58 },
  },
  {
    id: 'milson',
    name: 'Sala Milson Henriques',
    parentVenueId: 'casa',
    address: 'Praça João Clímaco, s/n — Centro, Vitória/ES',
    kind: 'sala',
    position: { x: 52, y: 63 },
  },
  {
    id: 'sesi',
    name: 'Teatro SESI Jardim da Penha',
    parentVenueId: null,
    address: 'R. Tupinambás, 240 — Jardim da Penha, Vitória/ES',
    kind: 'teatro',
    position: { x: 76, y: 22 },
  },
  {
    id: 'ufes',
    name: 'Teatro Universitário UFES',
    parentVenueId: null,
    address: 'Av. Fernando Ferrari, 514 — Goiabeiras, Vitória/ES',
    kind: 'teatro-universitario',
    position: { x: 86, y: 34 },
  },
  {
    id: 'praca',
    name: 'Praça Costa Pereira',
    parentVenueId: null,
    address: 'Av. Jerônimo Monteiro — Centro, Vitória/ES',
    kind: 'ar-livre',
    position: { x: 33, y: 70 },
  },
  {
    id: 'ma',
    name: 'Má Companhia',
    parentVenueId: null,
    address: 'R. Prof. Baltazar, 152 — Centro, Vitória/ES',
    kind: 'espaco-independente',
    position: { x: 24, y: 80 },
  },
  {
    id: 'estrelas',
    name: 'Teatro Estrelas',
    parentVenueId: null,
    address: 'Rua Pereira Pinto, 180 — Centro, Vitória/ES',
    kind: 'teatro-formacao',
    position: { x: 38, y: 86 },
  },
] as const;

/**
 * Os ids válidos de espaço, derivados do próprio acervo.
 *
 * É isto que faz uma referência inválida — em uma atividade, numa oficina, num
 * processo criativo — quebrar o `pnpm typecheck` em vez de virar um `undefined`
 * silencioso em produção. Não há schema validator no projeto e não é preciso um:
 * o dado é estático e o compilador é o validador.
 */
export type VenueId = (typeof RAW_VENUES)[number]['id'];

/** Um espaço com integridade referencial garantida por tipo. */
export interface FestivalVenue extends Venue {
  readonly id: VenueId;
  readonly parentVenueId: VenueId | null;
}

/*
 * A anotação de tipo aqui é o que valida o acervo: o `parentVenueId` de cada
 * espaço precisa ser um id que existe na própria lista, ou isto não compila.
 *
 * As fotografias de espaço que o protótipo distribui (`venue-a/b/c.jpg`) não
 * vêm identificadas com o espaço que retratam. Atribuí-las a um espaço nomeado
 * seria uma afirmação sobre a realidade que o material não sustenta, então
 * nenhum espaço declara fotografia: a página de espaço trata a ausência com
 * área neutra, que é o comportamento que o protótipo já desenha.
 */
export const venues: readonly FestivalVenue[] = RAW_VENUES.map((venue) => ({
  ...venue,
  image: null,
  accessibility: [],
}));

/** O espaço de um id, ou `undefined` quando o id não existe. */
export function findVenue(id: string): FestivalVenue | undefined {
  return venues.find((venue) => venue.id === id);
}
