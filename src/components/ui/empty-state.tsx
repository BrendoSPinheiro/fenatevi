import { cn } from '@/lib/utils/cn';

import type { ReactNode } from 'react';

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  /** Ação que tira o visitante do estado vazio — limpar filtros, por exemplo. */
  readonly action?: ReactNode;
  readonly className?: string;
}

/**
 * O que a tela diz quando não há o que mostrar.
 *
 * Um resultado vazio é uma resposta, não uma falha: ele explica o que aconteceu
 * e oferece a saída. Por isso o estado vazio é um bloco de conteúdo comum, e
 * não um alerta — nada aqui precisa interromper quem usa leitor de tela.
 */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed border-outline-variant px-6 py-10 text-center',
        className,
      )}
    >
      <p className="font-serif text-2xl text-foreground">{title}</p>
      {description !== undefined && (
        <p className="mx-auto mt-2 max-w-prose font-sans text-base text-foreground-muted">
          {description}
        </p>
      )}
      {action !== undefined && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
