## Context

Motivação e escopo: ver [proposal.md](./proposal.md). Contrato de comportamento:
ver [specs/stage-intro/spec.md](./specs/stage-intro/spec.md).

Quatro fatos da base condicionam quase todas as decisões abaixo:

1. **As três variantes de idioma são pré-renderizadas em build** (`generateStaticParams`
   - `setRequestLocale`). Ler cookie ou header para decidir se a abertura acontece
     derrubaria a renderização estática. Nada de estado de servidor.
2. **Não há o que carregar.** HTML estático, tipografia da pilha do sistema, Three.js já
   é `dynamic` + `ssr: false` e vive abaixo da dobra. A abertura é narrativa, não espera
   por nenhum sinal real.
3. **O CSS é render-blocking; o JavaScript não é.** Qualquer coreografia dirigida por JS
   só começa depois da hidratação — ou seja, depois de o conteúdo já ter sido pintado.
4. **`globals.css` já bloqueia todas as animações sob `prefers-reduced-motion`**, com
   `animation-duration: 0.01ms !important` em `*`.

Restrições herdadas do projeto que valem como requisito de projeto: nenhuma dependência
nova; nenhum texto visível no JSX; nenhuma cor arbitrária; `'use client'` só nas folhas;
zero erros de hidratação (é portão de CI); e a regra que vence as outras — a experiência
continua completa sem animação e sem WebGL.

## Goals / Non-Goals

**Goals**

- Que a cortina exista **no primeiro pixel pintado**, não depois da hidratação.
- Que o encerramento da abertura **não dependa de JavaScript nenhum** — é a única forma
  de o requisito "encerramento garantido" ser estrutural em vez de defensivo.
- Que a implementação some sem deixar rastro: nenhum asset, nenhuma dependência, nenhum
  provider global, nenhum estado persistido.
- Que a superfície de acoplamento seja pequena o suficiente para ser reescrita quando a
  identidade visual definitiva chegar.

**Non-Goals**

- Máquina de estados formal, biblioteca de animação ou orquestração de timeline.
- Qualquer sinal de progresso real de carregamento.
- Reaproveitamento futuro: a abertura é de uso único. Nada aqui é projetado para virar
  abstração de transições de página.

## Decisions

### D1 — A coreografia é declarativa em CSS; o GSAP fica de fora

**Decisão:** a sequência inteira é `@keyframes` em CSS. O JavaScript só faz três coisas:
dispensar, desmontar e marcar que já aconteceu.

**Por quê:** o argumento não é estético, é de **ordem de execução**. Uma cortina que só
existe depois da hidratação não é uma cortina — é um flash de conteúdo seguido de um pano
caindo por cima. E uma cortina que só o JavaScript sabe abrir transforma "o bundle falhou"
em "o site é uma tela vermelha". O CSS resolve os dois de graça, e é o que torna o
requisito _Encerramento garantido sem JavaScript_ verdadeiro por construção em vez de por
mecanismo de segurança.

**Alternativas consideradas:**

| Alternativa                    | Por que não                                                                                                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Timeline GSAP                  | Só roda pós-hidratação. Custo de bundle seria zero (o GSAP já vem no bundle inicial via `SmoothScrollProvider`), mas exigiria estado fechado em CSS **mais** um fallback de abertura em CSS — dois sistemas disputando o mesmo estado |
| GSAP + script inline anti-FOUC | O `dangerouslySetInnerHTML` é proibido por regra escrita no guia de segurança. Exigiria uma ADR só para viabilizar um caminho que o CSS já cobre                                                                                      |
| WebGL / R3F                    | Contradiz o próprio propósito: o Canvas é `ssr: false` por regra, então a cortina não existiria no primeiro pixel                                                                                                                     |
| Theatre.js                     | Ver D9                                                                                                                                                                                                                                |

**Quando revisitar:** se a sequência passar de ~6 tempos, ganhar acoplamento ao scroll ou
precisar de interatividade. Nesse dia, o estado fechado e uma abertura de reserva em CSS
continuam obrigatórios.

### D2 — O overlay é renderizado pelo servidor, na página inicial

**Decisão:** a marcação vem no HTML do servidor, composta por
`src/app/[locale]/page.tsx` como irmã de `<main>`. Não vai no layout.

**Por quê:** no HTML do servidor porque é a única forma de a cortina estar pintada junto
com o CSS render-blocking. Na página e não no layout porque (a) quem chegar de um link
para uma futura `/programacao` não deve assistir à abertura, (b) o layout permanece
intocado, o que reduz o raio de explosão, e (c) o `<main>` único continua sendo do
`page.tsx`.

O componente é `'use client'` e recebe os textos por props de um Server Component — o
mesmo padrão de `Hero`: o servidor traduz, o cliente interage.

### D3 — Não travar o scroll

**Decisão:** nenhum `overflow: hidden`, em lugar nenhum. O overlay é `position: fixed;
inset: 0` e captura eventos de ponteiro; rolar conta como dispensar.

**Por quê:** `overflow: hidden` no `body` remove a barra de rolagem no desktop clássico —
isso **é** deslocamento de layout, e o requisito exige CLS zero. Também brigaria com a
restauração de scroll do navegador e com a chegada por âncora na URL. E o Lenis não pode
ser o mecanismo de trava: ele nem monta sob movimento reduzido, e `getLenisInstance()`
pode devolver `null`.

**Consequência aceita:** sem JavaScript, rolar durante a abertura move a página por baixo
da cortina. Ao término, o visitante está alguns pixels rolado. Invisível durante a
abertura e trivial de corrigir depois.

### D4 — Captura de ponteiro sim, `inert` não

**Decisão:** `aria-hidden="true"` no overlay, sem descendentes focáveis, e
`pointer-events` ativo. **Sem** o atributo `inert`.

**Por quê:** `inert` deixaria os cliques atravessarem para a página invisível por baixo —
o visitante ativaria um link que não consegue ver. Capturando os eventos, a cortina
protege o que está atrás. E como não há nada focável dentro dela, a ordem de tabulação da
página fica intacta sem precisar de `inert`: o primeiro `Tab` continua indo ao skip link,
exatamente como o teste E2E existente já verifica.

**Consequência aceita:** durante a abertura, `Tab` move o foco para elementos atrás da
cortina, que ficam com foco invisível. Mitigado porque a primeira tecla dispensa a
abertura — a situação se resolve no mesmo evento que a cria.

Os listeners (`keydown`, `pointerdown`, `wheel`, `touchstart`) ficam no `document`, não no
overlay: pegam a interação independentemente de onde ela ocorra e sobrevivem à decisão
acima.

### D5 — Movimento reduzido usa uma regra explícita, não o efeito colateral global

**Decisão:** `@media (prefers-reduced-motion: reduce) { <overlay> { display: none } }`.

**Por quê:** o bloco global de `globals.css` faria as animações concluírem em 0,01 ms, o
que _quase_ satisfaz o requisito. Mas o requisito é "nenhuma cortina é exibida", e só
`display: none` garante **zero quadros pintados**. Um requisito duro não deve depender do
efeito colateral de uma regra escrita para outro fim. O bloco global vira redundância, não
mecanismo.

### D6 — Não reexibir: singleton de módulo, não storage

**Decisão:** um booleano em módulo (`src/lib/animation/`), no mesmo padrão de
[`lenis-instance.ts`](../../../src/lib/animation/lenis/lenis-instance.ts). Lido uma vez
por montagem, via inicializador de `useState`.

**Por quê:** o único caso a cobrir é navegação de cliente — trocar de idioma remonta o
segmento `[locale]`. Um módulo já sobrevive a isso e morre no recarregamento, que é
exatamente o comportamento especificado. `sessionStorage` exigiria leitura antes do
primeiro paint, ou seja, script inline, ou seja, a regra do `dangerouslySetInnerHTML`.

**Sem risco de hidratação:** no servidor o módulo é sempre novo, então a marcação sai
sempre. Na primeira hidratação a flag ainda é `false` — cliente e servidor coincidem. Ela
só vira `true` depois da conclusão, que é pós-hidratação; a partir daí só há renderização
de cliente, sem comparação com HTML.

### D7 — Dispensa por animação de saída sobreposta

**Decisão:** dispensar aplica uma classe ao container que (a) desliga `pointer-events`
no mesmo quadro e (b) roda uma animação própria de `opacity: 1 → 0` em 250 ms, com
`fill-mode: forwards`. As animações filhas continuam rodando por baixo, invisíveis.

**Por quê:** a alternativa óbvia — `animation: none` — devolveria cada elemento ao seu
estado base, ou seja, **fecharia as cortinas de volta**. Sobrepor uma saída no container é
mais simples que qualquer tentativa de "pular para o fim" em CSS, e entrega o requisito
de 300 ms com folga: o conteúdo fica clicável imediatamente, e o fade é só cortesia.

A conclusão (natural ou por dispensa) é detectada por `onAnimationEnd` no container,
filtrando `event.target === event.currentTarget` para ignorar os eventos que sobem dos
filhos. O handler é idempotente: desmonta, marca a flag e remove os listeners. Não há
`setTimeout` no caminho principal, então não existe corrida entre temporizador e quadro.

### D8 — Construção visual: gradientes em camadas, zero assets

**Decisão:** cada metade da cortina é **um** elemento com três camadas de `background`:
gradiente vertical (volume cilíndrico), `repeating-linear-gradient` com paradas em
porcentagem (pregas), e vinheta radial (profundidade). Os fachos são `radial-gradient`
animados **só em `opacity`**. A abertura anima **só `transform`**.

**Por quê:** uma imagem de veludo seria o pior asset possível — um request no caminho
crítico para o elemento que precisa existir antes de qualquer request terminar. SVG com
`feTurbulence` custa caro e não pode ser animado. Gradientes escalam para qualquer
viewport sem deformar e sem custo de rede.

**Regras que a implementação não pode violar:** nada de animar `filter: blur()`,
`box-shadow`, `width`, `height`, `top` ou `left`. O desfoque dos fachos mora nas paradas
do gradiente, não em um filtro.

**Geometria:** cada metade tem ~51 % de largura, ancorada na sua borda, com sobreposição
no centro — é o que garante ausência de fresta em larguras que dão subpixel. A abertura é
`translateX(∓100%)` (relativo à própria largura, portanto imune a redimensionamento) mais
um leve `scaleX` que sugere o franzido. Pregas em porcentagem mantêm a contagem constante
e a largura proporcional: em ultrawide elas ficam largas, o que lê como "teatro grande",
e nunca produzem emenda.

### D9 — Tokens de cenografia, não de marca

**Decisão:** três tokens novos no bloco `@theme`, nomeados como cenário:
`--color-curtain` (base), `--color-curtain-fold` (sombra da prega) e
`--color-curtain-sheen` (realce). Valores iniciais na faixa do veludo profundo
(aproximadamente `#4a0d12`, `#2a070a`, `#7a1a20`), ajustáveis pela direção de arte.

**Por quê:** nomeá-los como cenografia impede que vazem para botões, links ou estados, e
os torna descartáveis quando a identidade definitiva chegar, sem arrastar o resto do tema.
São tokens de cor, então vão no `@theme` — mas os `@keyframes` **não** vão: são de uso
único e interno a um componente, e transformá-los em utilitários `--animate-*` inflaria a
superfície de design tokens com seis animações que ninguém mais vai usar. Eles ficam num
bloco próprio de `globals.css`.

**Contraste:** `--color-foreground` (`#f4f1ec`) sobre o mais claro dos três
(`#7a1a20`) dá ≈9,4:1, e sobre a base ≈12,4:1 — folga confortável sobre o mínimo de
4,5:1. **O risco real não é a cortina, é a luz por cima dela:** o facho dourado
(`--color-accent`) somado ao veludo clareia o centro. Mitigação de projeto: o pico do
facho fica **atrás e acima** da frase, com o núcleo mais escuro sob o texto — que é também
mais teatral, o feixe atinge o palco e a frase se assenta nele. Verificação: a varredura
do axe com a cortina no ar, já exigida pela spec.

### D10 — Resposta à ADR 0001: Theatre.js segue adiado

A [ADR 0001](../../../docs/adr/0001-adiar-theatre-js.md) previa reavaliar a adoção
"quando a implementação da abertura teatral começar". A resposta é **não adotar**: uma
sequência de seis tempos, sem 3D, sem interatividade e sem edição visual não justifica uma
ferramenta de direção de timeline — e adotá-la implicaria uma coreografia dirigida por
JavaScript, contradizendo D1. A ADR recebe um adendo registrando isso; a decisão continua
aberta para uma futura cena 3D do festival.

### D11 — Testes: movimento reduzido vira o padrão do contexto

**Decisão:** `reducedMotion: 'reduce'` no `use` do `playwright.config.ts`; a spec da
abertura reativa o movimento com `test.use({ reducedMotion: 'no-preference' })`.

**Por quê:** sem gate em JavaScript, **nenhum `addInitScript` consegue impedir a cortina
de pintar** — ela é HTML do servidor pintado por CSS, anterior a qualquer script. As
alternativas seriam cada spec existente pagar a duração da abertura, ou introduzir um
mecanismo de bypass que só existe para os testes. Usar a preferência de movimento é o
mecanismo que o próprio produto já oferece, e dois specs do repositório já o adotam.

**Efeito colateral positivo:** a intermitência do axe registrada em
[`docs/riscos-conhecidos.md`](../../../docs/riscos-conhecidos.md) — causada pelo fade do
GSAP no CTA — deixa de existir, porque nenhuma timeline é criada.

**Contrapartida assumida:** o caminho _com_ movimento passa a ser exercitado só pela spec
da abertura. Aceitável enquanto ela for a única animação com requisito duro; deixa de ser
quando a próxima seção animada chegar.

Os cenários sem JavaScript se testam com `javaScriptEnabled: false` no contexto; a falha
de bundle, abortando as requisições de script por `page.route`.

### D12 — Migração da frase

`home.seed` deixa de existir; nasce o namespace `intro` (`line` e a dica de dispensa) nos
três arquivos. A prop `seed` sai da interface de `Hero` e da chamada em `page.tsx`. A
asserção de `e2e/home.spec.ts` sobre a frase migra para a spec da abertura.

## Risks / Trade-offs

**A atribuição de LCP muda para a cortina** → É o elemento genuinamente pintado naquele
instante, então a métrica não está errada — mas passa a medir outra coisa. Registrar em
`docs/riscos-conhecidos.md` para que ninguém leia a melhora numérica como ganho de
desempenho do conteúdo.

**Coreografia em CSS é rígida se a sequência crescer** → Aceito conscientemente: seis
tempos cabem bem em keyframes. O gatilho de migração para GSAP está em D1, junto com o que
seria obrigatório preservar.

**Bloco grande de CSS em `globals.css`, contra a política atual do arquivo** → Manter em
uma seção própria, delimitada e comentada, no mesmo espírito da exceção já existente para
as classes do Lenis. O guia de estilos é atualizado no mesmo commit.

**Promoção excessiva de camadas em dispositivos modestos** → Teto de ~6 elementos
compostos: duas metades, dois fachos, o texto, o container. Sem `will-change` explícito —
`transform` já promove o que precisa ser promovido.

**A frase existe no DOM mesmo quando a abertura não é exibida** (movimento reduzido usa
`display: none`) → Sem impacto para leitores de tela, porque o overlay é `aria-hidden` e
`display: none` o remove da árvore de qualquer forma. Duplicação irrelevante para busca.

**Aba em segundo plano congela as animações** → O `animationend` só dispara no retorno, e
até lá nada é desmontado. Inofensivo: nenhum temporizador dessincroniza, porque não há
temporizador. O visitante que volta ou vê o resto da abertura ou a dispensa com o primeiro
clique.

**Isto será refeito quando a identidade visual definitiva chegar** → É o risco estratégico
maior e não tem mitigação técnica, só de escopo: tokens isolados como cenografia,
componente único, zero assets, zero dependências. Reescrever custa apagar um arquivo e
três tokens.

**Regressão silenciosa na primeira coisa que todo visitante vê** → A `e2e/intro.spec.ts`
não é opcional, e precisa cobrir os caminhos degradados (sem JS, movimento reduzido), não
só o feliz.

## Migration Plan

Não há migração de dados nem de API. A implementação é aditiva, exceto por duas remoções
que precisam acontecer no mesmo commit para não quebrar o build: a chave `home.seed` nos
três arquivos de mensagens e a prop `seed` de `Hero` (com a chamada em `page.tsx`).

Reversão: `git revert` do commit. Nada persiste no navegador do visitante — sem cookie,
sem storage — então não existe estado a limpar depois de reverter.

## Open Questions

- **Valores exatos do veludo.** Os hexadecimais de D9 são um ponto de partida verificado
  para contraste; a direção de arte pode ajustá-los desde que a verificação do axe com a
  cortina no ar continue passando. Não altera specs, abordagem nem tarefas.
- **Contagem de pregas e intensidade do franzido.** Ajuste visual, resolvido olhando o
  protótipo em várias larguras.
- **Redação da dica de dispensa** nos três idiomas.
