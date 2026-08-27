## Why

A tela de memória já é semanticamente uma linha do tempo — `editionTimeline`, `<ol>`,
requisito "Linha do tempo das edições" na spec — mas **não se lê como uma**. São quatro
cartões empilhados, sem eixo, sem posição, sem sensação de percurso. O acervo do festival
é a matéria mais própria do portal e hoje ele se apresenta como uma lista de status.

Além disso, a granularidade esconde o tamanho da coisa: 19 edições vivem comprimidas numa
única entrada "2004–2023", de modo que o visitante nunca percebe que está diante de mais
de duas décadas de festival.

## What Changes

- A linha do tempo passa a ter **uma estação por edição** — 22 estações, de 2005 a 2026 —
  em vez das quatro entradas agregadas de hoje.
- A tela ganha um **eixo persistente** com marcos e indicação de posição: é o eixo, e não
  a horizontalidade, que faz uma linha do tempo se ler como linha do tempo.
- São implementadas **duas variantes de percurso, vivas ao mesmo tempo e mutuamente
  exclusivas**, para decisão visual comparativa:
  - `espinha` — estações empilhadas na vertical, com espinha contínua à esquerda e eixo
    fixo (`position: sticky`) no topo;
  - `trilho` — painéis lado a lado com `scroll-snap` horizontal e eixo fixo ao pé, em
    todas as larguras, inclusive 320px.
- A escolha da variante vive na **URL** (`/memoria?linha=espinha|trilho`), validada no
  servidor, com `espinha` como padrão. Não entra em navegação, sitemap nem metadata.
- **Uma das duas variantes será apagada por inteiro** após a decisão. Por isso elas não
  compartilham abstração: cada uma é um arquivo, e a duplicação entre elas é deliberada e
  tem prazo de validade.
- Entra **conteúdo de prévia** (fictício) para as 21 edições sem acervo, isolado em um
  único arquivo, com imagens do Unsplash. Será substituído pelos dados reais quando a
  organização os fornecer; a grade de anos não muda nesse dia.
- `next.config.ts` ganha `images.remotePatterns` para `images.unsplash.com`.
  **Autorizado explicitamente pelo mantenedor nesta sessão** (mudança de configuração de
  build exige autorização humana por CLAUDE.md).
- Nenhum GSAP, nenhum `'use client'`, nenhum `loading.tsx`: a tela continua Server
  Component e o movimento é CSS declarativo (`sticky`, `scroll-snap`, `Reveal`).
- `stagePhotos.memoria`, hoje declarado em `src/content/images.ts` e **consumido por
  ninguém**, passa a ser o fundo decorativo do cabeçalho da tela.

## Capabilities

### New Capabilities

Nenhuma. A linha do tempo já é uma capacidade existente; esta mudança altera seus
requisitos, não introduz um domínio novo.

### Modified Capabilities

- `memoria-do-festival`: a granularidade da linha do tempo passa de entradas agregadas
  para uma estação por edição; a linha do tempo passa a exigir eixo persistente com
  posição; o portal passa a poder apresentar conteúdo de prévia declarado como tal; e a
  regra de que nenhuma ação leva a página inexistente passa a valer também para as
  estações de prévia.

## Impact

**Código**

- `src/app/[locale]/memoria/page.tsx` — deixa de renderizar a lista e passa a validar
  `searchParams.linha` e despachar para a variante.
- `src/components/sections/edition-timeline-spine.tsx` — nova, variante `espinha`.
- `src/components/sections/edition-timeline-rail.tsx` — nova, variante `trilho`.
- `src/content/mock/timeline-preview.ts` — nova, todo o conteúdo fictício e a chave que o
  liga. É o único arquivo a apagar quando os dados reais chegarem.
- `messages/pt-BR.json`, `messages/en.json`, `messages/es.json` — chaves novas nos três.
- `next.config.ts` — `images.remotePatterns`.
- `CONTEXT.md` — glossário criado nesta sessão.

**Contratos preservados**

- `editionTimeline`, `editionPageYears`, `findEditionEntry` e `EditionTimelineEntry`
  permanecem intactos: `/edicoes/[year]` e seu `generateStaticParams` não são tocados.
- Só 2024 tem `hasEditionPage: true`; nenhuma estação de prévia vira link para
  `/edicoes/<ano>`.

**Contrato enfraquecido, conscientemente**

- `src/content/images.test.ts` garante que toda imagem referenciada existe em `public/`.
  As imagens de prévia são remotas e ficam fora dessa garantia — consequência aceita ao
  escolher `remotePatterns` em vez de baixar os arquivos.

**Riscos**

- A prévia fica **ligada por padrão** em `/memoria`, que é URL real e indexável. O
  mantenedor está ciente e decidiu seguir assim até os dados reais existirem.
- Duas variantes vivas dobram a superfície visual até a decisão. É temporário por
  construção, e o custo de deletar é um `rm` mais um ramo do `switch`.

**Sem impacto**

Sem dependência nova, sem backend, sem CMS, sem estado de cliente, sem alteração de
design tokens, sem mudança na estratégia de i18n.
