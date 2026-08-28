import type { FestivalEdition } from '@/types/festival';

/**
 * A edição de 2024 — a 20ª, de 13 a 20 de outubro, e a edição **vigente** do
 * portal.
 *
 * Tudo aqui é acervo transcrito do programa impresso: o número da edição, a
 * janela de datas, a entrada franca, o mote que encerra o programa, a
 * apresentação assinada por Beth Caser e o nome cerimonial da mostra paralela.
 *
 * `hasPublishedProgram: true` é o que rege o comportamento do portal inteiro:
 * a programação desta edição está publicada, então nenhuma tela precisa avisar
 * que está exibindo acervo no lugar da edição corrente.
 */
export const edition2024: FestivalEdition = {
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
    portrait: {
      src: '/imagens/2024/beth-caser.png',
      altKey: 'bethCaser',
      provenance: 'programa-impresso-2024',
      isLowResolution: true,
    },
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
 * A edição vigente do festival.
 *
 * É um apelido de `edition2024`, e a indireção é o ponto: quando a organização
 * publicar a próxima edição, ela entra como um novo objeto neste arquivo e esta
 * constante passa a apontar para ele. Nenhuma tela precisa mudar — todas leem
 * `currentEdition`, nunca o ano.
 */
export const currentEdition: FestivalEdition = edition2024;

/**
 * A edição cuja programação o portal apresenta agora.
 *
 * Enquanto a vigente não publicar a sua, seria a última edição com acervo
 * completo — e o portal informaria isso ao visitante. Hoje as duas coincidem.
 */
export const displayedEdition: FestivalEdition = currentEdition.hasPublishedProgram
  ? currentEdition
  : edition2024;

/** O portal está mostrando acervo no lugar da programação da edição vigente? */
export const isShowingArchiveAsProgram: boolean = !currentEdition.hasPublishedProgram;
