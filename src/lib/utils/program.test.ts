import { describe, expect, it } from 'vitest';

import { activities } from '@/content/activities';
import { creativeProcesses } from '@/content/creative-processes';
import { workshops } from '@/content/workshops';
import { availableDays } from '@/lib/utils/program-query';

import { countsByDay, countsByStrand, editionScale, programCount, programGroups } from './program';

/** Quantos itens a frente tem sob estes filtros, sem depender da ordem. */
function itemsOf(strand: string, filters = {}) {
  return programGroups(filters).find((group) => group.strand === strand)?.items ?? [];
}

describe('programGroups', () => {
  it('reúne as três fontes do acervo nas frentes que elas ocupam', () => {
    const groups = programGroups({});

    expect(groups.map((group) => group.strand)).toEqual([
      'mostra-oficial',
      'mostra-paralela',
      'oficina',
      'lancamento',
      'processo-criativo',
    ]);
  });

  /*
   * É a regressão que motivou este módulo: as oficinas vivem em outro arquivo
   * do acervo, e a listagem que lia só `activities` oferecia "Oficina" como
   * filtro que nunca devolvia nada.
   */
  it('a frente Oficina devolve as oficinas do acervo, e não vazio', () => {
    expect(itemsOf('oficina', { strand: 'oficina' })).toHaveLength(workshops.length);
  });

  it('a frente Processo criativo devolve as demonstrações do acervo', () => {
    const total = creativeProcesses.reduce((sum, entry) => sum + entry.items.length, 0);

    expect(itemsOf('processo-criativo', { strand: 'processo-criativo' })).toHaveLength(total);
  });

  it('uma frente sem itens não vira seção vazia', () => {
    const groups = programGroups({ day: '2024-10-13' });

    expect(groups.map((group) => group.strand)).not.toContain('oficina');
  });

  it('ordena os itens de cada frente pelo horário do acervo', () => {
    const items = itemsOf('mostra-oficial');
    const starts = items.map((item) =>
      item.kind === 'activity' ? new Date(item.activity.startsAt).getTime() : 0,
    );

    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });

  it('uma oficina de dois dias pertence aos dois', () => {
    expect(itemsOf('oficina', { day: '2024-10-14' })).toHaveLength(1);
    expect(itemsOf('oficina', { day: '2024-10-15' })).toHaveLength(1);
  });

  /*
   * O acervo não declara recursos de acessibilidade para as demonstrações de
   * processo criativo. Herdá-los da sessão anterior seria informar algo que o
   * programa impresso não diz.
   */
  it('o filtro de acessibilidade exclui as demonstrações, que não o declaram', () => {
    expect(
      programGroups({ accessibility: 'signLanguage' }).map((group) => group.strand),
    ).not.toContain('processo-criativo');
  });

  it('o filtro de acessibilidade só deixa quem declara o recurso', () => {
    for (const group of programGroups({ accessibility: 'audioDescription' })) {
      for (const item of group.items) {
        const features =
          item.kind === 'activity'
            ? item.activity.accessibility
            : item.kind === 'workshop'
              ? item.workshop.accessibility
              : [];

        expect(features).toContain('audioDescription');
      }
    }
  });

  it('um espaço filtra as três fontes ao mesmo tempo', () => {
    const groups = programGroups({ venueId: 'estrelas' });

    // As duas oficinas acontecem no Teatro Estrelas, e nada mais acontece lá.
    expect(groups.map((group) => group.strand)).toEqual(['oficina']);
  });
});

describe('programCount', () => {
  it('sem filtros, conta tudo o que a tela apresenta', () => {
    const demonstrations = creativeProcesses.reduce((sum, entry) => sum + entry.items.length, 0);

    expect(programCount({})).toBe(activities.length + workshops.length + demonstrations);
  });

  it('uma combinação impossível devolve zero em vez de erro', () => {
    expect(programCount({ strand: 'lancamento', day: '2024-10-13' })).toBe(0);
  });
});

describe('countsByStrand', () => {
  /*
   * O número ao lado de uma frente precisa dizer quanto **aquele** caminho
   * devolve — e não quanto a frente já escolhida devolve. Por isso a contagem
   * ignora o filtro de frente e respeita todos os outros.
   */
  it('ignora a frente escolhida e respeita os demais filtros', () => {
    const counts = countsByStrand({ strand: 'oficina', day: '2024-10-13' });

    expect(counts['oficina']).toBe(0);
    expect(counts['mostra-oficial']).toBeGreaterThan(0);
  });
});

describe('countsByDay', () => {
  it('conta cada dia mantendo os demais filtros', () => {
    const counts = countsByDay({ strand: 'oficina' }, availableDays);

    expect(counts['2024-10-13']).toBe(0);
    expect(counts['2024-10-16']).toBe(1);
  });

  it('a soma dos dias cobre a programação inteira', () => {
    const counts = countsByDay({}, availableDays);
    const summed = availableDays.reduce((sum, day) => sum + (counts[day] ?? 0), 0);

    // A oficina de dois dias é contada em cada um deles, e só ela.
    expect(summed).toBe(programCount({}) + 1);
  });
});

describe('editionScale', () => {
  it('descreve a edição com números contados, não escritos', () => {
    expect(editionScale(availableDays)).toEqual({
      items: programCount({}),
      days: availableDays.length,
      venues: 7,
      strands: 5,
    });
  });
});
