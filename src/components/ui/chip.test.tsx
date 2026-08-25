import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ComponentPropsWithoutRef } from 'react';

/**
 * O `Link` do next-intl depende do roteador do App Router, que não existe no
 * jsdom — mesmo mock de `locale-switcher.test.tsx`.
 *
 * O que este teste observa não é a montagem da URL (isso é do next-intl, e é
 * verificado de verdade em `e2e/programacao.spec.ts`), e sim o que o chip
 * controla: ser um link, anunciar o estado do filtro, e distinguir o estado
 * ativo por algo além da cor.
 */
vi.mock('@/lib/i18n/navigation', () => ({
  Link: ({ href, ...props }: ComponentPropsWithoutRef<'a'> & { href: string }) => (
    <a href={href} {...props} />
  ),
}));

const { Chip } = await import('./chip');

describe('Chip', () => {
  it('é um link, para que o filtro funcione sem JavaScript', () => {
    render(<Chip href="/programacao?dia=2024-10-13">13 de out.</Chip>);

    expect(screen.getByRole('link', { name: '13 de out.' })).toHaveAttribute(
      'href',
      '/programacao?dia=2024-10-13',
    );
  });

  it('não marca nada quando o filtro está desligado', () => {
    render(<Chip href="/programacao">Todos</Chip>);

    expect(screen.getByRole('link', { name: 'Todos' })).not.toHaveAttribute('aria-current');
  });

  it('anuncia o filtro ligado', () => {
    render(
      <Chip href="/programacao?frente=mostra-oficial" isActive>
        Mostra Oficial
      </Chip>,
    );

    /*
     * `aria-current`, e não `aria-pressed`: este é um link, e `aria-pressed` é
     * atributo de botão — em um link ele é proibido, e o axe reprova.
     */
    expect(screen.getByRole('link', { name: /Mostra Oficial/ })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('distingue o estado ativo por mais de um recurso além da cor', () => {
    render(
      <Chip href="/programacao?frente=oficina" isActive>
        Oficina
      </Chip>,
    );
    const link = screen.getByRole('link', { name: /Oficina/ });

    // Preenchimento sólido e um marcador antes do texto acompanham a cor.
    expect(link).toHaveClass('bg-secondary');
    expect(link.textContent).toContain('✓');
  });
});
