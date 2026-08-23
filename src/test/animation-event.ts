/**
 * `AnimationEvent` para o jsdom, que não a implementa.
 *
 * Sem ela o React detecta o ambiente como legado e registra
 * `webkitAnimationEnd` no lugar de `animationend`. O efeito prático é que
 * nenhum `animationend` disparado por um teste chega a um `onAnimationEnd` — e
 * os testes passariam sem exercitar nada.
 *
 * **A ordem importa:** a detecção do React acontece quando o `react-dom` é
 * avaliado, e o resultado fica em cache. Por isso este módulo é importado antes
 * de qualquer coisa em `setup.ts`; defini-la depois não tem efeito.
 */
class JsdomAnimationEvent extends Event {
  readonly animationName: string;
  readonly elapsedTime: number;
  readonly pseudoElement: string;

  constructor(type: string, init: AnimationEventInit = {}) {
    super(type, init);
    this.animationName = init.animationName ?? '';
    this.elapsedTime = init.elapsedTime ?? 0;
    this.pseudoElement = init.pseudoElement ?? '';
  }
}

if (typeof globalThis.AnimationEvent === 'undefined') {
  globalThis.AnimationEvent = JsdomAnimationEvent as unknown as typeof AnimationEvent;
}
