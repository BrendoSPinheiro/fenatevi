'use client';

import { useEffect, useId, useRef } from 'react';

import { cn } from '@/lib/utils/cn';

import type { ReactNode } from 'react';

/**
 * Deixa inerte tudo o que está fora do diálogo e devolve uma função que
 * restaura o estado anterior.
 *
 * Sobe do diálogo até o `<body>` e marca os irmãos de cada nível. `aria-modal`
 * sozinho não basta: ele orienta o leitor de tela, mas o fundo continua
 * clicável, focável pelo teclado e visível para auditoria — mesmo coberto por
 * uma superfície opaca. `inert` remove os três de uma vez.
 */
function inertizarFundo(dialog: HTMLElement): () => void {
  const marcados: HTMLElement[] = [];

  for (let node: HTMLElement = dialog; node !== document.body;) {
    const parent = node.parentElement;

    if (parent === null) {
      break;
    }

    for (const sibling of parent.children) {
      if (sibling !== node && sibling instanceof HTMLElement && !sibling.inert) {
        sibling.inert = true;
        marcados.push(sibling);
      }
    }

    node = parent;
  }

  return () => {
    for (const element of marcados) {
      element.inert = false;
    }
  };
}

/** Seletor dos elementos que podem receber foco dentro do diálogo. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  /** Título acessível do diálogo — o que o leitor de tela anuncia ao abrir. */
  readonly title: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Diálogo modal em tela cheia, com foco preso.
 *
 * Implementado à mão em vez de com `<dialog showModal>` por um motivo concreto:
 * o elemento nativo pinta um `::backdrop` e uma pilha de camadas próprias que
 * não conversam com a cortina e com a abertura teatral deste projeto. O que ele
 * dá de graça — foco preso, `Escape`, inércia do fundo — está aqui, explícito.
 *
 * O que este componente garante:
 *
 * - o foco entra no diálogo ao abrir e **volta ao controle de origem** ao
 *   fechar, e não para o topo da página;
 * - `Tab` e `Shift+Tab` circulam dentro do diálogo (WCAG 2.2 — 2.1.2, sem
 *   armadilha de teclado: `Escape` sempre sai);
 * - o resto da página fica inerte (`inert` em tudo o que está fora do
 *   diálogo) e o corpo não rola por baixo.
 */
export function Dialog({ isOpen, onClose, title, children, className }: DialogProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Quem abriu o diálogo — é para cá que o foco volta ao fechar.
    openerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const restaurarFundo = rootRef.current === null ? null : inertizarFundo(rootRef.current);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || panel === null) {
        return;
      }

      const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = focusable[0];
      const last = focusable.at(-1);

      if (first === undefined || last === undefined) {
        return;
      }

      // O ciclo é fechado nas duas pontas: sair por uma reentra pela outra.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = overflow;
      restaurarFundo?.();
      openerRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[var(--z-overlay)] overflow-y-auto bg-surface"
    >
      <div ref={panelRef} className={cn('min-h-dvh', className)}>
        <h2 id={titleId} className="sr-only">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
