import { cn } from '@/lib/utils/cn';

import type { ReactNode } from 'react';

export interface Definition {
  readonly id: string;
  readonly term: ReactNode;
  readonly description: ReactNode;
}

interface DefinitionListProps {
  readonly items: readonly Definition[];
  readonly className?: string;
}

/**
 * Pares de rótulo e valor — dados da sessão, ficha técnica, informações da
 * oficina.
 *
 * É um `<dl>` de verdade, e não uma grade de `<div>`s: a relação entre rótulo e
 * valor é o que um leitor de tela precisa anunciar, e só a marcação de lista de
 * definição carrega essa relação.
 */
export function DefinitionList({ items, className }: DefinitionListProps) {
  return (
    <dl className={cn('grid gap-4 sm:grid-cols-2', className)}>
      {items.map((item) => (
        <div key={item.id} className="min-w-0">
          <dt className="font-sans text-xs font-semibold tracking-[0.12em] text-foreground-subtle uppercase">
            {item.term}
          </dt>
          <dd className="mt-1 font-sans text-base text-foreground">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
