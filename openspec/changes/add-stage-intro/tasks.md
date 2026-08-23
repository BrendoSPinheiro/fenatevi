## 1. Tokens e base de estilo

- [x] 1.1 Adicionar ao bloco `@theme` de `src/styles/globals.css` os tokens de cenografia `--color-curtain`, `--color-curtain-fold` e `--color-curtain-sheen`, com os valores iniciais de D9 e um comentário registrando que são cenário, não paleta de marca
- [x] 1.2 Verificar o contraste de `--color-foreground` sobre cada um dos três tokens e confirmar que o menor resultado supera 4,5:1
- [x] 1.3 Criar em `globals.css` uma seção própria, delimitada e comentada, para a abertura — no mesmo espírito da exceção já existente para as classes do Lenis
- [x] 1.4 Escrever nessa seção o estado inicial: container `position: fixed; inset: 0`, camada `--z-overlay`, fundo escuro, e as duas metades ancoradas nas bordas com ~51 % de largura cada (sobreposição central, conforme a geometria de D8)
- [x] 1.5 Compor o veludo de cada metade com as três camadas de `background` de D8 (gradiente vertical de volume, `repeating-linear-gradient` de pregas com paradas em porcentagem, vinheta radial)
- [x] 1.6 Compor os dois fachos como `radial-gradient`, com o pico posicionado atrás e acima da frase e núcleo mais escuro sob o texto (mitigação de contraste de D9)
- [x] 1.7 Escrever os `@keyframes` da sequência — escuro, entrada dos fachos, entrada da frase, saída da frase, abertura das cortinas, saída do container — animando exclusivamente `transform` e `opacity`
- [x] 1.8 Encadear as animações por `animation-delay` de modo que o total fique em no máximo 5 s e a frase permaneça estática por pelo menos 1 s antes de as cortinas começarem a abrir
- [x] 1.9 Escrever os `@keyframes` da saída antecipada (opacidade 1 → 0 em 250 ms, `fill-mode: forwards`) e a classe que a aplica junto de `pointer-events: none`, conforme D7
- [x] 1.10 Adicionar a regra explícita `@media (prefers-reduced-motion: reduce)` com `display: none` no container, conforme D5
- [x] 1.11 Confirmar que nenhuma regra da seção anima `filter`, `box-shadow`, `width`, `height`, `top` ou `left`, e que nenhuma cor arbitrária foi usada onde existe token

## 2. Conteúdo e traduções

- [x] 2.1 Criar o namespace `intro` em `messages/pt-BR.json` com `line` ("Basta uma semente...") e a dica de dispensa
- [x] 2.2 Replicar o namespace `intro` em `messages/en.json` e `messages/es.json`, traduzido
- [x] 2.3 Remover a chave `home.seed` dos três arquivos de mensagens

## 3. Componente da abertura

- [x] 3.1 Criar o singleton de módulo em `src/lib/animation/` que registra se a abertura já aconteceu, no padrão de `lenis-instance.ts` (D6)
- [x] 3.2 Criar `src/components/sections/stage-intro.tsx` como Client Component, com props `readonly` para a frase e para a dica, sem resolver traduções internamente
- [x] 3.3 Montar a marcação: container `aria-hidden="true"`, duas metades, dois fachos, a frase e a dica — nenhum descendente focável (D4)
- [x] 3.4 Ler o singleton uma única vez no inicializador de `useState` e renderizar `null` quando a abertura já tiver acontecido
- [x] 3.5 Registrar no `document` os listeners de `keydown`, `pointerdown`, `wheel` e `touchstart` que aplicam a classe de saída antecipada, com cleanup no retorno do efeito
- [x] 3.6 Tratar a conclusão em `onAnimationEnd` do container, filtrando `event.target === event.currentTarget`, de forma idempotente: marca o singleton, remove os listeners e desmonta
- [x] 3.7 Confirmar que não existe `setTimeout` no caminho principal e que nenhum acesso a `window` ou `document` acontece durante a renderização

## 4. Composição na página inicial

- [x] 4.1 Compor `StageIntro` em `src/app/[locale]/page.tsx` como irmã de `<main>`, resolvendo as traduções do namespace `intro` no Server Component (D2)
- [x] 4.2 Remover a prop `seed` da interface `HeroProps` e o parágrafo correspondente do JSX em `src/components/sections/hero.tsx`
- [x] 4.3 Remover a passagem de `seed` na chamada de `Hero` em `page.tsx`
- [x] 4.4 Rodar `pnpm typecheck` e confirmar que nenhuma referência a `home.seed` ou à prop `seed` sobrou

## 5. Testes unitários

- [x] 5.1 Criar `src/lib/animation/*.test.ts` para o singleton: começa não marcado, marca uma vez, permanece marcado
- [x] 5.2 Criar `src/components/sections/stage-intro.test.tsx` verificando que a frase é renderizada quando a abertura ainda não aconteceu
- [x] 5.3 Cobrir que o container não é exposto na árvore de acessibilidade e que não há elemento focável dentro dele
- [x] 5.4 Cobrir que uma tecla e um clique aplicam a saída antecipada, sem depender de quadros de animação
- [x] 5.5 Cobrir que, com o singleton já marcado, o componente não renderiza nada

## 6. Testes E2E

- [x] 6.1 Definir `reducedMotion: 'reduce'` no `use` de `playwright.config.ts`, com comentário explicando por que é o único mecanismo capaz de desligar a abertura (D11)
- [x] 6.2 Mover a asserção sobre "Basta uma semente..." de `e2e/home.spec.ts` para a nova spec da abertura
- [x] 6.3 Rodar `pnpm test:e2e` e confirmar que a suíte existente continua verde com a nova configuração
- [x] 6.4 Criar `e2e/intro.spec.ts` com `test.use({ reducedMotion: 'no-preference' })`
- [x] 6.5 Cobrir a sequência completa: a abertura cobre o viewport na chegada e o conteúdo fica interativo em no máximo 5 s
- [x] 6.6 Cobrir a dispensa por tecla, por clique e por rolagem, verificando o limite de 300 ms
- [x] 6.7 Cobrir que a abertura não é reexibida ao trocar de idioma pelo seletor, sem recarregar a página
- [x] 6.8 Cobrir a chegada com movimento reduzido: nenhuma cortina exibida e conteúdo disponível de imediato
- [x] 6.9 Cobrir a degradação com `javaScriptEnabled: false` e a falha de bundle abortando as requisições de script por `page.route` (D11)
- [x] 6.10 Cobrir que o primeiro `Tab` durante a abertura leva ao link "Pular para o conteúdo"
- [x] 6.11 Cobrir que a abertura não é exibida em uma rota que não é a página inicial
- [x] 6.12 Rodar a varredura do axe com a cortina no ar e confirmar zero violações, em especial de contraste
- [x] 6.13 Verificar que o deslocamento cumulativo de layout atribuível à abertura é zero
- [x] 6.14 Verificar a cobertura das cortinas em celular vertical, celular horizontal, tablet, notebook e ultrawide, e após redimensionar no meio da sequência

## 7. Documentação

- [x] 7.1 Adicionar o adendo à `docs/adr/0001-adiar-theatre-js.md` registrando que a abertura foi entregue sem Theatre.js e por quê (D10)
- [x] 7.2 Registrar em `docs/guides/animacao-e-webgl.md` a exceção deliberada à regra de não esconder conteúdo esperando animação, com a condição que a torna aceitável
- [x] 7.3 Registrar em `docs/guides/estilos-e-design-tokens.md` os tokens de cenografia e a extensão da política de CSS global
- [x] 7.4 Registrar em `docs/guides/testes.md` que o contexto do Playwright roda com movimento reduzido por padrão
- [x] 7.5 Atualizar `docs/riscos-conhecidos.md`: remover o risco #10, que deixou de se aplicar, e registrar a mudança de atribuição do LCP
- [x] 7.6 Atualizar `docs/architecture.md` com a abertura na lista de Client Components e na seção de animações

## 8. Verificação final

- [x] 8.1 Rodar `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`
- [x] 8.2 Rodar `pnpm test:e2e` completo
- [x] 8.3 Revisar o diff inteiro: nenhum `any`, nenhum `eslint-disable`, nenhuma dependência nova, nenhum asset novo, nenhuma pasta vazia
- [x] 8.4 Confirmar que `CLAUDE.md` e `AGENTS.md` continuam idênticos entre si
- [x] 8.5 Revisar a abertura manualmente em pelo menos três larguras e nos três idiomas, avaliando ritmo, legibilidade e ausência de fresta entre as cortinas
