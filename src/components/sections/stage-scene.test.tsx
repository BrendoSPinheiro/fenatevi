import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StageScene } from './stage-scene';

/**
 * O jsdom não implementa WebGL, então este teste percorre exatamente o caminho
 * que um dispositivo sem suporte percorreria — a garantia que mais importa aqui.
 */
describe('StageScene', () => {
  it('descreve a cena por texto para tecnologias assistivas', async () => {
    render(<StageScene description="Composição abstrata em movimento" fallbackText="Sem WebGL." />);

    expect(
      await screen.findByRole('img', { name: 'Composição abstrata em movimento' }),
    ).toBeInTheDocument();
  });

  it('mostra o texto alternativo quando não há WebGL', async () => {
    render(<StageScene description="Composição abstrata em movimento" fallbackText="Sem WebGL." />);

    expect(await screen.findByText('Sem WebGL.')).toBeInTheDocument();
  });
});
