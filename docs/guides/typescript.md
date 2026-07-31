# TypeScript

Leia antes de: declarar tipos, lidar com dado externo ou brigar com o compilador.

## Configuração (fato — `tsconfig.json`)

`strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`noImplicitOverride`, `noFallthroughCasesInSwitch`,
`forceConsistentCasingInFileNames`, `isolatedModules`, `target ES2022`,
`moduleResolution: bundler`, alias `@/*`. Sem `baseUrl` (depreciado no TS 6).
`typescript.ignoreBuildErrors: false` no `next.config.ts`: erro de tipo quebra o
build.

## Regras

- **`any` é proibido** — `@typescript-eslint/no-explicit-any` é `error`. Use
  `unknown` e refine com type guard.
- Assertions (`as`) só com comentário explicando por que o compilador não
  consegue provar o fato. As duas em uso são pontuais (`Container`,
  `LocaleSwitcher`).
- Com `noUncheckedIndexedAccess`, todo acesso indexado devolve `T | undefined`:
  trate o `undefined` (ver o `if (entry)` em `use-in-viewport.ts`), não silencie
  com `!`.
- Com `exactOptionalPropertyTypes`, `{ x?: string }` não aceita
  `{ x: undefined }`. Espalhe condicionalmente em vez de passar `undefined`
  explícito (padrão usado no `playwright.config.ts`).
- Dados de conteúdo: `interface`/`type` com campos `readonly` e arrays
  `readonly T[]`.
- Uniões literais em vez de `enum` (`ButtonVariant`, `AccessibilityFeatureId`,
  `WebGLSupport`). `enum` não é usado no projeto — não introduza um.
- Union discriminada quando os estados forem mutuamente exclusivos e carregarem
  dados diferentes; união de strings simples quando não carregarem
  (`WebGLSupport` é do segundo tipo).
- `as const` para listas fechadas que geram tipos (`locales`), com o tipo
  derivado por `typeof`.
- Deixe a inferência trabalhar dentro de funções; **declare o tipo de retorno
  explicitamente** em toda função exportada de `lib/` e `hooks/` — é contrato
  público.
- Todo dado externo (rota, `searchParams`, resposta de API, futuro CMS) é
  desconhecido até ser validado em runtime. O padrão atual é validação explícita
  e barata: `hasLocale` para o locale, `Number.isNaN` em `parseIsoDate`. Um
  schema validator só entra quando houver entrada externa que o justifique — e
  então nos limites (`app/`, `lib/`), não espalhado pelos componentes.
- Não duplique tipos: derive com `Pick`, `Omit` e indexação
  (`venueId: Venue['id']`).
