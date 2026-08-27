## Context

`src/app/[locale]/memoria/page.tsx` renderiza hoje uma `<ol>` de quatro `Card`s a partir
de `editionTimeline`. É correta, acessível e conservadora — e não comunica percurso.

Restrições que não se negociam neste projeto e que moldaram todas as decisões abaixo:

- **A experiência precisa continuar completa sem animação e sem WebGL.** É a regra que
  vence as outras em CLAUDE.md.
- Server Component é o padrão; `'use client'` só com estado, efeito, evento ou API do
  navegador.
- Nenhum texto visível no JSX: tudo vem de `messages/`, nos três idiomas.
- Filtros vivem na URL, validados antes do uso.
- Estado do acervo e completude precisam de equivalente textual — já é requisito da spec.
- Design system escuro (`#131312`, bordô `#800020`, âmbar `#ffdb9d`), sem sombra como
  recurso de separação.

**As referências visuais** (um navegador de décadas em pêssego/coral; uma timeline de
pandemias em painéis horizontais) são claras, mas nenhuma das duas é transplantável: a
paleta é o oposto da nossa, e as duas dependem de fotografia densa que o acervo não tem.
O que se extrai delas e de fato se aplica: **eixo persistente com marcos**, **posição
visível no eixo**, **numeral do ano como elemento gráfico dominante** e **uma estação por
vez ocupando peso real na tela**.

**A grade de anos não é chute.** Cruzando três fontes do repositório — `festival.ts`
fixa 2024 como 20ª edição, `editions.ts` declara 19 edições em 2004–2023, PRODUCT.md diz
"realizado desde 2004" — existe exatamente um mapeamento consistente: **1ª = 2005 …
19ª = 2023, 20ª = 2024, 21ª = 2025, 22ª = 2026**, com 2004 como ano de fundação sem
edição. É a grade que a prévia usa, e é a grade que sobrevive à chegada dos dados reais.

## Goals / Non-Goals

**Goals:**

- Fazer a tela de memória se **ler** como linha do tempo, não como lista de status.
- Mostrar as 22 edições, para que a escala das duas décadas seja percebida.
- Entregar duas variantes comparáveis lado a lado, e tornar a deleção da perdedora
  trivial e completa.
- Preencher a tela com conteúdo suficiente para julgar layout, sem contaminar o acervo.

**Non-Goals:**

- Não é objetivo animar com GSAP, ScrollTrigger ou Three.js nesta tela.
- Não é objetivo criar páginas de edição para os anos de prévia.
- Não é objetivo alterar `EditionTimelineEntry`, `editionPageYears` ou
  `findEditionEntry` — `/edicoes/[year]` fica intocada.
- Não é objetivo mudar design tokens, tema, estratégia de i18n ou estrutura de pastas.
- Não é objetivo manter as duas variantes a médio prazo.

## Decisions

### 1. Eixo persistente em CSS, não em JavaScript

`position: sticky` para o eixo e `scroll-snap` para o trilho. A posição no eixo vem de
scroll-driven animations (`animation-timeline: view()` / `scroll()`), no mesmo espírito
do `Reveal` que já existe: **o estado inicial é o estado legível**, e a animação apenas
enriquece onde o navegador suporta.

_Alternativa rejeitada:_ `IntersectionObserver` marcando a estação ativa. Exigiria
`'use client'`, estado e um caminho de degradação escrito à mão — três coisas que o CSS
resolve de graça. E se o bundle falha, o observador some junto com a informação.

### 2. Eixo é `aria-hidden`

O eixo repete ano e número de edição que já estão em cada estação. Anunciá-lo faria o
leitor de tela ler 22 edições duas vezes. Segue o precedente já escrito no arquivo atual,
onde a barra de completude é decorativa porque o número acima dela já é o dado.

### 3. Variante na URL, validada, com padrão seguro

`/memoria?linha=espinha|trilho`. `espinha` é o padrão porque é a variante que sobrevive a
320px e a leitor de tela sem asterisco — a aposta certa se alguém esquecer o protótipo
ligado.

_Alternativas rejeitadas:_ rota própria (`/memoria/trilho`) exigiria mexer no mapa de
rotas dos três idiomas, gerar metadata e opengraph e criar URL indexável para algo
descartável; constante no arquivo impediria ver as duas ao mesmo tempo, que é o único
jeito de comparar layout; variável de ambiente **não existe neste projeto**.

**Consequência real:** ler `searchParams` tira a rota `/memoria` da geração estática.
É aceito porque é temporário — quando a variante for escolhida, `searchParams` sai e a
rota volta a ser estática. Está no plano de deleção.

### 4. Zero abstração compartilhada entre as variantes

`edition-timeline-spine.tsx` e `edition-timeline-rail.tsx` duplicam marcação e classes de
propósito. Uma delas vai morrer; extrair um `<TimelineAxis>` comum deixaria, no dia da
deleção, um componente meio-usado que alguém defende manter "porque já existe".

Duplicação com prazo de validade é mais barata que abstração prematura entre duas coisas
onde uma é descartável. Cada arquivo leva um comentário `ponytail:` dizendo isso, para
que a duplicação se leia como intenção e não como descuido.

### 5. Trilho continua trilho em 320px

Mesma marcação, mesmo CSS, painéis de `85vw` com `scroll-snap-type: x mandatory`. No
celular isso é o gesto nativo de carrossel. Cada painel rola **verticalmente por dentro**
se o texto passar da altura, então nenhum conteúdo exige rolagem em duas direções e
1.4.10 do WCAG fica satisfeito.

_Alternativa rejeitada:_ empilhar no celular. Isso é a variante `espinha` reaparecendo
dentro da `trilho`, e aí comparar as duas no celular não significa nada.

### 6. Peso visual vem da tipografia, não de imagem inventada

O ano em `display` grande é o equivalente honesto do "70" gigante da referência: funciona
igual nas 22 estações, custa zero e não some quando a imagem real chegar.

### 7. Prévia isolada em um arquivo, com pool de imagens remotas

Todo o conteúdo fictício vive em `src/content/mock/timeline-preview.ts`: a grade de 22
estações, a constante que liga a prévia e o pool de URLs do Unsplash. É o único arquivo a
apagar no dia da substituição.

O texto das estações **não** é fabricado 22 vezes em três idiomas. Um conjunto pequeno de
resumos parametrizados por `{edition}` e `{year}` em `messages/` rotaciona entre as
estações: dá variação visual suficiente para julgar layout sem inventar 66 blurbs de
festival que ninguém escreveu.

As imagens entram por `ProvenancedImage`, que já existe e já resolve o alt a partir de
`messages/` — nenhum componente novo de imagem.

_Alternativa rejeitada:_ baixar as fotos para `public/imagens/mock/`. Manteria o contrato
de `images.test.ts` intacto e o build offline. O mantenedor escolheu `remotePatterns`;
o enfraquecimento do teste está registrado como risco.

### 8. `stagePhotos.memoria` finalmente é consumido

Está declarado em `src/content/images.ts` desde o portal e nunca foi usado. Vira o fundo
decorativo (`aria-hidden`) do cabeçalho, no mesmo padrão que a home aplica a
`stagePhotos.hero`. Reuso do que já existe, não código novo.

## Risks / Trade-offs

**Prévia ligada por padrão em URL indexável** → O mantenedor decidiu conscientemente
seguir assim até haver dados reais. Mitigação parcial: aviso visível na tela declarando
o conteúdo como ilustrativo, e nenhuma estação de prévia vira link para `/edicoes/<ano>`,
de modo que a prévia não gera destino nem página.

**`images.test.ts` deixa de cobrir as imagens da tela** → Consequência direta de escolher
imagem remota. O teste continua verde e continua correto para todo o acervo real; ele só
não sabe das URLs do Unsplash. Some junto com o arquivo de prévia.

**`/memoria` sai da geração estática** → Aceito como temporário; volta ao normal quando
`searchParams` for removido. Está no plano de deleção.

**Dependência de rede no render das imagens de prévia** → Se o Unsplash falhar, as
imagens somem e o restante da tela permanece completo, porque nenhuma informação depende
delas. É o mesmo princípio da regra "completa sem animação".

**Duplicação entre as duas variantes** → Deliberada e comentada. O risco é alguém
"consertar" a duplicação extraindo um componente comum antes da decisão, o que
encareceria a deleção. Os comentários `ponytail:` existem para impedir isso.

**Scroll-driven animations não são universais** → Por construção, sem elas a página fica
estática e completa: o eixo continua visível, as estações continuam legíveis, a posição
apenas não acompanha a rolagem. Nada é perdido.

## Migration Plan

Não há migração de dados: `editionTimeline` e todos os tipos permanecem intactos.

**Plano de deleção da variante perdedora** — o entregável mais importante desta mudança
depois do layout em si:

1. Apagar `edition-timeline-<perdedora>.tsx` e seu teste.
2. Remover o despacho e o parser de `linha` em `memoria/page.tsx`, e com eles a leitura
   de `searchParams` — a rota volta a ser estática.
3. Remover as chaves de `messages/` exclusivas da variante nos **três** idiomas.
4. Remover o comentário `ponytail:` sobre duplicação da variante sobrevivente.
5. Rodar `pnpm check` e `pnpm test:e2e`.

**Plano de substituição da prévia pelos dados reais** (independente do anterior):

1. Preencher as estações reais em `src/content/editions.ts`.
2. Apagar `src/content/mock/timeline-preview.ts`.
3. Remover as chaves de prévia e o aviso de prévia dos três `messages/`.
4. Remover `images.remotePatterns` de `next.config.ts`.
5. `pnpm check`.

A grade de anos não muda nesse dia — só títulos, imagens e completude.

## Open Questions

Nenhuma bloqueante. Duas ficam para a decisão de layout, não para a implementação:

- A completude do acervo continua como barra por estação, ou passa a ser densidade do
  próprio eixo? Entra como barra (mantém o requisito satisfeito e o precedente do
  arquivo); se virar densidade do eixo, precisa continuar tendo equivalente textual.
- Quantas fotos no pool do Unsplash antes de a repetição ficar aparente nas 22 estações?
  Começa com oito; ajusta na revisão visual.
