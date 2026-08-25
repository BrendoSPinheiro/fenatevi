import { cn } from '@/lib/utils/cn';

import type { ComponentPropsWithoutRef, ElementType } from 'react';

export type TextVariant =
  'display-lg' | 'display-md' | 'headline-lg' | 'body-lg' | 'body-md' | 'label-md' | 'caption';

/*
 * A escala tipográfica do `DESIGN.md` — família, tamanho, peso, entrelinha e
 * tracking amarrados.
 *
 * Deliberadamente **não** é um utilitário do Tailwind: como utilitário, nada
 * impediria escrever `text-display-lg font-normal` e desmontar a escala pela
 * metade. Aqui as sete propriedades andam juntas ou não andam.
 *
 * Os tamanhos do `DESIGN.md` são valores de desktop; viram teto de um `clamp()`.
 * `headline-lg` tem piso declarado no próprio documento (`headline-lg-mobile`,
 * 32px); nas demais o piso é a proporção que preserva a hierarquia sem estourar
 * a largura de 375px.
 */
/*
 * `WONK` liga as formas excêntricas da Fraunces (o `g` de cauda aberta, os
 * terminais inclinados). Só nos dois tamanhos de display: é a voz do festival
 * no cartaz, não no corpo da grade — que precisa desaparecer para ser lida.
 */
const WONK = "[font-variation-settings:'WONK'_1]";

const VARIANT_CLASSES: Record<TextVariant, string> = {
  'display-lg': `font-serif font-bold tracking-[-0.02em] text-[clamp(2.75rem,8vw,5rem)] leading-[1.125] ${WONK}`,
  'display-md': `font-serif font-semibold tracking-[-0.01em] text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.15] ${WONK}`,
  'headline-lg': 'font-serif font-medium text-[clamp(2rem,4.5vw,2.5rem)] leading-[1.2]',
  'body-lg': 'font-sans font-normal text-[1.125rem] leading-[1.556]',
  'body-md': 'font-sans font-normal text-[1rem] leading-[1.5]',
  /*
   * Maiúsculas com tracking: a voz do programa impresso, conforme o `DESIGN.md`.
   * A largura vem do eixo `wdth` da Archivo, desenhada — o espaçamento sozinho
   * afasta as letras sem lhes dar corpo.
   */
  'label-md':
    "font-sans font-semibold uppercase tracking-[0.05em] text-[0.875rem] leading-[1.429] [font-variation-settings:'wdth'_110]",
  caption: 'font-sans font-normal text-[0.75rem] leading-[1.333]',
};

/** Elemento padrão de cada variante, quando quem chama não informa `as`. */
const VARIANT_ELEMENTS: Record<TextVariant, ElementType> = {
  'display-lg': 'h1',
  'display-md': 'h2',
  'headline-lg': 'h3',
  'body-lg': 'p',
  'body-md': 'p',
  'label-md': 'span',
  caption: 'span',
};

/**
 * Classes da variante, expostas para quando o elemento já existe.
 *
 * Um `<Link>` ou um `<summary>` não devem ganhar um wrapper só para receber
 * tipografia; apenas as classes são compartilhadas.
 */
export function textClassName(variant: TextVariant, className?: string): string {
  return cn(VARIANT_CLASSES[variant], className);
}

type TextOwnProps = ComponentPropsWithoutRef<'p'>;

interface TextProps extends TextOwnProps {
  readonly variant: TextVariant;
  /**
   * Elemento renderizado. O padrão da variante é uma sugestão visual, não uma
   * regra semântica: a hierarquia de cabeçalhos da página é de quem chama.
   */
  readonly as?: ElementType;
}

/**
 * Texto na escala do design system.
 *
 * Server Component: só entra em bundle de cliente quando usado dentro de um.
 */
export function Text({ variant, as, className, ...props }: TextProps) {
  const Component = (as ?? VARIANT_ELEMENTS[variant]) as ElementType<TextOwnProps>;

  return <Component className={textClassName(variant, className)} {...props} />;
}
