import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button, buttonClassName } from './button';

describe('Button', () => {
  it('expõe o texto como nome acessível', () => {
    render(<Button>Voltar ao topo</Button>);

    expect(screen.getByRole('button', { name: 'Voltar ao topo' })).toBeInTheDocument();
  });

  it('usa type="button" por padrão para não submeter formulários por engano', () => {
    render(<Button>Ação</Button>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('reage ao clique', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ação</Button>);

    await user.click(screen.getByRole('button', { name: 'Ação' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('é acionável pelo teclado', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Ação</Button>);

    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('não dispara o clique quando desabilitado', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Ação
      </Button>,
    );

    await user.click(screen.getByRole('button', { name: 'Ação' }));

    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('buttonClassName', () => {
  it('permite reaproveitar o visual do botão em um link', () => {
    const className = buttonClassName('secondary', 'mt-4');

    expect(className).toContain('mt-4');
    expect(className).toContain('border');
  });

  it('dá à variante ghost uma pista de interação que não é só cor', () => {
    expect(buttonClassName('ghost')).toContain('hover:underline');
  });

  it('mantém o alvo de toque mínimo em todas as variantes', () => {
    for (const variant of ['primary', 'secondary', 'ghost'] as const) {
      expect(buttonClassName(variant)).toContain('min-h-11');
    }
  });
});
