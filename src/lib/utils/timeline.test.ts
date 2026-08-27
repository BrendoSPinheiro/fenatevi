import { describe, expect, it } from 'vitest';

import { editionTimeline } from '@/content/editions';
import {
  DEFAULT_TIMELINE_VARIANT,
  parseTimelineVariant,
  realStations,
  stationHasDestination,
  stationYearLabel,
} from '@/lib/utils/timeline';

describe('parseTimelineVariant', () => {
  it('aceita as duas variantes existentes', () => {
    expect(parseTimelineVariant({ linha: 'espinha' })).toBe('espinha');
    expect(parseTimelineVariant({ linha: 'trilho' })).toBe('trilho');
  });

  it('cai na variante padrão quando o parâmetro não vem', () => {
    expect(parseTimelineVariant({})).toBe(DEFAULT_TIMELINE_VARIANT);
  });

  /*
   * O valor vem da URL, e é entrada externa: um valor inventado não é erro, é a
   * variante padrão — a tela responde, nunca quebra.
   */
  it('ignora um valor desconhecido em vez de falhar', () => {
    expect(parseTimelineVariant({ linha: 'carrossel' })).toBe(DEFAULT_TIMELINE_VARIANT);
    expect(parseTimelineVariant({ linha: '' })).toBe(DEFAULT_TIMELINE_VARIANT);
  });

  it('usa o primeiro valor quando a URL repete a chave', () => {
    expect(parseTimelineVariant({ linha: ['trilho', 'espinha'] })).toBe('trilho');
  });
});

describe('realStations', () => {
  it('preserva o acervo e não inventa imagem nem prévia', () => {
    const stations = realStations(editionTimeline);

    expect(stations).toHaveLength(editionTimeline.length);
    expect(stations.every((station) => station.imageId === null)).toBe(true);
    expect(stations.every((station) => !station.isPreview)).toBe(true);
  });

  it('mantém `hasEditionPage` intacto, para que nenhum destino seja inventado', () => {
    const stations = realStations(editionTimeline);

    expect(
      stations.filter((station) => station.hasEditionPage).map((station) => station.firstYear),
    ).toEqual([2024]);
  });
});

describe('stationYearLabel', () => {
  it('mostra o ano de uma edição única e o intervalo de um bloco', () => {
    const [single, grouped] = realStations([
      { ...editionTimeline[2]!, firstYear: 2024, lastYear: 2024 },
      { ...editionTimeline[3]!, firstYear: 2004, lastYear: 2023 },
    ]);

    expect(stationYearLabel(single!)).toBe('2024');
    expect(stationYearLabel(grouped!)).toBe('2004—2023');
  });
});

describe('stationHasDestination', () => {
  it('só tem destino quem tem página de edição ou é a edição vigente', () => {
    const stations = realStations(editionTimeline);
    const withDestination = stations.filter(stationHasDestination).map((station) => station.id);

    expect(withDestination).toEqual(['2026', '2024']);
  });
});
