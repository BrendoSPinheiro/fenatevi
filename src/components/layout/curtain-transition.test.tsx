import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigation = vi.hoisted(() => ({ pathname: '/' }));
const motion = vi.hoisted(() => ({ prefersReduced: false }));

vi.mock('@/lib/i18n/navigation', () => ({
  usePathname: () => navigation.pathname,
}));

vi.mock('@/hooks/use-reduced-motion', () => ({
  useReducedMotion: () => motion.prefersReduced,
}));

const { CurtainTransition } = await import('./curtain-transition');

describe('CurtainTransition', () => {
  beforeEach(() => {
    navigation.pathname = '/';
    motion.prefersReduced = false;
  });

  it('não aparece no carregamento inicial — não houve troca de cena', () => {
    const { container } = render(<CurtainTransition />);

    expect(container.querySelector('.curtain-transition')).toBeNull();
  });

  it('aparece quando a rota muda', () => {
    const { container, rerender } = render(<CurtainTransition />);

    navigation.pathname = '/programacao';
    rerender(<CurtainTransition />);

    expect(container.querySelector('.curtain-transition')).not.toBeNull();
  });

  it('nunca bloqueia o ponteiro', () => {
    const { container, rerender } = render(<CurtainTransition />);
    navigation.pathname = '/programacao';
    rerender(<CurtainTransition />);

    const curtain = container.querySelector('.curtain-transition');

    /*
     * A garantia real é a regra `pointer-events: none` em `globals.css`, que o
     * jsdom não resolve. O que se verifica aqui é o contrato do componente: a
     * cortina fica fora da árvore de acessibilidade e não é focável — não há
     * nada nela que possa receber clique ou foco.
     */
    expect(curtain).toHaveAttribute('aria-hidden', 'true');
    expect(curtain?.getAttribute('tabindex')).toBeNull();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('não é montada sob movimento reduzido, nem depois de navegar', () => {
    motion.prefersReduced = true;
    const { container, rerender } = render(<CurtainTransition />);

    navigation.pathname = '/memoria';
    rerender(<CurtainTransition />);

    expect(container.querySelector('.curtain-transition')).toBeNull();
  });
});
