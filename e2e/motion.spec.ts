import { expect, test } from '@playwright/test';

test.describe('Movimento reduzido', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('entrega o conteúdo completo sem depender de animação', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'FENATEVI' })).toBeVisible();
    await expect(
      page.getByText(
        'Oito dias de teatro nos palcos, nas salas e nas praças da cidade — de entrada franca, do começo ao fim.',
      ),
    ).toBeVisible();

    /*
     * A revelação por rolagem parte do estado visível: sob movimento reduzido
     * ela não acontece, e todos os atos precisam estar completos mesmo assim.
     */
    await expect(
      page.getByRole('heading', { level: 2, name: 'Os dias do festival' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Realização e parceiros' }),
    ).toBeVisible();
  });

  test('o CTA da abertura leva à programação mesmo sem smooth scroll', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Ver a programação', exact: true }).click();

    await expect(page).toHaveURL(/\/programacao$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Programação' })).toBeVisible();
  });

  test('o botão "Voltar ao topo" funciona sem o Lenis inicializado', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Voltar ao topo' }).scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Voltar ao topo' }).click();

    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 5_000 })
      .toBeLessThan(20);
  });
});
