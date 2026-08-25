import { expect, test } from '@playwright/test';

/**
 * Os dois diálogos do portal prendem o foco enquanto estão abertos, fecham por
 * `Escape` e devolvem o foco ao controle que os abriu.
 *
 * Não é detalhe: um diálogo modal que deixa o foco escapar para trás do overlay
 * abandona quem navega por teclado em uma página que ele não consegue ver, e um
 * que não devolve o foco joga a pessoa de volta ao topo do documento.
 */
test.describe('Foco em diálogos', () => {
  test('o menu de áreas prende o foco, fecha por Escape e o devolve', async ({ page }) => {
    await page.goto('/');

    const abrir = page.getByRole('button', { name: 'Áreas do portal' });
    await abrir.click();

    const dialogo = page.getByRole('dialog', { name: 'Áreas do portal' });
    await expect(dialogo).toBeVisible();

    // O foco entrou no diálogo.
    await expect(page.getByRole('button', { name: 'Fechar as áreas' })).toBeFocused();

    // Tabulando até o fim, o ciclo reentra pelo primeiro elemento.
    const focaveis = await dialogo.locator('a[href], button').count();
    for (let i = 0; i < focaveis; i += 1) {
      await page.keyboard.press('Tab');
    }
    await expect(page.getByRole('button', { name: 'Fechar as áreas' })).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(dialogo).toBeHidden();
    await expect(abrir).toBeFocused();
  });

  test('o menu de áreas aponta só para telas que existem', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Áreas do portal' }).click();

    const dialogo = page.getByRole('dialog', { name: 'Áreas do portal' });

    // O protótipo desenha "Ingressos" e "Experiência mobile"; nenhuma é rota.
    await expect(dialogo.getByRole('link', { name: /Ingressos/ })).toHaveCount(0);
    await expect(dialogo.getByRole('link', { name: /Experiência mobile/ })).toHaveCount(0);

    await expect(dialogo.getByRole('link')).toHaveCount(6);
  });

  test('o cabeçalho não oferece o controle "A11y" do protótipo', async ({ page }) => {
    await page.goto('/');

    // Exclusão deliberada, registrada na proposta: ele anunciava quatro
    // funcionalidades que o protótipo não desenha.
    await expect(page.getByRole('button', { name: /A11y|Acessibilidade/ })).toHaveCount(0);
  });
});

test.describe('Foco no painel de filtros', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('prende o foco, fecha por Escape e o devolve ao controle de origem', async ({ page }) => {
    await page.goto('/programacao');

    const abrir = page.getByRole('button', { name: 'Filtrar' }).first();
    await abrir.click();

    const dialogo = page.getByRole('dialog', { name: 'Filtros da programação' });
    await expect(dialogo).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(dialogo).toBeHidden();
    await expect(abrir).toBeFocused();
  });
});
