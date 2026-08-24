import type { IsoDate } from '@/types/festival';

/**
 * A área editorial do festival.
 *
 * **Está vazia de propósito, e a lista vazia é o dado.** O protótipo desenha
 * três "slots editoriais" com manchetes como "Espaço reservado para avisos de
 * última hora": aquilo é anotação de design, endereçada a quem implementa, e
 * publicá-la seria apresentar ao visitante uma notícia que não existe. Uma
 * manchete ou uma data fictícia num portal de festival é pior do que a
 * ausência — ela é lida como informação.
 *
 * Quando a organização publicar a primeira notícia, ela entra aqui e a tela
 * passa da mensagem de indisponibilidade para a listagem, sem mudança de
 * código.
 */
export type NewsCategory = 'alteracao' | 'bastidores' | 'chamada';

export interface NewsItem {
  readonly id: string;
  readonly category: NewsCategory;
  /** Acervo, pt-BR: a manchete como a organização a escreveu. */
  readonly title: string;
  readonly publishedAt: IsoDate;
  /** Acervo, pt-BR; `null` quando a nota é só a manchete. */
  readonly body: string | null;
  readonly imageSrc: string | null;
}

export const news: readonly NewsItem[] = [];

/** As notícias da mais recente à mais antiga. */
export const newsNewestFirst: readonly NewsItem[] = [...news].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);
