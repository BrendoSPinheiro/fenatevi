import { expect, test } from '@playwright/test';

test.describe('Grade diária', () => {
  test('a troca de visão preserva o dia selecionado', async ({ page }) => {
    await page.goto('/programacao/grade?visao=espaco&dia=2024-10-17');

    await page.getByRole('link', { name: /Por horário/ }).click();

    await expect(page).toHaveURL(/visao=horario&dia=2024-10-17/);
    await expect(page.getByRole('link', { name: 'A Charanga dos Proscritos' })).toBeVisible();
  });

  test('um espaço sem programação no dia é declarado, não sumido', async ({ page }) => {
    await page.goto('/programacao/grade?visao=espaco&dia=2024-10-16');

    // Todos os sete espaços aparecem, mesmo os que não recebem nada no dia.
    await expect(page.getByRole('heading', { name: 'Teatro Estrelas' })).toBeVisible();
    await expect(
      page.getByText('Este espaço não recebe atividades neste dia.').first(),
    ).toBeVisible();
  });

  test('a visão por horário agrupa o que acontece ao mesmo tempo', async ({ page }) => {
    await page.goto('/programacao/grade?visao=horario&dia=2024-10-19');

    await expect(page.getByRole('heading', { level: 2, name: '19h30' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'A Metamorfose' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'O Avarento' })).toBeVisible();
  });

  test('a semana inteira é uma tabela com cabeçalhos de linha e de coluna', async ({ page }) => {
    await page.goto('/programacao/grade?visao=semana');

    const table = page.getByRole('table');
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: '13 de out.' })).toBeVisible();
    await expect(
      table.getByRole('rowheader', { name: 'Casa da Música Sônia Cabral' }),
    ).toBeVisible();
  });
});

/**
 * A rolagem horizontal da semana acontece **dentro do container**.
 *
 * O requisito é do projeto inteiro, não só desta tela: em 375px, nenhuma rota
 * pode fazer o documento andar para o lado.
 */
test.describe('Grade em tela estreita', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('a semana rola dentro do container, e o documento não rola na horizontal', async ({
    page,
  }) => {
    await page.goto('/programacao/grade?visao=semana');

    /*
     * A pergunta que importa não é qual `scrollWidth` o documento reporta, e sim
     * se o visitante consegue arrastar a página para o lado. Tentar rolar e
     * verificar que nada se moveu mede exatamente isso.
     */
    const scrolledX = await page.evaluate(() => {
      window.scrollTo(500, 0);
      return window.scrollX;
    });
    expect(scrolledX).toBe(0);

    // O container da tabela é focável pelo teclado, para quem não usa mouse.
    const region = page.getByRole('region', { name: 'Espaços por dia da edição' });
    await expect(region).toHaveAttribute('tabindex', '0');
  });
});
