import { describe, expect, it } from 'vitest';

import { activities } from '@/content/activities';
import { workshops } from '@/content/workshops';
import {
  countByCategory,
  countByVenue,
  festivalDayOf,
  festivalDays,
  filterActivities,
  groupByDay,
  liveSessions,
  nextSessions,
  sessionEndsAt,
  sessionStatus,
  workshopHappensOn,
  workshopHasEnded,
} from './schedule';

import type { Activity } from '@/types/festival';

/** Uma atividade mínima — só os campos que as derivações realmente leem. */
function makeActivity(overrides: Partial<Activity> = {}): Activity {
  return {
    id: 'teste',
    title: 'Teste',
    strand: 'mostra-oficial',
    startsAt: '2024-10-13T19:30:00-03:00',
    durationInMinutes: 50,
    venueId: 'casa',
    company: 'Companhia',
    stateCode: 'ES',
    author: null,
    director: null,
    rating: null,
    release: '',
    technicalSheet: [],
    note: null,
    accessibility: [],
    image: null,
    ...overrides,
  };
}

describe('festivalDayOf', () => {
  it('lê o dia local do festival, sem depender do fuso de quem executa', () => {
    expect(festivalDayOf('2024-10-13T19:30:00-03:00')).toBe('2024-10-13');
  });

  it('não deixa uma sessão noturna escorregar para o dia seguinte', () => {
    // 23h30 em Vitória é 02h30 do dia seguinte em UTC.
    expect(festivalDayOf('2024-10-13T23:30:00-03:00')).toBe('2024-10-13');
  });

  it('rejeita um instante malformado em vez de devolver lixo', () => {
    expect(() => festivalDayOf('ontem à noite')).toThrow(TypeError);
  });
});

describe('sessionEndsAt', () => {
  it('deriva o término do início mais a duração', () => {
    const endsAt = sessionEndsAt(makeActivity({ durationInMinutes: 50 }));

    expect(endsAt?.toISOString()).toBe('2024-10-13T23:20:00.000Z');
  });

  it('não inventa término quando o programa não declara duração', () => {
    expect(sessionEndsAt(makeActivity({ durationInMinutes: null }))).toBeNull();
  });
});

describe('sessionStatus', () => {
  const activity = makeActivity({ durationInMinutes: 50 });
  const start = new Date('2024-10-13T19:30:00-03:00');
  const end = new Date('2024-10-13T20:20:00-03:00');

  it('antes do início, a sessão está por vir', () => {
    expect(sessionStatus(activity, new Date(start.getTime() - 60_000))).toBe('upcoming');
  });

  it('no instante exato do início, a sessão já está em cena', () => {
    expect(sessionStatus(activity, start)).toBe('live');
  });

  it('no instante exato do término, a sessão ainda está em cena', () => {
    expect(sessionStatus(activity, end)).toBe('live');
  });

  it('um minuto depois do término, a sessão está encerrada', () => {
    expect(sessionStatus(activity, new Date(end.getTime() + 60_000))).toBe('ended');
  });

  it('sem duração declarada, a sessão não se encerra por decurso de tempo', () => {
    const semDuracao = makeActivity({ durationInMinutes: null });

    expect(sessionStatus(semDuracao, start)).toBe('live');
    expect(sessionStatus(semDuracao, new Date(start.getTime() + 6 * 60 * 60_000))).toBe('live');
  });
});

describe('groupByDay', () => {
  it('agrupa por dia do festival e ordena os dias', () => {
    const groups = groupByDay([
      makeActivity({ id: 'b', startsAt: '2024-10-15T19:00:00-03:00' }),
      makeActivity({ id: 'a', startsAt: '2024-10-13T19:30:00-03:00' }),
    ]);

    expect(groups.map((group) => group.date)).toEqual(['2024-10-13', '2024-10-15']);
  });

  it('ordena as atividades do dia por horário de início', () => {
    const groups = groupByDay([
      makeActivity({ id: 'noite', startsAt: '2024-10-13T20:00:00-03:00' }),
      makeActivity({ id: 'tarde', startsAt: '2024-10-13T16:00:00-03:00' }),
      makeActivity({ id: 'fim-de-tarde', startsAt: '2024-10-13T17:00:00-03:00' }),
    ]);

    expect(groups[0]?.activities.map((activity) => activity.id)).toEqual([
      'tarde',
      'fim-de-tarde',
      'noite',
    ]);
  });

  it('uma lista vazia não produz nenhum dia', () => {
    expect(groupByDay([])).toEqual([]);
  });
});

describe('filterActivities', () => {
  const lista = [
    makeActivity({ id: 'oficial-casa', strand: 'mostra-oficial', venueId: 'casa' }),
    makeActivity({
      id: 'paralela-sesi',
      strand: 'mostra-paralela',
      venueId: 'sesi',
      startsAt: '2024-10-15T19:30:00-03:00',
    }),
  ];

  it('sem filtros, devolve tudo', () => {
    expect(filterActivities(lista, {})).toHaveLength(2);
  });

  it('combina dia, frente e espaço', () => {
    const resultado = filterActivities(lista, {
      day: '2024-10-13',
      strand: 'mostra-oficial',
      venueId: 'casa',
    });

    expect(resultado.map((activity) => activity.id)).toEqual(['oficial-casa']);
  });

  it('filtros que se anulam devolvem lista vazia, não a lista inteira', () => {
    const resultado = filterActivities(lista, { strand: 'mostra-oficial', venueId: 'sesi' });

    expect(resultado).toEqual([]);
  });

  it('um dia sem atividades devolve lista vazia', () => {
    expect(filterActivities(lista, { day: '2024-10-20' })).toEqual([]);
  });
});

describe('nextSessions', () => {
  const lista = [
    makeActivity({ id: 'segunda', startsAt: '2024-10-13T21:00:00-03:00' }),
    makeActivity({ id: 'primeira', startsAt: '2024-10-13T20:00:00-03:00' }),
    makeActivity({ id: 'em-cena', startsAt: '2024-10-13T19:00:00-03:00' }),
  ];
  const agora = new Date('2024-10-13T19:10:00-03:00');

  it('ordena por horário e ignora o que já começou', () => {
    expect(nextSessions(lista, agora).map((activity) => activity.id)).toEqual([
      'primeira',
      'segunda',
    ]);
  });

  it('respeita o limite pedido', () => {
    expect(nextSessions(lista, agora, 1).map((activity) => activity.id)).toEqual(['primeira']);
  });

  it('depois da última sessão, não há próximas', () => {
    expect(nextSessions(lista, new Date('2024-10-14T00:00:00-03:00'))).toEqual([]);
  });
});

describe('liveSessions', () => {
  it('devolve apenas o que está em cena no instante', () => {
    const lista = [
      makeActivity({ id: 'em-cena', startsAt: '2024-10-13T19:00:00-03:00' }),
      makeActivity({ id: 'depois', startsAt: '2024-10-13T21:00:00-03:00' }),
    ];

    const emCena = liveSessions(lista, new Date('2024-10-13T19:10:00-03:00'));

    expect(emCena.map((activity) => activity.id)).toEqual(['em-cena']);
  });
});

describe('contagens', () => {
  it('conta por frente de programação', () => {
    expect(countByCategory(activities)['mostra-oficial']).toBe(13);
    expect(countByCategory(activities)['mostra-paralela']).toBe(6);
    expect(countByCategory(activities).lancamento).toBe(1);
  });

  it('não inventa frente que não ocorre no acervo', () => {
    expect(countByCategory(activities)['processo-criativo']).toBeUndefined();
  });

  it('conta por espaço', () => {
    expect(countByVenue(activities).ufes).toBe(1);
    expect(countByVenue(activities).estrelas).toBeUndefined();
  });
});

describe('festivalDays', () => {
  it('lista os oito dias da edição 2024, sem repetição e em ordem', () => {
    const dias = festivalDays(activities);

    expect(dias).toHaveLength(8);
    expect(dias[0]).toBe('2024-10-13');
    expect(dias.at(-1)).toBe('2024-10-20');
  });
});

describe('oficinas', () => {
  const oficinaDeDoisDias = workshops[0]!;

  it('reconhece cada dia em que a oficina acontece', () => {
    expect(workshopHappensOn(oficinaDeDoisDias, '2024-10-14')).toBe(true);
    expect(workshopHappensOn(oficinaDeDoisDias, '2024-10-15')).toBe(true);
    expect(workshopHappensOn(oficinaDeDoisDias, '2024-10-16')).toBe(false);
  });

  it('só considera encerrada depois da última sessão', () => {
    expect(workshopHasEnded(oficinaDeDoisDias, new Date('2024-10-15T10:00:00-03:00'))).toBe(false);
    expect(workshopHasEnded(oficinaDeDoisDias, new Date('2024-10-15T19:00:00-03:00'))).toBe(true);
  });
});
