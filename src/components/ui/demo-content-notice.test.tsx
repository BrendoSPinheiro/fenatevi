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
});
