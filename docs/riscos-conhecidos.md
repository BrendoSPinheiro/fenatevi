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
14. **O controle "A11y" do cabeçalho não existe.** O protótipo o desenha, ainda
    que rotulado "Estado de demonstração — integração real na implementação":
    alto contraste, aumento de texto, redução de movimento e Libras são quatro
    funcionalidades anunciadas e não desenhadas. O portal já entrega WCAG 2.2 AA
    e respeita `prefers-reduced-motion` nativamente. Implementá-las de verdade é
    uma change própria, com decisões próprias sobre persistência de preferência.
    A ausência **será notada** por quem conhece o protótipo.
15. **O mapa cultural é um esquema, não um mapa.** As posições dos espaços são
    porcentagens dentro do container, herdadas do protótipo: mostram os espaços
    em relação uns aos outros e nada mais. Não há base cartográfica, biblioteca
    de mapa nem coordenada. A página declara isso em texto, e a lista de espaços
    com endereços reais não depende do esquema.
16. **O acervo histórico não é traduzido.** Títulos, releases, fichas técnicas e
    biografias permanecem em pt-BR nas páginas em inglês e espanhol, marcados com
    `lang="pt-BR"` e precedidos de aviso traduzido. O visitante estrangeiro ainda
    encontra texto que não lê; traduzir material artístico de terceiros sem
    revisão humana seria pior.
17. **A home mostra a programação de 2024 sob o cabeçalho da edição de 2026.** É
    o que o protótipo desenha, e o aviso de conteúdo demonstrativo é explícito e
    traduzido, acima da primeira lista de cada tela que apresenta programação. O
    risco real é o aviso passar despercebido.
18. **`stage-scene.tsx` e `use-webgl-support.ts` ficaram sem consumidor.** A home
    deixou de exibir a cena 3D; o código permanece no repositório, com seus
    testes, à espera de um uso previsto no design. Não é código morto por
    descuido — é uma decisão registrada na proposta da change.
19. **As imagens são todas de baixa resolução.** As 23 capas e retratos de 2024
    são extrações do programa impresso e não passam de 530px de largura; as
    fotografias de palco têm 512px. Cada uma declara `isLowResolution` no
    acervo, e `imagesNeedingOriginals` (em `src/content/images.ts`) é a lista de
    pedidos a fazer às companhias e à organização.
20. **As três fotografias de espaço distribuídas com o protótipo não são
    usadas.** `venue-a/b/c.jpg` não vêm identificadas com o espaço que retratam,
    e atribuí-las a um teatro nomeado seria uma afirmação que o material não
    sustenta. Nenhum espaço declara fotografia; a página de espaço trata a
    ausência com área neutra, sem dizer nada ao visitante sobre isso.
21. **A linha do tempo da memória apresenta conteúdo de prévia, ligado por
    padrão.** As edições de 2005 a 2023 e as suas fotografias são ilustrativas —
    a tela declara isso em texto, nenhuma delas vira link para uma página de
    edição, e nada disso alimenta contagem, resumo ou página. Fica em
    `src/content/mock/timeline-preview.ts`, atrás de `TIMELINE_PREVIEW_ENABLED`,
    e é o único arquivo a apagar quando os dados reais chegarem. Decisão
    consciente do mantenedor enquanto o acervo histórico não existir.
22. **`src/content/images.test.ts` não cobre as fotografias de prévia.** Elas são
    remotas (`images.unsplash.com`, autorizado em `next.config.ts`), e o teste
    garante apenas que toda imagem **em `public/`** existe. O acervo real
    continua inteiramente coberto; a lacuna some junto com a prévia.
23. **`/memoria` deixou de ser gerada estaticamente.** A rota lê `searchParams`
    para escolher entre as duas variantes de linha do tempo (`?linha=`). É
    temporário por construção: quando a variante for escolhida, a leitura sai e
    a rota volta a ser estática.
24. **Duas variantes da linha do tempo convivem no repositório.**
    `edition-timeline-spine.tsx` e `edition-timeline-rail.tsx` duplicam marcação
    e classes **de propósito**, e o CSS do eixo é duplicado pelo mesmo motivo. A
    que não for escolhida é apagada por inteiro. Não "conserte" a duplicação
    extraindo um componente comum — isso encareceria justamente a deleção que a
    duplicação existe para baratear.
    A tira tem ainda uma folha de cliente própria,
    `edition-timeline-rail-wheel.tsx`, que converte a rolagem vertical em avanço
    horizontal; ela também some com a variante.
25. **O cabeçalho vaza cerca de 36px na horizontal em 320px, em todas as telas.**
    O grupo do seletor de idioma com o botão de áreas não cabe, e o documento
    passa a rolar de lado — contra "A Regra do Documento Que Não Anda de Lado".
    É anterior às mudanças da linha do tempo e não foi corrigido aqui; a suíte
    da memória mede o vazamento **relativo** entre as variantes por causa disso.
26. **`ImageAsset` não guarda as dimensões do arquivo, e o teto de largura é
    arbitrado por quem apresenta.** As capas de 2024 vão de **151 a 269px de
    largura** e de 3:5 a 3:2 de proporção — os dois extremos convivem no mesmo
    acervo. `ProvenancedImage` recebe `maxRenderedWidth` do chamador, e o padrão
    (320px) está acima de **todos** os arquivos: qualquer tela que aceite o
    padrão amplia o material. A programação passa os seus tetos explicitamente
    (152px no cartaz de abertura, 112px nas linhas, ambos ≤ o menor arquivo) e
    usa `fit="contain"` em moldura quadrada, para não recortar as capas
    horizontais. **As demais telas ainda não fazem isso** — a home apresenta a
    capa em destaque a 240px, acima das que têm 151px. A correção definitiva é
    gravar largura e altura em `ImageAsset` e derivar o teto do próprio arquivo;
    é change própria, e vale para o portal inteiro.
