import { cn } from '@/lib/utils/cn';

import type { ComponentPropsWithoutRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/*
 * As três variantes do `DESIGN.md`.
 *
 * `primary` é o bordô sólido da marca, com ivory por cima (8,4:1) e um brilho
 * no hover; `secondary` é o contorno ivory de 1px que se preenche a 10%;
 * `ghost` não tem caixa e ganha sublinhado no hover — o sublinhado é o que
 * evita que a única pista de interação seja a cor.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-container text-foreground hover:shadow-[0_0_24px_-6px_var(--color-primary)] ' +
    'transition-shadow',
  secondary: 'border border-foreground/60 text-foreground hover:bg-foreground/10 bg-transparent',
  ghost: 'bg-transparent text-foreground hover:underline underline-offset-4',
};

/*
 * Altura mínima de 44px: alvo de toque do WCAG 2.2 (2.5.8), que vale para o
 * botão em qualquer lugar do portal e não só na navegação mobile.
 */
const BASE_CLASSES =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-5 py-2.5 ' +
  'font-sans text-sm font-semibold tracking-[0.1em] uppercase ' +
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
