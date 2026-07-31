'use client';

import { useSyncExternalStore } from 'react';

import { isWebGLAvailable } from '@/lib/animation/three/webgl';

export type WebGLSupport = 'unknown' | 'available' | 'unavailable';

/**
 * O suporte a WebGL não muda durante a sessão: basta detectar uma vez por
 * documento. O cache também evita criar um `<canvas>` descartável a cada
 * renderização.
 */
let cached: WebGLSupport | undefined;

/** A capacidade nunca muda, então não há a que se inscrever. */
function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): WebGLSupport {
  cached ??= isWebGLAvailable() ? 'available' : 'unavailable';
  return cached;
}

/**
 * Informa se o dispositivo suporta WebGL.
 *
 * Devolve `'unknown'` durante a renderização no servidor e na primeira
 * renderização do cliente, de modo que o HTML hidratado é idêntico ao do
 * servidor. Só depois disso o resultado real aparece — por isso a interface
 * precisa ter um estado neutro para `'unknown'` (nunca uma área vazia).
 */
export function useWebGLSupport(): WebGLSupport {
  return useSyncExternalStore(subscribe, getSnapshot, () => 'unknown' as const);
}
