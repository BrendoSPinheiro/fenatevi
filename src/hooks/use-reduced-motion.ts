'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }

  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(QUERY).matches;
}

/**
 * Indica se o usuário pediu movimento reduzido.
 *
 * No servidor devolve `false` — assumimos que há movimento e o desligamos após a
 * hidratação, se necessário. Isso mantém o HTML do servidor e do cliente
 * idênticos na primeira renderização (sem erro de hidratação), e é seguro porque
 * nenhuma animação do site esconde conteúdo: elas apenas partem de um estado
 * inicial e chegam ao estado natural do documento.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
