import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/**
 * Faz `window.matchMedia` responder `matches` para qualquer consulta.
 *
 * O jsdom não implementa `matchMedia`, do qual dependem `useReducedMotion` e o
 * `gsap.matchMedia()`.
 */
export function mockMatchMedia(matches: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

/**
 * O jsdom não implementa `getContext` e emite um aviso a cada chamada. Devolver
 * `null` reproduz exatamente o que um navegador sem WebGL faz — que é justamente
 * o caminho que os testes de fallback precisam exercitar — sem poluir a saída.
 */
HTMLCanvasElement.prototype.getContext = () => null;

// Padrão de cada teste: "sem preferência" por movimento reduzido.
beforeEach(() => {
  mockMatchMedia(false);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
