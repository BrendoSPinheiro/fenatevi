# Dependências, Git e escopo das mudanças

Leia antes de: instalar pacote, atualizar versão ou tocar em arquivo fora da
tarefa.

## Dependências

- **Não instale dependências que não sejam usadas no mesmo commit.** Preparar o
  futuro não é justificativa — foi por isso que o Theatre.js ficou de fora
  ([ADR 0001](../adr/0001-adiar-theatre-js.md)).
- Antes de adicionar: verifique se uma dependência já presente resolve o
  problema, se a plataforma resolve (`Intl`, `URL`, `IntersectionObserver`,
  `matchMedia`) e se escrever 15 linhas próprias não é melhor — `cn` é o
  precedente.
- Avalie manutenção ativa, tamanho no bundle, alertas de segurança e
  compatibilidade com **Next.js 16, React 19 e TypeScript 6** antes de adotar.
- Não adicione biblioteca de componentes que imponha identidade visual, nem
  gerenciador de estado, camada de dados ou CMS sem necessidade demonstrada.
- Explique no resumo da mudança por que a dependência é necessária.
- Remova o que deixar de ser usado, no mesmo commit.
- **Não atualize versões alheias à tarefa.** Em particular: TypeScript está em
  6.0.3 (o `typescript-eslint@8` declara suporte a `<6.1.0`) e ESLint em 9.39.5
  (o `eslint-plugin-react@7.37.5` ainda usa `context.getFilename()`, removida no
  ESLint 10) — ambos transitivos do `eslint-config-next@16`. Não os atualize sem
  verificar essas dependências.
- Use apenas `pnpm add` / `pnpm remove`; nunca edite `pnpm-lock.yaml` à mão.

## Git e escopo

- Não modifique arquivos sem relação com a tarefa.
- Não faça refatoração oportunista de grande porte junto com uma correção.
- Não sobrescreva mudanças não salvas do usuário; em conflito, pergunte.
- Não execute comandos destrutivos (`git reset --hard`, `git clean -fd`, remoção
  em massa) sem autorização explícita.
- Não remova funcionalidade nem teste para contornar um problema.
- Mantenha a mudança pequena, focada e revisável; revise o diff inteiro antes de
  concluir.
- **Não faça commit nem push, salvo pedido explícito.**
- Este repositório **ainda não tem commits**; não há convenção de mensagens,
  branches ou PR documentada. Não invente uma — pergunte se for necessário.

## Arquivos que não devem ser editados manualmente

- `pnpm-lock.yaml` — gerado pelo PNPM.
- `next-env.d.ts` e `tsconfig.tsbuildinfo` — gerados pelo Next.js/TypeScript.
- `.next/`, `coverage/`, `playwright-report/`, `test-results/` — artefatos.
- Campos do `tsconfig.json` que o Next.js reescreve no build (por exemplo
  `jsx: "react-jsx"`): **não os reverta**. Se o build reformatar o arquivo, rode
  `pnpm format`.

## PNPM é obrigatório

Use **apenas** `pnpm`, `pnpm exec` e `pnpm dlx`. **Nunca** `npm`, `npx`, `yarn`
ou `bun` — eles criariam um segundo lockfile e uma árvore de dependências
divergente. O `.gitignore` bloqueia `package-lock.json`, `yarn.lock` e
`bun.lockb` justamente por isso.

`pnpm-workspace.yaml` **não** indica monorepo: não há a chave `packages`. Desde o
PNPM 11 ele guarda as configurações antes lidas do campo `pnpm` do
`package.json` — aqui, o `allowBuilds` que autoriza os scripts de build de
dependências nativas (`@parcel/watcher`, `@swc/core`, `sharp`, `unrs-resolver`).
