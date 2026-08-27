import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Memória', () => {
  test('apresenta uma estação por edição, da 1ª à vigente', async ({ page }) => {
    await page.goto('/memoria');

    // Vinte e duas edições, cada uma com o seu próprio cabeçalho de ano.
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(22);
    await expect(page.getByRole('heading', { level: 2, name: '2026' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: '2005' })).toBeVisible();
  });

  test('declara que as edições sem acervo são conteúdo de prévia', async ({ page }) => {
    await page.goto('/memoria');

    await expect(page.getByText('Prévia de layout')).toBeVisible();
    await expect(page.getByText(/fotografias são ilustrativas/)).toBeVisible();
  });

  test('o estado do acervo de cada edição é texto, não só cor', async ({ page }) => {
    await page.goto('/memoria');

    await expect(page.getByText('Edição vigente')).toBeVisible();
    await expect(page.getByText('Acervo completo')).toBeVisible();
    await expect(page.getByText('Acervo pendente')).toBeVisible();
    await expect(page.getByText('Em digitalização').first()).toBeVisible();
  });

  test('o indicador de completude tem equivalente textual', async ({ page }) => {
    await page.goto('/memoria');

    await expect(page.getByText('Acervo 100% completo')).toBeVisible();
    await expect(page.getByText('Acervo 12% completo').first()).toBeVisible();
  });

  test('só a edição com acervo completo leva a uma página de edição', async ({ page }) => {
    await page.goto('/memoria');

    await expect(page.getByRole('link', { name: 'Explorar esta edição' })).toHaveCount(1);

    /*
     * A regra dura, e a que a prévia poderia quebrar sem que nada falhasse:
     * nenhuma estação inventada aponta para uma página de edição.
     */
    const editionLinks = page.locator('main a[href*="/edicoes/"]');
    await expect(editionLinks).toHaveCount(1);
    await expect(editionLinks).toHaveAttribute('href', /\/edicoes\/2024$/);
  });

  test('a edição com acervo completo abre a página da edição', async ({ page }) => {
    await page.goto('/memoria');

    await page.getByRole('link', { name: 'Explorar esta edição' }).click();

    await expect(page).toHaveURL(/\/edicoes\/2024$/);
    await expect(page.getByRole('heading', { level: 1, name: '2024' })).toBeVisible();
  });
});

test.describe('Memória — variante de percurso', () => {
  test('a variante padrão é a espinha, e um valor inventado não quebra a tela', async ({
    page,
  }) => {
    await page.goto('/memoria?linha=carrossel');

    await expect(
      page.getByRole('heading', { level: 1, name: 'Memória do festival' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(22);
    // A espinha é uma lista do documento; o trilho é uma região rolável.
    await expect(page.getByRole('region', { name: 'Linha do tempo das edições' })).toHaveCount(0);
  });

  test('cada estação do trilho é alcançável pelo teclado, e anuncia o seu ano', async ({
    page,
  }) => {
    await page.goto('/memoria?linha=trilho');

    await expect(page.getByRole('region', { name: 'Linha do tempo das edições' })).toBeVisible();

    /*
     * Dezenove das vinte e duas estações não têm link nenhum: sem foco no
     * próprio painel, o seu conteúdo rolável ficaria inalcançável sem mouse.
     */
    const station2005 = page.getByRole('article', { name: '2005' });
    await expect(station2005).toHaveAttribute('tabindex', '0');
    await expect(page.getByRole('article')).toHaveCount(22);
  });

  test('o trilho contém a própria rolagem em 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });

    /*
     * A comparação é entre as duas variantes, e não com a largura do viewport,
     * porque o cabeçalho do portal já vaza alguns pixels em 320px em **todas**
     * as telas — um defeito próprio, anterior a esta mudança. O que se mede
     * aqui é o que o trilho acrescenta: nada. Ver `docs/riscos-conhecidos.md`.
     */
    const widthOf = async (linha: string) => {
      await page.goto(`/memoria?linha=${linha}`);
      return page.evaluate(() => document.documentElement.scrollWidth);
    };

    expect(await widthOf('trilho')).toBe(await widthOf('espinha'));

    // E a tira rola de verdade por dentro, sem levar o documento junto.
    await page.goto('/memoria?linha=trilho');
    const rail = page.getByRole('region', { name: 'Linha do tempo das edições' });
    const contained = await rail.evaluate(
      (el) => el.scrollWidth > el.clientWidth && el.clientWidth <= window.innerWidth,
    );
    expect(contained).toBe(true);
  });

  test('as duas variantes passam no axe', async ({ page }) => {
    for (const linha of ['espinha', 'trilho']) {
      await page.goto(`/memoria?linha=${linha}`);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(results.violations, `variante ${linha}`).toEqual([]);
    }
  });
});

test.describe('Memória — o eixo leva a uma edição', () => {
  test('o eixo é uma navegação com as vinte e duas edições', async ({ page }) => {
    await page.goto('/memoria');

    const eixo = page.getByRole('navigation', { name: 'Ir para uma edição' });
    await expect(eixo).toBeVisible();
    await expect(eixo.getByRole('link')).toHaveCount(22);
  });

  test('o salto leva à edição pedida, e não a um vizinho', async ({ page }) => {
    await page.goto('/memoria');

    await page.getByRole('navigation', { name: 'Ir para uma edição' }).getByText('2012').click();

    await expect(page).toHaveURL(/#edicao-2012$/);

    /*
     * `scroll-mt` é o que separa "chegou" de "chegou debaixo do cabeçalho":
     * sem a folga, o ano de destino aterrissa encoberto e o visitante conclui
     * que o link errou a edição.
     */
    const chegada = await page.evaluate(() => {
      const alvo = document.getElementById('edicao-2012')?.getBoundingClientRect();
      const cabecalho = document.querySelector('header')?.getBoundingClientRect();
      return alvo === undefined || cabecalho === undefined
        ? null
        : { topo: alvo.top, base: cabecalho.bottom };
    });

    expect(chegada).not.toBeNull();
    expect(chegada!.topo).toBeGreaterThanOrEqual(chegada!.base);
  });

  test('no trilho, a edição pedida aterrissa no início da tira', async ({ page }) => {
    await page.goto('/memoria?linha=trilho');

    await page.getByRole('navigation', { name: 'Ir para uma edição' }).getByText('2012').click();

    /*
     * A âncora nativa só garante "visível": o encaixe obrigatório acerta o
     * painel vizinho no início, e pedir 2012 devolveria 2013 na primeira
     * coluna. A folha de cliente corrige a posição.
     */
    await expect
      .poll(() =>
        page.evaluate(() => {
          const alvo = document.getElementById('edicao-2012')?.getBoundingClientRect().left;
          return alvo === undefined ? -1 : Math.round(alvo);
        }),
      )
      .toBeLessThan(80);
  });

  test('uma URL com âncora já abre na edição, sem clique nenhum', async ({ page }) => {
    await page.goto('/memoria?linha=trilho#edicao-2017');

    await expect
      .poll(() =>
        page.evaluate(() => {
          const alvo = document.getElementById('edicao-2017')?.getBoundingClientRect().left;
          return alvo === undefined ? -1 : Math.round(alvo);
        }),
      )
      .toBeLessThan(80);
  });
});

test.describe('Memória — a roda avança o trilho', () => {
  /*
   * A suíte roda com movimento reduzido (ver `playwright.config.ts`), o que
   * desliga o Lenis e faz o ouvinte assumir a posição direto, sem interpolação.
   * É exatamente o que se quer medir aqui: a **regra de prioridade**, não a
   * suavidade — quem consome o gesto, e quando ele volta para a página.
   */
  const railOf = (page: import('@playwright/test').Page) => page.locator('#timeline-rail-track');

  test('rolar para baixo sobre a tira a faz andar para o lado', async ({ page }) => {
    await page.goto('/memoria?linha=trilho');

    const rail = railOf(page);
    await rail.hover();

    await page.mouse.wheel(0, 600);
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(300);
  });

  test('a página não anda enquanto a tira ainda tem estações à frente', async ({ page }) => {
    await page.goto('/memoria?linha=trilho');

    const rail = railOf(page);
    await rail.hover();
    const before = await page.evaluate(() => window.scrollY);

    await page.mouse.wheel(0, 600);
    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(300);

    /*
     * A tolerância não é frouxidão: com a tira andando, o navegador reajusta a
     * âncora de rolagem em alguns pixels. O que este teste precisa distinguir é
     * "a página ficou parada" de "a página levou o gesto inteiro" — e são
     * ordens de grandeza diferentes.
     */
    const after = await page.evaluate(() => window.scrollY);
    expect(Math.abs(after - before)).toBeLessThan(50);
  });

  /*
   * O defeito clássico deste efeito: a tira sequestra a roda para sempre e a
   * página trava. Cada ponta precisa devolver o gesto.
   */
  test('no fim da tira o gesto volta para a página', async ({ page }) => {
    await page.goto('/memoria?linha=trilho');

    const rail = railOf(page);
    await rail.hover();
    await rail.evaluate((el) => {
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    });

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 600);

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });

  test('no início da tira, rolar para cima devolve o gesto para a página', async ({ page }) => {
    await page.goto('/memoria?linha=trilho');

    /*
     * A página desce por programação, não pela roda: a tira ocupa a largura
     * inteira, então qualquer gesto de roda cairia sobre ela e a faria andar —
     * e o cenário aqui exige a tira parada no início.
     */
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    const rail = railOf(page);
    await rail.evaluate((el) => {
      el.scrollLeft = 0;
    });
    await rail.hover();
    expect(await rail.evaluate((el) => el.scrollLeft)).toBe(0);

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, -400);

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(before);
  });
});

test.describe('Memória — a roda avança o trilho, com movimento normal', () => {
  test.use({ contextOptions: { reducedMotion: 'no-preference' } });

  /*
   * O caminho que a suíte não cobria, e onde o defeito morava: com movimento
   * normal o ouvinte interpola quadro a quadro em vez de saltar, e a
   * interpolação briga com `scroll-snap-type: x mandatory` — o navegador
   * reancora a cada escrita em `scrollLeft` e a tira não sai do lugar. O
   * encaixe é suspenso durante o deslize e devolvido na chegada.
   */
  test('a tira desliza, encaixa numa estação e devolve o scroll-snap', async ({ page }) => {
    await page.goto('/memoria?linha=trilho', { waitUntil: 'domcontentloaded' });

    // A abertura teatral existe neste modo; dispensada por rolagem.
    await page.keyboard.press('Escape');

    const rail = page.locator('#timeline-rail-track');
    await rail.hover();
    await page.mouse.wheel(0, 700);

    await expect.poll(() => rail.evaluate((el) => el.scrollLeft)).toBeGreaterThan(300);

    // O laço converge: sem isso ele giraria para sempre com o encaixe desligado.
    await expect
      .poll(() => rail.evaluate((el) => el.style.scrollSnapType), { timeout: 5_000 })
      .toBe('');

    // E a tira para alinhada com o início de uma estação.
    const offset = await rail.evaluate((el) => {
      const panel = el.querySelector('[data-station]');
      return panel === null ? -1 : Math.abs(el.scrollLeft % panel.getBoundingClientRect().width);
    });

    expect(offset).toBeLessThan(2);
  });
});

test.describe('Memória sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  /*
   * A regra que vence as outras no projeto: a experiência continua completa sem
   * animação e sem JavaScript. As vinte e duas estações são HTML do servidor, e
   * a escolha de variante vive na URL — não em estado de cliente.
   */
  test('as vinte e duas estações estão no HTML, nas duas variantes', async ({ page }) => {
    await page.goto('/memoria');
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(22);
    await expect(page.getByRole('link', { name: 'Explorar esta edição' })).toBeVisible();

    await page.goto('/memoria?linha=trilho');
    await expect(page.getByRole('article')).toHaveCount(22);
    await expect(page.getByRole('region', { name: 'Linha do tempo das edições' })).toBeVisible();
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
