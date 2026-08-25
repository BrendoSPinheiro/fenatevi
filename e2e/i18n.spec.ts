import { expect, test } from '@playwright/test';

test.describe('Internacionalização', () => {
  test('troca o idioma alterando a URL e o conteúdo', async ({ page }) => {
    await page.goto('/');

    const switcher = page.getByRole('navigation', { name: 'Escolher idioma' });
    await switcher.getByRole('link', { name: 'English' }).click();

    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(
      page.getByText("Nine days of theatre on the city's stages and squares."),
    ).toBeVisible();

    await page
      .getByRole('navigation', { name: 'Choose language' })
      .getByRole('link', { name: 'Español' })
      .click();

    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(
      page.getByText('Nueve días de teatro en los escenarios y plazas de la ciudad.'),
    ).toBeVisible();
  });

  test('voltar ao português devolve o visitante à raiz, sem prefixo', async ({ page }) => {
    await page.goto('/en');

    /*
     * O next-intl monta este link como `/pt-BR` — passar `locale` explicitamente
     * sempre força o prefixo, para que a troca seja registrada. O proxy então
     * normaliza para `/`, que é a URL canônica do idioma padrão. Este teste
     * protege exatamente essa normalização.
     */
    await page
      .getByRole('navigation', { name: 'Choose language' })
      .getByRole('link', { name: 'Português' })
      .click();

    await expect(page).toHaveURL(/:\d+\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(
      page.getByText('Nove dias de teatro nos palcos e nas praças da cidade.'),
    ).toBeVisible();
  });

  test('marca o idioma corrente no seletor', async ({ page }) => {
    await page.goto('/es');

    const current = page
      .getByRole('navigation', { name: 'Elegir idioma' })
      .getByRole('link', { name: /Español/ });

    await expect(current).toHaveAttribute('aria-current', 'page');
  });

  test('serve cada idioma com seu próprio título de página', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Festival Nacional de Teatro de Vitória/);

    await page.goto('/en');
    await expect(page).toHaveTitle(/Vitória National Theatre Festival/);
  });
});
