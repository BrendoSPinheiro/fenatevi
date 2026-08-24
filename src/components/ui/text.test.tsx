import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Text, textClassName } from './text';

describe('Text', () => {
  it('usa o elemento padrão da variante', () => {
    render(<Text variant="display-lg">FENATEVI</Text>);

    expect(screen.getByRole('heading', { level: 1, name: 'FENATEVI' })).toBeInTheDocument();
  });

  it('permite trocar o elemento sem perder a tipografia', () => {
    render(
      <Text variant="display-lg" as="p">
        FENATEVI
      </Text>,
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.getByText('FENATEVI').tagName).toBe('P');
  });

  it('amarra família, peso e tamanho na mesma variante', () => {
    render(<Text variant="label-md">Mostra Oficial</Text>);
    const element = screen.getByText('Mostra Oficial');

    expect(element).toHaveClass('font-sans', 'font-semibold', 'uppercase');
  });

  it('preserva o texto original mesmo quando a variante é apresentada em maiúsculas', () => {
    render(<Text variant="label-md">Mostra Paralela</Text>);

    // O `uppercase` é apresentação: o nome acessível continua sendo o original.
    expect(screen.getByText('Mostra Paralela')).toBeInTheDocument();
  });
});

describe('textClassName', () => {
  it('permite reaproveitar a variante em um elemento existente', () => {
    const className = textClassName('body-md', 'mt-4');

    expect(className).toContain('mt-4');
    expect(className).toContain('font-sans');
  });
});
