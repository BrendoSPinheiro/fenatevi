'use client';

import type Lenis from 'lenis';

/**
 * Referência à instância ativa do Lenis.
 *
 * É um singleton de módulo em vez de um React Context de propósito: existe no
 * máximo uma instância de Lenis por página, ela é criada por um único provider e
 * apenas um punhado de componentes precisa dela. Um Context aqui adicionaria um
 * provider e re-renderizações sem entregar nada em troca.
 *
 * `null` é um estado legítimo e esperado: o Lenis não é inicializado quando o
 * usuário prefere movimento reduzido. Todo consumidor precisa funcionar sem ele.
 */
let instance: Lenis | null = null;

export function setLenisInstance(next: Lenis | null): void {
  instance = next;
}

export function getLenisInstance(): Lenis | null {
  return instance;
}

/**
 * Rola até o topo usando o Lenis quando ele estiver ativo e o scroll nativo
 * caso contrário. O comportamento observável é o mesmo nos dois caminhos.
 */
export function scrollToTop(): void {
  const lenis = getLenisInstance();

  if (lenis) {
    lenis.scrollTo(0);
    return;
  }

  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 });
  }
}
