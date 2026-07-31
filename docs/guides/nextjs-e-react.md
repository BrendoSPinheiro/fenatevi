# Next.js e React

Leia antes de: mexer em rotas, layouts, metadata, `'use client'`, efeitos ou
busca de dados.

Versões que valem aqui: **Next.js 16 (App Router + Turbopack)** e **React 19**.

## Roteamento e renderização (fato)

- O segmento `[locale]` é a **raiz** da árvore: `src/app/[locale]/layout.tsx`
  renderiza `<html>` e `<body>` — **não existe** `src/app/layout.tsx`.
- `generateStaticParams` gera as três variantes de idioma em build;
  `setRequestLocale(locale)` é chamado no layout **e** na página para permitir
  renderização estática.
- `params` é uma `Promise` e precisa de `await`.
- `generateMetadata` resolve título e descrição por idioma e declara
  `alternates.languages`.
- Estados de rota implementados: `loading.tsx` (reserva altura, sem spinner
  animado), `error.tsx` (error boundary, Client Component obrigatório) e
  `not-found.tsx`.
- `src/proxy.ts` é a convenção do Next.js 16 para o que antes se chamava
  `middleware`; o `createMiddleware` do next-intl continua sendo a fábrica
  correta.

## Server e Client Components

**Server Component é o padrão.** Um componente só recebe `'use client'` quando
precisa de:

- estado ou efeito do React;
- evento do usuário;
- API do navegador (`window`, `matchMedia`, `IntersectionObserver`);
- GSAP, Lenis ou React Three Fiber.

Client Components devem ser **pequenos e nas folhas** da árvore. Nunca marque um
layout ou uma página inteira como `'use client'` para resolver um erro pontual —
extraia a parte interativa.

Rodam no cliente hoje: seletor de idioma, provider de smooth scroll, `Hero`,
`StageScene`, `BackToTop` e o error boundary. Essa lista deve crescer devagar.

## Dados, cache e navegação

- Não há fetch remoto hoje: o conteúdo é importado de `src/content/`. Se um fetch
  entrar, ele acontece em Server Component ou Route Handler — nunca em
  `useEffect` para dados que o servidor já pode resolver.
- Ao adicionar um fetch, declare a estratégia de cache explicitamente
  (`cache`/`revalidate` na chamada, ou `revalidate` no segmento) e documente o
  porquê. Não deixe o comportamento implícito.
- Use `<Suspense>` com fallback que reserve altura quando o streaming reduzir de
  fato o tempo até o primeiro conteúdo útil; não envolva tudo por hábito.
- **Navegação:** importe `Link`, `useRouter`, `usePathname`, `redirect` e
  `getPathname` de `@/lib/i18n/navigation` — **nunca** de `next/link` ou
  `next/navigation` — para preservar o idioma. `notFound` continua vindo de
  `next/navigation`.
- Links internos usam `Link`; **âncoras na mesma página usam `<a href="#id">`**
  (o Lenis trata âncoras via `anchors: true`).
- Navegação é sempre `<a>`, nunca `<button onClick={router.push}>`: teclado, menu
  de contexto e "abrir em nova aba" precisam funcionar. Para reaproveitar o
  visual do botão em um link, use `buttonClassName()` de
  `@/components/ui/button`.

## Hidratação

Zero erros de hidratação — há um teste E2E que falha se o console registrar
qualquer erro. Trate-o como portão, não como ruído.

- Não acesse `window`, `document`, `matchMedia` nem `Date.now()` durante a
  renderização.
- Para estado que só o cliente conhece, use `useSyncExternalStore` com um
  snapshot de servidor estável — o padrão de `useReducedMotion` (`false` no
  servidor) e `useWebGLSupport` (`'unknown'` no servidor).
- A interface precisa ter estado neutro para o valor do servidor. Nunca renderize
  área vazia enquanto o valor real não chega.
- Datas de conteúdo são dias de calendário: formate com `formatFestivalDate` de
  `@/lib/utils/format.ts`, que força UTC. Sem isso o fuso do servidor desloca o
  dia e o HTML diverge.

## Metadata, imagens e fontes

- Título e descrição vêm de `generateMetadata` com traduções; ao criar uma rota,
  adicione as chaves nos três arquivos de mensagens.
- O layout de `[locale]` define `metadataBase`, o `title.template`, o canonical,
  o `hreflang` e o cartão social. Uma rota nova só precisa declarar o próprio
  `title` e `description` — o sufixo `— FENATEVI` vem do template.
- **`alternates`, `openGraph` e `robots` são substituídos, não mesclados.** A
  rota que declarar `alternates.canonical` precisa repetir `alternates.languages`
  junto, ou perde o `hreflang`. Mesma regra ao redeclarar `openGraph`.
- Toda URL absoluta (canonical, `hreflang`, `og:image`, `robots.txt` e o futuro
  sitemap) deriva de `SITE_URL`, em `src/lib/seo/site.ts`. O valor é provisório;
  não repita o domínio em outro arquivo.
- A imagem de compartilhamento é gerada por `[locale]/opengraph-image.tsx` com
  `next/og`. Ela renderiza no Satori, que aceita só um subconjunto de CSS e
  **não** lê CSS Custom Properties nem classes do Tailwind — daí o estilo inline
  e as cores de `OG_COLORS`.
- A rota da imagem não tem extensão, então `src/proxy.ts` precisa excluí-la do
  matcher; sem isso o idioma padrão responde 307 e o card fica sem figura.
- Imagens relevantes usam `next/image` com `width`/`height` (ou `fill` sobre
  contêiner com proporção fixa) e `alt` significativo. Decorativas: `alt=""`.
- A tipografia hoje é a pilha de sistema (`--font-sans`). Se uma fonte própria
  entrar, use `next/font` (sem `<link>` manual), com `display: swap` e subset
  adequado.

## React

- Efeitos servem para sincronizar com sistemas externos (observers, media
  queries, instâncias de biblioteca), não para derivar estado: valor calculável
  na renderização deve ser calculado na renderização.
- Todo efeito que registra algo devolve o cleanup correspondente —
  `SmoothScrollProvider` e `useInViewport` são os exemplos.
- Não memoize por precaução. `useMemo`/`useCallback`/`memo` só com problema
  medido.
- Prefira composição (`children`, slots) a props de configuração acumuladas. Se
  um componente ganhou mais de ~3 flags booleanas, provavelmente são dois.
- Chaves de lista: um id estável do dado, nunca o índice.
