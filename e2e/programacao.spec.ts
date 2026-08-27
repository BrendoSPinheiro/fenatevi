import { expect, test, type Page } from '@playwright/test';

/**
 * A contagem de resultados da programação.
 *
 * Ela conta tudo o que a tela apresenta — espetáculos, oficinas e demonstrações
 * de processo criativo —, porque as cinco frentes do festival são reais e vêm
 * de três arquivos diferentes do acervo.
 */
const resultCount = (page: Page) => page.locator('p[aria-live="polite"]');

test.describe('Programação', () => {
  test('um link profundo já chega filtrado', async ({ page }) => {
    await page.goto('/programacao?dia=2024-10-13&frente=mostra-paralela');

    await expect(resultCount(page)).toHaveText('2 atividades');
    await expect(
      page.getByRole('link', { name: 'Calunga — A Princesa Que Virou Boneca', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'A Metamorfose', exact: true })).toBeHidden();
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
    await page.goto(
      '/programacao?dia=2024-99-99&frente=mostra-secreta&espaco=../etc&acessibilidade=telepatia',
    );

    await expect(page.getByRole('heading', { level: 1, name: 'Programação' })).toBeVisible();
    await expect(resultCount(page)).toHaveText('39 atividades');
  });

  test('uma combinação sem resultados explica o vazio e oferece a saída', async ({ page }) => {
    // O lançamento de livros acontece no dia 18; no dia 13 a combinação é vazia.
    await page.goto('/programacao?frente=lancamento&dia=2024-10-13');

    await expect(page.getByText('Nenhuma atividade com estes filtros')).toBeVisible();

    await page.getByRole('link', { name: 'Limpar filtros' }).first().click();

    await expect(page).toHaveURL(/\/programacao$/);
    await expect(resultCount(page)).toHaveText('39 atividades');
  });

  /**
   * A regressão que o redesenho corrigiu: as oficinas e as demonstrações de
   * processo criativo vivem em outros arquivos do acervo, e a listagem que lia
   * só `activities` oferecia as duas frentes como filtros que nunca devolviam
   * nada. Elas eram, até então, telas em branco.
   */
  test('as cinco frentes do festival devolvem conteúdo, e não página em branco', async ({
    page,
  }) => {
    await page.goto('/programacao?frente=oficina');

    await expect(resultCount(page)).toHaveText('2 atividades');
    await expect(
      page.getByRole('link', { name: 'O Corpo Que Habitamos', exact: true }),
    ).toBeVisible();

    await page.goto('/programacao?frente=processo-criativo');

    await expect(page.getByRole('heading', { level: 2, name: 'Processo criativo' })).toBeVisible();
    await expect(page.getByText('Cia Da Ideia — Companhia de Dança — RJ')).toBeVisible();
  });

  test('o recurso de acessibilidade é um filtro da URL', async ({ page }) => {
    await page.goto('/programacao?acessibilidade=signLanguage');

    await expect(resultCount(page)).toHaveText('3 atividades');
    await expect(
      page.getByRole('link', { name: 'O Corpo Que Eu Habito', exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'A Metamorfose', exact: true })).toBeHidden();
  });

  test('um filtro aplicado pode ser retirado sozinho, sem limpar os demais', async ({ page }) => {
    await page.goto('/programacao?dia=2024-10-19&frente=mostra-oficial');

    await page.getByRole('link', { name: /Remover o filtro Dia/ }).click();

    await expect(page).toHaveURL(/\/programacao\?frente=mostra-oficial$/);
    await expect(resultCount(page)).toHaveText('13 atividades');
  });

  test('a tira de dias não leva a um dia que os filtros esvaziaram', async ({ page }) => {
    await page.goto('/programacao?frente=oficina');

    // As oficinas acontecem nos dias 14, 15 e 16 — e só neles.
    await expect(page.getByRole('link', { name: /14/ }).first()).toBeVisible();
    await expect(page.locator('a[href="/programacao?dia=2024-10-13&frente=oficina"]')).toHaveCount(
      0,
    );
  });
});

/**
 * A filtragem é feita com links e com um `<details>` nativo, não com estado de
 * cliente — então ela precisa funcionar com o JavaScript desligado. Este é o
 * teste que prova isso.
 */
test.describe('Programação sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('os filtros continuam funcionando', async ({ page }) => {
    await page.goto('/programacao');

    // O painel é `<details>`: ele abre sem script nenhum.
    await page.getByText('Filtrar programação', { exact: false }).first().click();

    await page
      .getByRole('link', { name: /Teatro Universitário UFES/ })
      .first()
      .click();

    await expect(page).toHaveURL(/espaco=ufes/);
    await expect(page.getByRole('link', { name: 'O Avarento', exact: true })).toBeVisible();
    await expect(resultCount(page)).toHaveText('2 atividades');
  });

  test('a programação inteira está no HTML, sem depender de hidratação', async ({ page }) => {
    await page.goto('/programacao');

    await expect(
      page.getByRole('link', { name: 'A Lenda de Um Homem Sem Nome', exact: true }),
    ).toBeVisible();
    await expect(resultCount(page)).toHaveText('39 atividades');
  });
});
