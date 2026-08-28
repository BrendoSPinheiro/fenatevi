# Riscos e inconsistências conhecidos

Registrados para transparência. **Não os corrija espontaneamente** — este
documento é descritivo; cada item vira tarefa quando for pedido.

1. **`AccessibilityFeature` continua sem uso.** O tipo existe em
   `src/types/festival.ts` e nenhum módulo o importa — o acervo referencia os
   recursos pelo `AccessibilityFeatureId` direto. `Show` e `TimelineItem` foram
   substituídos por `Activity` e `EditionTimelineEntry`, que têm consumidor.
2. **Chaves de tradução sem consumidor:** `metadata.localeLabel` existe nos três
   arquivos de `messages/` e não é usada.
3. **Ids de âncora em português fixo** (`conteudo-principal`, `sobre`) valem para
   os três idiomas. É consistente e testável, mas ao criar rotas traduzidas
   decida conscientemente se os ids acompanham o idioma.
4. **`cn` não resolve conflitos de Tailwind** — sobrescrever classe por prop pode
   não ter o efeito esperado. Ver
   [`guides/estilos-e-design-tokens.md`](./guides/estilos-e-design-tokens.md).
5. **O domínio de produção é provisório.** `SITE_URL`, em `src/lib/seo/site.ts`,
   vale `https://www.fenatevi.com.br` como marcador. Dele derivam `metadataBase`,
   o canonical, o `hreflang` e a URL da imagem OG — todos apontam para um
   endereço ainda não contratado. Trocar o domínio é editar essa constante e
   `SITE_URL` em `e2e/seo.spec.ts`.
6. **`OG_COLORS` duplica tokens de `globals.css`.** O Satori (`next/og`) não lê
   CSS Custom Properties, então a imagem de compartilhamento repete quatro cores
   em JavaScript. Ao mudar o tema, atualize os dois lugares.
7. **A imagem OG não declara `og:image:alt`.** O `generateImageMetadata` roda
   antes de `[locale]` ser resolvido e recebe `params` vazio, então o alt não
   pode ser traduzido. Ver o comentário em `src/app/[locale]/opengraph-image.tsx`.
8. **Cobertura de SEO ainda parcial:** faltam `sitemap.ts`, dados estruturados
   JSON-LD (`Event`/`Organization`), `x-default` no `hreflang`, `og:locale` e
   `alternates` derivadas do pathname — hoje o layout fixa os caminhos das três
   versões, o que só é correto porque a home é a única rota.
9. **A detecção automática de idioma redireciona `/` conforme o
   `Accept-Language`.** O Google desaconselha redirecionar por idioma percebido:
   o rastreador chega majoritariamente dos EUA e pode nunca indexar a versão
   pt-BR na raiz. Decisão em aberto, junto com a de manter ou não o multi-idioma.
10. **A abertura teatral passa a ser o elemento de LCP da home.** Com a cortina
    pintada no primeiro quadro, o Largest Contentful Paint mede a cortina, não o
    título. O número tende a melhorar; ele simplesmente deixou de descrever
    quando o _conteúdo_ aparece. Não leia essa melhora como ganho de desempenho.
11. **O contraste da frase da abertura não é verificado pelo axe.** O fundo é um
    gradiente, e o axe não calcula contraste sobre gradiente — reporta como
    "incompleto", não como violação. A varredura de `e2e/intro.spec.ts` é
    restrita ao overlay e cobre problemas estruturais, não cor. O orçamento de
    contraste está verificado numericamente no comentário dos tokens de
    cenografia, em `globals.css` (pior caso realista: 6,3:1). Ao mexer nas cores
    da cortina ou na intensidade dos fachos, refaça essa conta à mão.
12. **Sem deploy, sem observabilidade e sem orçamento de performance** — decisões
    ainda abertas.

13. **A cortina de transição revela, em vez de cobrir.** O protótipo faz a
    cortina descer, espera 300 ms, troca de tela e a recolhe. Aqui a ordem é
    invertida: a cortina é pintada já cobrindo a rota nova e se recolhe. Visual
    próximo, semântica melhor — **navegação não espera animação**. Divergência
    deliberada.
14. **O painel de acessibilidade entrega três das quatro opções do protótipo, e
    Libras não é uma delas.** Alto contraste, texto maior e movimento reduzido
    estão implementados de ponta a ponta (`lib/a11y/preferences.ts`), persistem
    em `localStorage` e valem para o portal inteiro. Libras ficou de fora porque
    exigiria intérprete em vídeo ou serviço de terceiros — anunciá-la sem
    entregá-la enganaria exatamente quem depende dela. No lugar, o painel leva
    ao filtro de acessibilidade da programação, que diz **quais sessões** têm
    Libras e audiodescrição.
    Duas limitações conhecidas: as preferências são aplicadas **depois da
    hidratação**, porque lê-las antes do primeiro quadro exigiria um script
    inline que o guia de segurança proíbe — quem escolheu alto contraste vê o
    tema padrão por um quadro; e elas vivem em `localStorage`, ou seja, por
    navegador, não por pessoa.
15. **O menu "Áreas do portal" saiu do cabeçalho.** Era um diálogo em tela cheia
    com as seis áreas; a navegação principal e o rodapé já levam às mesmas seis,
    e o lugar dele na barra passou a ser o painel de acessibilidade. `portalAreas`
    continua sendo a fonte única de destinos, agora lida pelo cabeçalho, pelo
    rodapé e pela navegação inferior.
16. **O acervo histórico não é traduzido.** Títulos, releases, fichas técnicas e
    biografias permanecem em pt-BR nas páginas em inglês e espanhol, marcados com
    `lang="pt-BR"` e precedidos de aviso traduzido. O visitante estrangeiro ainda
    encontra texto que não lê; traduzir material artístico de terceiros sem
    revisão humana seria pior.
17. **O mapa dos espaços é geográfico, e a precisão de cada marcador varia.**
    Linha de costa e malha viária são dados do OpenStreetMap congelados em
    `content/city-map.ts`; as coordenadas dos espaços vieram do OSM a partir do
    endereço que o programa publica. Três estão sobre o equipamento mapeado
    (`poi`), uma sobre o número da rua (`numero`) e três sobre a rua ou a praça
    do endereço (`via`) — `coordinatePrecision`, em `content/venues.ts`,
    registra qual é qual, e a nota do mapa declara isso ao visitante. Não há
    biblioteca de mapa nem requisição a terceiros: é `<svg>` inline, e funciona
    sem JavaScript. A atribuição ao OpenStreetMap é **obrigação de licença**
    (ODbL), não enfeite: não remova.
    No mapa geral os cinco espaços do Centro cabem em quatro quarteirões e os
    seus alvos de toque se sobreporiam, o que é violação de tamanho de alvo
    (WCAG 2.5.8). Ali eles são desenho; quem os torna clicáveis é o detalhe
    ampliado do Centro.
18. **O portal apresenta a edição de 2024 como edição vigente, e o relógio é
    fixo.** É a premissa da branch `demo/fenatevi-2024`: `currentEdition` aponta
    para `edition2024` em `src/content/festival.ts`, com
    `hasPublishedProgram: true` — e por isso o aviso de conteúdo demonstrativo
    (`ui/demo-content-notice.tsx`) não aparece em tela nenhuma. O componente e as
    chaves `acervo.demoNotice*` continuam no repositório, intactos: eles voltam a
    aparecer sozinhos no dia em que uma edição sem programação publicada virar a
    vigente.
    O instante corrente vem de `DEMO_INSTANT`, em
    `src/lib/utils/festival-clock.ts`, fixado em **18/10/2024 14h20** — meio da
    edição. Sem ele, todo estado de tempo do portal ("em cena agora", "ainda
    hoje", o dia que a grade abre, se uma oficina ainda recebe inscrição)
    responderia "a edição terminou". Virar a constante para `null` devolve o
    portal ao relógio real sem tocar em mais nenhum arquivo.
19. **`stage-scene.tsx` e `use-webgl-support.ts` ficaram sem consumidor.** A home
    deixou de exibir a cena 3D; o código permanece no repositório, com seus
    testes, à espera de um uso previsto no design. Não é código morto por
    descuido — é uma decisão registrada na proposta da change.
20. **Seis imagens ainda são extrações do programa impresso.** As fotografias de
    cena de 2024 foram restauradas e estão em `public/imagens/2024` com mais de
    1000px de largura; elas declaram `provenance: 'registro-original'` e
    `isLowResolution: false`. Continuam de baixa resolução, e declaradas como
    tal: `meus-olhos-verdes`, `corpo-que-eu-habito`, os dois retratos de
    homenageados, o retrato de Beth Caser e a capa do programa. São essas que
    `imagesNeedingOriginals` (em `src/content/images.ts`) lista — a lista de
    pedidos a fazer às companhias e à organização. As fotografias de palco
    (`/imagens/palco`) têm 512px e são decorativas.
21. **As três fotografias de espaço distribuídas com o protótipo não são
    usadas.** `venue-a/b/c.jpg` não vêm identificadas com o espaço que retratam,
    e atribuí-las a um teatro nomeado seria uma afirmação que o material não
    sustenta. Nenhum espaço declara fotografia; a página de espaço trata a
    ausência com área neutra, sem dizer nada ao visitante sobre isso.
22. **A linha do tempo da memória apresenta conteúdo de prévia, ligado por
    padrão — e a tela deixou de dizer isso.** As edições de 2005 a 2023 e as
    suas fotografias são ilustrativas. Nenhuma delas vira link para uma página
    de edição e nada disso alimenta contagem, resumo ou página, então a tela não
    afirma nada falso; mas a nota "Prévia de layout", que ressalvava isso ao
    visitante, **foi retirada nesta branch de demonstração** a pedido de quem
    apresenta. É o item desta lista com maior chance de virar problema real:
    antes de publicar para o público, ou a nota volta, ou
    `TIMELINE_PREVIEW_ENABLED` vira `false`. Fica em
    `src/content/mock/timeline-preview.ts`, e é o único arquivo a apagar quando
    os dados reais chegarem.
23. **`src/content/images.test.ts` não cobre as fotografias de prévia.** Elas são
    remotas (`images.unsplash.com`, autorizado em `next.config.ts`), e o teste
    garante apenas que toda imagem **em `public/`** existe. O acervo real
    continua inteiramente coberto; a lacuna some junto com a prévia.
24. **`/memoria` deixou de ser gerada estaticamente.** A rota lê `searchParams`
    para escolher entre as duas variantes de linha do tempo (`?linha=`). É
    temporário por construção: quando a variante for escolhida, a leitura sai e
    a rota volta a ser estática.
25. **Duas variantes da linha do tempo convivem no repositório.**
    `edition-timeline-spine.tsx` e `edition-timeline-rail.tsx` duplicam marcação
    e classes **de propósito**, e o CSS do eixo é duplicado pelo mesmo motivo. A
    que não for escolhida é apagada por inteiro. Não "conserte" a duplicação
    extraindo um componente comum — isso encareceria justamente a deleção que a
    duplicação existe para baratear.
    A tira tem ainda uma folha de cliente própria,
    `edition-timeline-rail-wheel.tsx`, que converte a rolagem vertical em avanço
    horizontal; ela também some com a variante.
26. ~~**O cabeçalho vaza cerca de 36px na horizontal em 320px.**~~ Resolvido: o
    botão de áreas saiu da barra, e o painel de acessibilidade que ocupou o
    lugar dele mostra só o pictograma abaixo de `lg`, com o rótulo no nome
    acessível. Nenhuma rota rola de lado em 320px. A suíte da memória ainda mede
    o vazamento **relativo** entre as variantes, o que continua correto — só
    deixou de haver vazamento para medir.
27. **`ImageAsset` não guarda as dimensões do arquivo.** O risco encolheu com a
    restauração das fotografias — `maxRenderedWidth` só tem efeito onde
    `isLowResolution` é verdadeiro, e hoje isso é só o material do programa
    impresso —, mas a forma continua: o teto é arbitrado por quem apresenta, e o
    padrão (320px) está acima das seis extrações que restam. As telas que as
    exibem passam o seu teto explicitamente e usam `fit="contain"`, para não
    ampliar nem recortar reprodução de cartaz. A correção definitiva é gravar
    largura e altura em `ImageAsset` e derivar o teto do próprio arquivo; é
    change própria, e vale para o portal inteiro.
