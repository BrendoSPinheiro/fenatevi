import type { Book } from '@/types/festival';

/**
 * Os três livros lançados na edição 2024.
 *
 * Título, autoria e descrição são acervo em pt-BR — a descrição é a que consta
 * do programa, não uma sinopse reescrita.
 */
export const books: readonly Book[] = [
  {
    id: 'escuro-aceso',
    title: 'Melhor Manter o Escuro Aceso',
    author: 'Duílio Kuster Cid',
    description:
      'Coletânea de quatro textos teatrais escritos pelo ator e dramaturgo nos últimos anos: “A Lenda do Reino Partido”, “Búffalo’s Show”, “Rubem Braga: a Vida em Voz Alta” e “Sopa de Galena”.',
  },
  {
    id: 'ceu-e-o-limite',
    title: 'O Céu é o Limite',
    author: 'Erlon José Paschoal',
    description:
      'Texto teatral envolvente, sarcástico e crítico. Retrata a vida de um personagem bem-sucedido que busca resgatar as relações de afeto com seu filho adolescente.',
  },
  {
    id: 'ontem-hoje-amanha',
    title: 'Ontem, Hoje e Amanhã — Narrativas Capixabas',
    author: 'Nieve Matos e autores parceiros',
    description:
      'Coletânea de quatro dramaturgias criadas em processos colaborativos junto ao grupo Repertório Artes Cênicas e ao Instituto Cultural Tambor de Raiz.',
  },
];
