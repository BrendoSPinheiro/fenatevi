import { expect, test } from '@playwright/test';

/** Origem declarada em `src/lib/seo/site.ts`; provisória até o domínio definitivo. */
const SITE_URL = 'https://www.fenatevi.com.br';

/** Lê o `content`/`href` de uma tag do `<head>`, que não é visível na página. */
async function headAttribute(
  page: import('@playwright/test').Page,
  selector: string,
  attribute: string,
) {
  return page.locator(selector).first().getAttribute(attribute);
}

test.describe('Metadados para buscadores e redes sociais', () => {
  test('declara canonical absoluto por idioma', async ({ page }) => {
    await page.goto('/');
    expect(await headAttribute(page, 'link[rel="canonical"]', 'href')).toBe(SITE_URL);

    await page.goto('/en');
    expect(await headAttribute(page, 'link[rel="canonical"]', 'href')).toBe(`${SITE_URL}/en`);
  });

  test('mantém o canonical estável quando a URL traz parâmetros de campanha', async ({ page }) => {
    // O motivo de existir do canonical: consolidar as variações de UTM em um só endereço.
    await page.goto('/?utm_source=instagram&utm_medium=paid&utm_campaign=teste');

    expect(await headAttribute(page, 'link[rel="canonical"]', 'href')).toBe(SITE_URL);
  });

  test('preenche o cartão de compartilhamento traduzido', async ({ page }) => {
    await page.goto('/');

    expect(await headAttribute(page, 'meta[property="og:title"]', 'content')).toContain('FENATEVI');
    expect(await headAttribute(page, 'meta[property="og:type"]', 'content')).toBe('website');
    expect(await headAttribute(page, 'meta[property="og:url"]', 'content')).toBe(SITE_URL);
    expect(await headAttribute(page, 'meta[name="twitter:card"]', 'content')).toBe(
      'summary_large_image',
    );

    await page.goto('/en');
    expect(await headAttribute(page, 'meta[property="og:title"]', 'content')).toContain(
      'Theatre Festival',
    );
  });

  test('serve a imagem de compartilhamento sem redirecionar, nos três idiomas', async ({
    page,
    request,
  }) => {
    // Regressão: com o `proxy` interceptando a rota, o idioma padrão respondia 307
    // e o card ficava sem imagem justamente em pt-BR.
    for (const path of ['/', '/en', '/es']) {
      await page.goto(path);
      const imageUrl = await headAttribute(page, 'meta[property="og:image"]', 'content');
      expect(imageUrl).toBeTruthy();

      // O `content` é absoluto e aponta para o domínio de produção; testamos o
      // mesmo caminho no servidor local.
      const { pathname, search } = new URL(imageUrl as string);
      const response = await request.get(`${pathname}${search}`, { maxRedirects: 0 });

      expect(response.status(), `imagem OG de ${path}`).toBe(200);
      expect(response.headers()['content-type']).toContain('image/png');
    }
  });

  test('publica um robots.txt que libera o rastreamento', async ({ request }) => {
    const response = await request.get('/robots.txt');

    expect(response.status()).toBe(200);
    expect(await response.text()).toContain('Allow: /');
  });

  test('declara o favicon', async ({ page }) => {
    await page.goto('/');

    expect(await headAttribute(page, 'link[rel="icon"]', 'href')).toContain('/icon.svg');
  });
});
