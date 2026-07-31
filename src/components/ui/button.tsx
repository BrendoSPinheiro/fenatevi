import { cn } from '@/lib/utils/cn';

import type { ComponentPropsWithoutRef } from 'react';

export type ButtonVariant = 'primary' | 'ghost';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-strong',
  ghost:
    'border-border text-foreground hover:border-accent hover:text-accent border bg-transparent',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium ' +
  'transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Classes do botão, expostas para elementos que **não** são `<button>`.
 *
 * Um link que navega deve continuar sendo um `<a>` (teclado, menu de contexto,
 * abrir em nova aba); apenas o visual é compartilhado.
 */
export function buttonClassName(variant: ButtonVariant = 'primary', className?: string): string {
  return cn(BASE_CLASSES, VARIANT_CLASSES[variant], className);
}

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  readonly variant?: ButtonVariant;
}

/**
 * Botão para ações — não para navegação.
 *
 * Server Component: só vira parte de um bundle de cliente quando usado dentro de
 * um. O estado de foco vem do estilo global `:focus-visible`.
 */
export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, className)} {...props} />;
}
