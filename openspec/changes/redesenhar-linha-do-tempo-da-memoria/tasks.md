## 1. Base de dados da prévia

- [x] 1.1 Criar `src/content/mock/timeline-preview.ts` com o tipo local da estação de
      prévia (ano, edição, estado do acervo, completude, imagem, `hasEditionPage`), sem
      alterar `EditionTimelineEntry` nem `src/types/festival.ts`.
- [x] 1.2 Gerar as 22 estações na grade derivada — 1ª = 2005 … 22ª = 2026 — reaproveitando
      os estados reais de 2024 (`acervo-completo`), 2025 (`acervo-pendente`) e 2026
      (`edicao-vigente`), e `em-digitalizacao` para 2005–2023.
- [x] 1.3 Exportar `TIMELINE_PREVIEW_ENABLED` no mesmo arquivo e documentar em comentário
      que este é o único arquivo a apagar quando os dados reais chegarem.
- [x] 1.4 Definir o pool de oito URLs do Unsplash e a função que escolhe a imagem da
      estação de forma determinística (mesma edição, mesma imagem, sem `Math.random`).
- [x] 1.5 Garantir que nenhuma estação de prévia carregue `hasEditionPage: true` — só a
      de 2024, que é acervo real.

## 2. Configuração e mensagens

- [x] 2.1 Adicionar `images.remotePatterns` para `images.unsplash.com` em
      `next.config.ts`, com comentário apontando o passo 4 do plano de deleção da prévia.
- [x] 2.2 Adicionar em `messages/pt-BR.json` as chaves de prévia: aviso de conteúdo
      ilustrativo, o conjunto pequeno de resumos parametrizados por `{edition}`/`{year}`,
      e o rótulo do eixo.
- [x] 2.3 Adicionar a chave de alt das imagens de prévia no namespace `imagens`.
- [x] 2.4 Replicar todas as chaves novas em `messages/en.json` e `messages/es.json`.

## 3. Variante `espinha`

- [x] 3.1 Criar `src/components/sections/edition-timeline-spine.tsx` como Server
      Component, com a `<ol>` de estações, espinha contínua e marcador por estação.
- [x] 3.2 Renderizar o eixo fixo no topo (`position: sticky`) com um marco por edição,
      marcado `aria-hidden="true"`.
- [x] 3.3 Dar peso gráfico ao ano em `display`, usando apenas tokens existentes — nenhuma
      cor, raio ou easing arbitrário, nenhum alfa arbitrário em texto.
- [x] 3.4 Preservar o comportamento de destino do arquivo atual: 2024 leva a
      `/edicoes/2024`, edição vigente leva a `/programacao`, o resto não vira link.
- [x] 3.5 Manter estado do acervo como texto (`Tag`) e a completude com equivalente
      textual, com a barra `aria-hidden`.
- [x] 3.6 Adicionar comentário `ponytail:` explicando que a duplicação com a variante
      `trilho` é deliberada e tem prazo de validade.

## 4. Variante `trilho`

- [x] 4.1 Criar `src/components/sections/edition-timeline-rail.tsx` como Server
      Component, com painéis em `scroll-snap-type: x mandatory` e largura de `85vw`.
- [x] 4.2 Renderizar o eixo fixo ao pé do trilho, `aria-hidden="true"`, com um marco por
      edição.
- [x] 4.3 Fazer cada painel rolar verticalmente por dentro quando o texto exceder a
      altura, para que nenhum conteúdo exija rolagem em duas direções.
- [x] 4.4 Manter o trilho horizontal em todas as larguras, sem `@media` de layout.
- [x] 4.5 Repetir destino, estado textual e completude com equivalente textual, iguais aos
      da variante `espinha`.
- [x] 4.6 Adicionar o mesmo comentário `ponytail:` sobre duplicação deliberada.

## 5. Página e despacho

- [x] 5.1 Ler `searchParams` em `src/app/[locale]/memoria/page.tsx` e escrever o parser
      que valida `linha` contra `'espinha' | 'trilho'`, caindo em `espinha` para qualquer
      outro valor, sem lançar erro.
- [x] 5.2 Despachar para a variante correspondente, mantendo `PageHeader`, `Container` e
      `scopeNote` como estão.
- [x] 5.3 Consumir `stagePhotos.memoria` como fundo decorativo (`aria-hidden`) do
      cabeçalho, no padrão que a home aplica a `stagePhotos.hero`.
- [x] 5.4 Renderizar o aviso de prévia quando `TIMELINE_PREVIEW_ENABLED` estiver ligado,
      no padrão visual do `DemoContentNotice` existente.
- [x] 5.5 Confirmar que a página segue Server Component: nenhum `'use client'`, nenhum
      `loading.tsx`, nenhum import de GSAP.

## 6. CSS do eixo e do trilho

- [x] 6.1 Adicionar em `src/styles/globals.css` as regras de eixo e trilho usando apenas
      tokens existentes.
- [x] 6.2 Escrever a posição no eixo com scroll-driven animation.
      _(o marcador é `aria-hidden` e nasce sem exibição nenhuma, só aparecendo onde
      `timeline-scope` existe: nenhuma informação depende dele, então não há estado
      legível a preservar — ao contrário do `Reveal`, que carrega conteúdo.)_
- [x] 6.3 Desligar o movimento sob `prefers-reduced-motion`, mantendo o estado final.

## 7. Testes

- [x] 7.1 Teste do parser de `linha`: valor válido, valor inválido, ausência de valor.
- [x] 7.2 Teste de que nenhuma estação de prévia renderiza link para `/edicoes/<ano>`.
- [x] 7.3 Teste de que o aviso de prévia aparece com `TIMELINE_PREVIEW_ENABLED` ligado.
- [x] 7.4 E2E com axe nas duas variantes, incluindo viewport de 320px na variante
      `trilho`.
- [x] 7.5 E2E confirmando que as estações permanecem legíveis com JavaScript desabilitado.

## 8. Documentação e verificação

- [x] 8.1 Registrar em `docs/riscos-conhecidos.md` os três riscos aceitos: prévia ligada
      por padrão, `images.test.ts` sem cobertura das imagens remotas, `/memoria` fora da
      geração estática.
- [x] 8.2 Confirmar que `CLAUDE.md` e `AGENTS.md` continuam idênticos, se algum mudou.
      _(nenhum dos dois mudou; nada a sincronizar.)_
- [x] 8.3 Rodar `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- [x] 8.4 Rodar `pnpm test:e2e`.
- [x] 8.5 Revisar o diff inteiro: nenhum `any`, nenhum `eslint-disable`, nenhuma pasta
      vazia, nenhuma chave de tradução faltando em um dos três idiomas.
