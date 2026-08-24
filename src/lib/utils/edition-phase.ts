import { displayedEdition } from '@/content/festival';

import type { FestivalEdition } from '@/types/festival';

/** Onde a edição está em relação a um instante. */
export type EditionPhase = 'before' | 'during' | 'after';

/**
 * A fase de uma edição num instante.
 *
 * O dia final é inclusivo: a edição de 13 a 20 de outubro só passa a `after`
 * depois que o dia 20 termina, e não às 00h dele.
 */
export function editionPhase(edition: FestivalEdition, now: Date): EditionPhase {
  const start = new Date(`${edition.startDate}T00:00:00-03:00`).getTime();
  const end = new Date(`${edition.endDate}T23:59:59-03:00`).getTime();
  const instant = now.getTime();

  if (instant < start) {
    return 'before';
  }

  return instant > end ? 'after' : 'during';
}

/**
 * A fase da edição exibida, decidida uma vez por render.
 *
 * **Esta é a peça que mantém as telas estáticas apesar de "em cena agora".**
 * Quando a fase é `before` ou `after`, o resultado não expira: uma janela
 * inteiramente no passado continua no passado no minuto seguinte, e o servidor
 * pode gravar "encerrada" no HTML com segurança, sem relógio no cliente.
 *
 * Só quando a fase é `during` é que o instante corrente importa — e aí um
 * Client Component de folha refina o baseline depois da montagem, sem que o
 * primeiro render mude.
 */
export const displayedEditionPhase: EditionPhase = editionPhase(displayedEdition, new Date());

/** A edição exibida contém o instante corrente? */
export const isEditionRunning: boolean = displayedEditionPhase === 'during';
