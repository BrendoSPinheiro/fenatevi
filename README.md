# FENATEVI — Site oficial

Site oficial do **FENATEVI — Festival Nacional de Teatro de Vitória**.

## Contexto

O portal é uma experiência digital de conteúdo, navegação e apresentação visual.
Ele existe para divulgar a edição vigente, apresentar programação, espetáculos,
locais e ingressos, preservar a memória das edições anteriores e falar com
patrocinadores, imprensa e pesquisadores — em português, inglês e espanhol.

O conceito que orienta as decisões técnicas é:

> **Imersão teatral sem sacrificar acessibilidade, usabilidade ou performance.**

Na prática, isso significa que animações dirigidas por scroll, parallax,
transições e cenas WebGL são bem-vindas, mas **nenhuma delas pode ser
pré-requisito para ler o conteúdo**.

## Objetivo deste repositório hoje

Este repositório contém o **bootstrap técnico** — a fundação, as configurações e
uma página mínima de validação. **O site ainda não foi implementado.**

O que existe:

- a stack configurada e verificada de ponta a ponta;
- internacionalização em três idiomas com traduções reais;
- design tokens iniciais e um tema escuro acessível;
- integrações de GSAP, Lenis e React Three Fiber com regras de uso definidas;
- testes unitários e E2E, incluindo varredura de acessibilidade;
- CI no GitHub Actions;
- documentação para pessoas e para agentes de IA.

O que **não** existe (e é intencional): design final, abertura com cortinas,
programação, linha do tempo, CMS, backend, autenticação, pagamentos, mapa,
modelos 3D complexos e deploy.

A página inicial atual é uma **página de validação**: ela prova que roteamento por
idioma, traduções, tokens, animação, smooth scroll, WebGL, fallback e
acessibilidade funcionam juntos. Ela não representa o design definitivo.

## Stack

| Camada        | Ferramenta                          | Versão                   |
| ------------- | ----------------------------------- | ------------------------ |
| Framework     | Next.js (App Router, Turbopack)     | 16.2.12                  |
| UI            | React / React DOM                   | 19.2.8                   |
| Linguagem     | TypeScript (modo estrito)           | 6.0.3                    |
| Estilos       | Tailwind CSS                        | 4.3.3                    |
| i18n          | next-intl                           | 4.13.4                   |
| Animação      | GSAP + ScrollTrigger, `@gsap/react` | 3.15.0 / 2.1.2           |
| Smooth scroll | Lenis                               | 1.3.25                   |
| 3D            | Three.js, React Three Fiber, drei   | 0.185.1 / 9.6.1 / 10.7.7 |
| Testes        | Vitest, Testing Library             | 4.1.10                   |
| E2E           | Playwright, `@axe-core/playwright`  | 1.62.0                   |
| Qualidade     | ESLint, Prettier                    | 9.39.5 / 3.9.6           |

Duas versões estão deliberadamente abaixo da mais recente publicada:

- **TypeScript 6.0.3** (e não 7.x) porque o `typescript-eslint@8`, que o
  `eslint-config-next@16` traz consigo, declara suporte a `typescript <6.1.0`.
- **ESLint 9.39.5** (e não 10.x) porque o `eslint-plugin-react@7.37.5`, também
  transitivo do `eslint-config-next`, ainda usa a API `context.getFilename()`,
  removida no ESLint 10.

Ambas devem ser revistas quando o `eslint-config-next` atualizar suas dependências.

## Pré-requisitos

- **Node.js 24.13.0** (LTS) — a versão está fixada em `.nvmrc`, em `engines` do
  `package.json` e no workflow de CI.
- **PNPM 11** — declarado em `packageManager`.

```bash
nvm use
```

> **Este projeto usa PNPM exclusivamente.** Não use `npm`, `npx`, Yarn ou Bun:
> eles gerariam um segundo lockfile e uma árvore de dependências divergente.
> O equivalente de `npx` aqui é `pnpm exec` (binário local) ou `pnpm dlx`
> (binário remoto).

## Instalação

```bash
pnpm install
```

Para rodar os testes E2E localmente, instale o navegador uma vez:

```bash
pnpm exec playwright install chromium
```

## Comandos

| Comando              | O que faz                                                        |
| -------------------- | ---------------------------------------------------------------- |
| `pnpm dev`           | Servidor de desenvolvimento (Turbopack) em http://localhost:3000 |
| `pnpm build`         | Build de produção                                                |
| `pnpm start`         | Serve o build de produção                                        |
| `pnpm lint`          | ESLint                                                           |
| `pnpm lint:fix`      | ESLint com correção automática                                   |
| `pnpm typecheck`     | `tsc --noEmit`                                                   |
| `pnpm format`        | Formata com Prettier                                             |
| `pnpm format:check`  | Verifica a formatação                                            |
| `pnpm test`          | Testes unitários e de componente                                 |
| `pnpm test:watch`    | Testes em modo watch                                             |
| `pnpm test:coverage` | Cobertura                                                        |
| `pnpm test:e2e`      | Testes E2E (constrói e sobe a aplicação sozinho)                 |
| `pnpm test:e2e:ui`   | Testes E2E no modo interativo                                    |
| `pnpm check`         | `format:check` + `lint` + `typecheck` + `test`                   |

## Estrutura de pastas

```text
.
├── .github/workflows/    CI
├── docs/                 Documentação técnica e ADRs
├── e2e/                  Testes Playwright
├── messages/             Traduções (pt-BR, en, es)
└── src/
    ├── app/[locale]/     Rotas, layouts, metadata, loading, error
    ├── components/
    │   ├── ui/           Reutilizáveis, sem conhecimento do festival
    │   ├── layout/       Cabeçalho, rodapé
    │   └── sections/     Seções visuais de página
    ├── content/          Conteúdo do festival, tipado
    ├── hooks/            Hooks reutilizáveis
    ├── lib/
    │   ├── animation/    gsap/, lenis/, three/
    │   ├── i18n/         Rotas, navegação e configuração
    │   └── utils/        Funções puras
    ├── providers/        Providers globais
    ├── styles/           globals.css e design tokens
    ├── test/             Setup do Vitest
    ├── types/            Tipos compartilhados
    └── proxy.ts          Resolução de idioma por requisição
```

Detalhes e justificativas em [`docs/architecture.md`](./docs/architecture.md).

## Internacionalização

- Idiomas: **pt-BR** (padrão), **en**, **es**.
- Estratégia de URL: `as-needed`. O português fica na raiz (`/`), inglês em
  `/en` e espanhol em `/es`.
- O idioma preferido do visitante é detectado pelo cabeçalho `Accept-Language`
  em `src/proxy.ts`. Quem chega em `/` com um navegador em inglês é levado a
  `/en`; a escolha manual no seletor de idioma tem precedência e é lembrada.
- Nenhum texto exibido ao usuário fica escrito no JSX. Tudo vem de `messages/`.
- Datas são formatadas por locale e sempre em UTC, para que o fuso do servidor
  nunca desloque o dia exibido.

### Como adicionar um idioma

1. Crie `messages/<locale>.json` traduzindo todas as chaves de `messages/pt-BR.json`.
2. Em `src/lib/i18n/routing.ts`, adicione o locale a `locales` e preencha
   `localeLabels` (o nome do idioma no próprio idioma) e `localeHtmlLang`.
3. Rode `pnpm typecheck` — os `Record<Locale, string>` acusam qualquer omissão.
4. Ajuste os testes E2E de i18n se o novo idioma fizer parte de um fluxo coberto.

Nada mais precisa mudar: rotas, metadata e o seletor de idioma derivam de `locales`.

## Estratégia de animações

Três bibliotecas, três papéis que não se sobrepõem:

- **GSAP (+ ScrollTrigger)** — animação de HTML e SVG: revelações, timelines,
  sequências ligadas ao scroll.
- **Lenis** — comportamento do scroll da página. Nada além disso.
- **Three.js / React Three Fiber** — cenas 3D dentro de um `<canvas>`.

Regras que valem para todo o projeto:

- Importe GSAP **apenas** de `src/lib/animation/gsap`, onde os plugins são
  registrados uma única vez, em um módulo `'use client'`.
- Use `useGSAP` com `scope` e refs locais. Seletores globais são proibidos.
- Prefira `gsap.from`: os elementos partem de um estado deslocado e chegam ao
  estado natural do documento. Se o JavaScript falhar, o conteúdo já está no
  lugar certo — nada fica escondido esperando uma animação que não veio.
- Movimento reduzido passa por `respectReducedMotion`, que usa
  `gsap.matchMedia()` e reverte a animação se a preferência mudar na sessão.
- O Lenis roda em **um único loop de RAF**, avançado pelo ticker do GSAP e
  sincronizado com o `ScrollTrigger`. Dois loops competindo causam jitter.
- O provider do Lenis não renderiza DOM e não envolve o conteúdo: a página
  continua rolável se ele falhar, e ele nem monta sob movimento reduzido.
- Regiões com scroll próprio (modais, listas) devem receber `data-lenis-prevent`.

## WebGL e fallback

- O Canvas é carregado com `next/dynamic` e `ssr: false`: o Three.js fica fora do
  bundle inicial e nunca roda no servidor.
- `useWebGLSupport` tem três estados — `unknown` (servidor e primeira
  renderização), `available` e `unavailable` — o que mantém o HTML hidratado
  idêntico ao do servidor.
- **Sempre há fallback visual** (gradiente CSS) e **sempre há alternativa
  textual**: o contêiner é `role="img"` com `aria-label`, e um texto explicativo
  aparece quando não há WebGL.
- O loop de renderização passa para `frameloop="demand"` quando a cena sai da
  viewport ou o usuário prefere movimento reduzido.
- Nenhum conteúdo essencial vive dentro do Canvas.

A cena atual é uma **prova técnica**, não a abertura do festival.

## Theatre.js

**Não foi instalado.** Não há uso concreto no bootstrap, a sequência de abertura
ainda não foi desenhada e instalar uma dependência "para o futuro" contraria a
regra de não manter dependências sem uso.

A decisão será reavaliada quando a implementação da abertura teatral começar. O
registro completo, com as restrições que valerão caso o Theatre.js seja adotado,
está em [`docs/adr/0001-adiar-theatre-js.md`](./docs/adr/0001-adiar-theatre-js.md).

## Acessibilidade

Alvo: **WCAG 2.2 nível AA**. Já em vigor:

- HTML semântico e uma única região `<main>` por página;
- link "Pular para o conteúdo" como primeiro elemento focável;
- foco visível e consistente (`:focus-visible` global);
- `lang` correto no `<html>` para cada idioma;
- seletor de idioma como navegação de links, com `aria-current="page"` — funciona
  sem JavaScript;
- alternativa textual para a cena 3D;
- suporte a `prefers-reduced-motion` em CSS e em JavaScript;
- sem áudio ou vídeo automático;
- contraste verificado; a home passa por uma varredura `axe` no CI.

A barra completa de acessibilidade (controles de contraste, tamanho de fonte,
pausa de animação) ainda não existe — entra junto com o design definitivo.

## Performance

- Server Components por padrão; Client Components pequenos e nas folhas da árvore.
- As três variantes de idioma são geradas estaticamente no build.
- Um único provider global, que não renderiza DOM.
- GSAP e Three.js fora do caminho crítico.
- Animação pausada quando o elemento está fora da viewport.
- `next/image` para qualquer imagem relevante que venha a ser adicionada.
- Altura reservada para blocos que carregam depois, evitando layout shift.
- Zero erros de hidratação — há um teste E2E que falha se o console registrar
  qualquer erro.

## GitHub Actions

O workflow [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) roda em Pull
Requests para `main` e em pushes na `main`, com dois jobs paralelos:

- **quality** — instala com lockfile congelado, verifica formatação, lint, tipos,
  testes unitários e build de produção;
- **e2e** — instala o Chromium e roda a suíte Playwright.

Permissões mínimas (`contents: read`), cache do PNPM, cancelamento da execução
anterior da mesma branch e timeouts definidos. O relatório do Playwright é
publicado como artefato **apenas quando algo falha**.

Não há deploy configurado.

## Convenções

- **Arquivos e pastas** em `kebab-case`; **componentes** em `PascalCase`.
- Um componente por arquivo, exportado por nome (exceto páginas e layouts do
  Next.js, que exigem `export default`).
- Testes ao lado do código, como `*.test.ts` / `*.test.tsx`.
- Server Component é o padrão; `'use client'` só quando há estado, evento, API do
  navegador ou biblioteca de animação.
- Texto visível ao usuário sempre vem de `messages/`.
- Sem `any`. Use `unknown` e refine.
- Não desabilite regras de lint para esconder um problema — corrija a causa.
- Não edite `pnpm-lock.yaml` à mão; deixe o PNPM gerá-lo.

## Troubleshooting

**`ERR_PNPM_IGNORED_BUILDS` na instalação**
Dependências nativas precisam de autorização explícita. As permitidas estão em
`pnpm-workspace.yaml`, na chave `allowBuilds` (este arquivo é configuração do
PNPM 11, **não** um monorepo — não há a chave `packages`).

**O Next.js avisa que inferiu a raiz do workspace**
Acontece quando existe outro lockfile em um diretório acima. A raiz está fixada
em `turbopack.root` no `next.config.ts`; se o aviso voltar, verifique se há um
`pnpm-lock.yaml` órfão em um diretório pai.

**`pnpm build` reescreve o `tsconfig.json`**
O Next.js ajusta valores obrigatórios (como `jsx: "react-jsx"`) e pode alterar a
formatação. Rode `pnpm format` depois — o CI executa a formatação antes do build,
então isso não quebra a pipeline.

**Os testes E2E redirecionam `/` para `/en`**
É a detecção de idioma funcionando. O `playwright.config.ts` fixa
`locale: 'pt-BR'` no contexto do navegador; testes de outros idiomas navegam para
o prefixo explicitamente.

**A cena 3D não aparece**
Esperado em ambientes sem WebGL — o fallback em gradiente e o texto alternativo
assumem. Para confirmar, verifique `useWebGLSupport`.

**A página não rola**
Provavelmente o Lenis inicializou e falhou. As classes `.lenis` em
`src/styles/globals.css` mantêm o scroll nativo funcionando; se o problema
persistir, desmonte o `SmoothScrollProvider` para isolar.

## Próximos passos recomendados

1. Definir a identidade visual e substituir os tokens iniciais por tokens reais
   (cores, tipografia, escala).
2. Desenhar o roteiro da abertura teatral e só então decidir entre GSAP puro e
   Theatre.js (ver ADR 0001).
3. Modelar a programação e a linha do tempo, criando `src/features/schedule/` e
   `src/features/timeline/` quando cada uma tiver estado, hooks e testes próprios.
4. Definir a origem do conteúdo (CMS ou arquivos versionados) mantendo
   `src/types/festival.ts` como contrato.
5. Adicionar Firefox e WebKit ao Playwright quando o layout estabilizar.
6. Definir a estratégia de imagens (formatos, tamanhos, licenças) antes de
   adicionar fotografias.
7. Configurar deploy e um orçamento de performance (Lighthouse CI ou equivalente).

## Documentação relacionada

- [`docs/`](./docs/README.md) — índice da documentação técnica
- [`docs/architecture.md`](./docs/architecture.md) — arquitetura em detalhe
- [`docs/guides/`](./docs/README.md) — guias de engenharia por assunto
- [`docs/riscos-conhecidos.md`](./docs/riscos-conhecidos.md) — inconsistências registradas
- [`docs/adr/0001-adiar-theatre-js.md`](./docs/adr/0001-adiar-theatre-js.md) — ADR
- [`CLAUDE.md`](./CLAUDE.md) e [`AGENTS.md`](./AGENTS.md) — instruções para
  agentes de IA (conteúdo idêntico; indexam os guias acima)
