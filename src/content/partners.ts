import type { Partner } from '@/types/festival';

/**
 * Quem realiza, produz, patrocina, promove e apoia o festival.
 *
 * O papel é chave traduzida; o nome da instituição é acervo e não se traduz. A
 * nota é chave de tradução (`parceiros.notes.*`) porque é texto de interface —
 * uma frase escrita para o visitante, não um registro do programa.
 */
export const partners: readonly Partner[] = [
  {
    id: 'uma-floresta',
    role: 'realizacao',
    name: 'Associação Cultural, Circense e Ambiental Uma Floresta',
    noteKey: 'umaFloresta',
  },
  {
    id: 'ratimbum',
    role: 'producao',
    name: 'Ratimbum Produções de Artes',
    noteKey: 'ratimbum',
  },
  {
    id: 'prefeitura',
    role: 'patrocinio',
    name: 'Prefeitura Municipal de Vitória',
    noteKey: 'prefeitura',
  },
  {
    id: 'tv-gazeta',
    role: 'promocao',
    name: 'TV Gazeta',
    noteKey: 'tvGazeta',
  },
  {
    id: 'espacos-parceiros',
    role: 'apoio',
    name: 'Casa da Música Sônia Cabral · Teatro Universitário UFES · Teatro SESI · Teatro Estrelas',
    noteKey: 'espacosParceiros',
  },
];
