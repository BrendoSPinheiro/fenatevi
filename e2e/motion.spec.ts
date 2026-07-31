import { expect, test } from '@playwright/test';

test.describe('Movimento reduzido', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  test('entrega o conteúdo completo sem depender de animação', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: 'FENATEVI' })).toBeVisible();
    await expect(page.getByText('Uma nova experiência está sendo preparada.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Conhecer o festival' })).toBeVisible();
  });

  test('o CTA leva à seção "Sobre o festival" mesmo sem smooth scroll', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Conhecer o festival' }).click();

    await expect(page).toHaveURL(/#sobre$/);
    await expect(
      page.getByRole('heading', { level: 2, name: 'Sobre o festival' }),
    ).toBeInViewport();
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
