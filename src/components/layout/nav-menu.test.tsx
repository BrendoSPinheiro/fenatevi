import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import messages from '../../../messages/pt-BR.json';

import type { ComponentPropsWithoutRef } from 'react';

/**
 * O `Link` do next-intl depende do roteador do App Router, que não existe no
 * jsdom. O mock não reproduz a montagem da URL — isso é do next-intl e do
 * proxy, e está coberto em `e2e/i18n.spec.ts`. Aqui interessa **quais destinos**
 * o menu oferece.
 */
vi.mock('@/lib/i18n/navigation', () => ({
  usePathname: () => '/programacao',
  Link: ({ href, locale, ...props }: ComponentPropsWithoutRef<'a'> & { locale?: string }) => (
    <a data-locale={locale} href={href} {...props} />
  ),
}));

const { NavMenu } = await import('./nav-menu');

function renderMenu() {
  return render(
    <NextIntlClientProvider locale="pt-BR" messages={messages}>
      <NavMenu />
    </NextIntlClientProvider>,
  );
}

describe('NavMenu', () => {
  it('expõe o hambúrguer com nome acessível, e nada mais, enquanto está fechado', () => {
    renderMenu();

    const trigger = screen.getByRole('button', { name: 'Abrir o menu' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('abre um diálogo com as seis áreas do portal', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Abrir o menu' }));

    const nav = screen.getByRole('navigation', { name: 'Navegação principal' });

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(within(nav).getAllByRole('link')).toHaveLength(6);
    expect(within(nav).getByRole('link', { name: /Notícias/ })).toHaveAttribute(
      'href',
      '/noticias',
    );
    expect(within(nav).getByRole('link', { name: /Início/ })).toHaveAttribute('href', '/');
  });

  it('traz o seletor de idioma para dentro do menu', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Abrir o menu' }));

    expect(screen.getByRole('navigation', { name: 'Escolher idioma' })).toBeInTheDocument();
  });

  it('fecha ao seguir um destino, para que a rota nova não nasça coberta', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Abrir o menu' }));
    await user.click(screen.getByRole('link', { name: /Programação/ }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('fecha pelo botão de fechar', async () => {
    const user = userEvent.setup();
    renderMenu();

    await user.click(screen.getByRole('button', { name: 'Abrir o menu' }));
    await user.click(screen.getByRole('button', { name: 'Fechar o menu' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
