import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { ArchiveText } from './archive-text';

import type { ReactNode } from 'react';

function renderInLocale(locale: string, children: ReactNode) {
  return render(
    <NextIntlClientProvider locale={locale} messages={{}}>
      {children}
    </NextIntlClientProvider>,
  );
}

describe('ArchiveText', () => {
  it('marca o idioma do acervo quando a página está em outro idioma', () => {
    renderInLocale('en', <ArchiveText>A Metamorfose</ArchiveText>);

    expect(screen.getByText('A Metamorfose')).toHaveAttribute('lang', 'pt-BR');
  });

  it('não repete o idioma quando a página já está em português', () => {
    renderInLocale('pt-BR', <ArchiveText>A Metamorfose</ArchiveText>);

    expect(screen.getByText('A Metamorfose')).not.toHaveAttribute('lang');
  });

  it('permite escolher o elemento sem perder a marcação de idioma', () => {
    renderInLocale('es', <ArchiveText as="p">Ficha técnica</ArchiveText>);
    const element = screen.getByText('Ficha técnica');

    expect(element.tagName).toBe('P');
    expect(element).toHaveAttribute('lang', 'pt-BR');
  });
});
