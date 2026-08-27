'use client';

import { useEffect } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

interface EditionTimelineRailWheelProps {
  /** `id` do trilho que este ouvinte comanda. */
  readonly targetId: string;
}

/** Quanto do gesto vertical vira avanço horizontal. */
const WHEEL_GAIN = 1.15;
/** Fração da distância restante percorrida a cada quadro. */
const EASING = 0.16;
/** Abaixo disso o trilho já chegou: encerra o laço em vez de perseguir frações. */
const SETTLE_PX = 1;

type Axis = 'vertical' | 'horizontal';

/**
 * O elemento ainda pode rolar nesse sentido?
 *
 * A folga de 1px existe porque `scrollLeft` e `scrollWidth` são fracionários em
 * telas com densidade não inteira: comparar exato deixaria o trilho "preso" no
 * fim por meio pixel, e o gesto seguinte não chegaria à página.
 */
function canScroll(element: HTMLElement, delta: number, axis: Axis): boolean {
  const position = axis === 'vertical' ? element.scrollTop : element.scrollLeft;
  const content = axis === 'vertical' ? element.scrollHeight : element.scrollWidth;
  const visible = axis === 'vertical' ? element.clientHeight : element.clientWidth;
  const max = content - visible;

  if (max <= 1) {
    return false;
  }

  return delta > 0 ? position < max - 1 : position > 1;
}

/**
 * O comportamento de rolagem do trilho: a roda vertical o avança de lado, e o
 * salto do eixo aterrissa a edição pedida no início da tira.
 *
 * **É enriquecimento, não mecanismo.** O trilho continua sendo um contêiner com
 * `overflow-x: auto` e `scroll-snap`, e este ouvinte apenas move o `scrollLeft`
 * verdadeiro — de modo que arrasto, toque, teclado, o marcador do eixo (que lê
 * uma `scroll-timeline` do próprio contêiner) e o funcionamento sem JavaScript
 * continuem exatamente como antes. Sem este componente, a tira roda como
 * qualquer carrossel horizontal.
 *
 * **O gesto nunca fica preso.** É a falha clássica desse efeito: a página trava
 * porque a tira sequestra a roda para sempre. Aqui a prioridade é explícita e
 * tem saída em cada degrau:
 *
 * 1. a estação sob o cursor ainda tem texto para rolar? o gesto é dela;
 * 2. o trilho ainda anda para esse lado? o trilho consome;
 * 3. caso contrário o gesto passa adiante e a página segue.
 *
 * `stopPropagation` só acontece no degrau 2. O provider de smooth scroll ouve a
 * roda na janela, e deixá-lo receber o mesmo gesto faria a página andar junto
 * com a tira. Não uso `data-lenis-prevent` — o atributo desligaria o Lenis para
 * o trilho inteiro, inclusive no degrau 3, que é justamente onde a página
 * *deve* rolar com o mesmo conforto do resto do portal.
 *
 * A folha cuida também do **salto do eixo**: um link de fragmento leva à edição
 * sozinho, mas o alinhamento nativo deixa o painel pedido uma coluna adiante, e
 * aqui ele é trazido para o início da tira.
 *
 * Client Component de folha, no padrão de `header-condense.tsx`: não renderiza
 * nada, acha o alvo pelo `id` e só o ouvinte vai para o bundle — a tira inteira
 * continua Server Component.
 */
export function EditionTimelineRailWheel({ targetId }: EditionTimelineRailWheelProps) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const rail = document.getElementById(targetId);

    if (rail === null) {
      return;
    }

    let target = rail.scrollLeft;
    let frame: number | null = null;

    /*
     * A âncora do `scroll-snap` é suspensa enquanto a tira desliza.
     *
     * Com `scroll-snap-type: x mandatory`, o navegador reancora a cada escrita
     * em `scrollLeft`: a interpolação avança alguns pixels e é puxada de volta
     * para a mesma estação no quadro seguinte, e a tira nunca sai do lugar.
     * Desligar o encaixe durante o deslize e devolvê-lo ao chegar dá as duas
     * coisas — o percurso contínuo e a estação alinhada no fim.
     */
    function releaseSnap() {
      if (rail !== null) {
        rail.style.scrollSnapType = 'none';
      }
    }

    function restoreSnap() {
      if (rail !== null) {
        rail.style.removeProperty('scroll-snap-type');
      }
    }

    /*
     * O destino é perseguido quadro a quadro em vez de somado direto ao
     * `scrollLeft`. Uma roda de mouse entrega saltos grandes e espaçados: sem a
     * interpolação, a tira andaria aos trancos ao lado de uma página que rola
     * suavemente, e a diferença entre as duas seria mais visível que o efeito.
     */
    function step() {
      if (rail === null) {
        return;
      }

      const distance = target - rail.scrollLeft;

      if (Math.abs(distance) < SETTLE_PX) {
        rail.scrollLeft = target;
        frame = null;
        // Devolver o encaixe aqui é o que faz a tira parar alinhada.
        restoreSnap();
        return;
      }

      /*
       * O passo nunca é menor que um pixel.
       *
       * `scrollLeft` é arredondado pelo navegador: perto do fim, um incremento
       * de meio pixel some no arredondamento, a distância não diminui e o laço
       * gira para sempre — deixando o encaixe desligado e um `requestAnimation
       * Frame` vivo. Garantir avanço mínimo é o que faz o deslize convergir.
       */
      const advance = distance * EASING;

      rail.scrollLeft += Math.abs(advance) < 1 ? Math.sign(distance) : advance;
      frame = requestAnimationFrame(step);
    }

    function handleWheel(event: WheelEvent) {
      if (rail === null) {
        return;
      }

      // Gesto já horizontal (trackpad de lado, Shift+roda): o navegador resolve.
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        return;
      }

      const delta = event.deltaY;

      if (delta === 0) {
        return;
      }

      // 1. A estação sob o cursor ainda tem texto por ler.
      const panel = (event.target as Element | null)?.closest<HTMLElement>('[data-station]');

      if (panel !== null && panel !== undefined && canScroll(panel, delta, 'vertical')) {
        return;
      }

      // 3. O trilho chegou ao fim: o gesto é da página.
      if (!canScroll(rail, delta, 'horizontal')) {
        target = rail.scrollLeft;
        return;
      }

      // 2. O trilho consome.
      event.preventDefault();
      event.stopPropagation();

      const max = rail.scrollWidth - rail.clientWidth;

      /*
       * O destino parte da posição real quando não há laço em curso. Sem isso,
       * um gesto dado depois de um arrasto com a barra continuaria de onde a
       * roda havia parado, e a tira saltaria para trás.
       */
      const from = frame === null ? rail.scrollLeft : target;
      target = Math.min(max, Math.max(0, from + delta * WHEEL_GAIN));

      if (prefersReducedMotion) {
        // Sem interpolação não há briga com o encaixe: o salto é único.
        rail.scrollLeft = target;
        return;
      }

      releaseSnap();
      frame ??= requestAnimationFrame(step);
    }

    /*
     * O salto do eixo aterrissa a edição no início da tira.
     *
     * A âncora nativa já traz o painel para dentro da tela — mas com alinhamento
     * "o mais perto possível", e o encaixe obrigatório então acerta o painel
     * *vizinho* no início: pedir 2012 e receber 2013 na primeira coluna. Aqui a
     * posição é corrigida para o começo exato do painel pedido.
     *
     * Continua sendo enriquecimento. Sem JavaScript o link de fragmento leva à
     * edição do mesmo jeito, uma coluna adiante — visível, só não alinhada.
     */
    function alignHashTarget() {
      if (rail === null || !location.hash.startsWith('#edicao-')) {
        return;
      }

      const panel = document.getElementById(decodeURIComponent(location.hash.slice(1)));

      if (panel === null || !rail.contains(panel)) {
        return;
      }

      const inset = Number.parseFloat(getComputedStyle(rail).scrollPaddingInlineStart) || 0;
      const left = Math.max(0, panel.offsetLeft - inset);

      // O laço da roda, se estiver em curso, perseguiria o destino antigo.
      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
        restoreSnap();
      }

      target = left;
      rail.scrollTo({ left, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    rail.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('hashchange', alignHashTarget);

    // Uma URL compartilhada já chega com a âncora resolvida pelo navegador.
    alignHashTarget();

    return () => {
      rail.removeEventListener('wheel', handleWheel);
      window.removeEventListener('hashchange', alignHashTarget);

      if (frame !== null) {
        cancelAnimationFrame(frame);
      }

      restoreSnap();
    };
  }, [targetId, prefersReducedMotion]);

  return null;
}
