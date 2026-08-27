import { expect, test } from '@playwright/test';

/**
 * O portal em 375px de largura — o aparelho mais estreito que ainda importa.
 *
 * Dois requisitos valem em **toda** rota: o documento não rola na horizontal, e
 * todo alvo de toque tem ao menos 44×44px (WCAG 2.2 — 2.5.8). Ambos falham de
 * forma silenciosa: ninguém abre um chamado dizendo "o botão tem 38px".
 */
const ROTAS = [
  '/',
  '/programacao',
  '/programacao?dia=2024-10-19',
  '/programacao/grade?visao=espaco&dia=2024-10-13',
  '/programacao/grade?visao=horario&dia=2024-10-19',
  '/programacao/grade?visao=semana',
  '/espetaculos/corpo16',
  '/oficinas/ws-corpo',
  '/espacos',
  '/espacos/casa',
  '/memoria',
  '/memoria?linha=trilho',
  '/edicoes/2024',
  '/noticias',
];

test.describe('Experiência em tela estreita', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  for (const rota of ROTAS) {
    test(`${rota} não produz rolagem horizontal do documento`, async ({ page }) => {
      await page.goto(rota);

      const scrolledX = await page.evaluate(() => {
        window.scrollTo(500, 0);
        return window.scrollX;
      });

      expect(scrolledX).toBe(0);
    });
  }

  test('todo alvo de toque tem ao menos 44×44px', async ({ page }) => {
    const pequenos: string[] = [];

    for (const rota of ROTAS) {
      await page.goto(rota);

      const alvos = await page.locator('a[href], button').all();

      for (const alvo of alvos) {
        if (!(await alvo.isVisible())) {
          continue;
        }

        const box = await alvo.boundingBox();

        if (box === null) {
          continue;
        }

        /*
         * Exceção do próprio critério 2.5.8: um alvo "em linha", dentro de um
         * bloco de texto, não precisa de 44px — aumentá-lo quebraria a
         * entrelinha da prosa. `display: inline` é exatamente o que distingue
         * um link no meio de uma frase de um controle da interface.
         */
        if ((await alvo.evaluate((el) => getComputedStyle(el).display)) === 'inline') {
          continue;
        }

        /*
         * O skip link é visualmente oculto até receber foco — não é um alvo de
         * toque enquanto ninguém pode tocá-lo. O tamanho dele quando está em
         * uso é verificado em `accessibility.spec.ts`, onde ele é focado de
         * verdade. `clip-path` é a marca do idioma "visualmente oculto".
         */
        const oculto = await alvo.evaluate((el) => getComputedStyle(el).clipPath !== 'none');

        if (oculto) {
          continue;
        }

        if (box.width < 44 || box.height < 44) {
          const texto = (await alvo.textContent())?.trim().slice(0, 40) ?? '';
          pequenos.push(`${rota} — "${texto}" ${Math.round(box.width)}×${Math.round(box.height)}`);
        }
      }
    }

    expect(pequenos).toEqual([]);
  });

  test('a navegação inferior fica sempre ao alcance', async ({ page }) => {
    await page.goto('/programacao');

    const nav = page.getByRole('navigation', { name: 'Navegação rápida' });
    await expect(nav).toBeInViewport();

    await page.mouse.wheel(0, 4_000);
    await expect(nav).toBeInViewport();

    await expect(nav.getByRole('link')).toHaveCount(4);
  });
});
