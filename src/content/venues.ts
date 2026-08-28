import type { Venue } from '@/types/festival';

/**
 * Os espaços da edição 2024, como o programa impresso os lista.
 *
 * Nome e endereço são acervo em pt-BR; o tipo é chave de tradução.
 *
 * **As coordenadas são reais**, em graus decimais, e vieram do OpenStreetMap a
 * partir do endereço que o programa impresso publica. A precisão varia com o
 * que o OSM tem, e está anotada em cada espaço: `poi` quando o próprio
 * equipamento está mapeado, `numero` quando o número da rua existe, `via`
 * quando só a rua ou a praça existem. Nenhuma foi arbitrada — um marcador no
 * lugar errado de um mapa de verdade é pior do que não ter mapa.
 */
const RAW_VENUES = [
  {
    id: 'casa',
    name: 'Casa da Música Sônia Cabral',
    parentVenueId: null,
    address: 'Praça João Clímaco, s/n — Centro, Vitória/ES',
    kind: 'teatro-casa-de-musica',
    /* Praça João Clímaco, o endereço que o programa publica (a casa é "s/n"). */
    coordinates: { latitude: -20.3212649, longitude: -40.3390521 },
    coordinatePrecision: 'via',
  },
  {
    id: 'milson',
    name: 'Sala Milson Henriques',
    parentVenueId: 'casa',
    address: 'Praça João Clímaco, s/n — Centro, Vitória/ES',
    kind: 'sala',
    /* A sala fica dentro da Casa da Música: mesma coordenada. */
    coordinates: { latitude: -20.3212649, longitude: -40.3390521 },
    coordinatePrecision: 'via',
  },
  {
    id: 'sesi',
    name: 'Teatro SESI Jardim da Penha',
    parentVenueId: null,
    address: 'R. Tupinambás, 240 — Jardim da Penha, Vitória/ES',
    kind: 'teatro',
    /* O "Teatro do SESI" está mapeado no OSM. */
    coordinates: { latitude: -20.2853641, longitude: -40.2996321 },
    coordinatePrecision: 'poi',
  },
  {
    id: 'ufes',
    name: 'Teatro Universitário UFES',
    parentVenueId: null,
    address: 'Av. Fernando Ferrari, 514 — Goiabeiras, Vitória/ES',
    kind: 'teatro-universitario',
    /* O "Teatro Universitário" está mapeado no OSM. */
    coordinates: { latitude: -20.2775368, longitude: -40.3020344 },
    coordinatePrecision: 'poi',
  },
  {
    id: 'praca',
    name: 'Praça Costa Pereira',
    parentVenueId: null,
    address: 'Av. Jerônimo Monteiro — Centro, Vitória/ES',
    kind: 'ar-livre',
    /* A praça está mapeada no OSM. */
    coordinates: { latitude: -20.3200186, longitude: -40.3354631 },
    coordinatePrecision: 'poi',
  },
  {
    id: 'ma',
    name: 'Má Companhia',
    parentVenueId: null,
    address: 'R. Prof. Baltazar, 152 — Centro, Vitória/ES',
    kind: 'espaco-independente',
    /* A Rua Prof. Baltazar existe no OSM; o número 152, não. */
    coordinates: { latitude: -20.3193347, longitude: -40.3371225 },
    coordinatePrecision: 'via',
  },
  {
    id: 'estrelas',
    name: 'Teatro Estrelas',
    parentVenueId: null,
    address: 'Rua Pereira Pinto, 180 — Centro, Vitória/ES',
    kind: 'teatro-formacao',
    /* Rua Pereira Pinto, 180, com número mapeado no OSM. */
    coordinates: { latitude: -20.3187818, longitude: -40.3342697 },
    coordinatePrecision: 'numero',
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

/**
 * Os espaços que ganham marcador no mapa — os de primeiro nível, nesta ordem.
 *
 * **É a numeração que o mapa e a lista compartilham.** Uma sala dentro de uma
 * casa tem a coordenada da casa; dois marcadores no mesmo pixel seriam dois
 * alvos sobrepostos, e um número no mapa que não existisse na lista seria pior
 * do que não numerar.
 */
export const mappedVenues: readonly FestivalVenue[] = venues.filter(
  (venue) => venue.parentVenueId === null,
);

/** O espaço de um id, ou `undefined` quando o id não existe. */
export function findVenue(id: string): FestivalVenue | undefined {
  return venues.find((venue) => venue.id === id);
}
