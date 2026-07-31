'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';

import { useInViewport } from '@/hooks/use-in-viewport';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useWebGLSupport } from '@/hooks/use-webgl-support';

/**
 * Carregado sob demanda e somente no cliente: o Three.js não entra no bundle
 * inicial nem é executado durante a renderização no servidor.
 */
const StageCanvas = dynamic(() => import('@/lib/animation/three/stage-canvas'), {
  ssr: false,
  loading: () => <StageGradient />,
});

/**
 * Fallback puramente CSS. É o que aparece enquanto o Canvas carrega, quando o
 * WebGL não está disponível e quando o JavaScript falha — nunca uma área vazia.
 */
function StageGradient() {
  return (
    <div
      aria-hidden="true"
      className="size-full bg-[radial-gradient(circle_at_50%_38%,var(--color-accent)_0%,transparent_62%)] opacity-70"
    />
  );
}

interface StageSceneProps {
  /** Alternativa textual da cena — a cena é decorativa, mas sempre descrita. */
  readonly description: string;
  /** Mensagem exibida quando o dispositivo não suporta WebGL. */
  readonly fallbackText: string;
}

export function StageScene({ description, fallbackText }: StageSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInViewport = useInViewport(containerRef);
  const prefersReducedMotion = useReducedMotion();
  const webGLSupport = useWebGLSupport();

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={description}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-surface sm:aspect-[16/9]"
    >
      {webGLSupport === 'available' ? (
        <StageCanvas active={isInViewport && !prefersReducedMotion} />
      ) : (
        <StageGradient />
      )}

      {webGLSupport === 'unavailable' && (
        <p className="absolute inset-x-0 bottom-0 p-4 text-center text-sm text-balance text-muted">
          {fallbackText}
        </p>
      )}
    </div>
  );
}
