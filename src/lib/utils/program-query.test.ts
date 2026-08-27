import { describe, expect, it } from 'vitest';

import {
  accessibilityFilters,
  availableDays,
  gridHref,
  hasActiveFilters,
  parseGridQuery,
  parseProgramFilters,
  programHref,
} from './program-query';

describe('parseProgramFilters', () => {
  it('aceita os filtros que correspondem ao acervo', () => {
    const filters = parseProgramFilters({
      dia: '2024-10-13',
      frente: 'mostra-oficial',
      espaco: 'casa',
    });

    expect(filters).toEqual({
      day: '2024-10-13',
      strand: 'mostra-oficial',
      venueId: 'casa',
    });
  });

  it('ignora um dia que não existe na edição', () => {
    expect(parseProgramFilters({ dia: '2024-12-25' }).day).toBeUndefined();
  });

  it('ignora uma frente inventada', () => {
    expect(parseProgramFilters({ frente: 'mostra-secreta' }).strand).toBeUndefined();
  });

  it('ignora um espaço desconhecido', () => {
    expect(parseProgramFilters({ espaco: '../../etc/passwd' }).venueId).toBeUndefined();
  });

  it('lê apenas o primeiro valor quando a URL repete a chave', () => {
    expect(parseProgramFilters({ dia: ['2024-10-13', '2024-10-14'] }).day).toBe('2024-10-13');
  });

  it('sem parâmetros, não filtra nada', () => {
    expect(hasActiveFilters(parseProgramFilters({}))).toBe(false);
  });

  it('aceita um recurso de acessibilidade que a edição declara', () => {
    expect(parseProgramFilters({ acessibilidade: 'signLanguage' }).accessibility).toBe(
      'signLanguage',
    );
  });

  /*
   * A união de tipos conhece cinco recursos; a edição exibida declara dois. O
   * que decide o filtro é o acervo, não o tipo — oferecer um recorte que só
   * devolve vazio seria pior do que não oferecê-lo.
   */
  it('ignora um recurso que a edição exibida não declara', () => {
    expect(accessibilityFilters).not.toContain('relaxedPerformance');
    expect(
      parseProgramFilters({ acessibilidade: 'relaxedPerformance' }).accessibility,
    ).toBeUndefined();
  });

  it('o filtro de acessibilidade conta como filtro ativo', () => {
    expect(hasActiveFilters(parseProgramFilters({ acessibilidade: 'audioDescription' }))).toBe(
      true,
    );
  });
});

describe('programHref', () => {
  it('sem filtros, aponta para a rota limpa', () => {
    expect(programHref({})).toBe('/programacao');
  });

  it('escreve os parâmetros sempre na mesma ordem', () => {
    const href = programHref({ venueId: 'casa', strand: 'mostra-oficial', day: '2024-10-13' });

    expect(href).toBe('/programacao?dia=2024-10-13&frente=mostra-oficial&espaco=casa');
  });

  it('altera um filtro preservando os demais', () => {
    const href = programHref(
      { day: '2024-10-13', strand: 'mostra-oficial' },
      { day: '2024-10-14' },
    );

    expect(href).toBe('/programacao?dia=2024-10-14&frente=mostra-oficial');
  });

  it('remove um filtro com null', () => {
    const href = programHref({ day: '2024-10-13', strand: 'mostra-oficial' }, { strand: null });

    expect(href).toBe('/programacao?dia=2024-10-13');
  });

  it('leva o recurso de acessibilidade para a URL, no fim da ordem fixa', () => {
    const href = programHref({ day: '2024-10-14' }, { accessibility: 'signLanguage' });

    expect(href).toBe('/programacao?dia=2024-10-14&acessibilidade=signLanguage');
  });
});

describe('parseGridQuery', () => {
  it('abre na visão por espaço, no primeiro dia da edição', () => {
    expect(parseGridQuery({})).toEqual({ view: 'espaco', day: availableDays[0] });
  });

  it('ignora uma visão inventada sem perder o dia pedido', () => {
    expect(parseGridQuery({ visao: 'calendario', dia: '2024-10-15' })).toEqual({
      view: 'espaco',
      day: '2024-10-15',
    });
  });
});

describe('gridHref', () => {
  it('a troca de visão preserva o dia selecionado', () => {
    const href = gridHref({ view: 'espaco', day: '2024-10-17' }, { view: 'semana' });

    expect(href).toBe('/programacao/grade?visao=semana&dia=2024-10-17');
  });
});
