import createMiddleware from 'next-intl/middleware';

import { routing } from '@/lib/i18n/routing';

/**
 * Resolve o idioma de cada requisição.
 *
 * No Next.js 16 esta convenção de arquivo passou a se chamar `proxy` (antes
 * `middleware`); o `createMiddleware` do next-intl continua sendo a fábrica correta.
 *
 * Responsabilidades: detectar o idioma preferido, servir `/` em `pt-BR` sem
 * prefixo e mapear `/en` e `/es` para o segmento `[locale]`.
 */
export default createMiddleware(routing);

export const config = {
  /*
   * Aplica-se a todas as rotas de página, ignorando:
   * - rotas de API (`/api`)
   * - artefatos internos do Next.js (`/_next`) e da Vercel (`/_vercel`)
   * - a imagem de compartilhamento (`/<locale>/opengraph-image`)
   * - qualquer arquivo estático (caminhos que contenham um ponto)
   *
   * A imagem precisa da exceção porque sua URL não tem extensão: sem ela o
   * `/pt-BR/opengraph-image` do `og:image` cairia na regra `as-needed` e
   * responderia 307 para `/opengraph-image`. Raspadores de rede social nem
   * sempre seguem redirecionamento de imagem — o card apareceria sem figura
   * justamente no idioma padrão.
   */
  matcher: '/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)',
};
