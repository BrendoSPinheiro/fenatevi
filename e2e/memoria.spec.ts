import { expect, test } from '@playwright/test';

test.describe('Memória', () => {
  test('o estado do acervo de cada edição é texto, não só cor', async ({ page }) => {
    await page.goto('/memoria');

    await expect(page.getByText('Edição vigente')).toBeVisible();
    await expect(page.getByText('Acervo completo')).toBeVisible();
    await expect(page.getByText('Acervo pendente')).toBeVisible();
    await expect(page.getByText('Em digitalização')).toBeVisible();
  });

  test('o indicador de completude tem equivalente textual', async ({ page }) => {
    await page.goto('/memoria');

    await expect(page.getByText('Acervo 100% completo')).toBeVisible();
    await expect(page.getByText('Acervo 18% completo')).toBeVisible();
  });

  test('só a edição com acervo completo leva a uma página de edição', async ({ page }) => {
    await page.goto('/memoria');

    await expect(page.getByRole('link', { name: 'Explorar esta edição' })).toHaveCount(1);

    // As edições sem página dizem isso, em vez de oferecer um link quebrado.
    await expect(page.getByText('Esta edição ainda não tem página própria no portal.')).toHaveCount(
      2,
    );

    await expect(page.getByRole('link', { name: /edicoes\/2025/ })).toHaveCount(0);
  });

  test('a edição com acervo completo abre a página da edição', async ({ page }) => {
    await page.goto('/memoria');

    await page.getByRole('link', { name: 'Explorar esta edição' }).click();

    await expect(page).toHaveURL(/\/edicoes\/2024$/);
    await expect(page.getByRole('heading', { level: 1, name: '2024' })).toBeVisible();
  });
});

test.describe('Edição 2024', () => {
  test('apresenta a identidade e o resumo numérico derivado do acervo', async ({ page }) => {
    await page.goto('/edicoes/2024');

    await expect(page.getByText('Acervo · edição encerrada')).toBeVisible();
    await expect(page.getByText('20ª edição · de 13 de outubro a 20 de outubro')).toBeVisible();
    await expect(page.getByText('A arte cura!')).toBeVisible();
  });

  test('nomeia as duas mostras como listas distintas', async ({ page }) => {
    await page.goto('/edicoes/2024');

    await expect(page.getByRole('heading', { level: 2, name: 'Mostra Oficial' })).toBeVisible();
    // Nome próprio da mostra paralela desta edição — não traduzido.
    await expect(
      page.getByRole('heading', { level: 2, name: '7ª Mostra Paralela Vera Viana' }),
    ).toBeVisible();
  });

  test('traz homenageados, livros, processos criativos e ficha técnica', async ({ page }) => {
    await page.goto('/edicoes/2024');

    await expect(page.getByText('Bere (Luiz Carlos Siqueira)')).toBeVisible();
    await expect(page.getByText('Melhor Manter o Escuro Aceso')).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: 'Processos criativos por dia' }),
    ).toBeVisible();
    await expect(page.getByText('Elenice Moreira')).toBeVisible();
  });

  test('uma edição sem acervo completo não tem página', async ({ page }) => {
    const response = await page.goto('/edicoes/2025');

    expect(response?.status()).toBe(404);
  });
});

test.describe('Notícias', () => {
  test('declara que ainda não há notícias, sem manchete nem data fictícias', async ({ page }) => {
    await page.goto('/noticias');

    await expect(page.getByText('Ainda não há notícias publicadas')).toBeVisible();

    // Nenhum "slot editorial" do protótipo sobrevive como conteúdo.
    await expect(page.getByText(/Espaço reservado para/)).toHaveCount(0);
    await expect(page.locator('time')).toHaveCount(0);
  });
});
