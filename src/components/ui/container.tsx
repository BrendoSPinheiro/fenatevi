import { cn } from '@/lib/utils/cn';

import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ContainerOwnProps = ComponentPropsWithoutRef<'div'>;

interface ContainerProps extends ContainerOwnProps {
  /**
   * Elemento renderizado. Use `section`, `header`, `footer` ou `main` quando o
   * bloco tiver significado semântico — o contêiner não deve custar um `<div>`
   * extra só para aplicar largura máxima.
   */
  readonly as?: ElementType;
}

/**
 * Largura máxima e respiro horizontal consistentes em todas as seções.
 *
 * Os valores são os do `DESIGN.md`: 1280px de conteúdo, margens de 20px no
 * mobile e 64px no desktop — o "center stage" com espaço para respirar.
 */
export function Container({ as, className, ...props }: ContainerProps) {
  const Component = (as ?? 'div') as ElementType<ContainerOwnProps>;

  return (
    <Component
      className={cn(
        'mx-auto w-full max-w-(--container-max) px-margin-mobile lg:px-margin-desktop',
        className,
      )}
      {...props}
    />
  );
}
