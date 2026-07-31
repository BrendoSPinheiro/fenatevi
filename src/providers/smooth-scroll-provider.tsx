'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gsap, ScrollTrigger } from '@/lib/animation/gsap';
import { setLenisInstance } from '@/lib/animation/lenis/lenis-instance';

/**
 * Ativa o smooth scroll do Lenis.
 *
 * Decisões importantes:
 *
 * - **Não renderiza nada.** O conteúdo não fica dentro de um wrapper, então a
 *   página continua íntegra e rolável se este componente falhar ou nunca montar.
 * - **Um único loop de RAF.** O Lenis é avançado pelo ticker do GSAP em vez de
 *   um `requestAnimationFrame` próprio; dois loops competindo produzem jitter.
 * - **Sincronizado com o ScrollTrigger**, que precisa saber a cada quadro qual é
 *   a posição real do scroll.
 * - **Desativado sob movimento reduzido**, devolvendo o controle ao scroll nativo.
 * - **Âncoras preservadas** via `anchors: true` (links `#secao` continuam funcionando).
 * - Regiões com scroll próprio (modais, listas roláveis) devem receber o atributo
 *   `data-lenis-prevent` para manter o comportamento nativo.
 */
export function SmoothScrollProvider() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      anchors: true,
    });

    setLenisInstance(lenis);
    lenis.on('scroll', ScrollTrigger.update);

    const advance = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(advance);
    // Sem lag smoothing o scroll não "salta" após uma queda de quadros.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(advance);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [prefersReducedMotion]);

  return null;
}
