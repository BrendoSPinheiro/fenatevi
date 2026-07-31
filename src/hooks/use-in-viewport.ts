'use client';

import { useEffect, useState, type RefObject } from 'react';

/** Navegadores sem `IntersectionObserver` degradam para "sempre visível". */
const hasIntersectionObserver = () => typeof IntersectionObserver !== 'undefined';

/**
 * Informa se o elemento referenciado está visível na viewport.
 *
 * Usado para pausar trabalho caro — o loop de renderização do WebGL — quando a
 * cena sai da tela. Sem suporte a `IntersectionObserver` o valor é `true` desde
 * o início: degradar para "sempre ativo" é melhor do que nunca renderizar.
 */
export function useInViewport(ref: RefObject<Element | null>, rootMargin = '200px'): boolean {
  const [isInViewport, setIsInViewport] = useState(() => !hasIntersectionObserver());

  useEffect(() => {
    const element = ref.current;
    if (!element || !hasIntersectionObserver()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setIsInViewport(entry.isIntersecting);
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isInViewport;
}
