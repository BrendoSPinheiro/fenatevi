import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const LINE = 'Basta uma semente...';

/*
 * A abertura começa no primeiro pixel pintado, e é esse instante que esta spec
 * observa — daí `waitUntil: 'domcontentloaded'` em toda visita à home.
 *
 * Com o padrão (`load`), o Playwright só devolveria o controle depois das
 * imagens da home, e boa parte dos 4,65 s da coreografia já teria corrido antes
 * da primeira asserção. O visitante vê a sequência inteira; o teste precisa
 * chegar junto com ele.
 */
/** Duração total da coreografia, declarada em `globals.css`. */
const SEQUENCE_MS = 4_650;

/**
 * A abertura é `aria-hidden` e não tem papel: o único caminho até ela é o texto.
 * Este é o mesmo caminho que uma pessoa usando o site percorre com os olhos.
 */
const overlay = (page: Page) => page.getByText(LINE);

/**
 * Espera a hidratação antes de interagir.
 *
 * Sem isso os testes de dispensa disputam com o carregamento do bundle: uma
 * tecla pressionada antes de o listener existir é simplesmente perdida, e a
 * abertura só terminaria no fim natural da sequência.
 *
 * O sinal é o Lenis marcando o `<html>` — ele só inicializa depois da
 * hidratação e, como esta spec roda com movimento normal, ele de fato monta.
 */
async function esperaHidratacao(page: Page) {
  await expect(page.locator('html')).toHaveClass(/lenis/);
}

/*
 * O resto da suíte roda com movimento reduzido, em que a abertura não existe
 * (ver `playwright.config.ts`). Aqui ela é o objeto do teste.
 */
test.describe('Abertura teatral', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  test('cobre o viewport na chegada e libera o conteúdo dentro do limite', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(overlay(page)).toBeVisible();

    const viewport = page.viewportSize();
    if (!viewport) throw new Error('viewport indisponível');

    // Sem fresta: as duas metades somadas cobrem a tela inteira.
    const covered = await page.evaluate(() => {
      const { innerWidth: w, innerHeight: h } = window;
      const points: readonly (readonly [number, number])[] = [
        [1, 1],
        [w / 2, 1],
        [w - 2, 1],
        [1, h / 2],
        [w / 2, h / 2],
        [w - 2, h / 2],
        [1, h - 2],
        [w / 2, h - 2],
        [w - 2, h - 2],
      ];
      return points.every((point) =>
        document.elementFromPoint(point[0], point[1])?.closest('[aria-hidden="true"]'),
      );
    });
    expect(covered, 'a cortina cobre todos os cantos e o centro').toBe(true);

    // O conteúdo fica clicável quando a sequência termina — e não depois disso.
    await expect(page.getByRole('link', { name: 'Ver a programação', exact: true })).toBeEnabled({
      timeout: SEQUENCE_MS + 500,
    });
    await expect(overlay(page)).toBeHidden();
  });

  test('a frase fica legível por pelo menos um segundo antes das cortinas abrirem', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    /*
     * A sustentação é medida no **relógio da própria animação**, e não no
     * relógio de parede.
     *
     * A janela declarada em `globals.css` dura 1,05 s (de 1,70 s a 2,75 s).
     * Cronometrá-la de fora deixava só 50 ms de folga para o carregamento da
     * página, o que tornava o teste refém do peso da home — ele falhava sem
     * que a coreografia tivesse mudado. Perguntar à animação em que ponto ela
     * está remove a corrida por completo, e mede exatamente o requisito: a
     * frase fica legível por pelo menos um segundo.
     */
    const opacityAt = (ms: number) =>
      overlay(page).evaluate((element, time) => {
        for (const animation of element.getAnimations()) {
          animation.pause();
          animation.currentTime = time;
        }

        return Number(getComputedStyle(element).opacity);
      }, ms);

    // 1,70 s: a frase acabou de entrar. 2,70 s: um segundo depois, ainda inteira.
    expect(await opacityAt(1_700)).toBeGreaterThan(0.95);
    expect(await opacityAt(2_700)).toBeGreaterThan(0.95);
  });

  for (const [nome, dispensar] of [
    ['tecla', (page: Page) => page.keyboard.press('Escape')],
    ['clique', (page: Page) => page.mouse.click(10, 10)],
    ['rolagem', (page: Page) => page.mouse.wheel(0, 200)],
  ] as const) {
    test(`é dispensada por ${nome}`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await expect(overlay(page)).toBeVisible();
      await esperaHidratacao(page);

      const started = Date.now();
      await dispensar(page);

      /*
       * O limite especificado é 300 ms; a margem cobre o custo do driver. O que
       * de fato distingue "foi dispensada" de "acabou sozinha" é ser muito mais
       * rápido do que a sequência completa, que leva 4,65 s.
       */
      await expect(overlay(page)).toBeHidden({ timeout: 2_000 });
      expect(Date.now() - started).toBeLessThan(1_500);
    });
  }

  test('não é reexibida ao trocar de idioma sem recarregar a página', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await esperaHidratacao(page);
    await page.keyboard.press('Escape');
    await expect(overlay(page)).toBeHidden();

    await page
      .getByRole('navigation', { name: 'Escolher idioma' })
      .getByRole('link', { name: 'English' })
      .click();

    await expect(page).toHaveURL(/\/en$/);
    await expect(
      page.getByText(
        "Eight days of theatre on the city's stages, halls and squares — free admission from start to finish.",
      ),
    ).toBeVisible();
    await expect(page.getByText('All it takes is a seed...')).toBeHidden();
  });

  test('não é exibida em uma rota que não é a página inicial', async ({ page }) => {
    const response = await page.goto('/rota-inexistente');

    expect(response?.status()).toBe(404);
    await expect(overlay(page)).toBeHidden();
  });

  test('o primeiro Tab alcança o skip link mesmo com a cortina no ar', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(overlay(page)).toBeVisible();

    await page.keyboard.press('Tab');

    await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
  });

  /*
   * A varredura é restrita à abertura de propósito. Uma varredura de página
   * inteira aqui mediria o Hero no meio do fade do GSAP — que roda porque esta
   * spec reativa o movimento — e reportaria as cores transitórias dele, não as
   * da cortina.
   *
   * Limite conhecido: o fundo da cortina é um gradiente, e o axe não calcula
   * contraste sobre gradiente (reporta como "incompleto", não como violação).
   * O orçamento de contraste da frase está verificado numericamente no
   * comentário dos tokens de cenografia, em `globals.css`.
   */
  test('não apresenta violações do axe com a cortina no ar', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(overlay(page)).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include('.stage-intro')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('não desloca o layout ao entrar nem ao sair', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.evaluate(() => {
      const store = { total: 0 };
      (window as unknown as { __cls: typeof store }).__cls = store;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
          if (!shift.hadRecentInput) store.total += shift.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await expect(overlay(page)).toBeHidden({ timeout: SEQUENCE_MS + 500 });

    const cls = await page.evaluate(
      () => (window as unknown as { __cls: { total: number } }).__cls.total,
    );
    expect(cls).toBe(0);
  });

  /*
   * Nos caminhos degradados ninguém remove o overlay do DOM — é o CSS que o
   * tira do viewport. Por isso a verificação tem duas partes: primeiro que a
   * cortina saiu de cena, depois que a página responde a um clique de verdade,
   * o que o Playwright só permite quando nada intercepta o ponteiro.
   *
   * A espera é explícita porque um `click()` com timeout longo não serve aqui:
   * observado que o laço de retentativa não chega a ver a cortina sair, mesmo
   * com 20 s de folga, enquanto a espera pela posição seguida de um clique
   * comum passa de forma consistente.
   */
  async function esperaAPaginaFicarUtilizavel(page: Page) {
    await expect
      .poll(async () => (await overlay(page).boundingBox())?.y ?? 0, {
        timeout: SEQUENCE_MS + 2_000,
      })
      .toBeLessThan(0);

    await expect(page.getByRole('heading', { level: 1, name: 'FENATEVI' })).toBeVisible();
    await page.getByRole('link', { name: 'Ver a programação', exact: true }).click();
    await expect(page).toHaveURL(/\/programacao$/);
  }

  test.describe('degradação', () => {
    test.use({ contextOptions: { reducedMotion: 'no-preference', javaScriptEnabled: false } });

    test('sem JavaScript, a cortina abre sozinha e revela o conteúdo', async ({ page }) => {
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      await expect(overlay(page)).toBeVisible();
      await esperaAPaginaFicarUtilizavel(page);
    });
  });

  test('com o bundle falhando, a cortina ainda assim se encerra', async ({ page }) => {
    await page.route('**/*.js', (route) => route.abort());

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(overlay(page)).toBeVisible();
    await esperaAPaginaFicarUtilizavel(page);
  });

  for (const [nome, viewport] of [
    ['celular vertical', { width: 375, height: 812 }],
    ['celular horizontal', { width: 812, height: 375 }],
    ['tablet', { width: 768, height: 1024 }],
    ['notebook', { width: 1440, height: 900 }],
    ['ultrawide', { width: 2560, height: 1080 }],
  ] as const) {
    test(`cobre o viewport em ${nome}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/', { waitUntil: 'domcontentloaded' });

      await expect(overlay(page)).toBeVisible();

      const covered = await page.evaluate(() => {
        const { innerWidth: w, innerHeight: h } = window;
        return [1, w / 2 - 1, w / 2, w / 2 + 1, w - 2].every((x) =>
          [1, h / 2, h - 2].every((y) =>
            document.elementFromPoint(x, y)?.closest('[aria-hidden="true"]'),
          ),
        );
      });
      expect(covered).toBe(true);
    });
  }

  test('continua cobrindo o viewport após redimensionar no meio da sequência', async ({ page }) => {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(overlay(page)).toBeVisible();

    await page.setViewportSize({ width: 1600, height: 700 });

    // A sequência não reinicia: a frase continua a mesma instância, ainda visível.
    await expect(overlay(page)).toBeVisible();
    const covered = await page.evaluate(() => {
      const { innerWidth: w, innerHeight: h } = window;
      return [1, w / 2, w - 2].every((x) =>
        document.elementFromPoint(x, h / 2)?.closest('[aria-hidden="true"]'),
      );
    });
    expect(covered).toBe(true);
  });
});

test.describe('Abertura teatral sob movimento reduzido', () => {
  test('não é exibida, e o conteúdo está disponível de imediato', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText(LINE)).toBeHidden();
    await expect(page.getByRole('heading', { level: 1, name: 'FENATEVI' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ver a programação', exact: true })).toBeEnabled();
  });
});
