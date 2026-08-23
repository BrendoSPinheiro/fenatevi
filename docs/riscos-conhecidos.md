# Riscos e inconsistências conhecidos

Registrados para transparência. **Não os corrija espontaneamente** — este
documento é descritivo; cada item vira tarefa quando for pedido.

1. **Tipos de domínio ainda sem uso.** `Venue`, `Show`, `TimelineItem` e
   `AccessibilityFeature` existem em `src/types/festival.ts` mas nenhum é
   importado hoje (só `IsoDate`, `AccessibilityFeatureId` e `FestivalEdition`
   são). Eles antecipam domínios futuros, o que fica em tensão com a regra de não
   preparar o futuro. Ao implementar programação ou linha do tempo, valide-os
   contra a necessidade real em vez de assumi-los corretos.
2. **Chaves de tradução sem consumidor:** `header.navigationLabel`,
   `header.about` e `metadata.localeLabel` existem nos três arquivos de
   `messages/` e não são usadas.
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
