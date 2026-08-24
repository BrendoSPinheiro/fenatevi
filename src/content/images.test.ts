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

  it('registra as extrações do programa impresso como material a substituir', () => {
    // Todas as capas de 2024 são extrações de baixa resolução do programa.
    expect(imagesNeedingOriginals.length).toBe(allImages.length);
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
