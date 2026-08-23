## Why

O repositório é bootstrap técnico mais uma página de validação: roteamento por idioma,
tokens, GSAP, Lenis, R3F e acessibilidade provaram que funcionam juntos, mas o site do
festival não existe. Agora existe um protótipo de alta fidelidade — construído no Claude
Design e exportado para código em `prototipo-fenatevi/` — que define o portal inteiro:
nove telas, a narrativa em atos, os estados vazios, o comportamento mobile e um design
system nomeado **Nocturne Stage**, declarado em
[`prototipo-fenatevi/uploads/DESIGN.md`](../../../prototipo-fenatevi/uploads/DESIGN.md).

Esta change transporta esse protótipo para dentro da arquitetura do projeto. O protótipo
é a especificação visual e de comportamento; os guias de `docs/guides/` são a
especificação técnica. **Nada além do protótipo entra** — as melhorias e páginas
seguintes serão propostas depois, tomando o que aqui for implementado como base.

## What Changes

### O design system passa a ser o Nocturne Stage

- **BREAKING — os design tokens são substituídos.** O `@theme` de
  [`src/styles/globals.css`](../../../src/styles/globals.css) troca o tema neutro de
  bootstrap (acento âmbar `#e8b04b`, superfícies frias) pela paleta do `DESIGN.md`:
  bordô `#800020` como primária, ivory quente `#e5e2df` como texto, âmbar `#ffdb9d`
  como destaque, superfícies `#131312 → #353533`. Nomes de token atuais que não existem
  no `DESIGN.md` (`accent`, `accent-strong`, `on-accent`, `surface-raised`) são
  renomeados; todo consumo existente acompanha. _Requer autorização humana explícita —
  concedida._
- **BREAKING — os tokens de cenografia mudam de base.** `--color-curtain`,
  `--color-curtain-fold` e `--color-curtain-sheen` passam a derivar do bordô da marca em
  vez do vermelho arbitrário do bootstrap. Continuam nomeados como cenário e continuam
  fora da paleta. _Requer autorização humana explícita — concedida._
- **Duas famílias tipográficas entram**: **Bodoni Moda** (serifada, a voz do festival) e
  **Hanken Grotesk** (sem serifa, toda a informação funcional), carregadas por
  `next/font/google` — que baixa e auto-hospeda no build, sem requisição a terceiros em
  runtime e sem pacote novo no `package.json`. Novos tokens `--font-serif` e
  `--font-sans`, mais a escala tipográfica do `DESIGN.md`
  (`display-lg`…`caption`). _Requer autorização humana explícita — concedida._
- Escala de espaçamento (unidade 8px, `container-max` 1280px, gutters 24px, margens
  64/20px, stacks 16/32/80px) e raios (2px em botões e campos, 8px em cartões, pill em
  chips) do `DESIGN.md` viram tokens.
- **Contraste vence fidelidade.** Onde o protótipo usa ivory em opacidade que não atinge
  4,5:1 sobre a superfície (`rgba(229,226,223,0.4)` e `0.45` em texto corrido), o valor
  sobe até passar. WCAG 2.2 AA é portão de CI e é o critério que decide empates neste
  projeto.

### Nove rotas novas substituem a página de validação

`/` · `/programacao` · `/programacao/grade` · `/espetaculos/[id]` · `/oficinas/[id]` ·
`/espacos` · `/espacos/[id]` · `/memoria` · `/edicoes/[ano]` · `/noticias`, todas nos
três idiomas.

- **BREAKING — a home é reescrita.** Os dez atos do protótipo substituem a página de
  validação. `hero.tsx` sai; `stage-scene.tsx` sai da home (o código de
  `src/lib/animation/three/` e `use-webgl-support.ts` permanece no repositório, sem
  consumidor, à espera de um uso previsto no design).
- **A abertura teatral (`StageIntro`) permanece na home, sem alteração de
  comportamento.** Ela é a materialização de "The Reveal" do `DESIGN.md` e sua
  capability continua válida: segue exclusiva da home, segue ausente sob movimento
  reduzido, segue se encerrando sem JavaScript.
- **Os filtros da programação vivem na URL** (`?dia=`, `?frente=`, `?espaco=`), não em
  estado de cliente. É o que torna possíveis os links profundos que o próprio protótipo
  exige (Home → "Ver programação de hoje", cada frente do Ato VI, cada dia do Ato IV),
  mantém as telas de listagem como Server Components e faz os filtros funcionarem sem
  JavaScript.
- **Os segmentos de rota não são traduzidos** (`/en/programacao`, `/es/programacao`).
  Traduzi-los exigiria `pathnames` no next-intl, o que é alterar a estratégia de i18n —
  fora do escopo desta change e do protótipo.

### O acervo da edição 2024 vira conteúdo tipado

- Os dados embutidos no protótipo (7 espaços, 21 atividades, 2 oficinas, 8 dias de
  processos criativos, 2 homenageados, 3 livros, 12 linhas de ficha técnica da edição)
  passam a viver em `src/content/`, tipados em `src/types/`.
- **Política de idioma do acervo**: toda a interface — rótulos, filtros, estados vazios,
  navegação, rodapé — vai para `messages/` nos três idiomas. O acervo histórico
  (títulos, releases, fichas técnicas, biografias) permanece **em pt-BR**, marcado com
  `lang="pt-BR"` no elemento que o contém e precedido de um aviso traduzido de que o
  registro está no idioma original. Traduzir release artístico e ficha técnica sem
  revisão humana deturparia material de terceiros; marcar o idioma real é o
  comportamento correto para leitores de tela.
- A `currentEdition` de hoje (edição 12, setembro de 2026) é corrigida para os dados do
  protótipo: 22ª edição, 13 a 21 de outubro de 2026.
- **O aviso "conteúdo demonstrativo" é implementado como comportamento, não como texto
  fixo**: enquanto a edição vigente não tiver programação publicada, o portal exibe o
  acervo 2024 e diz que é isso que está fazendo. Quando a organização publicar a edição
  vigente, o aviso desaparece sem mudança de código.

### As imagens entram como material identificado

- Os 20 PNGs de `prototipo-fenatevi/assets/2024/` e as 8 fotografias de palco/espaço vão
  para `public/`, servidas por `next/image`. São extrações de baixa resolução do programa
  impresso — o modelo de conteúdo registra essa proveniência por imagem para que a
  substituição por originais seja um dado, não uma caçada no JSX.

### O que deliberadamente não entra

- **As anotações endereçadas a quem implementa não são publicadas**: "Prévia — base
  geográfica na implementação", "Imagem em baixa resolução — solicitar original", "Slot
  editorial — sem conteúdo publicado", "Protótipo de alta fidelidade". Anotações
  endereçadas ao visitante são publicadas ("Conteúdo demonstrativo · edição 2024",
  "Entrada franca", "Este espaço não recebe atividades nesta edição").
- **O controle "A11y" do cabeçalho não é implementado.** O próprio protótipo o rotula
  "Estado de demonstração — integração real na implementação": alto contraste, aumento
  de texto, redução de movimento e Libras são quatro funcionalidades que o protótipo não
  desenha, só anuncia. O portal já entrega WCAG 2.2 AA e respeita
  `prefers-reduced-motion` nativamente.
- **O mapa cultural é o esquema do protótipo, não um mapa geográfico.** Posições
  percentuais, `role="img"`, sem biblioteca de mapa, sem base geográfica — que o
  `CLAUDE.md` põe atrás de pedido explícito.
- **A tela "Experiência mobile" não vira rota.** É a especificação responsiva do
  protótipo: barra fixa com "agora", dias em rolagem horizontal, filtros em bottom sheet
  e navegação inferior permanente viram requisitos das telas reais.
- Fora de escopo: CMS, backend, busca no acervo, ingressos, edições anteriores a 2024,
  notícias com conteúdo real, e a transição de cortina bloqueando a navegação (a
  navegação nunca espera pela animação).

## Capabilities

### New Capabilities

- `acervo-do-festival`: o modelo de conteúdo do portal — edições, espaços, atividades,
  oficinas, processos criativos, homenageados e créditos; a política de idioma do acervo
  histórico; a proveniência das imagens; e como o portal se comporta quando a edição
  vigente ainda não tem programação publicada.
- `navegacao-do-portal`: as rotas do portal nos três idiomas, o cabeçalho que se
  condensa na rolagem, o menu de áreas em tela cheia, o rodapé institucional, o retorno
  contextual de cada tela interna e a transição de cortina entre páginas.
- `home-do-portal`: a home em atos — abertura, o que está em cena agora, o que está em
  cartaz, os oito dias, a capa editorial, as frentes de programação, a cidade como
  palco, a memória, as notícias e os realizadores.
- `programacao`: a consulta à programação — listagem filtrável por momento, dia, frente
  e espaço, agrupada por dia; e a grade diária em três visões (por espaço, por horário e
  semana inteira).
- `detalhe-de-atividade`: a página de um espetáculo (ficha técnica, release,
  acessibilidade da sessão, companhia, espaço, outras apresentações) e a página de uma
  oficina (vagas, turmas, requisitos e inscrição em formulário externo).
- `espacos-culturais`: o mapa cultural esquemático dos espaços do festival e a página de
  cada espaço com endereço e programação própria.
- `memoria-do-festival`: a linha do tempo das edições com seu estado de acervo, e a
  página completa da edição 2024.
- `noticias`: a área editorial do festival e seu estado de conteúdo ainda indisponível.

### Modified Capabilities

Nenhuma. `openspec/specs/` está vazio — a change `add-stage-intro` está completa mas
ainda não arquivada, e esta change **não altera nenhum requisito dela**: a abertura
continua exclusiva da home e as novas rotas não a exibem, que é exatamente o que aquela
spec já exige.

## Impact

**Estilos e tipografia**

- `src/styles/globals.css` — `@theme` reescrito (paleta, tipografia, espaçamento,
  raios); a seção da abertura teatral permanece, com as cores derivadas da nova base.
- `src/app/[locale]/layout.tsx` — carregamento das duas famílias por `next/font/google`.

**Rotas**

- `src/app/[locale]/page.tsx` — reescrita.
- `src/app/[locale]/programacao/`, `programacao/grade/`, `espetaculos/[id]/`,
  `oficinas/[id]/`, `espacos/`, `espacos/[id]/`, `memoria/`, `edicoes/[ano]/`,
  `noticias/` — novas, com `generateStaticParams` e `generateMetadata` onde couber.

**Componentes**

- `src/components/layout/` — cabeçalho reescrito (menu de áreas, condensação na
  rolagem), rodapé reescrito, cortina de transição nova.
- `src/components/sections/` — as seções da home e das telas internas; `hero.tsx`
  removido; `stage-intro.tsx` intocado.
- `src/components/ui/` — chip de filtro, cartão de atividade, linha de programação,
  divisor, rótulo de ato, aviso de conteúdo demonstrativo, imagem com proveniência;
  `button.tsx` ganha as variantes primária/secundária/ghost do `DESIGN.md`.
- `src/components/sections/stage-scene.tsx` — deixa de ser consumido pela home.

**Conteúdo e tipos**

- `src/content/` — acervo 2024, espaços, oficinas, processos criativos, homenageados,
  créditos, linha do tempo, parceiros; `festival.ts` corrigido para a 22ª edição.
- `src/types/festival.ts` — modelo ampliado.
- `src/lib/utils/` — derivações puras de programação (status de sessão, agrupamento por
  dia, fim previsto, filtros).
- `messages/pt-BR.json`, `en.json`, `es.json` — namespaces novos para toda a interface;
  `home.*` reescrito.

**Testes**

- Unitários ao lado de cada derivação e de cada componente com lógica.
- `e2e/` — novas specs de programação, grade, detalhe, espaços e memória; `home.spec.ts`
  e `accessibility.spec.ts` atualizados; a varredura do axe passa a cobrir todas as
  rotas.

**Assets**

- `public/` — 20 imagens de espetáculo, 4 de palco, 3 de espaço, 2 retratos e a capa do
  programa 2024, todas identificadas como material de baixa resolução no modelo de
  conteúdo.

**Documentação**

- `docs/guides/estilos-e-design-tokens.md` — o inventário de tokens e a tipografia.
- `docs/guides/i18n.md` — a política de idioma do acervo histórico.
- `docs/guides/arquitetura-e-convencoes.md` — as rotas do portal.
- `CLAUDE.md` e `AGENTS.md` — o estágio deixa de ser "bootstrap mais página de
  validação".

**Dependências**

Nenhum pacote novo. `next/font` é parte do Next.js; GSAP, Lenis e Three.js permanecem
instalados e o código da cena 3D continua no repositório.
