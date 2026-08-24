# Arquitetura e convenções

Leia antes de: criar arquivo novo, mover código entre pastas, criar abstração.
Decisões e justificativas: [`docs/architecture.md`](../architecture.md).

## Responsabilidades das pastas (fato)

| Área                   | Responsabilidade                                                    |
| ---------------------- | ------------------------------------------------------------------- |
| `app/`                 | Roteamento, layouts, metadata, composição de providers e de páginas |
| `components/ui/`       | Peças genéricas; **não** conhecem o festival                        |
| `components/layout/`   | Estrutura persistente do site (cabeçalho, rodapé)                   |
| `components/sections/` | Blocos visuais de uma página; recebem texto e dados por props       |
| `content/`             | Dados do festival como objetos tipados e imutáveis                  |
| `lib/`                 | Integrações técnicas e funções puras, sem JSX de página             |
| `providers/`           | Efeitos globais que precisam existir uma vez por documento          |
| `hooks/`               | Hooks reutilizáveis por mais de um componente                       |
| `types/`               | Apenas tipos que atravessam fronteiras entre áreas                  |

## Direção das dependências (regra)

```text
app/  →  components/{sections,layout,ui}  →  lib/, hooks/
  ↘  content/  →  types/                        ↘  types/
```

- `components/ui/` **não** importa de `content/`, `sections/` nem `app/`.
- `sections/` e `layout/` **não** importam de `app/`.
- `lib/` e `hooks/` **não** importam componentes de página nem `content/`.
- `types/` não importa nada.
- Importe pelo alias `@/*` (mapeado para `./src/*`), exceto entre arquivos irmãos
  do mesmo diretório, onde o relativo `./nome` já é o padrão em uso (ver
  `src/lib/i18n/navigation.ts`).
- Ciclo de importação é erro de arquitetura: quebre-o extraindo o valor
  compartilhado para o módulo mais baixo — foi assim que `MAIN_CONTENT_ID` acabou
  em `src/components/ui/skip-link.tsx`, consumido por `page`, `error` e
  `not-found`.

## Conteúdo separado de apresentação

Quatro coisas permanecem separadas: **conteúdo** (`src/content/` e `messages/`),
**apresentação** (`src/components/`), **interação** (Client Components pequenos) e
**integrações técnicas** (`src/lib/`).

- Nenhum componente carrega um objeto grande com dados do festival dentro do JSX.
- `src/content/` guarda **chaves de tradução**, não frases — ver
  `accessibility: ['audioDescription', ...]` em `src/content/festival.ts`,
  resolvido pelo namespace `accessibilityFeatures` das mensagens.
- O contrato do conteúdo é `src/types/festival.ts`. Quando os dados vierem de um
  CMS, esse arquivo continua sendo o tipo de saída do adaptador e os componentes
  não mudam.
- Sem classes, entidades, repositórios, casos de uso ou value objects: apenas
  `type`, `interface`, objetos imutáveis e funções puras.

## Quando criar `src/features/`

Só quando uma funcionalidade acumular **todos** estes traços: componentes
próprios, estado próprio, hooks próprios, transformação de dados e testes
próprios. Candidatas futuras: `schedule/`, `timeline/`, `festival-edition/`.

Dois ou três componentes soltos ainda são `sections/`. **Não crie a pasta vazia**
para representar arquitetura futura. Criá-la exige autorização humana.

## Coesão, tamanho e abstrações

- Um componente por arquivo, exportado por nome.
- Arquivo que passa de ~200 linhas ou mistura duas responsabilidades
  (animar + buscar dados + formatar) deve ser dividido.
- Generalize a partir do **terceiro** caso real, não do primeiro. `cn` em
  `src/lib/utils/cn.ts` é o critério em ação: 12 linhas, sem `clsx` nem
  `tailwind-merge`, porque ainda não há variantes que justifiquem.
- Implementação usada por um único lugar fica nesse lugar. Tipo usado por um
  único arquivo fica nesse arquivo.

## Convenções por tipo de arquivo (fato)

| Item                 | Convenção                                                     |
| -------------------- | ------------------------------------------------------------- |
| Arquivos e pastas    | `kebab-case` (`site-header.tsx`, `use-webgl-support.ts`)      |
| Componentes React    | `PascalCase`, exportação **por nome**                         |
| Hooks                | arquivo `use-*.ts`, função `useAlgo`, com `'use client'`      |
| Testes               | `*.test.ts` / `*.test.tsx`, **ao lado** do código             |
| Constantes de módulo | `SCREAMING_SNAKE_CASE` (`MAIN_CONTENT_ID`, `VARIANT_CLASSES`) |
| Props                | `interface XProps` com todos os campos `readonly`             |

Exceção obrigatória à exportação por nome: convenções do Next.js (`page.tsx`,
`layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `src/proxy.ts`) e o
módulo carregado por `next/dynamic`
(`src/lib/animation/three/stage-canvas.tsx`) exigem `export default`.

Ordem de imports em uso: externos, internos por alias `@/`, relativos, e
`import type` ao final quando for só tipo.

## Como criar um componente

1. Escolha a pasta pela responsabilidade: `ui/` (genérico, sem conhecimento do
   festival), `layout/` (estrutura persistente), `sections/` (bloco visual).
2. Server Component por padrão — ver [`nextjs-e-react.md`](./nextjs-e-react.md).
3. Props em `interface`, campos `readonly`, sem `any`.
4. Nenhum texto visível ao usuário no JSX — ver [`i18n.md`](./i18n.md).
5. Nenhuma cor arbitrária — ver
   [`estilos-e-design-tokens.md`](./estilos-e-design-tokens.md).

## Como criar uma seção

1. Crie `src/components/sections/<nome>.tsx`.
2. A seção **recebe texto e dados por props**; não chama `getTranslations` nem
   importa de `src/content/` — quem faz isso é a página.
3. Envolva com `<Container as="section">` e dê a ela um cabeçalho referenciado
   por `aria-labelledby` (ver as seções da home).
4. Componha na página. Se a seção animar, **só ela** vira Client Component.

Padrão de referência — o Server Component traduz, o Client Component anima:

```tsx
// src/app/[locale]/page.tsx  (Server Component)
const t = await getTranslations('home');
return <Hero title={t('title')} tagline={t('tagline')} />;

// src/components/sections/hero.tsx  ('use client')
export function Hero({ title, tagline }: HeroProps) {
  /* anima, não traduz */
}
```

## Como adicionar conteúdo

1. Se o formato for novo, declare o tipo em `src/types/festival.ts` (`type` ou
   `interface`, campos `readonly`).
2. Adicione o dado em `src/content/`, como objeto imutável e tipado.
3. Guarde **chaves de tradução**, não frases.
4. A página lê de `src/content/` e passa por props aos componentes.

## As rotas do portal

Nove telas, todas nos três idiomas. Os **segmentos não são traduzidos**
(`/en/programacao`, não `/en/programme`): traduzi-los exigiria `pathnames` no
next-intl, o que é alterar a estratégia de i18n.

| Rota                 | Renderização | O que apresenta                               |
| -------------------- | ------------ | --------------------------------------------- |
| `/`                  | estática     | A home em atos                                |
| `/programacao`       | sob demanda  | Listagem filtrável, agrupada por dia          |
| `/programacao/grade` | sob demanda  | A grade em três visões                        |
| `/espetaculos/[id]`  | estática     | Uma sessão: ficha, release, acessibilidade    |
| `/oficinas/[id]`     | estática     | Uma ação formativa e sua inscrição externa    |
| `/espacos`           | estática     | O esquema dos espaços e a lista com endereços |
| `/espacos/[id]`      | estática     | Um espaço e a sua programação                 |
| `/memoria`           | estática     | A linha do tempo das edições                  |
| `/edicoes/[ano]`     | estática     | Uma edição com acervo completo                |
| `/noticias`          | estática     | A área editorial e o seu estado de conteúdo   |

As páginas de detalhe usam `generateStaticParams` sobre o acervo. `/programacao`
e `/programacao/grade` renderizam sob demanda porque leem `searchParams` — o que
é irrelevante: não há I/O, só computação sobre um array em memória.

**Não use `loading.tsx` neste projeto.** Ele cria um limite de Suspense, e o
conteúdo que chega depois do shell é entregue dentro de um `<div hidden>` que
**só o JavaScript move para a página**. Sem JS, a tela fica vazia — o oposto da
regra que vence todas as outras aqui. Foi verificado: com `loading.tsx` no
segmento `[locale]`, a home inteira ficava oculta sem JavaScript.

## Filtros vivem na URL, não em estado

Os filtros da programação (`?dia=`, `?frente=`, `?espaco=`) e a visão da grade
(`?visao=`, `?dia=`) são `searchParams`, lidos no servidor. Cada chip é um
`Link`, não um botão com `useState`.

Isso resolve quatro coisas de uma vez: o link profundo que a home usa, o
compartilhamento de um resultado filtrado, o funcionamento **sem JavaScript**, e
a ausência de estado de cliente na tela mais complexa do portal.

Todo valor que chega da URL é **entrada externa** e passa por
[`lib/utils/program-query.ts`](../../src/lib/utils/program-query.ts): um dia que
não existe na edição, uma frente inventada ou um espaço desconhecido são
ignorados, e a tela responde sem aquele filtro — nunca com erro, nunca com uma
lista vazia enganosa.

## `src/content/` é o acervo tipado

Um módulo por coleção (`venues`, `activities`, `workshops`, `creative-processes`,
`honorees`, `books`, `edition-credits`, `partners`, `editions`, `news`,
`contact`), cada um exportando um `readonly` array tipado. Referências entre
coleções são `id`s.

A integridade referencial é garantida **por tipo, não por validação em runtime**:
os ids de espaço são uma união literal derivada do próprio array
(`(typeof RAW_VENUES)[number]['id']`), de modo que uma atividade apontando para
um espaço inexistente é um erro de `pnpm typecheck`. Não há schema validator no
projeto e não é preciso um: o dado é estático e o compilador é o validador.

Derivações da programação (situação da sessão, término, agrupamento, filtragem,
contagens) ficam em [`lib/utils/schedule.ts`](../../src/lib/utils/schedule.ts),
como funções puras. **Nenhuma delas lê `Date.now()`** — o instante é sempre
parâmetro. É o que as torna testáveis nos limites exatos e o que impede que
produzam HTML diferente no servidor e no cliente.
