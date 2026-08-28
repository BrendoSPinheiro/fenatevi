import { expect, test } from '@playwright/test';

test.describe('Página inicial', () => {
  test('exibe o conteúdo em português no idioma padrão, sem prefixo na URL', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { level: 1, name: 'FENATEVI' })).toBeVisible();
    await expect(
      page.getByText(
        'Oito dias de teatro nos palcos, nas salas e nas praças da cidade — de entrada franca, do começo ao fim.',
      ),
    ).toBeVisible();
  });

  test('formata as datas do festival no idioma corrente', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('De 13 de outubro a 20 de outubro de 2024')).toBeVisible();

    await page.goto('/en');
    await expect(page.getByText('From October 13 to October 20, 2024')).toBeVisible();
  });

  test('tem uma única região main com o conteúdo principal', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('main')).toHaveCount(1);
  });

  test('não registra erros no console', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });

  /*
   * O cabeçalho é transparente no topo e ganha corpo ao rolar. A polaridade
   * importa: o estado **padrão**, sem atributo, é o opaco — é o que sai do
   * servidor e o que fica se o JavaScript não carregar. A transparência é
   * enriquecimento, e um bundle que falha não pode deixar o cabeçalho invisível
   * por cima da fotografia.
   */
  test('o cabeçalho fica sem moldura no topo e ganha corpo ao rolar', async ({ page }) => {
    await page.goto('/');

    const cabecalho = page.locator('.site-header');
    const fundo = () => cabecalho.evaluate((el) => getComputedStyle(el).backgroundColor);
    const borda = () => cabecalho.evaluate((el) => getComputedStyle(el).borderBottomColor);

    /*
     * As asserções esperam em vez de ler uma vez só: fundo e filete entram por
     * transição de 240ms, e uma leitura única pegaria o meio dela.
     */
    await expect(page.locator('html')).toHaveAttribute('data-header-condensed', 'false');
    await expect.poll(fundo).toBe('rgba(0, 0, 0, 0)');
    await expect.poll(borda).toBe('rgba(0, 0, 0, 0)');

    await page.evaluate(() => window.scrollTo(0, 400));
    await expect(page.locator('html')).toHaveAttribute('data-header-condensed', 'true');

    await expect.poll(fundo).not.toBe('rgba(0, 0, 0, 0)');
    await expect.poll(borda).not.toBe('rgba(0, 0, 0, 0)');
  });

  /* A fotografia da abertura passa por baixo do cabeçalho transparente. */
  test('a abertura começa debaixo do cabeçalho', async ({ page }) => {
    await page.goto('/');

    const topoDaAbertura = await page
      .locator('section[aria-labelledby="abertura"]')
      .evaluate((el) => el.getBoundingClientRect().top);

    expect(topoDaAbertura).toBeLessThanOrEqual(0);
  });
});
