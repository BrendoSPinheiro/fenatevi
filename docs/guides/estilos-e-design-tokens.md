# Estilos, Tailwind CSS e design tokens

Leia antes de: escrever classes, criar componente visual ou adicionar cor.

## Configuração (fato)

- Tailwind CSS **v4**, configurado **em CSS**: não existe `tailwind.config.js`.
  Os tokens vivem no bloco `@theme` de
  [`src/styles/globals.css`](../../src/styles/globals.css), que gera as variáveis
  em `:root` e as utilidades correspondentes.
- PostCSS: apenas `@tailwindcss/postcss`.
- O design system é o **Nocturne Stage**, definido no frontmatter de
  [`prototipo-fenatevi/uploads/DESIGN.md`](../../prototipo-fenatevi/uploads/DESIGN.md).
  Onde a prosa daquele documento cita outros hexes ("#050505", "#0F172A"), o
  **frontmatter vence**.
- Inventário de tokens:
  - **Superfícies:** `surface`, `surface-dim`, `surface-bright`,
    `surface-container-lowest`, `surface-container-low`, `surface-container`,
    `surface-container-high`, `surface-container-highest`, `surface-variant`,
    `background`.
  - **Texto:** `foreground`, `foreground-muted`, `foreground-subtle` —
    exatamente três tons, ver a regra de contraste abaixo.
  - **Contornos:** `outline`, `outline-variant`.
  - **Marca:** `primary` e `primary-container` (o bordô), `on-primary`,
    `on-primary-container`, `inverse-primary`.
  - **Destaque:** `secondary`, `secondary-container`, `on-secondary`,
    `on-secondary-container` (o âmbar, usado com parcimônia).
  - **Apoio:** `tertiary*`, `error*`, `focus`, `success`,
    `inverse-surface`, `inverse-on-surface`.
  - **Raios:** `sm` (2px, botões e campos), `md`, `lg` (8px, cartões), `xl`,
    `full` (pill, chips).
  - **Espaçamento:** `unit` (8px), `gutter` (24px), `margin-mobile` (20px),
    `margin-desktop` (64px), `stack-sm`/`stack-md`/`stack-lg` (16/32/80px).
  - **Tipografia:** `--font-serif` (Fraunces) e `--font-sans` (Archivo), carregadas por `next/font/google` no layout.
  - Fora do `@theme`, em `:root`: `--container-max` (1280px), durações
    (`--duration-*`) e camadas (`--z-*`).

## Tipografia

- Duas famílias, e cada uma com um papel: **Fraunces** é a voz do festival
  (títulos, citações); **Archivo** carrega toda a informação funcional
  (programação, descrições, rótulos).
- A serifa é a Fraunces, e não uma didone, por legibilidade: a maior parte do
  texto em `font-serif` fica entre 18px e 24px sobre fundo escuro, tamanho em que
  hastes finas de alto contraste somem. O eixo `opsz` da Fraunces engrossa essas
  hastes conforme o tamanho cai; o eixo `WONK`, ligado só em `display-lg` e
  `display-md` (ver [`ui/text.tsx`](../../src/components/ui/text.tsx)), devolve a
  excentricidade no cartaz.
- A sans é a Archivo, e não uma grotesca macia, por contraste: a Fraunces já é
  quente e orgânica, então a família funcional precisa ser fria e mecânica para
  recuar. O eixo `wdth` da Archivo dá largura desenhada aos rótulos em caixa
  alta — hoje aplicado em `label-md`.
- Ambas entram por `next/font/google` em
  [`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx): baixadas
  e auto-hospedadas no build, sem requisição a terceiros em runtime e sem pacote
  novo.
- A escala do `DESIGN.md` (`display-lg`, `display-md`, `headline-lg`, `body-lg`,
  `body-md`, `label-md`, `caption`) **não é utilitário do Tailwind**: é o
  componente [`ui/text.tsx`](../../src/components/ui/text.tsx), com uma prop
  `variant`. O motivo é que cada entrada amarra família, tamanho, peso,
  entrelinha e tracking ao mesmo tempo — como utilitário, nada impediria escrever
  `text-display-lg font-normal` e desmontar a escala pela metade.
- Os tamanhos do `DESIGN.md` são valores de desktop e viram **teto** de um
  `clamp()`. `headline-lg` tem piso declarado no próprio documento
  (`headline-lg-mobile`, 32px).

## Os três tons de texto, e a proibição de alfa arbitrário

O protótipo espalha `rgba(229,226,223,α)` com α entre 0,22 e 0,8. Sobre
`--color-surface`, α = 0,4 dá ≈ 3,6:1 e α = 0,45 dá ≈ 4,2:1 — os dois **reprovam
em AA** para texto normal.

Por isso a escala de texto é fechada em três tokens, e **alfa arbitrário em
texto é proibido**. Contraste medido sobre a superfície mais escura (`#131312`)
e sobre a mais clara em que texto pode assentar (`--color-surface-bright`):

| Token                       | Sobre `surface` | Sobre `surface-bright` | Uso                      |
| --------------------------- | --------------- | ---------------------- | ------------------------ |
| `--color-foreground`        | 14,4:1          | 8,9:1                  | títulos, texto principal |
| `--color-foreground-muted`  | 10,6:1          | 6,6:1                  | texto secundário         |
| `--color-foreground-subtle` | 7,4:1           | 4,6:1                  | rótulos, metadados       |

Abaixo de `subtle`, só elemento decorativo (`aria-hidden`), separador ou traço.
**Contraste vence fidelidade ao protótipo** — é o critério que decide empates
neste projeto.

- **Tokens de cenografia:** `--color-curtain`, `--color-curtain-fold` e
  `--color-curtain-sheen` descrevem um objeto de cena — o veludo da abertura
  teatral e da cortina de transição — e **não** fazem parte da paleta. Não os use
  em botões, links, superfícies ou estados. Eles derivam do bordô da marca, mas
  continuam nomeados como cenário.
- Tema **escuro único** (`color-scheme: dark`): **não há alternância de tema**.
  É a atmosfera teatral do design system, não uma limitação temporária.
- O Prettier ordena as classes automaticamente (`prettier-plugin-tailwindcss`,
  com `tailwindFunctions: ["cn", "buttonClassName"]`).
- Padrão de variantes em uso: um `Record<Variant, string>` mais uma função
  exportada que devolve a string de classes — ver
  [`src/components/ui/button.tsx`](../../src/components/ui/button.tsx). Não há
  `cva`/`clsx`/`tailwind-merge`.

## Regras

- **Nenhuma cor arbitrária.** Use as utilidades dos tokens (`bg-surface`,
  `text-foreground-muted`, `border-outline-variant`, `text-secondary`). Valor
  arbitrário só quando não existir token equivalente e a intenção for única —
  como os gradientes de escurecimento da abertura da home, que existem para
  garantir contraste sobre a fotografia.
- **Nenhum alfa arbitrário em texto.** Escolha um dos três tons acima. Alfa em
  borda e fundo decorativo continua permitido.
- **Rolagem horizontal fica dentro do container.** Use a classe `.scroll-x` de
  `globals.css` (que é `overflow-x: auto` mais `position: relative`) em vez de
  `overflow-x-auto` solto: sem o `position: relative`, a extensão rolável do
  container chega ao documento e a página inteira anda para o lado em 375px.
- Precisa de cor, raio ou easing novo? Adicione o token em `@theme` primeiro
  (alterar tokens exige autorização humana).
- CSS global só em `src/styles/globals.css`, e apenas para base do documento,
  requisitos das bibliotecas (as classes `.lenis`) e a **abertura teatral**.
  Nada de `.css` por componente, CSS-in-JS ou um segundo sistema de estilos
  paralelo ao Tailwind.
- A seção "Abertura teatral" de `globals.css` é a única coreografia declarada
  em CSS global. Ela está ali porque precisa existir antes da hidratação — o
  motivo completo está em
  [`animacao-e-webgl.md`](./animacao-e-webgl.md). **Não trate isso como
  precedente** para animações de componente: essas continuam em GSAP.
- Os `@keyframes` da abertura ficam fora do `@theme` de propósito: são de uso
  único e interno, e virar utilitário `--animate-*` inflaria a superfície de
  design tokens com animações que nada mais consome.
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
