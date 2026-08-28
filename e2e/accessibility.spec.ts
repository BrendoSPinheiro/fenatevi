import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Acessibilidade', () => {
  test('o skip link é o primeiro elemento focável e leva ao conteúdo', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/#conteudo-principal$/);
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('o skip link, quando em uso, é um alvo de toque de tamanho pleno', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');

    const skip = page.getByRole('link', { name: 'Pular para o conteúdo' });
    await expect(skip).toBeFocused();

    // Oculto até receber foco; a partir dali é um controle como outro qualquer.
    const box = await skip.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  });

  test('permite percorrer o cabeçalho pelo teclado', async ({ page }) => {
    await page.goto('/');

    /*
     * A ordem de tabulação segue a ordem visual do cabeçalho: marca, navegação
     * principal, seletor de idioma e, por último, o acesso às áreas. Nenhum
     * item é alcançado fora de ordem — é o que 2.4.3 exige.
     */
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'FENATEVI', exact: true })).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(
      page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link').first(),
    ).toBeFocused();
  });

  test('o mapa dos espaços tem equivalente textual', async ({ page }) => {
    await page.goto('/espacos');

    /*
     * O mapa é ilustração de uma informação que não depende dele: cada
     * marcador carrega o nome do espaço no nome acessível, a lista ao lado traz
     * o endereço de verdade, e a nota declara a precisão de cada coordenada.
     * Quem não enxerga o mapa não perde nada.
     */
    await expect(
      page.getByText(/Os marcadores seguem o endereço que o programa publica/),
    ).toBeVisible();

    // Atribuição da ODbL: obrigação de licença, não enfeite.
    await expect(page.getByText(/colaboradores do OpenStreetMap/)).toBeVisible();

    await expect(
      page.getByRole('img', { name: 'Mapa de Vitória com os espaços do festival numerados' }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /Casa da Música Sônia Cabral/ }).first(),
    ).toBeVisible();
  });

  /*
   * Como todo o contexto roda com movimento reduzido (ver `playwright.config.ts`),
   * a varredura mede a página em repouso: `respectReducedMotion` não cria
   * nenhuma timeline e a abertura teatral não existe.
   *
   * Isso também encerrou uma intermitência antiga: o axe chegava a medir o CTA no
   * meio da interpolação de opacidade do GSAP, quando o botão mesclado com
   * o fundo caía para 4.39:1. As cores transitórias nunca corresponderam a um
   * estado em que alguém lê o conteúdo — e agora não são mais medidas.
   *
   * A varredura com a cortina no ar vive em `intro.spec.ts`, onde ela é o objeto
   * do teste.
   */
  /**
   * Toda rota do portal, nos três idiomas.
   *
   * A varredura completa é o portão: uma tela nova que passe a violar AA
   * derruba o CI no mesmo commit, e não meses depois.
   */
  const ROTAS = [
    '',
    '/programacao',
    '/programacao?dia=2024-10-19&frente=mostra-oficial',
    '/programacao?frente=oficina',
    '/programacao?frente=processo-criativo',
    '/programacao?acessibilidade=signLanguage',
    '/programacao/grade?visao=espaco&dia=2024-10-13',
    '/programacao/grade?visao=horario&dia=2024-10-19',
    '/programacao/grade?visao=semana',
    '/espetaculos/corpo16',
    '/espetaculos/dona',
    '/oficinas/ws-corpo',
    '/espacos',
    '/espacos/casa',
    '/espacos/estrelas',
    '/memoria',
    '/edicoes/2024',
    '/noticias',
  ];

  const PREFIXOS = ['', '/en', '/es'];

  async function varrer(page: import('@playwright/test').Page) {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    return results.violations;
  }

  for (const prefixo of PREFIXOS) {
    for (const rota of ROTAS) {
      const url = `${prefixo}${rota}` === '' ? '/' : `${prefixo}${rota}`;

      test(`não apresenta violações do axe em ${url} (WCAG 2.2 AA)`, async ({ page }) => {
        await page.goto(url);

        /*
         * As rotas com `searchParams` renderizam sob demanda, e o `<title>`
         * chega pelo stream do `<head>`. Sem esperar por ele, sob carga o axe
         * chega antes e reprova por "documento sem título" — um estado que
         * nenhum visitante alcança. Esperar o título é, de quebra, a garantia
         * de que toda rota tem um.
         */
        await expect(page).toHaveTitle(/.+/);

        expect(await varrer(page)).toEqual([]);
      });
    }
  }

  test('o painel de acessibilidade aberto não apresenta violações do axe', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Acessibilidade/ }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    expect(await varrer(page)).toEqual([]);
  });

  /*
   * O modo de alto contraste é uma promessa de contraste: se ele próprio
   * introduzisse uma violação de cor, seria a pior falha possível desta tela.
   */
  test('a home em alto contraste e texto maior não apresenta violações do axe', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Acessibilidade/ }).click();
    await page.getByRole('button', { name: 'Alto contraste' }).click();
    await page.getByRole('button', { name: 'Texto maior' }).click();
    await page.keyboard.press('Escape');

    await expect(page.locator('html')).toHaveAttribute('data-contrast', 'alto');

    expect(await varrer(page)).toEqual([]);
  });

  test('o painel de filtros aberto não apresenta violações do axe', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    /*
     * O painel abre sozinho quando um dos seus filtros está aplicado — é assim
     * que a tela evita que ele se feche a cada navegação sem guardar estado de
     * cliente. A URL abaixo é, portanto, o painel aberto.
     */
    await page.goto('/programacao?espaco=casa&acessibilidade=signLanguage');
    await expect(page.getByRole('link', { name: /Audiodescrição/ }).first()).toBeVisible();

    expect(await varrer(page)).toEqual([]);
  });
});
