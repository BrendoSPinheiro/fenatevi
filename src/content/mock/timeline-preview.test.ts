import { describe, expect, it } from 'vitest';

import { editionTimeline } from '@/content/editions';
import {
  PREVIEW_PHOTOS,
  previewPhotoAltKey,
  previewStations,
  previewPhotoUrl,
} from '@/content/mock/timeline-preview';

/*
 * O que estes testes protegem não é o layout — é a fronteira entre prévia e
 * acervo. Uma estação de prévia que ganhasse destino, ou uma edição real que
 * fosse marcada como prévia, seria o portal mentindo sobre o próprio arquivo.
 */
describe('previewStations', () => {
  it('cobre as 22 edições, da 1ª à vigente', () => {
    expect(previewStations).toHaveLength(22);

    const editions = previewStations.map((station) => station.edition).sort((a, b) => a! - b!);

    expect(editions).toEqual(Array.from({ length: 22 }, (_, index) => index + 1));
  });

  it('usa a grade derivada — 1ª em 2005, 20ª em 2024, 22ª em 2026', () => {
    const yearOf = (edition: number) =>
      previewStations.find((station) => station.edition === edition)?.firstYear;

    expect(yearOf(1)).toBe(2005);
    expect(yearOf(20)).toBe(2024);
    expect(yearOf(22)).toBe(2026);
  });

  it('lista da edição mais recente para a mais antiga', () => {
    const years = previewStations.map((station) => station.firstYear);

    expect(years).toEqual([...years].sort((a, b) => b - a));
  });

  /* A regra dura: prévia nunca vira link para uma página de edição. */
  it('não dá página de edição a nenhuma estação de prévia', () => {
    const offenders = previewStations.filter(
      (station) => station.isPreview && station.hasEditionPage,
    );

    expect(offenders).toEqual([]);
  });

  it('copia as edições reais de `editionTimeline` sem alterá-las', () => {
    for (const entry of editionTimeline.filter((item) => item.edition !== null)) {
      const station = previewStations.find((item) => item.id === entry.id);

      expect(station).toMatchObject({
        edition: entry.edition,
        archiveState: entry.archiveState,
        completeness: entry.completeness,
        hasEditionPage: entry.hasEditionPage,
        isPreview: false,
      });
    }
  });

  it('mantém a completude dentro do intervalo válido', () => {
    for (const station of previewStations) {
      expect(station.completeness).toBeGreaterThanOrEqual(0);
      expect(station.completeness).toBeLessThanOrEqual(1);
    }
  });
});

describe('fotografias de prévia', () => {
  it('só aparecem em estações de prévia, e sem repetir foto', () => {
    const used = previewStations
      .filter((station) => station.imageId !== null)
      .map((station) => {
        expect(station.isPreview).toBe(true);
        return station.imageId;
      });

    expect(new Set(used).size).toBe(used.length);
  });

  it('resolve cada foto a uma chave de texto alternativo declarada', () => {
    const keys = new Set<string>(PREVIEW_PHOTOS.map((photo) => photo.key));

    for (const photo of PREVIEW_PHOTOS) {
      expect(keys.has(previewPhotoAltKey(photo.id))).toBe(true);
      expect(previewPhotoUrl(photo.id)).toContain('https://images.unsplash.com/');
    }
  });
});
