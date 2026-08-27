import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

/*
 * O aviso é um Server Component assíncrono: não passa pelo `render` direto.
 * Chamá-lo como função e renderizar o elemento devolvido é o que permite
 * testar exatamente o que ele decide — aparecer ou não.
 */
const festival = vi.hoisted(() => ({
  currentEdition: { edition: 22, hasPublishedProgram: false },
  displayedEdition: { year: 2024 },
}));

vi.mock('@/content/festival', () => festival);

vi.mock('next-intl/server', () => ({
  getTranslations: () =>
    Promise.resolve((key: string, values?: Record<string, unknown>) =>
      values === undefined ? key : `${key}:${Object.values(values).join(',')}`,
    ),
}));

const { DemoContentNotice } = await import('./demo-content-notice');

describe('DemoContentNotice', () => {
  beforeEach(() => {
    festival.currentEdition.hasPublishedProgram = false;
  });

  it('aparece enquanto a edição vigente não tem programação publicada', async () => {
    render(await DemoContentNotice({}));

    expect(screen.getByText('demoNoticeTitle:2024')).toBeInTheDocument();
    expect(screen.getByText('demoNoticeBody:22,2024')).toBeInTheDocument();
  });

  it('desaparece assim que a edição vigente publica sua programação', async () => {
    festival.currentEdition.hasPublishedProgram = true;

    expect(await DemoContentNotice({})).toBeNull();
  });

  /*
   * A variante muda a apresentação, nunca a regra nem o texto: na abertura da
   * programação o aviso é marginália de programa impresso, e não alerta de
   * painel — mas continua sendo o mesmo aviso, e continua desaparecendo sozinho
   * quando a edição vigente publicar sua programação.
   */
  it('a variante editorial diz o mesmo, sem superfície de cartão', async () => {
    const { container } = render(await DemoContentNotice({ variant: 'editorial' }));

    expect(screen.getByText('demoNoticeTitle:2024')).toBeInTheDocument();
    expect(container.querySelector('aside')).not.toHaveClass('bg-surface-container-low');
  });

  it('a variante editorial some junto com a de cartão', async () => {
    festival.currentEdition.hasPublishedProgram = true;

    expect(await DemoContentNotice({ variant: 'editorial' })).toBeNull();
  });
});
