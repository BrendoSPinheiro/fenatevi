'use client';

import { useSyncExternalStore } from 'react';

import { getA11yPreferences, subscribeToA11yPreferences } from '@/lib/a11y/preferences';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const unsubscribePreference = subscribeToA11yPreferences(onChange);

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return unsubscribePreference;
  }

  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener('change', onChange);

  return () => {
    mediaQuery.removeEventListener('change', onChange);
    unsubscribePreference();
  };
}

function getSnapshot(): boolean {
  /*
   * A escolha feita no portal **vence** a do sistema, e só em uma direção:
   * quem pediu movimento reduzido aqui recebe movimento reduzido, ainda que o
   * sistema não peça. O contrário não existe — o portal não liga animação para
   * quem pediu ao sistema para desligá-la.
   */
  if (getA11yPreferences().motion === 'reduzido') {
    return true;
  }

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia(QUERY).matches;
}

/**
 * Indica se o usuário pediu movimento reduzido — no sistema ou no portal.
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
