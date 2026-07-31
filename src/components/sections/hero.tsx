'use client';

import { useRef } from 'react';

import { buttonClassName } from '@/components/ui/button';
import { gsap, respectReducedMotion, useGSAP } from '@/lib/animation/gsap';

interface HeroProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly tagline: string;
  readonly seed: string;
  readonly dates: string;
  readonly city: string;
  readonly ctaLabel: string;
  readonly ctaHref: string;
}

/**
 * Seção de abertura da página inicial.
 *
 * Client Component porque anima. O texto chega pronto por props, vindo de um
 * Server Component — as traduções não são resolvidas aqui.
 *
 * A animação é sempre `gsap.from`: os elementos partem de um estado deslocado e
 * chegam ao estado natural do documento. Se o GSAP não carregar, se o JavaScript
 * falhar ou se o usuário preferir movimento reduzido, o conteúdo já está no lugar
 * certo e legível — nada é escondido por CSS à espera de animação.
 */
export function Hero(props: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () =>
      respectReducedMotion(() => {
        gsap.from('[data-animate="hero-item"]', {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
        });
      }),
    // `scope` limita os seletores a este componente: nada de seletores globais.
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="py-16 sm:py-24">
      <p data-animate="hero-item" className="text-sm tracking-[0.24em] text-accent uppercase">
        {props.eyebrow}
      </p>

      <h1 data-animate="hero-item" className="mt-4 text-5xl font-semibold sm:text-7xl">
        {props.title}
      </h1>

      <p data-animate="hero-item" className="mt-3 text-xl text-foreground/90 sm:text-2xl">
        {props.subtitle}
      </p>

      <p data-animate="hero-item" className="mt-6 max-w-2xl text-lg text-muted">
        {props.tagline}
      </p>

      <p data-animate="hero-item" className="mt-2 text-lg text-accent/90 italic">
        {props.seed}
      </p>

      <p data-animate="hero-item" className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-muted">
        <span>{props.city}</span>
        <span>{props.dates}</span>
      </p>

      <p data-animate="hero-item" className="mt-10">
        {/* Link, não botão: o destino é uma âncora real, com scroll suave via Lenis. */}
        <a href={props.ctaHref} className={buttonClassName('primary')}>
          {props.ctaLabel}
        </a>
      </p>
    </div>
  );
}
