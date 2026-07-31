# Arquitetura do frontend

Este documento descreve como o código do site do FENATEVI está organizado e por
quê. Ele acompanha o bootstrap técnico: descreve o que existe hoje e registra as
direções já decididas para o que vem depois.

## 1. Objetivos

O site é uma **experiência editorial e visual**, não uma plataforma
transacional. Não há autenticação, banco de dados, backend próprio nem regras de
negócio extensas. A arquitetura foi escolhida para refletir isso:

1. **Simplicidade sobre cerimônia.** Nada de `domain/`, `application/`,
   `infrastructure/`, casos de uso, repositórios, adapters ou value objects.
   Essas camadas resolvem problemas que este projeto não tem.
2. **Orientada à interface.** A unidade de organização é o componente e a seção
   da página, não a entidade.
3. **Preparada para animação e imersão.** GSAP, Lenis e Three.js já têm um lugar
   definido, com regras claras de carregamento e limpeza.
4. **Degradação garantida.** O conteúdo precisa estar completo e navegável sem
   animação, sem WebGL e sem JavaScript de enfeite.
5. **Evolução incremental.** Abstrações aparecem quando há dois ou três casos
   reais, nunca antes.

## 2. Estrutura de pastas

```text
.
├── .github/workflows/    CI
├── docs/                 Documentação técnica (este arquivo, ADRs)
├── e2e/                  Testes Playwright
├── messages/             Traduções: pt-BR.json, en.json, es.json
└── src/
    ├── app/[locale]/     Rotas, layouts, metadata, loading, error
    ├── components/
    │   ├── ui/           Reutilizáveis, sem conhecimento do festival
    │   ├── layout/       Cabeçalho, rodapé, estruturas do shell
    │   └── sections/     Seções visuais de página
    ├── content/          Conteúdo local tipado
    ├── hooks/            Hooks reutilizáveis
    ├── lib/
    │   ├── animation/
    │   │   ├── gsap/     Registro de plugins e helpers
    │   │   ├── lenis/    Acesso à instância de smooth scroll
    │   │   └── three/    Canvas e detecção de WebGL
    │   ├── i18n/         Rotas, navegação e configuração do next-intl
    │   └── utils/        Funções puras
    ├── providers/        Providers globais (hoje: smooth scroll)
    ├── styles/           globals.css e design tokens
    ├── test/             Setup do Vitest
    ├── types/            Tipos compartilhados entre áreas
    └── proxy.ts          Resolução de idioma por requisição
```

Não há `src/features/` no bootstrap — ver a seção 4.

### Responsabilidades

| Área                   | Responsabilidade                                                    |
| ---------------------- | ------------------------------------------------------------------- |
| `app/`                 | Roteamento, layouts, metadata, composição de providers e de páginas |
| `components/ui/`       | Peças genéricas e reutilizáveis; não conhecem o festival            |
| `components/layout/`   | Estrutura persistente do site (cabeçalho, rodapé)                   |
| `components/sections/` | Blocos visuais de uma página; recebem texto e dados por props       |
| `content/`             | Dados do festival como objetos tipados e imutáveis                  |
| `lib/`                 | Integrações técnicas e funções puras, sem JSX de página             |
| `providers/`           | Efeitos globais que precisam existir uma vez por documento          |
| `types/`               | Apenas tipos usados por mais de uma área                            |

Tipos usados em um único arquivo ficam nesse arquivo. `src/types/` é para o que
atravessa fronteiras.

## 3. Separação entre conteúdo e apresentação

Mesmo sem Clean Architecture, quatro coisas permanecem separadas:

- **Conteúdo** — `src/content/` e `messages/`.
- **Apresentação** — componentes em `src/components/`.
- **Interação** — Client Components pequenos e localizados.
- **Integrações técnicas** — `src/lib/`.

Consequências práticas:

- Um componente visual **não** carrega um objeto grande com dados do festival
  dentro do JSX. Ele recebe props ou lê de `src/content/`.
- Textos exibidos ao usuário vivem em `messages/`, nunca no JSX.
- `src/content/` guarda **chaves de tradução**, não frases. Ver
  `AccessibilityFeature` em `src/types/festival.ts`.
- O contrato do conteúdo é `src/types/festival.ts`. Quando os dados passarem a
  vir de um CMS, esse arquivo continua sendo o tipo de saída; os componentes não
  mudam.

Nenhuma classe, entidade ou value object: apenas `type`, `interface`, objetos
imutáveis e funções puras. Schemas de validação (Zod ou equivalente) entram
quando existir entrada externa que os justifique — hoje não existe.

## 4. Quando criar `src/features/`

`src/features/<nome>/` é para uma funcionalidade que acumulou **estado próprio,
hooks próprios, transformação de dados e testes próprios** — não apenas alguns
componentes. Candidatas futuras: `schedule/`, `timeline/`, `festival-edition/`.

A pasta não existe hoje porque nada preencheria esses critérios. Criar diretórios
vazios para representar uma arquitetura futura é o oposto do princípio adotado.

## 5. Server e Client Components

O padrão é **Server Component**. Um componente só recebe `'use client'` quando
precisa de uma destas coisas:

- estado ou efeito do React;
- eventos do usuário;
- APIs do navegador (`window`, `matchMedia`, `IntersectionObserver`);
- bibliotecas de animação (GSAP, Lenis, React Three Fiber).

Client Components devem ser **pequenos e nas folhas da árvore**. O padrão adotado
é: um Server Component resolve traduções e dados e passa tudo por props para um
Client Component que apenas anima ou interage. `src/components/sections/hero.tsx`
é o exemplo de referência — ele anima, mas não sabe traduzir nada.

Hoje rodam no cliente apenas: o seletor de idioma, o provider de smooth scroll, o
Hero, a cena 3D, o botão "voltar ao topo" e o error boundary.

## 6. Internacionalização

- Biblioteca: **next-intl**, integrada pelo plugin em `next.config.ts`.
- Idiomas: `pt-BR` (padrão), `en`, `es`.
- Estratégia de URL: `localePrefix: 'as-needed'` — `pt-BR` em `/`, os demais em
  `/en` e `/es`.
- O idioma é resolvido em `src/proxy.ts` (convenção `proxy` do Next.js 16, antes
  chamada `middleware`), que também detecta o `Accept-Language` do visitante.
- O segmento `[locale]` é **sempre validado** com `hasLocale` antes de ser usado.
- `setRequestLocale` é chamado no layout e na página para permitir renderização
  estática — as três variantes são geradas em build (`generateStaticParams`).
- Datas são formatadas por locale e sempre em UTC
  (`src/lib/utils/format.ts`), para que o fuso do servidor nunca desloque o dia.
- Navegação: use sempre `Link`, `useRouter` e `usePathname` de
  `src/lib/i18n/navigation.ts`, nunca os equivalentes de `next/*`.

## 7. Animações

Três bibliotecas, três papéis que não se sobrepõem:

| Biblioteca                 | Papel                                                                       |
| -------------------------- | --------------------------------------------------------------------------- |
| **GSAP** (+ ScrollTrigger) | Animação de HTML e SVG: revelações, timelines, sequências ligadas ao scroll |
| **Lenis**                  | Comportamento do scroll da página (suavização), nada mais                   |
| **Three.js / R3F**         | Cenas 3D dentro de um `<canvas>`                                            |

Regras:

- GSAP é importado **apenas** de `src/lib/animation/gsap` — é lá que os plugins
  são registrados, uma única vez, em um módulo `'use client'`.
- Animações usam `useGSAP` com `scope` e refs locais. Seletores globais são
  proibidos: eles vazam entre componentes e quebram o cleanup.
- Movimento reduzido passa por `respectReducedMotion`, que usa
  `gsap.matchMedia()` e reverte a timeline se a preferência mudar na sessão.
- Animações são sempre `from` (do estado deslocado para o natural), nunca `to`
  partindo de um estado escondido por CSS. Assim, se o JavaScript falhar, o
  conteúdo já está visível e no lugar certo.
- O Lenis roda em um **único loop de RAF**, avançado pelo ticker do GSAP, e
  notifica o `ScrollTrigger` a cada quadro. Dois loops competindo causam jitter.
- O provider do Lenis não renderiza nada e não envolve o conteúdo: a página
  continua rolável se ele falhar ou nunca montar.
- Regiões com scroll próprio (modais, listas) devem receber `data-lenis-prevent`.

## 8. WebGL

- Three.js é usado através de **React Three Fiber**; `@react-three/drei` entra
  apenas quando um helper concreto é necessário (hoje: `AdaptiveDpr`).
- O Canvas é carregado com `next/dynamic` e `ssr: false`. O Three.js não entra no
  bundle inicial nem é avaliado no servidor.
- O suporte a WebGL é detectado por `useWebGLSupport`, com três estados:
  `unknown` (servidor e primeira renderização), `available` e `unavailable`. Isso
  mantém o HTML hidratado idêntico ao do servidor.
- **Sempre existe fallback visual** (gradiente CSS) e **sempre existe alternativa
  textual**: o contêiner é `role="img"` com `aria-label`, e um texto explicativo
  aparece quando não há WebGL.
- O loop de renderização usa `frameloop="demand"` quando a cena está fora da
  viewport ou o usuário prefere movimento reduzido — fora da tela, o custo é zero.
- Nenhum conteúdo essencial vive dentro do Canvas.
- Nada de modelos ou texturas pesadas: a cena atual é geometria procedural.

A cena de hoje é uma **prova técnica**, não a abertura cinematográfica do
festival. Cortinas, holofotes e a linha do tempo virão depois.

## 9. Testes

| Camada                | Ferramenta               | O que cobre                                                 |
| --------------------- | ------------------------ | ----------------------------------------------------------- |
| Unitário / componente | Vitest + Testing Library | Comportamento observável: papéis, rótulos, texto, interação |
| E2E                   | Playwright               | Idioma, teclado, skip link, fallback 3D, movimento reduzido |
| Acessibilidade        | `@axe-core/playwright`   | Varredura WCAG 2.2 AA na home                               |

Testes ficam ao lado do código (`*.test.ts[x]`). O setup do Vitest está em
`src/test/setup.ts`.

O que **não** testamos: detalhes internos, quadros de animação, snapshots
grandes, ou componentes puramente visuais sem comportamento.

No CI roda apenas Chromium. Firefox e WebKit entram quando a experiência visual
estiver definida — antes disso, cobririam um layout que ainda vai mudar.

## 10. Performance

Compromissos assumidos:

- Server Components por padrão; Client Components pequenos e nas folhas.
- Um único provider global (smooth scroll), que não renderiza DOM.
- Three.js e GSAP fora do caminho crítico.
- Renderização estática das três variantes de idioma.
- `next/image` para qualquer imagem relevante que venha a ser adicionada.
- Nenhum vídeo com autoplay, nenhum áudio automático.
- Animação pausada quando o elemento está fora da viewport.
- Altura reservada para blocos que carregam depois, evitando layout shift.
- Zero erros de hidratação — verificado por teste E2E que falha se o console
  registrar qualquer erro.

## 11. Direções futuras

### CMS

`src/content/` é o ponto de troca. Um CMS entraria como uma função assíncrona que
devolve os mesmos tipos de `src/types/festival.ts`, consumida em Server
Components. Nada em `components/` precisa mudar. Só vale a pena quando a
organização do festival precisar editar conteúdo sem deploy.

### Theatre.js

Não instalado no bootstrap. A decisão está registrada em
[`docs/adr/0001-adiar-theatre-js.md`](./adr/0001-adiar-theatre-js.md).

### Navegadores adicionais no E2E

Firefox e WebKit entram no `playwright.config.ts` quando o design estiver
estável.
