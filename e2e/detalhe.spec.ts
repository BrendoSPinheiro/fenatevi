import { expect, test } from '@playwright/test';

test.describe('Detalhe de espetáculo', () => {
  test('deriva o término da sessão a partir do início e da duração', async ({ page }) => {
    // "O Corpo Que Eu Habito": 19h30, 55 minutos.
    await page.goto('/espetaculos/corpo16');

    await expect(page.getByRole('term').filter({ hasText: 'Término previsto' })).toBeVisible();
    await expect(page.getByText('20h25')).toBeVisible();
  });

  test('a acessibilidade da sessão vem acima da ficha técnica', async ({ page }) => {
    await page.goto('/espetaculos/corpo16');

    const acessibilidade = page.getByRole('heading', { name: 'Acessibilidade desta sessão' });
    const ficha = page.getByRole('heading', { name: 'Ficha técnica' });

    await expect(acessibilidade).toBeVisible();
    await expect(ficha).toBeVisible();

    const yAcessibilidade = (await acessibilidade.boundingBox())?.y ?? 0;
    const yFicha = (await ficha.boundingBox())?.y ?? 0;
    expect(yAcessibilidade).toBeLessThan(yFicha);
  });

  test('a ausência de dado é declarada como ausência', async ({ page }) => {
    // "Dona Rua Gentileza" não declara classificação no programa.
    await page.goto('/espetaculos/dona');

    await expect(page.getByText('Classificação não informada')).toBeVisible();
  });

  test('lista as outras apresentações da mesma companhia', async ({ page }) => {
    await page.goto('/espetaculos/corpo16');

    const outras = page.getByRole('region', { name: 'Outras apresentações desta companhia' });
    await expect(outras.getByRole('link', { name: 'O Corpo Que Eu Habito' })).toBeVisible();
  });

  test('omite a seção quando a companhia só tem esta apresentação', async ({ page }) => {
    await page.goto('/espetaculos/avarento');

    await expect(
      page.getByRole('heading', { name: 'Outras apresentações desta companhia' }),
    ).toBeHidden();
  });

  test('um espetáculo inexistente responde 404', async ({ page }) => {
    const response = await page.goto('/espetaculos/nao-existe');

    expect(response?.status()).toBe(404);
  });
});

test.describe('Detalhe de oficina', () => {
  test('a inscrição é externa, avisada antes, e abre em nova aba', async ({ page }) => {
    await page.goto('/oficinas/ws-corpo');

    await expect(
      page.getByText('A inscrição acontece em um formulário externo ao portal.'),
    ).toBeVisible();

    const cta = page.getByRole('link', { name: /Abrir o formulário de inscrição/ });
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', /noopener/);
    await expect(cta).toHaveAttribute('href', /forms\.gle/);
  });

  test('o portal não apresenta nenhum campo de entrada de dados', async ({ page }) => {
    await page.goto('/oficinas/ws-corpo');

    await expect(page.locator('input, textarea, select')).toHaveCount(0);
  });

  test('a oficina é identificada como ação formativa', async ({ page }) => {
    await page.goto('/oficinas/ws-disso');

    await expect(page.getByText('Ação formativa')).toBeVisible();
    await expect(page.getByText('A partir de 12 anos')).toBeVisible();
    await expect(page.getByText('20 vagas por turma')).toBeVisible();
  });
});

test.describe('Espaços', () => {
  test('o esquema é alcançável pelo teclado, com o nome de cada espaço', async ({ page }) => {
    await page.goto('/espacos');

    const marcador = page
      .getByRole('group', { name: 'Esquema dos espaços do festival na cidade' })
      .getByRole('link', { name: /Praça Costa Pereira/ });

    await marcador.focus();
    await expect(marcador).toBeFocused();

    const box = await marcador.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });

  test('um espaço sem atividades diz isso, e continua navegável', async ({ page }) => {
    // O Teatro Estrelas recebe apenas oficinas, que não são atividades da grade.
    await page.goto('/espacos/estrelas');

    await expect(page.getByRole('heading', { level: 1, name: 'Teatro Estrelas' })).toBeVisible();
    await expect(page.getByText('Este espaço não recebe atividades nesta edição.')).toBeVisible();
  });

  test('uma sala declara o espaço que a abriga', async ({ page }) => {
    await page.goto('/espacos/milson');

    await expect(page.getByRole('link', { name: 'Casa da Música Sônia Cabral' })).toBeVisible();
  });
});
