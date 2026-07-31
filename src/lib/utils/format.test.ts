import { describe, expect, it } from 'vitest';

import { formatFestivalDate, parseIsoDate } from './format';

describe('parseIsoDate', () => {
  it('interpreta a data como dia de calendário em UTC', () => {
    expect(parseIsoDate('2026-09-11').toISOString()).toBe('2026-09-11T00:00:00.000Z');
  });

  it('rejeita uma data inválida', () => {
    expect(() => parseIsoDate('11/09/2026')).toThrow(TypeError);
  });
});

describe('formatFestivalDate', () => {
  it('formata de acordo com o idioma', () => {
    expect(formatFestivalDate('2026-09-11', 'pt-BR')).toBe('11 de setembro');
    expect(formatFestivalDate('2026-09-11', 'en')).toBe('September 11');
    expect(formatFestivalDate('2026-09-11', 'es')).toBe('11 de septiembre');
  });

  it('aceita opções adicionais de formatação', () => {
    expect(formatFestivalDate('2026-09-20', 'pt-BR', { dateStyle: 'short' })).toBe('20/09/2026');
  });

  it('não desloca o dia por causa do fuso horário local', () => {
    // Um dia próximo do limite: em fusos negativos, sem UTC, viraria dia 10.
    expect(formatFestivalDate('2026-09-11', 'en', { day: 'numeric' })).toBe('11');
  });
});
