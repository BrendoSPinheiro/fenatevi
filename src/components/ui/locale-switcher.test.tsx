import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import messages from '../../../messages/pt-BR.json';

import type { ComponentPropsWithoutRef } from 'react';

/**
 * O `Link` do next-intl depende do roteador do App Router, que não existe no
 * jsdom.
 *
 * O mock **não** tenta reproduzir a montagem da URL: isso é responsabilidade do
 * next-intl e do proxy, e é verificado de verdade em `e2e/i18n.spec.ts`. Aqui o
 * href final é irrelevante — o que este componente controla é *qual locale* pede
 * para cada link e *qual rota* preserva. É isso que os testes observam, via
 * `data-locale` e `data-href`.
 */
vi.mock('@/lib/i18n/navigation', () => ({
  usePathname: () => '/programacao',
  Link: ({
    href,
    locale,
    ...props
  }: ComponentPropsWithoutRef<'a'> & { href: string; locale?: string }) => (
    <a href={href} data-locale={locale} data-href={href} {...props} />
  ),
}));

const { LocaleSwitcher } = await import('./locale-switcher');

function renderSwitcher() {
  return render(
    <NextIntlClientProvider locale="pt-BR" messages={messages}>
      <LocaleSwitcher />
    </NextIntlClientProvider>,
  );
}

describe('LocaleSwitcher', () => {
  it('é uma navegação com nome acessível', () => {
    renderSwitcher();

    expect(screen.getByRole('navigation', { name: 'Escolher idioma' })).toBeInTheDocument();
  });

  it('oferece um link por idioma suportado, cada um pedindo o seu locale', () => {
    renderSwitcher();

    expect(screen.getByRole('link', { name: /Português/ })).toHaveAttribute('data-locale', 'pt-BR');
    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('data-locale', 'en');
    expect(screen.getByRole('link', { name: 'Español' })).toHaveAttribute('data-locale', 'es');
  });

  it('preserva a rota atual ao trocar de idioma', () => {
    renderSwitcher();

    for (const name of [/Português/, 'English', 'Español']) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('data-href', '/programacao');
    }
  });

  it('anuncia cada idioma no próprio idioma', () => {
    renderSwitcher();

    expect(screen.getByRole('link', { name: 'English' })).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('link', { name: 'Español' })).toHaveAttribute('lang', 'es');
  });

  it('marca o idioma atual para tecnologias assistivas', () => {
    renderSwitcher();

    const current = screen.getByRole('link', { name: /Português\s*\(Idioma atual\)/ });

    expect(current).toHaveAttribute('aria-current', 'page');
  });
});
