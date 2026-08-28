import type { IsoDateTime } from '@/types/festival';

/**
 * O relógio do portal.
 *
 * **Existe por causa da demonstração, e some com uma linha.** Esta branch
 * apresenta a edição de 2024 como edição vigente, e o portal inteiro deriva
 * estado de tempo do instante corrente: o que está em cena agora, o que ainda
 * acontece hoje, qual dia a grade abre, se uma oficina ainda recebe inscrição.
 * Lido do relógio da máquina, todo esse estado responderia "a edição terminou"
 * — que é verdade no calendário e é exatamente o contrário do que a
 * demonstração precisa mostrar.
 *
 * Então o instante corrente passa a ser um **dado**, não uma leitura do
 * ambiente. Servidor e cliente importam o mesmo módulo e chegam ao mesmo
 * instante, o que também elimina a única fonte real de divergência de
 * hidratação que sobraria aqui.
 *
 * Trocar `DEMO_INSTANT` por `null` devolve o portal ao relógio de verdade, sem
 * mudar mais nenhum arquivo.
 */

/**
 * O instante que o portal considera "agora".
 *
 * `null` significa relógio real. O valor atual é a sexta-feira 18 de outubro de
 * 2024, às 14h20 — meio da edição: "Dona Rua Gentileza" está em cena, o
 * lançamento de livros e "SAGA" ainda acontecem no mesmo dia, e cinco dias de
 * programação já passaram.
 */
export const DEMO_INSTANT: IsoDateTime | null = '2024-10-18T14:20:00-03:00';

/** O instante corrente do portal. */
export function festivalNow(): Date {
  return DEMO_INSTANT === null ? new Date() : new Date(DEMO_INSTANT);
}
