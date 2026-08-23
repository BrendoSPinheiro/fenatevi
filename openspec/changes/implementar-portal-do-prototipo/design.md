## Context

Ver [`proposal.md`](./proposal.md) — Why. O que importa aqui é a distância entre as duas
pontas.

**A ponta de origem.** `prototipo-fenatevi/` é um artefato do Claude Design: um único
HTML de 1.884 linhas com estilos inline, um dialeto de template (`<sc-if>`, `<sc-for>`,
`{{ }}`), uma classe `DCLogic` que devolve um objeto gigante de valores por render, e
todos os dados da edição 2024 embutidos no fim do arquivo (`V`, `EV`, `WS`, `PROC`,
`HON`). Ele tem um "relógio de demonstração" (`demoDay`, `demoHour`) exposto como prop
do editor, porque no protótipo o tempo é um controle deslizante. Nada disso sobrevive —
o que sobrevive é a **decisão de produto**: quais telas existem, o que cada uma mostra,
em que ordem, e como cada uma se comporta quando o conteúdo falta.

**A ponta de destino.** Um Next.js 16 App Router com Server Components por padrão,
Tailwind v4 configurado em CSS, next-intl com três idiomas, sem backend, sem estado
global, sem cliente HTTP, sem variáveis de ambiente. O `CLAUDE.md` proíbe inventar
arquitetura para problemas que o projeto não tem.

**As restrições que moldam tudo abaixo:**

- A experiência precisa continuar completa sem animação e sem WebGL — regra que vence as
  outras.
- Nenhum texto visível no JSX; tudo em `messages/`, nos três idiomas.
- WCAG 2.2 AA e zero erro de hidratação são portões de CI.
- Server Component é o padrão; `'use client'` só nas folhas.
- Sem `any`; sem cor, raio ou easing arbitrário quando existe token.
- Nenhuma dependência nova.

## Goals / Non-Goals

**Goals:**

- Transportar as nove telas do protótipo com fidelidade de comportamento, não de markup.
- Trocar o design system inteiro de uma vez, sem deixar o repositório com duas paletas
  convivendo.
- Deixar o acervo 2024 como dado tipado, verificável no `pnpm typecheck`, substituível
  pela edição vigente sem tocar em componente.
- Deixar toda derivação de programação (situação da sessão, término, agrupamento,
  filtragem) em funções puras testáveis, fora dos componentes.
- Manter a home estaticamente gerada apesar de ela mostrar "o que está em cena agora".

**Non-Goals:**

- Reproduzir o markup, os estilos inline ou o modelo de estado do protótipo.
- Reproduzir o relógio de demonstração como controle de usuário.
- Abstrair para uma edição genérica além do que o acervo 2024 e a edição vigente
  exigem — não há CMS, e uma camada de adaptação sem segundo consumidor é especulação.
- Introduzir `src/features/`, estado global, biblioteca de formulário, mapa geográfico ou
  qualquer pacote novo.

## Decisions

### 1. Tokens: substituição completa, não convivência

O `@theme` é reescrito de uma vez, com os nomes do `DESIGN.md`. Os nomes atuais que não
existem lá (`accent`, `accent-strong`, `on-accent`, `surface-raised`) desaparecem e seus
consumos migram no mesmo commit.

**Por quê:** manter os dois conjuntos em paralelo com um período de migração criaria um
repositório onde `bg-surface` e `bg-surface-container` significam coisas diferentes e
ninguém sabe qual é a certa. O projeto tem 12 componentes; a migração de uma vez custa
menos que a ambiguidade.

O `DESIGN.md` traz uma contradição interna: o frontmatter define superfícies quentes
(`#131312`, `#20201e`) e a prosa de "Elevation & Depth" fala em "Pure black (#050505)" e
"Midnight Blue (#0F172A)". **O frontmatter vence** — é ele que o protótipo usa em cada
uma das 1.884 linhas. Os hexes soltos da prosa são resíduo e são ignorados.

**Tons de texto viram tokens; alfa arbitrário em texto é proibido.** O protótipo usa
`rgba(229,226,223,α)` com α entre 0,35 e 0,8 espalhado por todo lado. Sobre `#131312`,
α = 0,4 dá ≈ 3,6:1 e α = 0,45 dá ≈ 4,2:1 — os dois reprovam em AA para texto normal. Em
vez de corrigir caso a caso, define-se uma escala fechada:

| Token                       | Valor proposto | Contraste sobre `#131312` | Uso                               |
| --------------------------- | -------------- | ------------------------- | --------------------------------- |
| `--color-foreground`        | `#e5e2df`      | ≈ 13,9:1                  | títulos, texto principal          |
| `--color-foreground-muted`  | `#a6a3a0`      | ≈ 7,4:1                   | texto secundário, descrições      |
| `--color-foreground-subtle` | `#8a8785`      | ≈ 5,3:1                   | rótulos, metadados, texto pequeno |

Abaixo disso, só elemento decorativo (`aria-hidden`), separador ou traço. Os valores são
verificados na implementação; a regra é o piso de 4,5:1, não o hex.

**Alternativa considerada:** manter os alfas do protótipo e adicionar exceções no axe.
Rejeitada — silenciar o portão em vez de passar por ele.

### 2. Tipografia: `next/font/google`, e a escala como componentes de texto

Bodoni Moda e Hanken Grotesk entram por `next/font/google` no layout. Isso baixa e
auto-hospeda no build: nenhuma requisição a terceiros em runtime, nenhum pacote novo,
`font-display: swap` e preload automáticos. Ambas são fontes variáveis — carrega-se
apenas o eixo de peso, com `subsets: ['latin']`.

A escala do `DESIGN.md` (`display-lg`, `display-md`, `headline-lg`, `body-lg`, `body-md`,
`label-md`, `caption`) **não** vira utilitário Tailwind. Cada entrada amarra família,
tamanho, peso, entrelinha e tracking simultaneamente — sete propriedades que precisam
andar juntas. Como utilitário, nada impede escrever `text-display-lg font-normal` e
desmontar a escala. Vira, em vez disso, um componente `ui/text.tsx` com uma prop
`variant`, seguindo o padrão de `Record<Variant, string>` já usado em
[`button.tsx`](../../../src/components/ui/button.tsx).

Os tamanhos fixos do `DESIGN.md` são valores de desktop; o protótipo usa `clamp()` em
toda parte. A escala é traduzida para `clamp()` com o valor do `DESIGN.md` como teto,
preservando a `headline-lg-mobile` como piso onde ela está declarada.

### 3. Modelo de conteúdo: uma edição, listas planas, referências por id

`src/content/` ganha um módulo por coleção (`venues`, `activities`, `workshops`,
`creativeProcesses`, `honorees`, `books`, `credits`, `partners`, `editions`), cada um
exportando um `readonly` array tipado. Referências entre coleções são `id`s.

A integridade referencial é garantida por tipo, não por validação em runtime: os `id`s de
espaço são uma união literal derivada do próprio array de espaços
(`(typeof venues)[number]['id']`), de modo que uma atividade apontando para um espaço
inexistente é um erro de `pnpm typecheck`. Não há schema validator no projeto e não é
preciso um: o dado é estático e o compilador é o validador.

**Horário é dado estruturado, não string.** O protótipo guarda `time: '19h30'`. Isso
funciona em pt-BR e quebra nos outros dois idiomas — em inglês o mesmo horário é
"7:30 PM". O acervo guarda data e hora em ISO no fuso do festival; a formatação é
responsabilidade de `src/lib/utils/format.ts`, por locale, via `Intl`. O mesmo vale para
"13 OUT", "domingo" e "50 min".

**Frente de programação é enum traduzida; nome próprio é acervo.** `mostra-oficial`,
`mostra-paralela`, `oficina`, `lancamento` e `processo-criativo` são chaves de tradução —
"Mostra Oficial" tem tradução legítima. Mas "7ª Mostra Paralela Vera Viana" é nome
próprio que homenageia uma pessoa: fica no acervo, em pt-BR, e não é traduzido.

**Proveniência de imagem é campo, não comentário.** Cada imagem declara `src`,
`alt` (chave de tradução ou texto pt-BR conforme o caso), `provenance`
(`'programa-impresso-2024' | 'registro-original'`) e `isLowResolution`. Levantar o que
precisa de arquivo original vira um `filter`.

### 4. Rotas: Server Components, filtros em `searchParams`

Todas as telas são Server Components. `'use client'` fica restrito a cinco folhas: o
cabeçalho que reage à rolagem, o diálogo de menu, o painel de filtros mobile, a cortina
de transição e o bloco de "em cena agora".

As páginas de detalhe usam `generateStaticParams` sobre o acervo — 21 espetáculos, 2
oficinas, 7 espaços e 1 edição são estáticos no build. A home é estática. Programação e
grade leem `searchParams` e portanto renderizam sob demanda, o que é irrelevante: não há
I/O, só computação sobre um array em memória.

**Os filtros são links, não estado.** Cada chip é um `Link` de `@/lib/i18n/navigation`
para a mesma rota com a query alterada. Isso resolve de uma vez: o link profundo que a
home precisa, o compartilhamento de resultado, o funcionamento sem JavaScript, e a
ausência de estado de cliente na tela mais complexa do portal.

**Alternativa considerada:** estado de cliente com `useState`, como no protótipo.
Rejeitada — tornaria `/programacao` um Client Component inteiro, quebraria os links
profundos que o próprio protótipo desenha, e exigiria sincronizar estado com URL de
qualquer forma.

**Os segmentos não são traduzidos.** `/en/programacao`, não `/en/programme`. Traduzir
segmentos exige `pathnames` no next-intl, que é alterar a estratégia de i18n — atrás de
autorização humana e fora do escopo do protótipo, que é monolíngue.

### 5. O relógio: o servidor decide o que pode, o cliente refina o resto

Este é o ponto onde é fácil quebrar a hidratação, e o protótipo não ajuda — lá o tempo é
um slider.

A regra: **o estado de tempo é derivado da janela da edição exibida, não de `Date.now()`,
sempre que a janela já esteja inteiramente no passado ou no futuro.**

- A edição exibida hoje é a de 2024, inteiramente no passado. O servidor sabe disso no
  build, com certeza que não expira: renderiza o estado "edição encerrada", estaticamente,
  sem relógio nenhum.
- Quando a edição exibida contiver o instante corrente, o servidor renderiza o baseline
  independente de relógio — a programação completa do dia, com os horários de cada
  sessão — e um Client Component em folha refina para "em cena agora" / "a seguir" depois
  da montagem, usando o fuso `America/Sao_Paulo`.

O componente de refino não renderiza nada diferente do servidor no primeiro render: ele
começa com o mesmo baseline e só troca em `useEffect`. Sem `suppressHydrationWarning`,
sem divergência.

**Trade-off assumido:** sem JavaScript, o visitante não vê o distintivo "em cena agora" —
vê a programação completa do dia com todos os horários. É informação completa, não
degradada. A regra do projeto é a experiência sobreviver sem animação e sem WebGL, e ela
sobrevive.

**Alternativa considerada:** renderização dinâmica com o horário da requisição.
Rejeitada — tornaria a home não-estática para exibir um distintivo, e o horário da
requisição fica obsoleto no instante seguinte de qualquer forma.

### 6. i18n: dois regimes, fronteira explícita

Interface e acervo têm regimes diferentes, e a fronteira precisa ser óbvia no código,
não uma convenção que se perde.

- **Interface** → `messages/`, três idiomas, namespaces espelhando as capabilities
  (`nav`, `home`, `programacao`, `grade`, `espetaculo`, `oficina`, `espacos`, `memoria`,
  `edicao`, `noticias`, `acervo`), mais os existentes.
- **Acervo histórico** → `src/content/`, pt-BR, sempre renderizado por um único
  componente `ui/archive-text.tsx` que aplica `lang="pt-BR"` quando o locale corrente não
  é pt-BR e não aplica nada quando é.

Centralizar isso num componente é o que impede a regra de virar folclore: se o texto do
acervo passa por ele, o `lang` está certo; se não passa, a revisão vê texto cru no JSX,
que já é proibido por outro motivo.

O aviso de idioma (uma vez por página, antes do primeiro bloco de acervo) vem de
`messages/`, nos três idiomas.

### 7. Cortina de transição: revela, não bloqueia

O protótipo faz a cortina descer, espera 300 ms, troca de tela e a recolhe — 300 ms de
espera artificial em toda navegação. Isso não é aceitável: navegação não espera animação.

A implementação inverte a ordem. Um Client Component observa `usePathname()`; quando o
caminho muda, ele pinta a cortina bordô **já cobrindo** a página nova e a recolhe. O
visitante vê uma troca de cena; a página de destino começou a ser apresentada no mesmo
instante em que começaria sem cortina.

A cortina é `position: fixed`, `pointer-events: none` do primeiro ao último quadro, não é
focável, não entra na árvore de acessibilidade, e não é montada sob
`prefers-reduced-motion: reduce`. Anima só `transform`.

**Alternativa considerada:** a View Transitions API. Rejeitada — para navegação
client-side no App Router ela depende de flag experimental de build, e mexer em
configuração de build exige autorização humana.

Isto **não altera** a capability `stage-intro`: aquela é a abertura da home no
carregamento; esta é a passagem entre rotas. A spec da abertura já listava transições
entre páginas internas como fora do seu escopo.

### 8. Imagens

Os 29 arquivos vão para `public/imagens/` preservando a divisão `2024/`, `palco/` e
`espacos/`. Todas passam por `next/image` com `sizes` explícito. Os PNGs de espetáculo
são extrações do programa impresso: `isLowResolution` limita a largura renderizada ao que
o arquivo sustenta, e nenhum deles é usado em largura total de viewport.

`alt` é obrigatório e descritivo. Para os retratos de homenageado o `alt` identifica a
pessoa; para as capas de espetáculo, descreve a imagem, não repete o título já presente
ao lado.

As anotações de proveniência do protótipo ("solicitar arquivo original à companhia") são
recado para quem implementa, não para o visitante: viram o campo `provenance` e somem da
tela.

### 9. Inventário de componentes

`ui/` (sem conhecimento do festival): `text`, `button` (variantes primária, secundária,
ghost do `DESIGN.md`), `chip`, `card`, `divider`, `tag`, `definition-list`,
`empty-state`, `archive-text`, `provenanced-image`, `dialog`.

`layout/`: `site-header`, `areas-menu`, `site-footer`, `curtain-transition`,
`mobile-nav`, `back-to-top` (existente).

`sections/`: uma por ato da home e por bloco das telas internas. `stage-intro`
permanece intocado; `hero.tsx` é removido; `stage-scene.tsx` deixa de ser consumido.

`lib/utils/schedule.ts`: funções puras — `sessionStatus`, `sessionEndsAt`, `groupByDay`,
`filterActivities`, `nextSessions`, `countBy`. É aqui que mora a lógica que o protótipo
tinha espalhada na classe `DCLogic`, e é aqui que os testes unitários se concentram.

### 10. Testes

- **Unitário (Vitest):** `lib/utils/schedule.ts` exaustivamente — limites de sessão
  (instante do início, instante do fim, um minuto depois), agrupamento, filtragem com
  combinações vazias, formatação de horário nos três locales. Componentes com lógica:
  chip de filtro, `archive-text`, `empty-state`.
- **E2E (Playwright + axe):** uma spec por tela. A varredura do axe passa a cobrir todas
  as rotas nos três idiomas. Específicos: link profundo de filtro, filtro sem
  JavaScript, ausência de rolagem horizontal em 375 px, foco preso no menu e no painel de
  filtros, `lang` do acervo em `/en`, e ausência de erro de hidratação na home.

## Risks / Trade-offs

**A troca de tokens toca todo componente existente** → é feita como primeira etapa
isolada, com `pnpm check` verde antes de qualquer tela nova entrar. Se algo quebrar, o
culpado é conhecido.

**Duas famílias variáveis no caminho crítico** → `next/font` auto-hospeda e faz preload;
carrega-se só o eixo de peso e o subset latino. Se o orçamento de performance não
fechar, o recuo é fixar pesos discretos em vez do eixo variável — decisão de
implementação, não de arquitetura.

**A home mostra a programação de 2024 sob o cabeçalho da edição de 2026** → é o que o
protótipo desenha, e o aviso de conteúdo demonstrativo é explícito e traduzido. O risco
real é o aviso passar despercebido; ele fica acima da primeira lista de cada tela que
apresenta programação, não só na home.

**O acervo em pt-BR dentro de páginas em `en`/`es`** → mitigado por `lang` correto e
aviso traduzido, que é o comportamento certo para leitor de tela. O visitante estrangeiro
ainda encontra release que não lê; a alternativa era traduzir texto artístico de
terceiros sem revisão, que é pior.

**Nove telas em uma única change** → a sequência de tarefas é ordenada para que cada
etapa termine com o repositório verde e navegável, na ordem tokens → acervo → moldura →
programação → detalhes → espaços → memória → notícias → home. A home é a última porque
consome todas as outras.

**A cortina revela em vez de cobrir** → é uma divergência deliberada do protótipo. Visual
próximo, semântica melhor: nenhuma navegação espera por animação.

**O controle "A11y" some do cabeçalho** → o protótipo o desenha, ainda que rotulado como
demonstração, e a ausência será notada. Está registrado como exclusão explícita na
proposta; implementá-lo de verdade é uma change própria, com decisões próprias sobre
persistência de preferência.

## Migration Plan

Sem deploy, sem dados em produção, sem rollback a planejar — o projeto não tem ambiente
publicado. A "migração" é a ordem de trabalho descrita em [`tasks.md`](./tasks.md), e o
critério de cada etapa é o checklist de conclusão do `CLAUDE.md` passando.

O único ponto de não-retorno é a etapa 1: depois que os tokens mudam, a página de
validação atual fica visualmente inconsistente até a home ser reescrita na última etapa.
Isso é aceitável em um repositório sem deploy, e é preferível a manter duas paletas.
