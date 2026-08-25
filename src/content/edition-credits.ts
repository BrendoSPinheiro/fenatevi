import type { CreditLine } from '@/types/festival';

/**
 * A ficha técnica da edição 2024 — 13 linhas.
 *
 * Acervo em pt-BR. Ordem e grafia são as do programa impresso e não são
 * reorganizadas: numa ficha técnica, a ordem é parte da informação.
 */
export const editionCredits: readonly CreditLine[] = [
  { label: 'Direção geral', value: 'Elenice Moreira' },
  { label: 'Produção executiva', value: 'Taty Moraes' },
  { label: 'Coordenação de curadoria', value: 'Beth Caser' },
  { label: 'Curadoria', value: 'Beth Caser, Taty Moraes' },
  { label: 'Assessoria de imprensa', value: 'Márcia Almeida' },
  { label: 'Assistente de produção', value: 'George Henrique, Nívea Bromate' },
  { label: 'Apoio', value: 'Everton de Souza, Walter Gomes, Nilze Nascimento e Ramon Bastos' },
  { label: 'Gestão de mídias sociais', value: 'Tina Moreira, Duda Serqueira' },
  { label: 'Organização', value: 'Associação Cultural, Circense e Ambiental Uma Floresta' },
  { label: 'Produção', value: 'Ratimbum Produções de Artes' },
  { label: 'Patrocínio', value: 'Prefeitura Municipal de Vitória — Lei Rubem Braga' },
  { label: 'Promoção', value: 'TV Gazeta' },
  {
    label: 'Apoio de espaços',
    value: 'Casa da Música Sônia Cabral, Teatro Universitário (UFES), Teatro SESI, Teatro Estrelas',
  },
];
