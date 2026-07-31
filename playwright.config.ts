import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Impede que um `test.only` esquecido reduza silenciosamente a suíte no CI.
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // Fora do CI, omitir `workers` deixa o Playwright escolher o paralelismo.
  ...(isCI ? { workers: 1 } : {}),
  reporter: isCI ? [['html', { open: 'never' }], ['list']] : [['list']],
  timeout: 30_000,

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    /*
     * O next-intl detecta o idioma pelo cabeçalho `Accept-Language`. Sem fixar o
     * locale do navegador, o Chromium pediria `en-US` e `/` redirecionaria para
     * `/en` — os testes passariam a medir a detecção, não o conteúdo. Os cenários
     * em outros idiomas navegam para o prefixo explicitamente.
     */
    locale: 'pt-BR',
  },

  // Chromium é suficiente para o bootstrap; Firefox e WebKit entram quando a
  // experiência visual estiver definida (ver docs/architecture.md).
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    // Os testes rodam contra o build de produção — o mesmo artefato que vai ao ar.
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
