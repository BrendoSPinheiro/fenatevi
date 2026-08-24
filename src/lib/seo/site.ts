/**
 * Identidade do site para buscadores e para compartilhamento em redes sociais.
 *
 * Tudo que precisa de URL absoluta (`metadataBase`, canonical, Open Graph,
 * `robots.txt` e, futuramente, o sitemap) deriva daqui.
 */

/**
 * Origem canônica de produção.
 *
 * **Valor provisório.** O domínio definitivo do festival ainda não foi
 * decidido; até lá este placeholder mantém as URLs absolutas coerentes entre
 * si. Trocar o domínio é alterar esta constante — nenhum outro arquivo repete
 * o endereço. Registrado em `docs/riscos-conhecidos.md`.
 */
export const SITE_URL = 'https://www.fenatevi.com.br';

/**
 * Dimensão da imagem de compartilhamento.
 *
 * 1200×630 é a proporção que Facebook, WhatsApp, LinkedIn e X recortam sem
 * cortar conteúdo — o formato que as campanhas pagas vão exibir.
 */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * Cores usadas na imagem de compartilhamento.
 *
 * Duplicam tokens de `src/styles/globals.css` por limitação técnica: a imagem é
 * gerada pelo Satori (`next/og`), que resolve um subconjunto de CSS e **não lê
 * CSS Custom Properties**. A fonte da verdade continua sendo `globals.css`; ao
 * mudar o tema, atualize estes valores junto.
 */
export const OG_COLORS = {
  background: '#131312',
  foreground: '#e5e2df',
  muted: '#c6c3c0',
  /** Bordô da marca (`--color-primary-container`). */
  primary: '#800020',
  /** Âmbar de destaque (`--color-secondary`). */
  secondary: '#ffdb9d',
} as const;
