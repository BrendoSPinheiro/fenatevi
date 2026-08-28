import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { allImages, imagesNeedingOriginals, stagePhotos, venuePhotos } from './images';

const PUBLIC_DIR = join(process.cwd(), 'public');

/** O arquivo que um `src` do acervo aponta existe em `public/`? */
function existsInPublic(src: string): boolean {
  return existsSync(join(PUBLIC_DIR, src));
}

describe('imagens do acervo', () => {
  it('referencia apenas arquivos que existem em public/', () => {
    const ausentes = allImages.map((image) => image.src).filter((src) => !existsInPublic(src));

    expect(ausentes).toEqual([]);
  });

  it('declara a proveniência de cada imagem', () => {
    for (const image of allImages) {
      expect(['programa-impresso-2024', 'registro-original']).toContain(image.provenance);
    }
  });

  it('dá a cada imagem uma chave de texto alternativo', () => {
    for (const image of allImages) {
      expect(image.altKey).not.toBe('');
    }
  });

  /*
   * A regra que sustenta a apresentação: baixa resolução e proveniência andam
   * juntas. Uma fotografia restaurada marcada como extração seria apresentada
   * menor do que precisa; uma extração marcada como restaurada seria ampliada
   * até o borrão. As duas direções são erro, e as duas falham aqui.
   */
  it('faz baixa resolução e proveniência concordarem', () => {
    for (const image of allImages) {
      expect(image.isLowResolution, image.src).toBe(image.provenance === 'programa-impresso-2024');
    }
  });

  it('registra as extrações do programa impresso como material a substituir', () => {
    expect(imagesNeedingOriginals.every((image) => image.isLowResolution)).toBe(true);
    // Ainda há material do programa impresso à espera do arquivo original.
    expect(imagesNeedingOriginals.length).toBeGreaterThan(0);
    // Mas a maior parte do acervo já é fotografia restaurada.
    expect(imagesNeedingOriginals.length).toBeLessThan(allImages.length / 2);
  });
});

describe('fotografias de cena', () => {
  it('as fotografias de palco existem em public/', () => {
    for (const src of Object.values(stagePhotos)) {
      expect(existsInPublic(src), src).toBe(true);
    }
  });

  it('as fotografias de espaço existem em public/', () => {
    for (const src of venuePhotos) {
      expect(existsInPublic(src), src).toBe(true);
    }
  });
});
