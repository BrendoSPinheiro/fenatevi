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
   * - qualquer arquivo estático (caminhos que contenham um ponto)
   */
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
