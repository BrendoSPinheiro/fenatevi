## Why

O site do FENATEVI é uma experiência editorial e visual, mas hoje o visitante chega
direto a uma página de validação técnica: não existe nenhum momento que estabeleça a
identidade e a narrativa do festival. A abertura teatral — cortinas, escuro de palco,
holofotes — sempre esteve prevista (os tokens `--duration-curtain` e `--ease-curtain`
já existem, e a [ADR 0001](../../../docs/adr/0001-adiar-theatre-js.md) adiou a escolha
da ferramenta explicitamente até "quando a implementação da abertura teatral começar").
É esse momento.

Esta é também a primeira funcionalidade visual do projeto: ela precisa provar que dá
para entregar imersão sem abrir mão de acessibilidade, performance e degradação —
o princípio que decide empates neste repositório.

## What Changes

- **Nova abertura teatral na página inicial**: um overlay em tela cheia que começa
  escuro e com duas cortinas de veludo fechadas, revela dois fachos de luz, exibe a
  frase "Basta uma semente...", abre as cortinas lateralmente e desaparece — em menos
  de 5 segundos, revelando a home já renderizada por trás.
- **A abertura se encerra sozinha sem JavaScript.** A coreografia é declarativa, de
  modo que uma falha de bundle, JavaScript desligado ou hidratação que nunca acontece
  não podem deixar o visitante preso numa tela preta. Isto preserva a regra mais forte
  do projeto: a experiência continua completa sem animação e sem WebGL.
- **A abertura é dispensável por qualquer entrada do usuário** (tecla, clique, rolagem,
  toque), e **não existe sob `prefers-reduced-motion: reduce`** — o visitante vai
  direto ao conteúdo.
- **BREAKING — a prop `seed` sai de `Hero`.** A frase "Basta uma semente..." passa a
  ser exclusiva da abertura: a chave `home.seed` é substituída por `intro.line` nos três
  arquivos de `messages/`, e a linha some da seção Hero. Motivo: exibir a mesma frase
  duas vezes com dois segundos de intervalo enfraquece o momento e cria ambiguidade
  para os testes.
- **Novos design tokens de cenografia** (veludo vermelho), nomeados como cenário e não
  como paleta de marca, para que possam ser retrabalhados ou removidos quando a
  identidade visual definitiva chegar sem arrastar o tema junto. _Requer autorização
  humana explícita — concedida na exploração que originou esta change._
- **`reducedMotion: 'reduce'` passa a ser o padrão do contexto no Playwright**, com a
  spec da abertura reativando o movimento. Sem um gate em JavaScript, nenhum
  `addInitScript` consegue impedir a cortina de pintar, e cada spec existente pagaria a
  duração da abertura. Efeito colateral positivo: elimina a intermitência do axe
  registrada em [`docs/riscos-conhecidos.md`](../../../docs/riscos-conhecidos.md),
  causada pelo fade do GSAP no CTA. _Requer autorização humana explícita — concedida._
- **A política de CSS global em `globals.css` é estendida** para acomodar o estado
  inicial e a coreografia da abertura, hoje restrita a "base do documento e requisitos
  de bibliotecas". _Requer autorização humana explícita — concedida._
- **A ADR 0001 recebe um adendo** registrando que a abertura foi implementada sem
  Theatre.js e que a decisão de adiar segue válida por ausência de uso concreto.

Fora do escopo desta change: WebGL ou Theatre.js na cortina, áudio, vídeo, progresso de
carregamento real, persistência entre recarregamentos, textura de tecido em imagem,
abertura em rotas que não a home, transições de cortina entre páginas internas, e
qualquer trava de scroll baseada em `overflow: hidden`.

## Capabilities

### New Capabilities

- `stage-intro`: a abertura teatral da página inicial — quando ela acontece, a sequência
  narrativa que apresenta, como o visitante a dispensa, como ela degrada sem JavaScript
  e sob movimento reduzido, e onde a frase da semente é exibida.

### Modified Capabilities

Nenhuma. O diretório `openspec/specs/` está vazio: esta é a primeira capability
especificada do projeto.

## Impact

**Código**

- `src/components/sections/` — novo componente de abertura (Client Component,
  posicionado pela página inicial).
- `src/components/sections/hero.tsx` — **contrato de props alterado**: a prop `seed`
  deixa de existir.
- `src/app/[locale]/page.tsx` — compõe a abertura e para de passar `seed` ao `Hero`.
- `src/lib/animation/` — controle de reexibição em navegação de cliente (a troca de
  idioma remonta o segmento `[locale]`).
- `src/styles/globals.css` — tokens de cenografia e coreografia da abertura.

**Conteúdo**

- `messages/pt-BR.json`, `messages/en.json`, `messages/es.json` — namespace `intro`
  novo; `home.seed` removida.

**Testes**

- `playwright.config.ts` — `reducedMotion: 'reduce'` como padrão do contexto.
- `e2e/intro.spec.ts` — novo.
- `e2e/home.spec.ts` — a asserção sobre "Basta uma semente..." migra para a spec da
  abertura.
- `e2e/accessibility.spec.ts` — a varredura do axe passa a cobrir também a página com a
  cortina no ar.

**Documentação**

- `docs/adr/0001-adiar-theatre-js.md` — adendo.
- `docs/guides/animacao-e-webgl.md` e `docs/guides/estilos-e-design-tokens.md` —
  registro da exceção à regra de não esconder conteúdo esperando animação e da extensão
  da política de CSS global.
- `docs/riscos-conhecidos.md` — a intermitência do axe deixa de se aplicar.

**Dependências**

Nenhuma dependência nova, nenhum asset novo. GSAP, Lenis e Three.js permanecem como
estão; a abertura não os utiliza.
