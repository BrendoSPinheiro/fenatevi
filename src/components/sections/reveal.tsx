import { cn } from '@/lib/utils/cn';

import type { ComponentPropsWithoutRef, ElementType } from 'react';

type RevealOwnProps = ComponentPropsWithoutRef<'div'>;

interface RevealProps extends RevealOwnProps {
  readonly as?: ElementType;
}

/**
 * Revelação por rolagem — com o estado inicial **já sendo o estado visível**.
 *
 * A inversão importa e é a regra do projeto. O padrão comum (`opacity: 0` e
 * `translateY`, revertidos por JavaScript quando a seção entra na tela) faz o
 * conteúdo desaparecer para quem tem o bundle falhando, o script bloqueado ou
 * um navegador que não roda o observador — e "invisível" não é degradação
 * elegante, é conteúdo perdido.
 *
 * Aqui a seção nasce visível. A animação é uma `animation-timeline: view()`
 * puramente declarativa em `globals.css`, que **anima a partir** de um estado
 * levemente deslocado quando o navegador a suporta, e simplesmente não acontece
 * quando não. Sob movimento reduzido, a regra é desligada e a seção aparece
 * direto no estado final.
 *
 * Server Component: não há estado, não há observador, não há bundle.
 */
export function Reveal({ as, className, ...props }: RevealProps) {
  const Component = (as ?? 'div') as ElementType<RevealOwnProps>;

  return <Component className={cn('reveal', className)} {...props} />;
}
