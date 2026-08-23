'use client';

import { useEffect, useState } from 'react';

import { hasStageIntroPlayed, markStageIntroPlayed } from '@/lib/animation/stage-intro-state';
import { cn } from '@/lib/utils/cn';

import type { AnimationEvent } from 'react';

/** Eventos que contam como "quero entrar" e encerram a abertura. */
const DISMISS_EVENTS = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const;

type Phase = 'playing' | 'dismissing' | 'done';

interface StageIntroProps {
  /** A frase exibida no centro. */
  readonly line: string;
  /** Dica visual de que qualquer interação encerra a abertura. */
  readonly hint: string;
}

/**
 * Abertura teatral da página inicial.
 *
 * A coreografia inteira vive no CSS (`globals.css`, seção "Abertura teatral"),
 * não aqui — é o que garante que a cortina exista no primeiro pixel pintado e
 * que ela **se abra sozinha mesmo sem JavaScript**. Este componente só faz três
 * coisas: dispensar, desmontar e registrar que a abertura já aconteceu.
 *
 * Consequência importante: os tempos da narrativa não são estado do React. Não
 * há temporizador no caminho principal, portanto não existe corrida entre
 * relógio e quadro de animação.
 *
 * A abertura é decorativa: `aria-hidden` a mantém fora da árvore de
 * acessibilidade e ela não tem nenhum descendente focável, então a ordem de
 * tabulação da página fica intacta — o primeiro `Tab` continua indo ao skip
 * link. Ela captura eventos de ponteiro de propósito (não usa `inert`), para
 * que ninguém clique num link que não consegue ver.
 */
export function StageIntro({ line, hint }: StageIntroProps) {
  // Lido uma única vez por montagem: a troca de idioma remonta o segmento
  // `[locale]` e sem isso a abertura tocaria de novo.
  const [phase, setPhase] = useState<Phase>(() => (hasStageIntroPlayed() ? 'done' : 'playing'));

  useEffect(() => {
    if (phase !== 'playing') return;

    const dismiss = () => setPhase('dismissing');

    // Os listeners ficam no `document`, não no overlay: assim pegam a interação
    // onde quer que ela ocorra. Passivos porque nenhum deles cancela o evento —
    // `wheel` e `touchstart` não devem atrasar a rolagem.
    for (const event of DISMISS_EVENTS) {
      document.addEventListener(event, dismiss, { passive: true });
    }

    return () => {
      for (const event of DISMISS_EVENTS) {
        document.removeEventListener(event, dismiss);
      }
    };
  }, [phase]);

  if (phase === 'done') return null;

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    // As animações das cortinas, dos fachos e do texto sobem até aqui. Só a do
    // próprio container — a saída, natural ou antecipada — encerra a abertura.
    if (event.target !== event.currentTarget) return;

    markStageIntroPlayed();
    setPhase('done');
  };

  return (
    <div
      aria-hidden="true"
      // `cn`, e não um template literal: o `prettier-plugin-tailwindcss`
      // reordena as classes dentro de literais e come o espaço de separação.
      className={cn('stage-intro', phase === 'dismissing' && 'stage-intro--dismissing')}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="stage-intro__curtain stage-intro__curtain--left" />
      <div className="stage-intro__curtain stage-intro__curtain--right" />
      <div className="stage-intro__beam stage-intro__beam--fill" />
      <div className="stage-intro__beam stage-intro__beam--key" />

      <p className="stage-intro__line px-6 text-center text-3xl text-balance text-foreground italic sm:text-5xl">
        {line}
      </p>

      <p className="stage-intro__hint px-6 text-center text-xs tracking-[0.2em] text-foreground/80 uppercase sm:text-sm">
        {hint}
      </p>
    </div>
  );
}
