import type { Honoree } from '@/types/festival';

/**
 * Os homenageados da edição 2024.
 *
 * Nome, ofício e biografia são acervo em pt-BR. O `altKey` do retrato leva a um
 * texto alternativo que **identifica a pessoa** — num retrato, a informação é
 * quem está ali, não a composição da fotografia.
 */
export const honorees: readonly Honoree[] = [
  {
    id: 'bere',
    name: 'Bere (Luiz Carlos Siqueira)',
    role: 'Capataz de Circo e Técnico de Palco',
    biography:
      'Técnico do Teatro Carlos Gomes e da Casa de Música Sonia Cabral. Em 1987 iniciou sua carreira profissional no Circo da Cultura do DEC — Departamento Estadual de Cultura, tendo como seu mentor o Sr. Bandejinha. Em 1996 foi convidado a integrar a equipe do Teatro Carmelia e logo depois do Teatro Carlos Gomes. Foi o iluminador da Dona Lenira Borges e Mitzi Marzzuti por muitos anos e já trabalhou para vários grupos nacionais e locais.',
    portrait: {
      src: '/imagens/2024/homenageado-bere.png',
      altKey: 'homenageadoBere',
      provenance: 'programa-impresso-2024',
      isLowResolution: true,
    },
  },
  {
    id: 'alcides',
    name: 'Alcides Luiz Rodrigues Pereira',
    role: 'Técnico de Luz',
    biography:
      'Técnico do Teatro Carlos Gomes e da Casa de Música Sonia Cabral. Iniciou sua carreira em 1984 no Teatro SCAV e em 1985 foi efetivado no DEC — Departamento Estadual de Cultura. Passou também a integrar a equipe do Teatro Carlos Gomes a convite de Mauricio Silva e Waldir Castiglione. Em sua trajetória já montou iluminação para teatro, dança, música e circo, com grandes nomes como Fernanda Montenegro, Paulo Gustavo, Bibi Ferreira e Lenira Borges.',
    portrait: {
      src: '/imagens/2024/homenageado-alcides.png',
      altKey: 'homenageadoAlcides',
      provenance: 'programa-impresso-2024',
      isLowResolution: true,
    },
  },
];
