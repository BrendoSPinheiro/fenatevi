import { cn } from '@/lib/utils/cn';

interface DividerProps {
  readonly className?: string;
}

/**
 * Separador visual entre blocos.
 *
 * `aria-hidden` de propósito: o separador é traço de composição editorial, não
 * uma informação. A separação real do conteúdo vem dos cabeçalhos e das
 * regiões, que o leitor de tela já anuncia.
 */
export function Divider({ className }: DividerProps) {
  return <span aria-hidden="true" className={cn('block h-px bg-outline-variant', className)} />;
}
