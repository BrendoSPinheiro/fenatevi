import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';

interface BackLinkProps {
  /** Destino real do retorno — a listagem de onde a tela interna descende. */
  readonly href: string;
  readonly children: string;
  readonly className?: string;
}

/**
 * O retorno contextual de uma tela interna.
 *
 * É um destino de navegação de verdade, e **não** `history.back()`. Quem chega
 * a um espetáculo por um link compartilhado não tem histórico para voltar: com
 * `history.back()` o controle não faria nada, ou tiraria a pessoa do site. Um
 * link real leva à programação em qualquer caso, abre em nova aba, aparece no
 * menu de contexto e é anunciado como link.
 */
export function BackLink({ href, children, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 font-sans text-xs font-semibold tracking-[0.16em] text-foreground-muted uppercase no-underline transition-colors hover:text-foreground',
        className,
      )}
    >
      <span aria-hidden="true">←</span>
      {children}
    </Link>
  );
}
