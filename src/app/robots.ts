import type { MetadataRoute } from 'next';

/**
 * Gera `/robots.txt`.
 *
 * Fica na raiz de `app/` (fora de `[locale]`): o arquivo vale para o host
 * inteiro, não por idioma.
 *
 * Ainda não aponta um `sitemap` porque `sitemap.ts` não existe — declarar um
 * endereço que responde 404 é pior que omiti-lo. Adicione a chave junto com o
 * sitemap, quando houver rotas além da home.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
  };
}
