import { expect, test } from '@playwright/test';

test.describe('Página inicial', () => {
  test('exibe o conteúdo em português no idioma padrão, sem prefixo na URL', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { level: 1, name: 'FENATEVI' })).toBeVisible();
    await expect(page.getByText('Uma nova experiência está sendo preparada.')).toBeVisible();
    await expect(page.getByText('Basta uma semente...')).toBeVisible();
  });

  test('formata as datas do festival no idioma corrente', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('De 11 de setembro a 20 de setembro de 2026')).toBeVisible();

    await page.goto('/en');
    await expect(page.getByText('From September 11 to September 20, 2026')).toBeVisible();
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
});
