import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Acessibilidade', () => {
  test('o skip link é o primeiro elemento focável e leva ao conteúdo', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/#conteudo-principal$/);
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('o skip link, quando em uso, é um alvo de toque de tamanho pleno', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(skip).toBeFocused();

    // Oculto até receber foco; a partir dali é um controle como outro qualquer.
    const box = await skip.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });

  test('permite percorrer o cabeçalho pelo teclado', async ({ page }) => {
    await page.goto('/');

    /*
     * A ordem de tabulação segue a ordem visual do cabeçalho: marca, navegação
     * principal, seletor de idioma e, por último, o acesso às áreas. Nenhum
     * item é alcançado fora de ordem — é o que 2.4.3 exige.
     */
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'FENATEVI', exact: true })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link').first(),
    ).toBeFocused();
  });

  test('o esquema dos espaços tem equivalente textual', async ({ page }) => {
    await page.goto('/espacos');

    /*
     * O esquema não é um mapa geográfico, e ele mesmo diz isso. Cada marcador
     * carrega o nome do espaço no nome acessível, e a lista ao lado traz o
     * endereço de verdade — quem não enxerga o esquema não perde nada.
     */
    await expect(page.getByText(/O esquema mostra a posição relativa dos espaços/)).toBeVisible();

    await expect(
      page
        .getByRole('group', { name: 'Esquema dos espaços do festival na cidade' })
        .getByRole('link', { name: /Casa da Música Sônia Cabral/ }),
    ).toBeVisible();
  });

  /*
   * Como todo o contexto roda com movimento reduzido (ver `playwright.config.ts`),
   * a varredura mede a página em repouso: `respectReducedMotion` não cria
   * nenhuma timeline e a abertura teatral não existe.
   *
   * Isso também encerrou uma intermitência antiga: o axe chegava a medir o CTA no
   * meio da interpolação de opacidade do GSAP, quando o botão mesclado com
   * o fundo caía para 4.39:1. As cores transitórias nunca corresponderam a um
   * estado em que alguém lê o conteúdo — e agora não são mais medidas.
   *
   * A varredura com a cortina no ar vive em `intro.spec.ts`, onde ela é o objeto
   * do teste.
   */
  /**
   * Toda rota do portal, nos três idiomas.
   *
   * A varredura completa é o portão: uma tela nova que passe a violar AA
   * derruba o CI no mesmo commit, e não meses depois.
   */
  const ROTAS = [
    '',
    '/programacao',
    '/programacao?dia=2024-10-19&frente=mostra-oficial',
    '/programacao/grade?visao=espaco&dia=2024-10-13',
    '/programacao/grade?visao=horario&dia=2024-10-19',
    '/programacao/grade?visao=semana',
    '/espetaculos/corpo16',
    '/espetaculos/dona',
    '/oficinas/ws-corpo',
    '/espacos',
    '/espacos/casa',
    '/espacos/estrelas',
    '/memoria',
    '/edicoes/2024',
    '/noticias',
  ];

  const PREFIXOS = ['', '/en', '/es'];

  async function varrer(page: import('@playwright/test').Page) {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    return results.violations;
  }

  for (const prefixo of PREFIXOS) {
    for (const rota of ROTAS) {
      const url = `${prefixo}${rota}` === '' ? '/' : `${prefixo}${rota}`;

      test(`não apresenta violações do axe em ${url} (WCAG 2.2 AA)`, async ({ page }) => {
        await page.goto(url);

        /*
         * As rotas com `searchParams` renderizam sob demanda, e o `<title>`
         * chega pelo stream do `<head>`. Sem esperar por ele, sob carga o axe
         * chega antes e reprova por "documento sem título" — um estado que
         * nenhum visitante alcança. Esperar o título é, de quebra, a garantia
         * de que toda rota tem um.
         */
        await expect(page).toHaveTitle(/.+/);

        expect(await varrer(page)).toEqual([]);
      });
    }
  }

  test('o menu de áreas aberto não apresenta violações do axe', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Áreas do portal' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    expect(await varrer(page)).toEqual([]);
  });

  test('o painel de filtros aberto não apresenta violações do axe', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/programacao');
    await page.getByRole('button', { name: 'Filtrar' }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    expect(await varrer(page)).toEqual([]);
  });
});
