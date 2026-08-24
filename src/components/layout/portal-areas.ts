/**
 * As áreas do portal — a fonte única do que existe para navegar.
 *
 * Cabeçalho, menu de áreas, rodapé e navegação mobile leem daqui, de modo que
 * um destino novo entra em um lugar só. Cada área aponta para uma tela que
 * **existe**: o protótipo desenha "Ingressos" e "Experiência mobile", e nenhuma
 * das duas é rota — a primeira é a informação "entrada franca", que aparece na
 * programação, e a segunda é a especificação responsiva das telas reais.
 */
export interface PortalArea {
  readonly id: 'home' | 'programacao' | 'grade' | 'espacos' | 'memoria' | 'noticias';
  readonly href: string;
  /** Número do ato, como o protótipo numera as áreas. */
  readonly number: string;
}

export const portalAreas: readonly PortalArea[] = [
  { id: 'home', href: '/', number: '01' },
  { id: 'programacao', href: '/programacao', number: '02' },
  { id: 'grade', href: '/programacao/grade', number: '03' },
  { id: 'espacos', href: '/espacos', number: '04' },
  { id: 'memoria', href: '/memoria', number: '05' },
  { id: 'noticias', href: '/noticias', number: '06' },
];

/** As áreas do cabeçalho: a marca já leva à home, que por isso fica de fora. */
export const headerAreas: readonly PortalArea[] = portalAreas.filter((area) => area.id !== 'home');

/**
 * As áreas da navegação inferior em telas estreitas.
 *
 * Quatro destinos, escolhidos pelo que alguém consulta **durante** o festival:
 * o que tem hoje, o dia inteiro, onde é, e o acervo.
 */
export const mobileAreas: readonly PortalArea[] = portalAreas.filter((area) =>
  ['programacao', 'grade', 'espacos', 'memoria'].includes(area.id),
);
