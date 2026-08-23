> Fonte da verdade visual: `prototipo-fenatevi/FENATEVI Portal.dc.html` e
> `prototipo-fenatevi/uploads/DESIGN.md`. Fonte da verdade técnica: `docs/guides/`.
> **Não implemente nada que não esteja no protótipo.** Cada etapa termina com
> `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build` verde.

## 1. Design system — tokens e tipografia

- [ ] 1.1 Reescrever o bloco `@theme` de `src/styles/globals.css` com a paleta do
      frontmatter do `DESIGN.md`: superfícies (`surface`, `surface-dim`, `surface-bright`,
      `surface-container-lowest/low/…/highest`), primária bordô, secundária âmbar,
      terciária, erro, `outline` e `outline-variant`. Ignorar os hexes soltos da prosa
      ("#050505", "#0F172A") — o frontmatter vence.
- [ ] 1.2 Adicionar os três tons de texto (`--color-foreground`,
      `--color-foreground-muted`, `--color-foreground-subtle`) e **verificar cada um em
      4,5:1 sobre `--color-surface`**, ajustando o valor até passar. Registrar as razões
      medidas em comentário no CSS.
- [ ] 1.3 Redefinir `--color-curtain`, `--color-curtain-fold` e `--color-curtain-sheen`
      derivando do bordô da marca, mantendo-os nomeados como cenografia e fora da paleta.
      Reverificar o contraste de `--color-foreground` sobre cada um e atualizar o
      comentário existente.
- [ ] 1.4 Substituir os raios pelos do `DESIGN.md` (2px em botões e campos, 8px em
      cartões, pill em chips) e acrescentar os tokens de espaçamento (unidade 8px,
      `container-max` 1280px, gutter 24px, margens 64/20px, stacks 16/32/80px).
- [ ] 1.5 Carregar Bodoni Moda e Hanken Grotesk por `next/font/google` em
      `src/app/[locale]/layout.tsx` (subset latino, eixo de peso variável) e ligá-las a
      `--font-serif` e `--font-sans`.
- [ ] 1.6 Criar `src/components/ui/text.tsx` com as variantes da escala do `DESIGN.md`
      (`display-lg`, `display-md`, `headline-lg`, `body-lg`, `body-md`, `label-md`,
      `caption`), traduzidas para `clamp()` com o valor do `DESIGN.md` como teto e
      `headline-lg-mobile` como piso onde declarado. Seguir o padrão de variantes já
      usado em `button.tsx`. Teste ao lado.
- [ ] 1.7 Reescrever as variantes de `src/components/ui/button.tsx` conforme o
      `DESIGN.md`: primária bordô sólida com brilho no hover, secundária com contorno
      ivory de 1px preenchendo a 10% no hover, ghost com sublinhado no hover. Atualizar o
      teste.
- [ ] 1.8 Migrar todo consumo dos tokens antigos (`accent`, `accent-strong`, `on-accent`,
      `surface-raised`) nos componentes existentes e em `opengraph-image.tsx`.
- [ ] 1.9 Rodar o checklist completo mais `pnpm test:e2e` e confirmar que a varredura do
      axe continua sem erros com a nova paleta.

## 2. Modelo de conteúdo e derivações

- [ ] 2.1 Ampliar `src/types/festival.ts`: espaço (com espaço-pai opcional, tipo,
      endereço e posição no esquema), atividade (com frente, release, ficha técnica,
      observação, acessibilidade, imagem), oficina, processo criativo, homenageado, livro,
      crédito, parceiro e edição com estado de acervo. Horário como dado estruturado, nunca
      string formatada.
- [ ] 2.2 Criar `src/content/venues.ts` com os 7 espaços do protótipo e derivar a união
      literal de ids a partir do próprio array, de modo que uma referência inválida quebre
      o `pnpm typecheck`.
- [ ] 2.3 Criar `src/content/activities.ts` com as 21 atividades da edição 2024
      (Mostra Oficial, Mostra Paralela e o lançamento de livros), transcrevendo release e
      ficha técnica sem alterar grafia.
- [ ] 2.4 Criar `src/content/workshops.ts` (2 oficinas, com vagas, turmas, público,
      faixa etária, requisitos e URL do formulário externo) e
      `src/content/creative-processes.ts` (os 8 dias de demonstrações de trabalho).
- [ ] 2.5 Criar `src/content/honorees.ts`, `src/content/books.ts`,
      `src/content/edition-credits.ts` e `src/content/partners.ts` com o conteúdo do
      protótipo.
- [ ] 2.6 Criar `src/content/editions.ts` com as entradas da linha do tempo (2026, 2025,
      2024 e o agrupado 2004—2023), cada uma com seu estado de acervo, e corrigir
      `src/content/festival.ts` para a 22ª edição, 13 a 21 de outubro de 2026.
- [ ] 2.7 Declarar a proveniência de cada imagem (`provenance`, `isLowResolution`) no
      próprio acervo e escrever um teste que garanta que nenhuma imagem referenciada esteja
      ausente de `public/`.
- [ ] 2.8 Criar `src/lib/utils/schedule.ts` com as funções puras: `sessionStatus`,
      `sessionEndsAt`, `groupByDay`, `filterActivities`, `nextSessions`, `countByCategory`,
      `countByVenue`. Nenhuma delas lê `Date.now()` internamente — o instante é parâmetro.
- [ ] 2.9 Testar `schedule.ts` exaustivamente: instante exato do início, instante exato
      do fim, um minuto depois, atividade sem duração declarada, dia sem atividades,
      filtros que se anulam, e ordenação de processos criativos ao fim do dia.
- [ ] 2.10 Estender `src/lib/utils/format.ts` com formatação por locale de horário
      ("19h30" / "7:30 PM" / "19:30"), dia curto ("13 OUT"), dia da semana e duração.
      Testar nos três locales.

## 3. Assets

- [ ] 3.1 Copiar os 29 arquivos de `prototipo-fenatevi/assets/` para `public/imagens/`
      preservando `2024/`, `palco/` e `espacos/`.
- [ ] 3.2 Criar `src/components/ui/provenanced-image.tsx`, encapsulando `next/image` com
      `sizes` explícito e limitando a largura renderizada quando `isLowResolution`.
      Nenhuma anotação de proveniência é renderizada como texto ao visitante.
- [ ] 3.3 Escrever os textos alternativos das 29 imagens nos três idiomas em `messages/`,
      identificando pessoas nos retratos e descrevendo a cena nas capas sem repetir o
      título ao lado.

## 4. Base de interface e i18n

- [ ] 4.1 Criar os namespaces de `messages/` nos **três** arquivos (`nav`, `home`,
      `programacao`, `grade`, `espetaculo`, `oficina`, `espacos`, `memoria`, `edicao`,
      `noticias`, `acervo`), incluindo os nomes traduzidos das frentes de programação e o
      aviso de idioma do acervo.
- [ ] 4.2 Criar `src/components/ui/archive-text.tsx`, que aplica `lang="pt-BR"` quando o
      locale corrente não é pt-BR e nada quando é. Teste cobrindo os dois casos.
- [ ] 4.3 Criar `src/components/ui/demo-content-notice.tsx`, exibido quando a edição
      vigente não tem programação publicada, informando qual edição está sendo mostrada.
      Teste cobrindo a aparição e o desaparecimento.
- [ ] 4.4 Criar os primitivos restantes de `ui/`: `chip`, `card`, `tag`, `divider`,
      `definition-list`, `empty-state` e `dialog` (com foco preso, fechamento por `Escape`
      e devolução de foco). Testes para `dialog` e `chip`.

## 5. Moldura do portal

- [ ] 5.1 Reescrever `src/components/layout/site-header.tsx`: marca, navegação principal,
      seletor de idioma e acesso ao menu. Condensação na rolagem em Client Component de
      folha, sem mover nenhum item de posição. **Sem o controle "A11y"** — exclusão
      registrada na proposta.
- [ ] 5.2 Criar `src/components/layout/areas-menu.tsx`: diálogo em tela cheia com as
      áreas do portal, cada uma com número, nome e descrição, apontando apenas para telas
      que existem (sem "Ingressos" e sem "Experiência mobile"). Foco preso, `Escape`,
      devolução de foco.
- [ ] 5.3 Reescrever `src/components/layout/site-footer.tsx` com identificação,
      navegação secundária, contatos acionáveis (`mailto:`, `tel:`) e realização/produção.
- [ ] 5.4 Criar `src/components/layout/curtain-transition.tsx`: observa `usePathname()`,
      pinta a cortina bordô já cobrindo a rota nova e a recolhe. `pointer-events: none`
      sempre, fora da árvore de acessibilidade, não montada sob movimento reduzido, anima
      só `transform`. Teste garantindo que não bloqueia ponteiro.
- [ ] 5.5 Criar `src/components/layout/mobile-nav.tsx`: navegação inferior permanente
      entre programação, grade, mapa e memória em telas estreitas, com alvos de 44px.
- [ ] 5.6 Criar `src/components/ui/back-link.tsx` para o retorno contextual das telas
      internas, como destino de navegação real e não `history.back()`.
- [ ] 5.7 Ligar cabeçalho, rodapé, cortina e navegação mobile em
      `src/app/[locale]/layout.tsx`.

## 6. Programação e grade

- [ ] 6.1 Criar `src/app/[locale]/programacao/page.tsx` como Server Component que lê
      `searchParams` (`dia`, `frente`, `espaco`), ignora valores desconhecidos e agrupa os
      resultados por dia.
- [ ] 6.2 Criar a barra de filtros: chips de momento (agora/hoje/amanhã/todos), chips de
      dia, chips de frente e chips de espaço, **todos como `Link`** para a mesma rota com a
      query alterada, com `aria-pressed` e distinção que não dependa só de cor.
- [ ] 6.3 Implementar a contagem de resultados, a limpeza de filtros e o estado vazio com
      texto e ação de limpar.
- [ ] 6.4 Criar a linha de atividade da listagem (horário, situação, título, companhia,
      espaço, frente, marcadores) como destino de navegação para o detalhe, com processos
      criativos declarando "após a sessão" e ordenados ao fim do dia.
- [ ] 6.5 Criar `src/app/[locale]/programacao/grade/page.tsx` lendo `visao` e `dia` de
      `searchParams`, com a troca de visão preservando o dia selecionado.
- [ ] 6.6 Implementar a visão por espaço, listando **todos** os espaços e declarando
      textualmente os que não têm programação no dia.
- [ ] 6.7 Implementar a visão por horário, agrupando as atividades do dia por horário de
      início.
- [ ] 6.8 Implementar a visão da semana como matriz espaços × dias, com rolagem
      horizontal **dentro do container** (`overflow-x: auto`, alcançável por teclado) e o
      aviso prévio sobre telas estreitas. O documento não rola horizontalmente.
- [ ] 6.9 Criar o painel de filtros mobile a partir de `dialog`, com a barra de "agora"
      fixa e os dias em rolagem horizontal.

## 7. Detalhe de espetáculo e de oficina

- [ ] 7.1 Criar `src/app/[locale]/espetaculos/[id]/page.tsx` com `generateStaticParams`,
      `generateMetadata` derivado do acervo e `notFound()` para id inexistente.
- [ ] 7.2 Implementar o cabeçalho do espetáculo: frente, situação derivada do horário,
      título, companhia, cidade, e a lista de dados essenciais (data, horário, dia da
      semana, término derivado, espaço com endereço, duração, classificação), com ausências
      declaradas como ausência.
- [ ] 7.3 Implementar o bloco de acessibilidade da sessão **acima** da ficha técnica,
      como texto traduzido, omitido quando não houver recursos declarados.
- [ ] 7.4 Implementar release, observação da sessão visualmente distinta, e ficha técnica
      preservando ordem e grafia — tudo através de `archive-text`.
- [ ] 7.5 Implementar os blocos de companhia, espaço (com navegação) e processo criativo
      associado, mais as ações "como chegar" e "ver na grade do dia".
- [ ] 7.6 Implementar "outras apresentações desta companhia", omitida quando não houver.
- [ ] 7.7 Criar `src/app/[locale]/oficinas/[id]/page.tsx` com o cabeçalho da oficina
      (identificada como ação formativa), descrição e acessibilidade.
- [ ] 7.8 Implementar o bloco de inscrição: vagas, turmas, formato, datas, horário,
      espaço, faixa etária e link externo (`target="_blank"`, `rel="noopener"`) com aviso
      prévio de que o formulário é externo. **Nenhum campo de entrada de dados no portal.**
- [ ] 7.9 Implementar a lista completa de informações da oficina, o bloco de requisitos e
      o espetáculo relacionado quando houver.

## 8. Espaços culturais

- [ ] 8.1 Criar `src/app/[locale]/espacos/page.tsx` com o esquema posicional dos espaços
      — sem base geográfica, sem biblioteca de mapa — exposto com descrição textual
      equivalente.
- [ ] 8.2 Tornar cada marcador um destino de navegação alcançável por teclado, com alvo
      de 44×44px e nome do espaço anunciado.
- [ ] 8.3 Implementar a lista de espaços ao lado do esquema (número, nome, endereço, tipo,
      contagem derivada), que continua funcionando se o esquema não for apresentado.
- [ ] 8.4 Criar `src/app/[locale]/espacos/[id]/page.tsx` com `generateStaticParams`:
      nome, espaço-pai quando houver, endereço, tipo, contagem, e as ações para grade e
      mapa.
- [ ] 8.5 Implementar a programação do espaço agrupada por dia e o estado "não recebe
      atividades nesta edição". Área de imagem com tratamento neutro quando não houver
      fotografia, sem texto endereçado ao visitante sobre a ausência.

## 9. Memória e edição

- [ ] 9.1 Criar `src/app/[locale]/memoria/page.tsx` com a abertura da linha do tempo e a
      lista de edições (ano, edição, período, estado, descrição, completude).
- [ ] 9.2 Garantir que o estado de acervo seja texto e que o indicador de completude
      tenha equivalente textual e não seja anunciado como conteúdo.
- [ ] 9.3 Dar a cada edição a ação coerente com seu estado, sem jamais levar a uma página
      de edição inexistente.
- [ ] 9.4 Criar `src/app/[locale]/edicoes/[ano]/page.tsx` com `generateStaticParams`
      restrito às edições com acervo completo: identidade (ano, edição, período, entrada
      franca, mote, capa do programa) e resumo numérico derivado.
- [ ] 9.5 Implementar a apresentação assinada da edição e a lista de núcleos com
      contagens derivadas.
- [ ] 9.6 Implementar a seção de homenageados (retrato com `alt` identificando a pessoa,
      nome, papel, biografia), omitida quando não houver.
- [ ] 9.7 Implementar as listas de Mostra Oficial e da 7ª Mostra Paralela Vera Viana como
      listas distintas e nomeadas, cada item navegável.
- [ ] 9.8 Implementar ações formativas, lançamentos de livros, processos criativos por
      dia e a ficha técnica da edição.

## 10. Notícias

- [ ] 10.1 Criar `src/app/[locale]/noticias/page.tsx` com a descrição da área e a
      listagem em ordem cronológica decrescente, preparada para categoria, título, data,
      imagem e corpo, omitindo campos ausentes.
- [ ] 10.2 Implementar o estado de conteúdo ainda indisponível, traduzido, **sem manchete
      ou data fictícias** e sem os "slots editoriais" do protótipo, que são anotação de
      design. Teste cobrindo a transição para a listagem quando a primeira notícia entrar.

## 11. Home

- [ ] 11.1 Reescrever `src/app/[locale]/page.tsx` com os atos do protótipo, mantendo
      `StageIntro` inalterado, removendo `hero.tsx` e deixando de consumir
      `stage-scene.tsx`.
- [ ] 11.2 Implementar a abertura: edição, ano, nome, assinatura, datas, cidade e os dois
      destinos, com camadas de escurecimento que garantam 4,5:1 sobre a fotografia em
      qualquer viewport e legibilidade preservada se a imagem não carregar.
- [ ] 11.3 Implementar "em cena agora" conforme a decisão 5 do design: o servidor
      renderiza o baseline derivado da janela da edição; um Client Component de folha
      refina após a montagem apenas quando a edição exibida contém o instante corrente.
      Sem `suppressHydrationWarning`.
- [ ] 11.4 Implementar os três estados da seção: em cena, nada em cena com próxima
      sessão, e edição encerrada com convite ao acervo.
- [ ] 11.5 Implementar "a seguir", priorizando o dia corrente e recorrendo aos próximos
      dias, com o título declarando qual caso está sendo mostrado.
- [ ] 11.6 Implementar a programação em destaque: destaque principal com acessibilidade e
      classificação, cartões secundários, e as ações para programação completa e grade.
- [ ] 11.7 Implementar os oito dias, com o dia corrente distinguido por mais de um
      recurso visual, cada um levando à programação já filtrada por aquele dia.
- [ ] 11.8 Implementar a capa editorial e as frentes de programação, com todas as
      contagens derivadas do acervo.
- [ ] 11.9 Implementar "a cidade vira palco" (prévia do esquema com descrição textual
      equivalente e seleção de espaços) e o convite à memória.
- [ ] 11.10 Implementar a chamada de notícias com estado vazio e a seção de realização e
      parceiros.
- [ ] 11.11 Implementar a revelação por rolagem das seções de modo que **o estado inicial
      seja o estado visível**: nada começa oculto esperando JavaScript. Sob movimento
      reduzido, as seções aparecem já no estado final.

## 12. Testes de ponta a ponta e acessibilidade

- [ ] 12.1 Atualizar `e2e/home.spec.ts` para a nova home e confirmar ausência de erro de
      hidratação em qualquer horário.
- [ ] 12.2 Criar as specs de programação (link profundo com filtros, compartilhamento,
      filtro inválido, resultado vazio) e de filtragem **com JavaScript desabilitado**.
- [ ] 12.3 Criar as specs de grade (troca de visão preservando o dia, espaço sem
      programação, ausência de rolagem horizontal do documento em 375px na visão da
      semana).
- [ ] 12.4 Criar as specs de detalhe (término derivado, acessibilidade acima da ficha,
      outras apresentações, inscrição externa em nova aba) e de espaços (navegação do
      esquema por teclado, espaço sem atividades).
- [ ] 12.5 Criar a spec de memória e edição, incluindo o estado de acervo como texto e a
      ausência de link para edição inexistente.
- [ ] 12.6 Criar a spec de i18n do acervo: em `/en`, os rótulos em inglês, o acervo com
      `lang="pt-BR"` e o aviso traduzido presente.
- [ ] 12.7 Estender `e2e/accessibility.spec.ts` para varrer **todas** as rotas nos três
      idiomas, incluindo o menu de áreas aberto e o painel de filtros mobile aberto.
- [ ] 12.8 Criar a spec de foco: menu de áreas e painel de filtros prendem o foco,
      fecham por `Escape` e devolvem o foco ao controle de origem.
- [ ] 12.9 Verificar em 375px que nenhuma rota produz rolagem horizontal do documento e
      que todo alvo de toque tem ao menos 44×44px.

## 13. Documentação e fechamento

- [ ] 13.1 Atualizar `docs/guides/estilos-e-design-tokens.md` com o inventário novo de
      tokens, a escala tipográfica, os três tons de texto e a proibição de alfa arbitrário
      em texto.
- [ ] 13.2 Atualizar `docs/guides/i18n.md` com a política de idioma do acervo histórico e
      o papel de `archive-text`.
- [ ] 13.3 Atualizar `docs/guides/arquitetura-e-convencoes.md` com as rotas do portal, o
      lugar de `src/content/` e a regra de filtros na URL.
- [ ] 13.4 Atualizar `CLAUDE.md` e `AGENTS.md` — o estágio deixa de ser "bootstrap mais
      página de validação" — e confirmar que os dois seguem **idênticos**.
- [ ] 13.5 Registrar em `docs/riscos-conhecidos.md` as divergências deliberadas em
      relação ao protótipo: cortina que revela em vez de bloquear, ausência do controle
      "A11y", mapa esquemático sem base geográfica, e o acervo histórico não traduzido.
- [ ] 13.6 Rodar o checklist completo de conclusão do `CLAUDE.md`, mais `pnpm build` e
      `pnpm test:e2e`, e revisar o diff inteiro: nenhum `any`, nenhum `eslint-disable`,
      nenhuma pasta vazia, nenhuma chave de tradução faltando em algum dos três arquivos,
      nenhum texto visível no JSX.
