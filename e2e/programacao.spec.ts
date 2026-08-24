import { expect, test, type Page } from '@playwright/test';

/**
 * A contagem de resultados da programação.
 *
 * O mesmo número aparece também no controle do painel mobile, que fica oculto
 * no desktop — mirar a região `aria-live` evita casar com o elemento invisível
 * e, de quebra, verifica que é ela quem anuncia a mudança.
 */
const resultCount = (page: Page) => page.locator('p[aria-live="polite"]');

test.describe('Programação', () => {
  test('um link profundo já chega filtrado', async ({ page }) => {
    await page.goto('/programacao?dia=2024-10-13&frente=mostra-paralela');

    await expect(resultCount(page)).toHaveText('2 atividades');
    await expect(
      page.getByRole('link', { name: 'Calunga — A Princesa Que Virou Boneca' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'A Metamorfose' })).toBeHidden();
  });

  test('o filtro escolhido vira URL, e a URL é compartilhável', async ({ page }) => {
    await page.goto('/programacao');

    await page
      .getByRole('link', { name: /Mostra Oficial/ })
      .first()
      .click();

    await expect(page).toHaveURL(/frente=mostra-oficial/);

    // A mesma URL, aberta do zero, produz o mesmo recorte.
    await page.goto(page.url());
    await expect(resultCount(page)).toHaveText('13 atividades');
  });

  test('um filtro inválido é ignorado, não quebra a página', async ({ page }) => {
    await page.goto('/programacao?dia=2024-99-99&frente=mostra-secreta&espaco=../etc');

    await expect(page.getByRole('heading', { level: 1, name: 'Programação' })).toBeVisible();
    await expect(resultCount(page)).toHaveText('20 atividades');
  });

  test('uma combinação sem resultados explica o vazio e oferece a saída', async ({ page }) => {
    await page.goto('/programacao?frente=oficina');

    await expect(page.getByText('Nenhuma atividade com estes filtros')).toBeVisible();

    await page.getByRole('link', { name: 'Limpar filtros' }).first().click();

    await expect(page).toHaveURL(/\/programacao$/);
    await expect(resultCount(page)).toHaveText('20 atividades');
  });

  test('os processos criativos são declarados como "após a sessão"', async ({ page }) => {
    await page.goto('/programacao?dia=2024-10-16');

    await expect(page.getByText('Após a sessão')).toBeVisible();
    await expect(page.getByText('Cia Da Ideia — Companhia de Dança — RJ')).toBeVisible();
  });
});

/**
 * A filtragem é feita com links, não com estado de cliente — então ela precisa
 * funcionar com o JavaScript desligado. Este é o teste que prova isso.
 */
test.describe('Programação sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('os filtros continuam funcionando', async ({ page }) => {
    await page.goto('/programacao');

    await page
      .getByRole('link', { name: /Teatro Universitário UFES/ })
      .first()
      .click();

    await expect(page).toHaveURL(/espaco=ufes/);
    await expect(page.getByRole('link', { name: 'O Avarento' })).toBeVisible();
    await expect(resultCount(page)).toHaveText('1 atividade');
  });

  test('a programação inteira está no HTML, sem depender de hidratação', async ({ page }) => {
    await page.goto('/programacao');

    await expect(page.getByRole('link', { name: 'A Lenda de Um Homem Sem Nome' })).toBeVisible();
    await expect(resultCount(page)).toHaveText('20 atividades');
  });
});
