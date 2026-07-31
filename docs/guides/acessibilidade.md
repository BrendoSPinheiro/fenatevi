# Acessibilidade

Leia antes de: criar qualquer elemento interativo, alterar foco, ARIA ou
estrutura semântica.

Alvo: **WCAG 2.2 nível AA**. Não negociável — a home passa por varredura `axe` no
CI (`e2e/accessibility.spec.ts`) e precisa continuar passando.

- HTML semântico primeiro; ARIA só quando o elemento nativo não dá conta.
  `<a>` para navegar, `<button>` para agir.
- Uma única `<main>` por página, com o id compartilhado `MAIN_CONTENT_ID`.
- O skip link é o primeiro elemento focável (WCAG 2.4.1) e é um `<a>` nativo —
  funciona sem JavaScript.
- Todo controle interativo precisa de nome acessível.
- Navegação por teclado precisa funcionar em tudo, na ordem visual, inclusive no
  seletor de idioma (que é uma lista de links, não um menu em JS).
- Foco visível: o `:focus-visible` global cuida disso — **não remova o
  `outline`**. Se precisar customizar, substitua por algo com contraste
  equivalente.
- `lang` correto no `<html>`; elementos em outro idioma recebem seu próprio
  `lang` (ver os links do seletor de idioma).
- Alternativa textual para todo conteúdo não textual; use `VisuallyHidden` para
  texto só para leitores de tela — nunca `display: none` ou `visibility: hidden`,
  que removem o conteúdo da árvore de acessibilidade.
- Estado atual sinalizado por `aria-current="page"`, não apenas por cor.
- Sem áudio ou vídeo automático.
- Respeite `prefers-reduced-motion` — ver
  [`animacao-e-webgl.md`](./animacao-e-webgl.md).
- Ao criar modal, menu ou dropdown (nenhum existe hoje): foco preso enquanto
  aberto, `Esc` fecha, foco volta ao gatilho, `data-lenis-prevent` na região
  rolável, e o padrão ARIA correspondente seguido por inteiro — inclusive
  teclado — ou nada de ARIA.
- Mensagens de erro devem ser associadas programaticamente ao campo e anunciadas
  (`aria-describedby`, região `aria-live` quando surgirem depois). Ainda não há
  formulários no projeto.
