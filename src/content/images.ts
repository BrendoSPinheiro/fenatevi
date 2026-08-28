import { activities } from '@/content/activities';
import { edition2024 } from '@/content/festival';
import { honorees } from '@/content/honorees';
import { venues } from '@/content/venues';
import { workshops } from '@/content/workshops';

import type { ImageAsset } from '@/types/festival';

/**
 * Toda imagem referenciada pelo acervo, em um só lugar.
 *
 * Existe por dois motivos concretos. O primeiro é verificação: um teste percorre
 * esta lista e falha se algum arquivo não estiver em `public/`, de modo que uma
 * imagem quebrada seja um teste vermelho e não uma descoberta do visitante.
 *
 * O segundo é a proveniência: levantar o que ainda precisa de arquivo original
 * é um `filter` sobre esta lista — ver `imagesNeedingOriginals`.
 */
export const allImages: readonly ImageAsset[] = [
  ...activities.map((activity) => activity.image),
  ...workshops.map((workshop) => workshop.image),
  ...venues.map((venue) => venue.image),
  ...honorees.map((honoree) => honoree.portrait),
  edition2024.coverImage,
  edition2024.statement?.portrait ?? null,
].filter((image): image is ImageAsset => image !== null);

/**
 * As imagens que ainda são extrações de baixa resolução.
 *
 * É a lista de pedidos a fazer às companhias e à organização — um dado, não uma
 * anotação perdida no JSX. Nada disso é apresentado ao visitante.
 */
export const imagesNeedingOriginals: readonly ImageAsset[] = allImages.filter(
  (image) => image.isLowResolution,
);

/**
 * Fotografias de palco, usadas como camada de fundo das aberturas de seção.
 *
 * Ficam separadas do acervo porque não retratam um espetáculo, um espaço nem
 * uma pessoa identificados: são atmosfera. Por isso são sempre decorativas —
 * apresentadas com `aria-hidden` e nunca como a única fonte de uma informação.
 */
export const stagePhotos = {
  hero: '/imagens/palco/stage-hero.jpg',
  frentes: '/imagens/palco/stage-b.jpg',
  memoria: '/imagens/palco/stage-c.jpg',
  edicao: '/imagens/palco/stage-d.jpg',
  noticias: '/imagens/palco/stage-a.jpg',
} as const;

/**
 * Fotografias de espaço cênico distribuídas com o protótipo.
 *
 * Não vêm identificadas com o espaço que retratam, então **não** são atribuídas
 * a nenhum espaço nomeado: aparecem apenas como ilustração da área de espaços,
 * decorativas, sem afirmar de que teatro se trata.
 */
export const venuePhotos = [
  '/imagens/espacos/venue-a.jpg',
  '/imagens/espacos/venue-b.jpg',
  '/imagens/espacos/venue-c.jpg',
] as const;
