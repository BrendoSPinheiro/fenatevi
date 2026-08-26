---
name: Nocturne Stage
description: O programa impresso do FENATEVI, iluminado por luz de teatro — escuro editorial, bordô de marca, âmbar de ação.
colors:
  background: '#131312'
  surface: '#131312'
  surface-dim: '#131312'
  surface-bright: '#393937'
  surface-container-lowest: '#0e0e0d'
  surface-container-low: '#1c1c1a'
  surface-container: '#20201e'
  surface-container-high: '#2a2a28'
  surface-container-highest: '#353533'
  surface-variant: '#353533'
  foreground: '#e5e2df'
  foreground-muted: '#c6c3c0'
  foreground-subtle: '#a6a3a0'
  inverse-surface: '#e5e2df'
  inverse-on-surface: '#31302f'
  outline: '#a78a8a'
  outline-variant: '#584141'
  primary: '#ffb3b5'
  on-primary: '#680018'
  primary-container: '#800020'
  on-primary-container: '#ff828a'
  inverse-primary: '#af2b3e'
  secondary: '#ffdb9d'
  on-secondary: '#412d00'
  secondary-container: '#feb700'
  on-secondary-container: '#412d00'
  tertiary: '#bec6e0'
  on-tertiary: '#283044'
  tertiary-container: '#353d52'
  on-tertiary-container: '#dae2fd'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  focus: '#ffdb9d'
  success: '#7fd6a1'
  curtain: '#800020'
  curtain-fold: '#4a0012'
  curtain-sheen: '#a8102f'
typography:
  display-lg:
    fontFamily: 'Fraunces, ui-serif, Georgia, Times New Roman, serif'
    fontSize: 'clamp(2.75rem, 8vw, 5rem)'
    fontWeight: 700
    lineHeight: 1.125
    letterSpacing: '-0.02em'
    fontVariation: "'WONK' 1"
  display-md:
    fontFamily: 'Fraunces, ui-serif, Georgia, Times New Roman, serif'
    fontSize: 'clamp(2.25rem, 6vw, 3.5rem)'
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: '-0.01em'
    fontVariation: "'WONK' 1"
  headline-lg:
    fontFamily: 'Fraunces, ui-serif, Georgia, Times New Roman, serif'
    fontSize: 'clamp(2rem, 4.5vw, 2.5rem)'
    fontWeight: 500
    lineHeight: 1.2
  body-lg:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, Segoe UI, Roboto, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.556
  body-md:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, Segoe UI, Roboto, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, Segoe UI, Roboto, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 600
    lineHeight: 1.429
    letterSpacing: '0.05em'
    fontVariation: "'wdth' 110"
  caption:
    fontFamily: 'Archivo, ui-sans-serif, system-ui, Segoe UI, Roboto, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 400
    lineHeight: 1.333
rounded:
  sm: '0.125rem'
  DEFAULT: '0.25rem'
  md: '0.375rem'
  lg: '0.5rem'
  xl: '0.75rem'
  full: '9999px'
spacing:
  unit: '8px'
  gutter: '24px'
  margin-mobile: '20px'
  margin-desktop: '64px'
  stack-sm: '16px'
  stack-md: '32px'
  stack-lg: '80px'
  container-max: '1280px'
components:
  button-primary:
    backgroundColor: '{colors.primary-container}'
    textColor: '{colors.foreground}'
    typography: '{typography.label-md}'
    rounded: '{rounded.sm}'
    padding: '10px 20px'
    height: '44px'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.foreground}'
    typography: '{typography.label-md}'
    rounded: '{rounded.sm}'
    padding: '10px 20px'
    height: '44px'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.foreground}'
    typography: '{typography.label-md}'
    rounded: '{rounded.sm}'
    padding: '10px 20px'
    height: '44px'
  chip-idle:
    backgroundColor: 'transparent'
    textColor: '{colors.foreground-muted}'
    rounded: '{rounded.full}'
    padding: '8px 16px'
    height: '44px'
  chip-active:
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.on-secondary}'
    rounded: '{rounded.full}'
    padding: '8px 16px'
    height: '44px'
  card:
    backgroundColor: '{colors.surface-container-low}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.lg}'
  tag-neutral:
    backgroundColor: 'transparent'
    textColor: '{colors.foreground-subtle}'
    rounded: '{rounded.sm}'
    padding: '4px 8px'
  empty-state:
    backgroundColor: 'transparent'
    textColor: '{colors.foreground}'
    rounded: '{rounded.lg}'
    padding: '40px 24px'
---

# Design System: Nocturne Stage

## Overview

**Creative North Star: "O Programa Impresso Iluminado"**

O acervo do FENATEVI não nasceu numa tela. Ele nasceu num programa impresso —
títulos transcritos com a grafia original, fichas técnicas em coluna, capas de
270px extraídas de papel digitalizado. O sistema visual reconhece essa
procedência em vez de disfarçá-la: o portal é aquele programa, colocado sob luz
de teatro. Serifa Fraunces para as vozes de cartaz, Archivo em maiúsculas
espaçadas para a rubrica, e um escuro que não é fundo de aplicativo — é palco
vazio antes da entrada.

A personalidade é **editorial, contida e escura por convicção**. O `#131312` não
é o preto neutro de um tema dark; é um carvão levemente quente, e sobre ele o
texto assenta em ivory `#e5e2df`, não em branco. Toda a paleta de texto é fechada
em três tons medidos — 14,4:1, 10,6:1 e 7,4:1 sobre a superfície mais escura —
porque alfa arbitrário sobre preto é como a maioria dos temas escuros reprova em
contraste sem perceber. Aqui isso é proibido por token, não por disciplina.

A densidade é generosa: 1280px de conteúdo, margens de 64px no desktop, atos
inteiros separados por 80px. Nada compete pela atenção ao mesmo tempo. O gesto
teatral existe — a cortina de veludo que abre a home, a cortina que revela cada
rota nova — mas é sempre **cenografia acompanhando o conteúdo, nunca condição
para lê-lo**: a abertura se encerra sozinha em CSS, sem JavaScript, e sob
`prefers-reduced-motion` ela simplesmente não acontece.

**Key Characteristics:**

- Escuro quente (`#131312`), não preto neutro nem cinza-azulado
- Fraunces com eixo `WONK` ativo nos displays; Archivo com `wdth 110` nos rótulos
- Três tons de texto, todos ≥ 7,4:1 — nenhum alfa arbitrário
- Elevação por degrau de superfície e por luz; nunca por sombra projetada
- Raio pequeno (2px em controles, 8px em cartões, pill só em chips)
- Bordô como identidade, âmbar como sinal — nunca o contrário
- Movimento é cenografia removível; o conteúdo existe sem ele

## Colors

Uma paleta de palco: escuro quente e fechado, cortado por um único bordô de
identidade e um âmbar raro que só aparece onde há luz incidindo.

### Primary

- **Bordô de Cortina** (`primary-container`): a cor da marca em forma de tecido.
  Preenche o botão primário e é a base do veludo da abertura. É a única cor de
  superfície saturada do sistema.
- **Rosa de Refletor** (`primary`): o bordô sob luz — usado em texto, contorno e
  no glow do hover do botão primário, onde o `primary-container` sólido seria
  escuro demais para ler.
- **Bordô Invertido** (`inverse-primary`): a marca sobre superfícies claras
  (imagem de compartilhamento, fundo invertido).

### Secondary

- **Âmbar de Palco** (`secondary`): a luz. Anel de foco em todo o portal, chip de
  filtro ativo, título do aviso de acervo, seleção de texto, ícone da navegação
  mobile. Nunca é cor de superfície ampla.
- **Âmbar Saturado** (`secondary-container`): o facho de preenchimento da
  abertura teatral. Cenografia, não interface.

### Tertiary

- **Azul de Bastidor** (`tertiary`): reservado. Existe na paleta do protótipo e
  ainda não tem papel atribuído na interface — não invente um.

### Neutral

- **Palco** (`background` / `surface`): o vazio. Fundo do documento e de todas as
  regiões de página.
- **Escala de Contêiner** (`surface-container-lowest` → `surface-container-highest`):
  cinco degraus que criam separação **sem borda e sem sombra**. `lowest` é o poço
  (navegação mobile, moldura de imagem); `low` é o cartão; os degraus altos são
  para sobreposição.
- **Palco Iluminado** (`surface-bright`): o degrau mais claro em que texto ainda
  pode assentar — e o pior caso das contas de contraste.
- **Ivory** (`foreground`), **Ivory Recuado** (`foreground-muted`), **Ivory Distante**
  (`foreground-subtle`): a escala fechada de texto. Nada abaixo de `subtle`
  carrega informação.
- **Contorno** (`outline`) e **Contorno Recuado** (`outline-variant`): a linha do
  cartão em repouso é `outline-variant`; ela sobe para `outline` no hover.

### Cenografia (fora da paleta de interface)

- **Veludo, Prega e Brilho** (`curtain`, `curtain-fold`, `curtain-sheen`): descrevem
  um objeto de cena. Derivam do bordô da marca em vez de um vermelho arbitrário,
  porque a cortina é a marca em forma de tecido.

### Named Rules

**A Regra do Bordô e do Âmbar.** O bordô **identifica** — cortina, botão
primário, moldura da marca. O âmbar **sinaliza** — foco, filtro ativo, aviso de
acervo. Se um elemento não está dizendo "preste atenção aqui", ele não é âmbar.
Trocar os dois papéis quebra o sistema mais do que trocar os hexes.

**A Regra dos Três Tons.** Texto é `foreground`, `foreground-muted` ou
`foreground-subtle`. Não existe quarta opção, e alfa arbitrário em texto
(`text-foreground/40`) é proibido: sobre `#131312`, α = 0,45 dá ≈ 4,2:1 e reprova
em AA. Abaixo de `subtle`, apenas elemento decorativo com `aria-hidden`,
separador ou traço.

**A Regra da Cenografia Isolada.** As três cores de cortina nunca aparecem em
botão, link, superfície ou estado. Elas pertencem à cena; a interface não as
importa.

## Typography

**Display Font:** Fraunces (fallback: `ui-serif`, Georgia, Times New Roman, serif)
**Body Font:** Archivo (fallback: `ui-sans-serif`, system-ui, Segoe UI, Roboto)

Ambas entram por `next/font/google` com auto-hospedagem, expostas como
`--font-fraunces` e `--font-archivo`.

**Character:** A Fraunces é a voz do cartaz — serifa variável, com o eixo `WONK`
ligado nos dois tamanhos de display, que abre a cauda do `g` e inclina os
terminais. Ela declama. A Archivo é a voz do programa: neutra no corpo,
maiúscula e alargada (`wdth 110`) na rubrica, onde precisa parecer impressa e não
espaçada à força.

### Hierarchy

- **Display LG** (700, `clamp(2.75rem, 8vw, 5rem)`, 1.125, `WONK 1`): o nome do
  festival e o título de abertura de cada tela. Um por página.
- **Display MD** (600, `clamp(2.25rem, 6vw, 3.5rem)`, 1.15, `WONK 1`): abertura de
  seção dentro de uma tela longa.
- **Headline LG** (500, `clamp(2rem, 4.5vw, 2.5rem)`, 1.2): título de espetáculo,
  de oficina, de espaço. Sem `WONK` — aqui a fonte informa, não declama.
- **Body LG** (400, 18px, 1.556): release, statement, texto de leitura contínua.
- **Body MD** (400, 16px, 1.5): o corpo padrão do portal.
- **Label MD** (600, 14px, `0.05em`, maiúsculas, `wdth 110`): rótulo de campo,
  botão, categoria, rubrica de programa.
- **Caption** (400, 12px, 1.333): crédito, proveniência, nota de rodapé.

Cabeçalhos `h1`–`h3` recebem `text-wrap: balance` e `line-height: 1.15`;
parágrafos recebem `text-wrap: pretty`. O corpo do documento roda em `line-height:
1.6`.

### Named Rules

**A Regra da Escala Amarrada.** Família, tamanho, peso, entrelinha e tracking
andam juntos ou não andam. A escala vive em `ui/text.tsx`, deliberadamente
**não** como utilitário do Tailwind — como utilitário, `text-display-lg
font-normal` desmontaria a hierarquia pela metade e ninguém notaria na revisão.

**A Regra do WONK Reservado.** O eixo `WONK` só nos dois displays. Ele é a voz do
festival no cartaz, não no corpo da grade — que precisa desaparecer para ser
lida.

**A Regra do Acervo Marcado.** Todo texto de acervo (título, release, ficha
técnica, biografia) permanece em pt-BR nas páginas em inglês e espanhol, e passa
por `ui/archive-text.tsx`, que aplica `lang="pt-BR"` quando a página não está em
português. É requisito de pronúncia em leitor de tela (WCAG 3.1.2), não
preferência editorial.

## Layout

Coluna central de **1280px** (`--container-max`), com margens de **20px no mobile
e 64px a partir de `lg`** — aplicadas exclusivamente por `ui/container.tsx`, que
aceita `as` para não custar um `<div>` extra sobre um `<section>` ou `<main>`.

O ritmo vertical é de **8px**, com três degraus de separação nomeados: `stack-sm`
(16px) entre blocos irmãos, `stack-md` (32px) entre grupos, `stack-lg` (80px)
entre atos inteiros de uma página. A goteira horizontal padrão é 24px.

**Responsivo.** O portal é mobile-first e muda de estrutura em `md` (768px): a
navegação principal do cabeçalho aparece, e a barra inferior de quatro colunas
desaparece. As margens de contêiner mudam em `lg` (1024px). Tipografia não usa
breakpoint — cada variante carrega seu próprio `clamp()`.

**Rolagem horizontal contida.** A grade da semana e as tiras de dias rolam para o
lado dentro de si, via `.scroll-x`. `overflow-x: auto` sozinho não basta: a
extensão rolável ainda chega ao `scrollWidth` do documento e o viewport passa a
rolar junto. `position: relative` no próprio container é o que resolve na origem.

### Named Rules

**A Regra do Documento Que Não Anda de Lado.** Nenhum container rolável pode
vazar para o viewport. Em 375px, a página inteira andando de lado é o defeito
mais visível que este layout pode ter — e `html { overflow-x: hidden }` foi
verificado e **não** o resolve, apenas o esconde.

**A Regra dos Filtros na URL.** Todo filtro é um link que altera a query, nunca
estado de cliente. É o que dá link profundo, resultado compartilhável e
funcionamento sem JavaScript de uma vez só.

## Elevation & Depth

**Este sistema não usa sombra projetada.** Sobre `#131312`, uma sombra não é
visível — ela apenas acrescenta peso de renderização e a ilusão de profundidade
que nunca chega. A profundidade vem de duas outras fontes:

1. **Degrau de superfície.** A escala `surface-container-*` é o mecanismo
   estrutural de elevação. Um cartão é `surface-container-low` sobre `surface`;
   uma sobreposição sobe mais um degrau. Separação sem borda, sem sombra.
2. **Luz.** O único `box-shadow` do sistema é um **glow**, não uma sombra: o
   botão primário ganha `0 0 24px -6px var(--color-primary)` no hover — bordô
   irradiando, como um objeto sob refletor.

### Shadow Vocabulary

- **Glow de Refletor** (`box-shadow: 0 0 24px -6px var(--color-primary)`): resposta
  de hover do botão primário. Único uso legítimo de `box-shadow` no portal.
- **Contorno de Foco** (`outline: 3px solid var(--color-focus)` com
  `outline-offset: 3px`): global, em `:focus-visible`. Âmbar, 3px, nunca
  removido, nunca substituído por sombra.

### Named Rules

**A Regra da Luz, Não da Sombra.** Profundidade se declara com superfície mais
clara ou com brilho. `box-shadow` com deslocamento (`0 4px 12px …`) está proibido
neste sistema — é o gesto de um tema claro aplicado a um palco.

## Shapes

Raio pequeno e deliberado, herdado da linguagem de material impresso:

- **2px** (`rounded-sm`) em botões, tags e no anel de foco — quase reto, com o
  canto apenas quebrado.
- **8px** (`rounded-lg`) em cartões, avisos, estados vazios e molduras de imagem.
- **Pill** (`rounded-full`) exclusivamente em chips de filtro, onde a forma
  distingue "isto é acionável e alternável" de "isto é um marcador de leitura".

Bordas são de 1px, sempre em `outline-variant` em repouso, subindo para `outline`
no hover de superfícies interativas. O estado vazio é o único lugar com borda
tracejada — a linha interrompida diz "aqui caberia conteúdo" sem precisar de
ilustração.

### Named Rules

**A Regra do Pill Reservado.** Só chip é pill. Um marcador não interativo com
forma de chip promete uma ação que não existe; quando o marcador precisa levar a
algum lugar, o componente certo é `Chip`, que já é um link.

## Components

### Buttons

Refinados e contidos: discretos, editoriais, sem gestos desnecessários. O
controle desaparece para o conteúdo aparecer.

- **Shape:** canto quase reto (2px), altura mínima de 44px — alvo de toque do
  WCAG 2.5.8, aplicado em todo o portal e não só na navegação mobile.
- **Tipografia:** Archivo 14px, 600, maiúsculas, tracking `0.1em`.
- **Primary:** bordô sólido (`primary-container`) com ivory por cima (8,4:1).
  Hover acende o glow de refletor.
- **Secondary:** contorno ivory de 1px a 60% de opacidade, fundo transparente;
  hover preenche a 10%.
- **Ghost:** sem caixa; hover adiciona **sublinhado** com offset de 4px. O
  sublinhado é o que impede que a única pista de interação seja a cor.
- **Focus:** herdado do `:focus-visible` global (âmbar 3px). Nenhuma variante
  redefine foco.
- **Disabled:** 50% de opacidade e `cursor: not-allowed`.
- `buttonClassName()` é exportado para que um link que navega continue sendo um
  `<a>` — só o visual é compartilhado, nunca a semântica.

### Chips

- **Style:** pill com borda de 1px, altura mínima de 44px, Archivo 14px/600 com
  tracking `0.04em`, `white-space: nowrap`.
- **Idle:** borda `outline-variant`, fundo transparente, texto
  `foreground-muted`; hover sobe borda e texto um degrau.
- **Active:** preenchimento âmbar sólido com `on-secondary` por cima, **mais** um
  marcador `✓` antes do texto. O estado ativo nunca se distingue só pela cor
  (WCAG 1.4.1).
- **Semântica:** sempre um `<a>`, com `aria-current="true"` — nunca
  `aria-pressed`, que pertence a `role="button"` e é violação crítica em um link.

### Cards / Containers

- **Corner Style:** 8px.
- **Background:** `surface-container-low` sobre `surface`.
- **Shadow Strategy:** nenhuma. Ver Elevation & Depth.
- **Border:** 1px `outline-variant`, subindo para `outline` no hover.
- **Semântica:** `as` aceita `article` ou `li` — o cartão não impõe `<div>` a um
  bloco que tem significado.

### Tags

Marcador de leitura (frente de programação, classificação, entrada franca), não
interativo. Borda de 1px, 2px de raio, Archivo 11px/700 maiúscula com tracking
`0.12em`. Três tons: `neutral` (`foreground-subtle`), `primary` e `secondary`,
os dois últimos com borda a 60%.

### Navigation

- **Desktop (≥768px):** cabeçalho `sticky` com fundo `surface/90` e
  `backdrop-blur-sm`, borda inferior `outline-variant/60`. A marca em Fraunces
  20px/700 com tracking `0.16em`; os itens em Archivo 12px/600 maiúsculo,
  `foreground-muted` subindo para `foreground` no hover.
- **Condensação na rolagem:** apenas o respiro vertical muda (`padding-block`
  para 8px), via atributo em `<html>`. **Nenhum item muda de posição, some ou
  troca de ordem** — e sem JavaScript o cabeçalho fica no estado expandido, que é
  o completo.
- **Mobile (<768px):** barra inferior `sticky` de quatro colunas sobre
  `surface-container-lowest`, altura mínima de 56px por alvo, rótulo em 11px
  maiúsculo com um glifo âmbar em Fraunces acima.

### Inputs / Fields

O portal não tem formulários — não há autenticação, busca nem envio de dados. Os
únicos controles de entrada são os filtros, e eles são links (ver Chips). **Não
invente um sistema de campos**: quando existir um, ele herda raio de 2px, altura
de 44px e o foco âmbar global.

### Empty State

Bloco de conteúdo comum, não alerta — um resultado vazio é uma resposta, não uma
falha, e nada aqui deve interromper quem usa leitor de tela. Borda tracejada de
1px, 8px de raio, título em Fraunces 24px, descrição em `foreground-muted`
limitada a `max-w-prose`, e uma ação opcional que tira o visitante do estado.

### Signature: Abertura Teatral (`StageIntro`)

A assinatura do sistema. Uma cortina de veludo em duas metades de 51% (2% de
sobreposição no centro, para que nenhuma fresta apareça em subpixel), construída
inteiramente em gradientes: `radial-gradient` para a profundidade das bordas,
`repeating-linear-gradient` em porcentagem para as pregas — proporcionais à
largura, sem emenda em qualquer viewport — e `linear-gradient` vertical para o
volume cilíndrico. Dois fachos de âmbar entram por cima, e uma frase se sustenta
por 1,05s antes das cortinas abrirem.

A coreografia inteira mora em **CSS**, não em timeline de JavaScript, e o motivo
é de ordem de execução: CSS é render-blocking, JavaScript não. Uma cortina
desenhada depois da hidratação não é uma cortina — é um flash de conteúdo com um
pano caindo por cima. Duração total 4,65s, abaixo do limite de 5s do WCAG 2.2.2.
Sob `prefers-reduced-motion` o elemento é `display: none` — ausência, não versão
curta. Ao componente cabe apenas dispensar, desmontar e registrar.

### Signature: Cortina de Transição

Ao contrário da abertura, esta cortina **revela**: é pintada já cobrindo a rota
nova e se recolhe em `scaleY` com `--ease-curtain`. **A navegação nunca espera a
animação.** `pointer-events: none` do primeiro ao último quadro; só `transform` é
animado; sob movimento reduzido o componente nem é montado.

## Do's and Don'ts

### Do:

- **Do** usar `foreground`, `foreground-muted` ou `foreground-subtle` para todo
  texto. Se um tom intermediário parece necessário, o problema é a hierarquia,
  não a paleta.
- **Do** separar superfícies com um degrau de `surface-container-*` e uma borda
  de 1px em `outline-variant`.
- **Do** consumir a tipografia por `ui/text.tsx` (ou `textClassName`), nunca
  montando família + tamanho + peso à mão.
- **Do** aplicar largura e margens por `ui/container.tsx`, passando `as` para
  aproveitar o elemento semântico que já existe.
- **Do** manter 44px de alvo mínimo em qualquer controle, e deixar o foco
  `:focus-visible` global intacto (âmbar 3px, offset 3px).
- **Do** distinguir todo estado por forma **e** cor — o `✓` do chip ativo é o
  modelo.
- **Do** conter rolagem horizontal com `.scroll-x`, e verificar em 375px que o
  documento não anda de lado.
- **Do** tratar movimento como cenografia removível: a página precisa estar
  completa e legível com `prefers-reduced-motion`, sem WebGL e sem JavaScript.
- **Do** marcar texto de acervo com `ui/archive-text.tsx`.

### Don't:

- **Don't** usar `box-shadow` com deslocamento. Sombra projetada não se vê sobre
  `#131312`; o único `box-shadow` legítimo é o glow de refletor no hover do botão
  primário.
- **Don't** escrever alfa arbitrário em texto (`text-foreground/40`,
  `rgba(229,226,223,0.45)`). Sobre a superfície escura isso reprova em AA — e o
  protótipo original fazia exatamente isso.
- **Don't** usar as cores de cortina (`curtain`, `curtain-fold`, `curtain-sheen`)
  em botão, link, superfície ou estado. Elas são objeto de cena.
- **Don't** promover o âmbar a cor de marca nem o bordô a cor de sinalização. Os
  papéis são fixos.
- **Don't** dar forma de pill a algo que não é um chip acionável.
- **Don't** ligar o eixo `WONK` fora dos dois tamanhos de display.
- **Don't** derivar para **site de festival de música**: gradiente neon, cartaz
  lotado, contagem regressiva piscando, energia de line-up. Este é um festival de
  teatro público, e a sobriedade é parte do que ele comunica.
- **Don't** derivar para **dashboard escuro de SaaS**: cinza-azulado, cards com
  sombra, ícone em toda parte, densidade de painel. O escuro aqui é palco, não
  produto.
- **Don't** esticar imagem marcada como `isLowResolution` além do seu teto de
  largura renderizada — ampliar o borrão não é apresentar o acervo, é degradá-lo.
- **Don't** condicionar leitura de conteúdo a animação, WebGL ou JavaScript. Esta
  é a regra que vence todas as outras deste documento.
