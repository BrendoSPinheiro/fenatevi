import { cn } from '@/lib/utils/cn';

import type { ComponentPropsWithoutRef, ElementType } from 'react';

type CardOwnProps = ComponentPropsWithoutRef<'div'>;

interface CardProps extends CardOwnProps {
  /** Elemento renderizado — use `article` ou `li` quando o bloco tiver semântica. */
  readonly as?: ElementType;
}

/**
 * Superfície elevada de um item de conteúdo.
 *
 * Raio de 8px e borda de contorno, conforme o `DESIGN.md`: a separação vem da
 * superfície um degrau acima, não de sombra — sombra não se vê sobre preto.
 */
export function Card({ as, className, ...props }: CardProps) {
  const Component = (as ?? 'div') as ElementType<CardOwnProps>;

  return (
    <Component
      className={cn(
        'rounded-lg border border-outline-variant bg-surface-container-low',
        'transition-colors hover:border-outline',
        className,
      )}
      {...props}
    />
  );
}
