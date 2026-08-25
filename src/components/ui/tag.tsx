import { cn } from '@/lib/utils/cn';

import type { ComponentPropsWithoutRef } from 'react';

export type TagTone = 'neutral' | 'primary' | 'secondary';

const TONE_CLASSES: Record<TagTone, string> = {
  neutral: 'border-outline-variant text-foreground-subtle',
  primary: 'border-primary/60 text-primary',
  secondary: 'border-secondary/60 text-secondary',
};

interface TagProps extends ComponentPropsWithoutRef<'span'> {
  readonly tone?: TagTone;
}

/**
 * Marcador de leitura — frente de programação, classificação, entrada franca.
 *
 * Não é interativo e não deve virar um: quando o marcador precisar levar a
 * algum lugar, o componente certo é `Chip`, que é um link.
 */
export function Tag({ tone = 'neutral', className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-2 py-1',
        'font-sans text-[0.6875rem] font-bold tracking-[0.12em] uppercase',
        TONE_CLASSES[tone],
        className,
      )}
      {...props}
    />
  );
}
