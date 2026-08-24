'use client';

import { useEffect, useState } from 'react';

/**
 * Condensa o cabeçalho depois que a página rola.
 *
 * Client Component de folha, e **puramente visual**: ele encolhe o respiro
 * vertical e assenta o fundo, mas não move, esconde nem reordena nenhum item —
 * um cabeçalho que reorganiza seus links no meio da rolagem obriga a reaprender
 * a navegação a cada scroll.
 *
 * Aplica a classe no elemento pai em vez de renderizar o cabeçalho: assim o
 * cabeçalho inteiro continua sendo Server Component, e só este ouvinte vai para
 * o bundle.
 */
export function HeaderCondense() {
  const [isCondensed, setIsCondensed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsCondensed(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.headerCondensed = String(isCondensed);
  }, [isCondensed]);

  return null;
}
