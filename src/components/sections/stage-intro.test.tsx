import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { markStageIntroPlayed, resetStageIntroForTesting } from '@/lib/animation/stage-intro-state';

import { StageIntro } from './stage-intro';

const LINE = 'Basta uma semente...';
const HINT = 'Toque ou pressione uma tecla para entrar';

/**
 * O container só é alcançável a partir do texto: ele é `aria-hidden`, portanto
 * não tem papel nem nome acessível pelos quais consultar.
 */
function getOverlay(): HTMLElement {
  const overlay = screen.getByText(LINE).closest('[aria-hidden="true"]');
  if (!(overlay instanceof HTMLElement)) throw new Error('overlay não encontrado');
  return overlay;
}

describe('StageIntro', () => {
  beforeEach(() => {
    resetStageIntroForTesting();
  });

  it('exibe a frase enquanto a abertura ainda não aconteceu', () => {
    render(<StageIntro line={LINE} hint={HINT} />);

    expect(screen.getByText(LINE)).toBeInTheDocument();
    expect(screen.getByText(HINT)).toBeInTheDocument();
  });

  it('não é exposta na árvore de acessibilidade', () => {
    render(<StageIntro line={LINE} hint={HINT} />);

    expect(getOverlay()).toBeInTheDocument();
  });

  it('não tem elemento focável, para não alterar a ordem de tabulação da página', async () => {
    const user = userEvent.setup();
    render(<StageIntro line={LINE} hint={HINT} />);

    await user.tab();

    // Nada dentro da abertura recebeu o foco: ele continua onde estava.
    expect(document.body).toHaveFocus();
  });

  /*
   * A dispensa é observável em jsdom apenas pela classe de saída — o
   * `pointer-events: none` e o fade vivem na folha de estilo, que o ambiente de
   * teste não aplica. A classe é o contrato entre o componente e o CSS; os
   * efeitos visíveis dela são verificados no E2E.
   */
  it('inicia a saída ao pressionar uma tecla', async () => {
    const user = userEvent.setup();
    render(<StageIntro line={LINE} hint={HINT} />);

    await user.keyboard('{Escape}');

    expect(getOverlay()).toHaveClass('stage-intro--dismissing');
  });

  it('inicia a saída ao clicar em qualquer ponto', async () => {
    const user = userEvent.setup();
    render(<StageIntro line={LINE} hint={HINT} />);

    await user.click(screen.getByText(LINE));

    expect(getOverlay()).toHaveClass('stage-intro--dismissing');
  });

  /*
   * `bubbles: true` explícito: o `animationend` real borbulha, mas o
   * `fireEvent` do Testing Library o cria com `bubbles: false`. Como o React
   * delega os eventos na raiz, sem isso o handler nunca seria chamado e os dois
   * testes abaixo passariam sem exercitar nada.
   */
  it('desmonta quando a própria animação do overlay termina', () => {
    render(<StageIntro line={LINE} hint={HINT} />);

    fireEvent.animationEnd(getOverlay(), { bubbles: true });

    expect(screen.queryByText(LINE)).not.toBeInTheDocument();
  });

  it('ignora as animações das cortinas e do texto, que sobem até o overlay', () => {
    render(<StageIntro line={LINE} hint={HINT} />);

    fireEvent.animationEnd(screen.getByText(LINE), { bubbles: true });

    expect(screen.getByText(LINE)).toBeInTheDocument();
  });

  it('não renderiza nada quando a abertura já aconteceu nesta sessão', () => {
    markStageIntroPlayed();

    const { container } = render(<StageIntro line={LINE} hint={HINT} />);

    expect(container).toBeEmptyDOMElement();
  });
});
