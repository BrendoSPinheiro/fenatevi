'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Ponto único de acesso ao GSAP.
 *
 * Regras:
 * - Importe GSAP **somente** a partir deste módulo, para que os plugins sejam
 *   registrados uma única vez.
 * - Este arquivo é `'use client'`: nunca é avaliado durante a renderização no
 *   servidor, então `window` e `document` estão sempre disponíveis quando o
 *   registro acontece.
 * - Use `useGSAP` com `scope` e refs locais. Não use seletores globais: eles
 *   vazam entre componentes e quebram o cleanup automático.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger);

export { gsap, ScrollTrigger, useGSAP };

/**
 * Executa `build` apenas quando o usuário **não** pediu movimento reduzido.
 *
 * Usa `gsap.matchMedia()`, que além de condicionar a criação da timeline também
 * a reverte automaticamente caso a preferência mude durante a sessão — devolvendo
 * os elementos ao estado natural do documento.
 *
 * Deve ser chamada de dentro de um `useGSAP`, retornando o resultado como cleanup:
 *
 * ```ts
 * useGSAP(() => respectReducedMotion(() => { gsap.from(...) }), { scope: ref });
 * ```
 */
export function respectReducedMotion(build: () => void): () => void {
  const mediaQuery = gsap.matchMedia();
  mediaQuery.add('(prefers-reduced-motion: no-preference)', build);
  return () => mediaQuery.revert();
}
