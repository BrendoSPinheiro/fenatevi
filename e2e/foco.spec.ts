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
  test('o painel de acessibilidade prende o foco, fecha por Escape e o devolve', async ({
    page,
  }) => {
    await page.goto('/');

    const abrir = page.getByRole('button', { name: /Acessibilidade/ });
    await abrir.click();

    const dialogo = page.getByRole('dialog', { name: 'Acessibilidade' });
    await expect(dialogo).toBeVisible();

    // O foco entrou no diálogo.
    await expect(page.getByRole('button', { name: 'Fechar' })).toBeFocused();

    // Tabulando até o fim, o ciclo reentra pelo primeiro elemento.
    const focaveis = await dialogo.locator('a[href], button').count();
    for (let i = 0; i < focaveis; i += 1) {
      await page.keyboard.press('Tab');
    }
    await expect(page.getByRole('button', { name: 'Fechar' })).toBeFocused();

    await page.keyboard.press('Escape');

    await expect(dialogo).toBeHidden();
    await expect(abrir).toBeFocused();
  });

  /*
   * O controle existia no protótipo como "estado de demonstração", anunciando
   * quatro funcionalidades — uma delas Libras — que não estavam implementadas.
   * Agora ele existe de verdade, e estes testes são o contrato: **cada opção
   * oferecida precisa mudar alguma coisa**, e Libras continua de fora porque
   * continua não sendo entregável.
   */
  test('cada preferência de acessibilidade muda o documento e sobrevive ao recarregamento', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Acessibilidade/ }).click();

    await page.getByRole('button', { name: 'Alto contraste' }).click();
    await page.getByRole('button', { name: 'Texto maior' }).click();
    await page.getByRole('button', { name: 'Reduzir movimento' }).click();

    const raiz = page.locator('html');
    await expect(raiz).toHaveAttribute('data-contrast', 'alto');
    await expect(raiz).toHaveAttribute('data-text-size', 'grande');
    await expect(raiz).toHaveAttribute('data-motion', 'reduzido');

    // O texto maior é medida, não rótulo: a base do documento sobe de fato.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe(
      '18px',
    );

    await page.reload();
    await expect(raiz).toHaveAttribute('data-contrast', 'alto');
    await expect(raiz).toHaveAttribute('data-text-size', 'grande');
    await expect(raiz).toHaveAttribute('data-motion', 'reduzido');

    // E dá para voltar atrás.
    await page.getByRole('button', { name: /Acessibilidade/ }).click();
    await page.getByRole('button', { name: 'Restaurar as preferências padrão' }).click();
    await expect(raiz).not.toHaveAttribute('data-contrast', /.*/);
  });

  test('o painel não anuncia Libras como uma preferência do portal', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Acessibilidade/ }).click();

    const dialogo = page.getByRole('dialog', { name: 'Acessibilidade' });

    // Libras não é ajuste do portal: é recurso de sessões, e o painel leva até elas.
    await expect(dialogo.getByRole('button', { name: /Libras/ })).toHaveCount(0);
    await expect(dialogo.getByRole('link', { name: /sessões com Libras/i })).toBeVisible();
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
