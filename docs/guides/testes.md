# Testes e qualidade

Leia antes de: escrever teste, mexer em setup de teste ou decidir o que cobrir.

| Camada                | Ferramenta               | O que cobre                                                 |
| --------------------- | ------------------------ | ----------------------------------------------------------- |
| Unitário / componente | Vitest + Testing Library | Comportamento observável                                    |
| E2E                   | Playwright               | Idioma, teclado, skip link, fallback 3D, movimento reduzido |
| Acessibilidade        | `@axe-core/playwright`   | WCAG 2.2 AA na home                                         |

## Configuração (fato)

- Vitest roda em `jsdom`, com `globals: true`, e inclui apenas
  `src/**/*.test.{ts,tsx}` — os E2E são responsabilidade do Playwright.
- Setup em `src/test/setup.ts`: mocka `matchMedia` (o jsdom não o implementa,
  padrão "sem preferência" por teste) e faz `getContext` devolver `null`,
  reproduzindo um navegador sem WebGL — o caminho que os testes de fallback
  exercitam. `cleanup` e `restoreAllMocks` a cada teste.
- Cobertura por v8, excluindo `src/app/**`, `src/types/**`, `src/proxy.ts` e o
  próprio setup. **Não há limiar de cobertura configurado** — cobertura é
  diagnóstico, não meta.
- Playwright roda contra o **build de produção** (`pnpm build && pnpm start` na
  porta 3100), só em Chromium, com `locale: 'pt-BR'` fixado no contexto para que
  os testes meçam conteúdo, não detecção de idioma.
- Primeira execução na máquina: `pnpm exec playwright install chromium`.

## Regras

- Consulte por **papel, rótulo e texto**. Não use `data-testid` nem classes CSS.
- Teste comportamento observável, não detalhes internos, quadros de animação nem
  snapshots grandes.
- Testes ficam ao lado do código, como `*.test.ts` / `*.test.tsx`; `describe`
  nomeia a unidade e `it` descreve o comportamento em português, na voz do
  usuário ("é acionável pelo teclado").
- Componentes puramente visuais, sem comportamento, não exigem teste unitário.
- **Mock só na fronteira que o ambiente de teste não consegue executar** — o
  roteador do App Router em `locale-switcher.test.tsx` é o exemplo, e o próprio
  teste registra que a montagem real da URL é verificada no E2E. Não mocke o
  módulo que você está testando.
- Testes precisam ser determinísticos: sem `sleep` arbitrário, sem depender de
  ordem de execução, sem data/hora do sistema (use datas fixas do conteúdo).
- Ao corrigir um bug, escreva primeiro o teste que falha por causa dele.
- Adicione teste E2E quando a mudança afetar fluxos de interface: rotas, idioma,
  navegação, foco, animação ou cena 3D.
- Nunca remova nem enfraqueça um teste para fazer a suíte passar.
