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

  test('permite percorrer o cabeçalho pelo teclado', async ({ page }) => {
    await page.goto('/');

    // skip link → marca do festival → seletor de idioma (3 idiomas)
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'FENATEVI', exact: true })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: /Português/ })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'English' })).toBeFocused();
  });

  test('a experiência 3D tem alternativa textual', async ({ page }) => {
    await page.goto('/');

    // A cena é exposta como imagem com descrição textual, e não como área vazia.
    await expect(
      page.getByRole('img', {
        name: 'Composição abstrata em movimento lento, evocando um refletor sobre o palco.',
      }),
    ).toBeVisible();
  });

  test('não apresenta violações detectáveis pelo axe (WCAG 2.2 AA)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
