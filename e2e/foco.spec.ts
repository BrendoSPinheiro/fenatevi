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

/**
 * O painel de filtros da programação é um `<details>` nativo, e não um diálogo.
 *
 * A troca é deliberada: escolher um espaço não precisa interromper a leitura
 * nem prender o foco, e o elemento nativo abre pelo teclado, anuncia o próprio
 * estado e funciona **sem JavaScript** — o que um painel montado em React só
 * consegue depois da hidratação.
 */
test.describe('Painel de filtros da programação', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('abre pelo teclado e revela os filtros que estavam recolhidos', async ({ page }) => {
    await page.goto('/programacao');

    const espaco = page.getByRole('link', { name: /Teatro Universitário UFES/ }).first();
    await expect(espaco).toBeHidden();

    const abrir = page.getByText('Filtrar programação', { exact: false }).first();
    await abrir.focus();
    await page.keyboard.press('Enter');

    await expect(espaco).toBeVisible();
  });

  test('já vem aberto quando um dos seus filtros está aplicado', async ({ page }) => {
    await page.goto('/programacao?espaco=ufes');

    await expect(
      page.getByRole('link', { name: /Teatro Universitário UFES/ }).first(),
    ).toBeVisible();
  });
});
