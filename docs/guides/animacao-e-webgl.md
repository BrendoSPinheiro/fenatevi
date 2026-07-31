# Animação, smooth scroll e WebGL

Leia antes de: animar qualquer coisa, mexer no scroll ou tocar na cena 3D.

Três bibliotecas, três papéis que não se sobrepõem: **GSAP + ScrollTrigger**
(HTML e SVG), **Lenis** (comportamento do scroll da página) e **Three.js / R3F**
(cenas 3D dentro de `<canvas>`).

## GSAP

```tsx
'use client';
import { gsap, respectReducedMotion, useGSAP } from '@/lib/animation/gsap';

const ref = useRef<HTMLDivElement>(null);

useGSAP(
  () =>
    respectReducedMotion(() => {
      gsap.from('[data-animate="item"]', { y: 24, opacity: 0, stagger: 0.12 });
    }),
  { scope: ref },
);
```

- Importe GSAP **apenas** de `@/lib/animation/gsap`: é lá que os plugins são
  registrados, uma única vez, em um módulo `'use client'`.
- Sempre `useGSAP` com `scope` e refs locais. **Seletores globais são proibidos:**
  vazam entre componentes e quebram o cleanup.
- Sempre dentro de `respectReducedMotion`.
- Prefira `gsap.from`: o estado final deve ser o estado natural do documento,
  para que o conteúdo esteja visível e posicionado mesmo se o JavaScript falhar.
- **Nunca** esconda conteúdo por CSS esperando uma animação revelá-lo.
- Não acesse `window` ou `document` durante a renderização.

## Lenis

- Já existe um `SmoothScrollProvider` em `src/providers/`. **Não crie outro** e
  não instancie o Lenis diretamente em um componente.
- Ele não renderiza DOM e não envolve o conteúdo: a página continua rolável se
  ele falhar. Preserve essa propriedade.
- Sob movimento reduzido ele nem monta. Todo código que dependa dele precisa
  funcionar sem ele — use `scrollToTop()` de
  `@/lib/animation/lenis/lenis-instance`, que cai no scroll nativo.
- **Não crie um segundo loop de `requestAnimationFrame`**: o Lenis é avançado
  pelo ticker do GSAP e notifica o `ScrollTrigger` a cada quadro.
- Regiões com scroll próprio (modais, listas) recebem `data-lenis-prevent`.
- Âncoras (`href="#secao"`) funcionam via `anchors: true` — não as reimplemente.

## React Three Fiber

- Carregue o Canvas com `next/dynamic` e `ssr: false`. Sempre.
- Verifique o suporte com `useWebGLSupport` (`unknown` | `available` |
  `unavailable`) e renderize algo neutro em `unknown` — nunca área vazia.
- **Fallback visual e alternativa textual são obrigatórios.** O padrão está em
  [`src/components/sections/stage-scene.tsx`](../../src/components/sections/stage-scene.tsx):
  `role="img"` com `aria-label`, gradiente CSS de fallback e texto explicativo
  quando não há WebGL.
- Pause o loop (`frameloop="demand"`) fora da viewport ou sob movimento reduzido.
- Nenhum conteúdo essencial dentro do Canvas.
- Sem modelos ou texturas pesadas. `@react-three/drei` só entra quando um helper
  concreto for necessário (hoje: `AdaptiveDpr`).

A cena atual é **prova técnica**, não a abertura do festival. Sobre adotar (ou
não) o Theatre.js para a abertura, ver
[`docs/adr/0001-adiar-theatre-js.md`](../adr/0001-adiar-theatre-js.md).

## Redução de movimento

Três mecanismos, todos ativos:

1. **CSS** — bloco `@media (prefers-reduced-motion: reduce)` em `globals.css`.
2. **GSAP** — `respectReducedMotion`, que usa `gsap.matchMedia()` e reverte a
   animação se a preferência mudar durante a sessão.
3. **React** — o hook `useReducedMotion`, para decisões de renderização.

Critério final: **com movimento reduzido, o conteúdo continua completo, legível e
navegável.** Se desligar a animação esconder ou quebrar alguma coisa, a animação
está errada, não a preferência.
