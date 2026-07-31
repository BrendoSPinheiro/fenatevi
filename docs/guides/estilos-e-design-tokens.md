# Estilos, Tailwind CSS e design tokens

Leia antes de: escrever classes, criar componente visual ou adicionar cor.

## Configuração (fato)

- Tailwind CSS **v4**, configurado **em CSS**: não existe `tailwind.config.js`.
  Os tokens vivem no bloco `@theme` de
  [`src/styles/globals.css`](../../src/styles/globals.css), que gera as variáveis
  em `:root` e as utilidades correspondentes.
- PostCSS: apenas `@tailwindcss/postcss`.
- Tokens disponíveis: cores (`background`, `foreground`, `surface`,
  `surface-raised`, `border`, `muted`, `accent`, `accent-strong`, `on-accent`,
  `focus`, `error`, `success`), raios (`sm`/`md`/`lg`/`full`), easings
  (`--ease-stage`, `--ease-curtain`), `--font-sans`, além de durações
  (`--duration-*`) e camadas (`--z-*`) declaradas em `:root` para uso direto.
- Tema **escuro único** (`color-scheme: dark`): **não há alternância de tema**.
  É um tema inicial neutro que valida infraestrutura e contraste, não a
  identidade visual definitiva.
- O Prettier ordena as classes automaticamente (`prettier-plugin-tailwindcss`,
  com `tailwindFunctions: ["cn", "buttonClassName"]`).
- Padrão de variantes em uso: um `Record<Variant, string>` mais uma função
  exportada que devolve a string de classes — ver
  [`src/components/ui/button.tsx`](../../src/components/ui/button.tsx). Não há
  `cva`/`clsx`/`tailwind-merge`.

## Regras

- **Nenhuma cor arbitrária.** Use as utilidades dos tokens (`bg-surface`,
  `text-muted`, `border-border`, `text-accent`). Valor arbitrário só quando não
  existir token equivalente e a intenção for única — como o gradiente radial do
  fallback em `stage-scene.tsx`, que consome `var(--color-accent)`.
- Precisa de cor, raio ou easing novo? Adicione o token em `@theme` primeiro
  (alterar tokens exige autorização humana).
- CSS global só em `src/styles/globals.css`, e apenas para base do documento e
  requisitos das bibliotecas (as classes `.lenis`). Nada de `.css` por
  componente, CSS-in-JS ou um segundo sistema de estilos paralelo ao Tailwind.
- Repetiu o mesmo conjunto de classes três vezes? Extraia um componente em `ui/`
  ou uma variante no `Record`, não uma classe utilitária global.
- Como `cn` não resolve conflitos de Tailwind, **evite passar duas classes que
  disputem a mesma propriedade**; a classe passada por prop deve complementar,
  não sobrescrever.
- Responsividade mobile-first: base sem prefixo e ajustes em `sm:`/`lg:`, como em
  `py-16 sm:py-24`.
- Estados interativos por utilidades (`hover:`, `focus-visible:`, `disabled:`) —
  nunca removendo o `outline` do foco global.
- Componentes de terceiros: encapsule-os em um wrapper próprio em `ui/`, para que
  a substituição seja local. Não espalhe imports da biblioteca pelo código, e
  verifique acessibilidade e tamanho antes de adotar.
- Estados de interface (carregando, vazio, erro, sucesso) são **conteúdo**: o
  texto vem de `messages/`, e o estado precisa ser perceptível sem depender só de
  cor ou de movimento. Não há hoje estados de permissão ou bloqueio — não há
  autenticação.
