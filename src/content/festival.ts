import type { FestivalEdition } from '@/types/festival';

/**
 * A edição vigente — 22ª, de 13 a 21 de outubro de 2026.
 *
 * `hasPublishedProgram: false` é o que rege o comportamento do portal inteiro
 * hoje: enquanto a organização não publicar a programação de 2026, cada tela
 * que apresenta programação exibe o acervo da última edição completa **e diz
 * que é isso que está fazendo**. Quando a programação entrar, basta virar este
 * campo — nenhum componente muda, e o aviso desaparece sozinho.
 */
export const currentEdition: FestivalEdition = {
  id: 'fenatevi-2026',
  edition: 22,
  year: 2026,
  startDate: '2026-10-13',
  endDate: '2026-10-21',
  city: 'Vitória',
  freeEntry: true,
  motto: null,
  hasPublishedProgram: false,
  statement: null,
  parallelShowcaseName: null,
  coverImage: null,
  accessibility: ['audioDescription', 'signLanguage', 'wheelchairAccess'],
};

/**
 * A edição de 2024 — a última com acervo completo.
 *
 * É a edição que o portal apresenta enquanto a vigente não tem programação
 * publicada, e é a que a rota `/edicoes/2024` documenta por inteiro.
 */
export const archivedEdition2024: FestivalEdition = {
  id: 'fenatevi-2024',
  edition: 20,
  year: 2024,
  startDate: '2024-10-13',
  endDate: '2024-10-20',
  city: 'Vitória',
  freeEntry: true,
  motto: 'A arte cura!',
  hasPublishedProgram: true,
  statement: {
    quote:
      '“O Teatro é arte da resistência. E, graças à resistência de mulheres e homens que compõem o universo das Artes Cênicas de Vitória do Espírito Santo, bem como dos quatro cantos do país é que o Festival Nacional de Teatro Cidade de Vitória chega à sua 20ª edição. Ainda é um jovem, mas com uma trajetória rica de experiências que reúne inúmeros espetáculos e atividades de formação.”',
    author: 'Beth Caser',
    authorRole: 'atriz, gestora e idealizadora do festival',
  },
  /*
   * Nome próprio: homenageia uma pessoa e por isso não é traduzido, ao
   * contrário da frente `mostra-paralela`, que é enum de interface.
   */
  parallelShowcaseName: '7ª Mostra Paralela Vera Viana',
  coverImage: {
    src: '/imagens/2024/edicao2024-capa.png',
    altKey: 'capa2024',
    provenance: 'programa-impresso-2024',
    isLowResolution: true,
  },
  accessibility: ['audioDescription', 'signLanguage'],
};

/**
 * A edição cuja programação o portal apresenta agora.
 *
 * Enquanto a vigente não publicar a sua, é a última edição com acervo
 * completo — e o portal informa isso ao visitante.
 */
export const displayedEdition: FestivalEdition = currentEdition.hasPublishedProgram
  ? currentEdition
  : archivedEdition2024;

/** O portal está mostrando acervo no lugar da programação da edição vigente? */
export const isShowingArchiveAsProgram: boolean = !currentEdition.hasPublishedProgram;
