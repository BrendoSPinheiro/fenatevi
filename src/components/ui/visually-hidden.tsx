import type { ComponentPropsWithoutRef } from 'react';

/**
 * Esconde conteúdo visualmente mantendo-o disponível para leitores de tela.
 *
 * Não use `display: none` nem `visibility: hidden` para isso — ambos removem o
 * conteúdo da árvore de acessibilidade.
 */
export function VisuallyHidden({ children, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span className="sr-only" {...props}>
      {children}
    </span>
  );
}
