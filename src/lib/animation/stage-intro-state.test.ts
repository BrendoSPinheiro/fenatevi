import { beforeEach, describe, expect, it } from 'vitest';

import {
  hasStageIntroPlayed,
  markStageIntroPlayed,
  resetStageIntroForTesting,
} from './stage-intro-state';

describe('estado da abertura teatral', () => {
  beforeEach(() => {
    resetStageIntroForTesting();
  });

  it('começa não marcado, para que a abertura aconteça em cada carregamento', () => {
    expect(hasStageIntroPlayed()).toBe(false);
  });

  it('fica marcado depois que a abertura acontece', () => {
    markStageIntroPlayed();

    expect(hasStageIntroPlayed()).toBe(true);
  });

  it('continua marcado quando registrado mais de uma vez', () => {
    markStageIntroPlayed();
    markStageIntroPlayed();

    expect(hasStageIntroPlayed()).toBe(true);
  });
});
