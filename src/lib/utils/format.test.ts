import { describe, expect, it } from 'vitest';

import {
  festivalDayFromDate,
  formatDayNumber,
  formatDuration,
  formatFestivalDate,
  formatMonthShort,
  formatSessionTime,
  formatShortDay,
  formatWeekday,
  formatWeekdayShort,
  parseIsoDate,
} from './format';

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

describe('formatSessionTime', () => {
  const sessao = '2024-10-13T19:30:00-03:00';

  it('formata o horário em cada idioma', () => {
    expect(formatSessionTime(sessao, 'pt-BR')).toBe('19h30');
    expect(formatSessionTime(sessao, 'en')).toBe('7:30 PM');
    expect(formatSessionTime(sessao, 'es')).toBe('19:30');
  });

  it('não desloca o horário pelo fuso de quem executa', () => {
    // O instante é o mesmo; o fuso do festival é declarado na formatação.
    expect(formatSessionTime('2024-10-13T22:30:00Z', 'pt-BR')).toBe('19h30');
  });
});

describe('formatShortDay', () => {
  it('deixa o Intl decidir a ordem dos campos por idioma', () => {
    expect(formatShortDay('2024-10-13', 'pt-BR')).toBe('13 de out.');
    expect(formatShortDay('2024-10-13', 'en')).toBe('Oct 13');
    expect(formatShortDay('2024-10-13', 'es')).toBe('13 oct');
  });
});

describe('formatWeekday', () => {
  it('nomeia o dia da semana em cada idioma', () => {
    expect(formatWeekday('2024-10-13', 'pt-BR')).toBe('domingo');
    expect(formatWeekday('2024-10-13', 'en')).toBe('Sunday');
    expect(formatWeekday('2024-10-13', 'es')).toBe('domingo');
  });
});

describe('formatDuration', () => {
  it('formata minutos nos três idiomas', () => {
    expect(formatDuration(50, 'pt-BR')).toBe('50 min');
    expect(formatDuration(50, 'en')).toBe('50 min');
    expect(formatDuration(50, 'es')).toBe('50 min');
  });

  it('passa a horas quando a sessão é longa', () => {
    expect(formatDuration(100, 'pt-BR')).toBe('1 h 40 min');
    expect(formatDuration(120, 'pt-BR')).toBe('2 h');
  });
});

describe('festivalDayFromDate', () => {
  it('converte um instante qualquer para o dia em Vitória', () => {
    // 01h UTC de 14 de outubro ainda é 22h do dia 13 no fuso do festival.
    expect(festivalDayFromDate(new Date('2024-10-14T01:00:00Z'))).toBe('2024-10-13');
  });
});

/*
 * A composição editorial da programação empilha o número, o mês e o dia da
 * semana em escalas diferentes, e para isso precisa de cada parte isolada. Elas
 * continuam vindo do `Intl` — o mês abreviado é "out." em português e "Oct" em
 * inglês, e nenhum dos dois é montado à mão. A caixa alta fica com o CSS.
 */
describe('as partes de uma data', () => {
  it('devolve o número do dia sem o resto', () => {
    expect(formatDayNumber('2024-10-13', 'pt-BR')).toBe('13');
    expect(formatDayNumber('2024-10-13', 'en')).toBe('13');
  });

  it('abrevia o mês conforme o idioma', () => {
    expect(formatMonthShort('2024-10-13', 'pt-BR')).toBe('out.');
    expect(formatMonthShort('2024-10-13', 'en')).toBe('Oct');
  });

  it('abrevia o dia da semana conforme o idioma', () => {
    expect(formatWeekdayShort('2024-10-13', 'pt-BR')).toBe('dom.');
    expect(formatWeekdayShort('2024-10-13', 'en')).toBe('Sun');
  });

  it('não escorrega de dia pelo fuso de quem executa', () => {
    // O dia 13 às 00h em UTC-3 ainda é dia 12 em UTC; a formatação é sempre UTC.
    expect(formatDayNumber('2024-10-13', 'pt-BR')).toBe('13');
    expect(formatWeekdayShort('2024-10-20', 'pt-BR')).toBe('dom.');
  });
});
