# FENATEVI — instruções para agentes

Site oficial do **FENATEVI — Festival Nacional de Teatro de Vitória**: experiência
editorial e visual em pt-BR, en e es. Público: audiência do festival, artistas,
patrocinadores, imprensa e pesquisadores.

`CLAUDE.md` e `AGENTS.md` têm **conteúdo idêntico**. Ao alterar um, altere o
outro. Documentação em português; este arquivo é índice — o detalhe está em
`docs/guides/`, leia sob demanda.

**Não é** plataforma transacional: sem autenticação, banco, backend, formulários,
pagamentos ou regras de negócio extensas. Não proponha arquitetura para problemas
que este projeto não tem.

**Princípio que decide empates:** imersão teatral sem sacrificar acessibilidade,
usabilidade ou performance.

## Estágio atual

O repositório é o **bootstrap técnico** mais uma **página de validação**. O site
ainda não foi implementado. A home prova que roteamento por idioma, traduções,
tokens, GSAP, Lenis, React Three Fiber, fallback de WebGL e acessibilidade
funcionam juntos — ela **não** é o design final.

Não implemente design definitivo, abertura teatral, programação, linha do tempo,
CMS, backend, autenticação, pagamentos, mapa ou deploy sem pedido explícito.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 6 estrito · Tailwind
CSS 4 (config em CSS, sem `tailwind.config.js`) · next-intl 4 · GSAP 3 +
ScrollTrigger · Lenis 1 · Three.js + React Three Fiber 9 · Vitest 4 + Testing
Library · Playwright + axe · ESLint 9 + Prettier 3 · Node 24.13.0 · PNPM 11.

**Não existem no projeto** (não os invente): Storybook, cliente HTTP, estado
global, biblioteca de formulários, schema validator, ORM, SDK de observabilidade,
variáveis de ambiente, Route Handlers, Server Actions e deploy.

## Comandos

```bash
pnpm install                          # instalar
pnpm dev                              # desenvolvimento em :3000
pnpm build          /  pnpm start     # build de produção / servir
pnpm lint           /  pnpm lint:fix
pnpm typecheck                        # tsc --noEmit
pnpm format         /  pnpm format:check
pnpm test           /  pnpm test:watch  /  pnpm test:coverage
pnpm test:e2e       /  pnpm test:e2e:ui
pnpm check                            # format:check + lint + typecheck + test
```

Se um comando não está acima, ele não existe. **Use apenas `pnpm`, `pnpm exec` e
`pnpm dlx`** — `npm`, `npx`, `yarn` e `bun` criariam um segundo lockfile.

## Estrutura

```text
docs/                    Documentação técnica, guias e ADRs
e2e/                     Testes Playwright
messages/                pt-BR.json, en.json, es.json
src/app/[locale]/        Rotas, layouts, metadata, loading, error, not-found
src/components/ui/       Reutilizáveis, sem conhecimento do festival
src/components/layout/   Cabeçalho, rodapé, shell
src/components/sections/ Seções visuais de página
src/content/             Conteúdo do festival, tipado
src/hooks/               Hooks reutilizáveis
src/lib/animation/       gsap/, lenis/, three/
src/lib/i18n/            Rotas, navegação, configuração do next-intl
src/lib/utils/           Funções puras
src/providers/           Providers globais (hoje: smooth scroll)
src/styles/              globals.css e design tokens
src/test/                Setup do Vitest
src/types/               Tipos compartilhados entre áreas
src/proxy.ts             Resolução de idioma por requisição
```

Não há `src/features/` — criá-la exige autorização humana.

## Guias — leia o relevante antes de mexer

| Guia                                                                | Leia antes de                                        |
| ------------------------------------------------------------------- | ---------------------------------------------------- |
| [arquitetura-e-convencoes](docs/guides/arquitetura-e-convencoes.md) | criar arquivo, mover código, criar abstração         |
| [nextjs-e-react](docs/guides/nextjs-e-react.md)                     | rotas, `'use client'`, dados, hidratação, metadata   |
| [typescript](docs/guides/typescript.md)                             | declarar tipos, lidar com dado externo               |
| [estilos-e-design-tokens](docs/guides/estilos-e-design-tokens.md)   | escrever classes, criar componente visual            |
| [i18n](docs/guides/i18n.md)                                         | qualquer texto visível, rota nova, idioma            |
| [animacao-e-webgl](docs/guides/animacao-e-webgl.md)                 | animar, mexer no scroll, tocar na cena 3D            |
| [acessibilidade](docs/guides/acessibilidade.md)                     | elemento interativo, foco, ARIA, semântica           |
| [seguranca-e-configuracao](docs/guides/seguranca-e-configuracao.md) | entrada externa, variável de ambiente, HTML dinâmico |
| [performance](docs/guides/performance.md)                           | biblioteca no caminho crítico, imagem, lista longa   |
| [testes](docs/guides/testes.md)                                     | escrever teste, decidir o que cobrir                 |
| [erros-e-observabilidade](docs/guides/erros-e-observabilidade.md)   | tratar falha, escrever log, integração remota        |
| [dependencias-e-mudancas](docs/guides/dependencias-e-mudancas.md)   | instalar pacote, atualizar versão, mexer no Git      |

Contexto adicional: [arquitetura](docs/architecture.md) (decisões),
[riscos conhecidos](docs/riscos-conhecidos.md) (inconsistências deliberadas),
[ADRs](docs/adr/), [README](README.md) (instalação e troubleshooting).

## Regras que valem em toda tarefa

- **A experiência precisa continuar completa sem animação e sem WebGL.** Esta é a
  regra que vence as outras.
- Server Component é o padrão; `'use client'` só com estado, efeito, evento, API
  do navegador ou biblioteca de animação — e sempre nas folhas da árvore.
- **Nenhum texto visível ao usuário no JSX**: tudo vem de `messages/`, nos três
  idiomas.
- **Sem `any`** (é `error` no ESLint). Use `unknown` e refine.
- **Nenhuma cor, raio ou easing arbitrário** quando existe token equivalente.
- Importe GSAP apenas de `@/lib/animation/gsap`; navegação apenas de
  `@/lib/i18n/navigation`.
- Acessibilidade WCAG 2.2 AA e zero erros de hidratação são portões de CI.
- Um componente por arquivo, `kebab-case` no arquivo, `PascalCase` no componente,
  props `readonly`, teste ao lado do código.

## Fluxo de trabalho

1. Leia este arquivo e o guia relevante.
2. Leia o código relacionado e **inspecione uma implementação semelhante**
   (`hero.tsx` para seção animada, `button.tsx` para componente de `ui/`,
   `use-webgl-support.ts` para estado só-do-cliente).
3. Faça a **menor alteração** capaz de resolver o problema, preservando contratos
   existentes (props, tipos exportados, chaves de tradução).
4. Adicione ou atualize testes.
5. Rode as verificações do checklist e revise o diff inteiro.
6. Relate o que mudou, o que foi validado, suposições e limitações.

Além disso: investigue antes de criar abstração; **não invente** APIs, scripts,
diretórios ou convenções; não assuma que compilar é estar correto; não mascare
erro com `any`, `eslint-disable` ou remoção de teste; comente **o porquê**, não o
óbvio; atualize a documentação no mesmo commit quando mudar arquitetura,
configuração ou comportamento relevante. Pergunte quando a decisão for de
**negócio** e não estiver no código; detalhe técnico descobrível no repositório:
investigue.

## Checklist de conclusão

```bash
pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Adicione `pnpm test:e2e` quando a mudança afetar rotas, idioma, navegação, foco,
animação, cena 3D ou qualquer coisa visível na página. Se um comando falhar,
corrija a causa. Além disso:

- [ ] nenhum `eslint-disable` para esconder problema, nenhum `any`;
- [ ] nenhuma dependência não utilizada, nenhuma pasta vazia;
- [ ] chaves novas de tradução nos **três** arquivos de `messages/`;
- [ ] nenhum segredo, token ou dado pessoal no repositório ou em log;
- [ ] `CLAUDE.md` e `AGENTS.md` continuam idênticos, se algum mudou;
- [ ] a experiência continua completa sem animação e sem WebGL.

## Exige autorização humana explícita

Adicionar ou atualizar dependência · introduzir CMS, backend, autenticação,
pagamentos ou banco · alterar a estratégia de i18n · alterar design tokens ou
tema · mudar configuração de CI, build ou testes · criar `src/features/` ou
reorganizar diretórios · commit, push, PR e qualquer comando destrutivo.
