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

  /*
   * A varredura roda com movimento reduzido — cenário suportado pelo site, em que
   * `respectReducedMotion` não cria nenhuma timeline.
   *
   * Com a animação de entrada ativa, o axe podia medir a página no meio da
   * interpolação de opacidade dos `[data-animate="hero-item"]`: o CTA `bg-accent`
   * mesclado com o fundo chegava a #947133 (4.39:1) e a regra `color-contrast`
   * falhava de forma intermitente. Esperar o fim da animação não resolveria de
   * verdade — antes de o GSAP aplicar o estado inicial, os elementos já estão no
   * estado final, e a espera passaria cedo demais.
   *
   * Nada é perdido em cobertura: com ou sem movimento o DOM e as classes são os
   * mesmos, e as cores transitórias não correspondem a nenhum estado em que o
   * usuário lê o conteúdo.
   */
  test.describe('varredura do axe', () => {
    test.use({ contextOptions: { reducedMotion: 'reduce' } });

    test('não apresenta violações detectáveis pelo axe (WCAG 2.2 AA)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
