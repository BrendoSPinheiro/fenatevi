import { expect, test } from '@playwright/test';

/**
 * Dois regimes de idioma convivem no portal, e a fronteira precisa ser visível
 * na página, não só no código.
 *
 * A interface é traduzida. O acervo histórico — título, release, ficha técnica,
 * biografia — permanece em pt-BR, marcado com `lang="pt-BR"` e precedido de um
 * aviso traduzido. Traduzir release artístico de terceiros sem revisão humana
 * deturparia o material; marcar o idioma real é o que um leitor de tela precisa.
 */
test.describe('Idioma do acervo', () => {
  test('em inglês, a interface é inglesa e o acervo é marcado como português', async ({ page }) => {
    await page.goto('/en/espetaculos/violeta');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Interface traduzida.
    await expect(page.getByRole('heading', { name: 'About the performance' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Credits' })).toBeVisible();

    // Aviso de idioma, traduzido.
    await expect(
      page.getByText(
        /Archive records .* are kept in their original language, Brazilian Portuguese/,
      ),
    ).toBeVisible();

    // O acervo declara o idioma em que realmente está.
    await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('lang', 'pt-BR');
  });

  test('em espanhol, o mesmo contrato vale', async ({ page }) => {
    await page.goto('/es/espetaculos/violeta');

    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { name: 'Sobre el espectáculo' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveAttribute('lang', 'pt-BR');
  });

  test('em português, o acervo não repete a marcação de idioma', async ({ page }) => {
    await page.goto('/espetaculos/violeta');

    await expect(page.getByRole('heading', { level: 1 })).not.toHaveAttribute('lang', 'pt-BR');
  });

  test('as frentes de programação são traduzidas, porque são interface', async ({ page }) => {
    await page.goto('/en/programacao');

    await expect(page.getByRole('link', { name: /Official Showcase/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Parallel Showcase/ }).first()).toBeVisible();
  });

  test('as datas e os horários seguem o idioma da página', async ({ page }) => {
    /*
     * O português vem primeiro de propósito. Visitar uma rota com prefixo faz o
     * next-intl gravar o idioma escolhido em cookie, e a partir daí a URL sem
     * prefixo passa a servir aquele idioma — que é o comportamento correto do
     * produto, e não um defeito. Medir o pt-BR antes de qualquer troca evita
     * testar a memória do cookie quando o assunto é a formatação.
     */
    await page.goto('/espetaculos/lenda');
    await expect(page.getByText('19h30')).toBeVisible();

    await page.goto('/en/espetaculos/lenda');
    await expect(page.getByText('7:30 PM')).toBeVisible();

    await page.goto('/es/espetaculos/lenda');
    await expect(page.getByText('19:30')).toBeVisible();
  });
});
