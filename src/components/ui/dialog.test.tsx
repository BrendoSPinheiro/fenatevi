import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Dialog } from './dialog';

/** Uma página mínima com o controle que abre o diálogo, como no cabeçalho. */
function Harness() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Abrir áreas
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Áreas do portal">
        <a href="#programacao">Programação</a>
        <a href="#memoria">Memória</a>
        <button type="button" onClick={() => setIsOpen(false)}>
          Fechar
        </button>
      </Dialog>
    </>
  );
}

describe('Dialog', () => {
  it('não existe no documento enquanto está fechado', () => {
    render(
      <Dialog isOpen={false} onClose={vi.fn()} title="Áreas">
        <a href="#programacao">Programação</a>
      </Dialog>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('leva o foco para dentro ao abrir', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Abrir áreas' }));

    expect(screen.getByRole('link', { name: 'Programação' })).toHaveFocus();
  });

  it('prende o foco: do último elemento, Tab volta ao primeiro', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Abrir áreas' }));

    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('link', { name: 'Programação' })).toHaveFocus();
  });

  it('prende o foco também para trás: do primeiro, Shift+Tab vai ao último', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Abrir áreas' }));

    await user.tab({ shift: true });

    expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();
  });

  it('fecha com Escape e devolve o foco ao controle de origem', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Abrir áreas' });
    await user.click(opener);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it('expõe um nome acessível', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Abrir áreas' }));

    expect(screen.getByRole('dialog', { name: 'Áreas do portal' })).toBeInTheDocument();
  });
});
