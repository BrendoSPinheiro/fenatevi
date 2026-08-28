'use client';

import { useState } from 'react';

import { usePathname } from '@/lib/i18n/navigation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * A troca de cena entre rotas.
 *
 * **É a cortina da abertura teatral, encurtada.** Literalmente: os dois painéis
 * usam a classe `.curtain-panel`, a mesma da `StageIntro`, com as suas pregas,
 * a sua profundidade e o seu franzido de borda. O portal tem um só gesto de
 * troca de cena, e vê-lo de novo a cada navegação é o que faz a casa parecer a
 * mesma. A duração é a única diferença — 0,52 s contra os 1,6 s da abertura,
 * porque uma transição que se faz notar atrapalha quem navega.
 *
 * O protótipo faz a cortina descer, espera 300 ms, troca de tela e a recolhe —
 * 300 ms de espera artificial em toda navegação. Aqui a ordem é invertida:
 * quando o caminho muda, a cortina é pintada **já cobrindo a página nova** e se
 * recolhe. O visitante vê uma troca de cena, e a página de destino começou a
 * ser apresentada no mesmo instante em que começaria sem cortina nenhuma.
 * Navegação não espera animação.
 *
 * Ela é `position: fixed`, `pointer-events: none` do primeiro ao último quadro,
 * não é focável, não entra na árvore de acessibilidade e **não é montada** sob
 * `prefers-reduced-motion: reduce`. Anima só `transform`.
 *
 * Não altera a abertura teatral (`StageIntro`): aquela é a entrada da home no
 * carregamento, esta é a passagem entre rotas.
 */
export function CurtainTransition() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const [scene, setScene] = useState<string | null>(null);

  /*
   * Ajuste de estado **durante a renderização**, não em efeito: é o padrão que
   * o React recomenda para reagir a uma mudança de entrada, e é o que faz a
   * cortina existir já no primeiro quadro da rota nova. Em um `useEffect` ela
   * só apareceria depois da pintura — atrasada, piscando por cima de uma página
   * que já estava lá.
   *
   * `scene` começa `null` de propósito: no carregamento inicial não houve
   * navegação, e portanto não há troca de cena a mostrar.
   */
  if (previousPathname !== pathname) {
    setPreviousPathname(pathname);
    setScene(pathname);
  }

  if (prefersReducedMotion || scene === null) {
    return null;
  }

  return (
    <div key={scene} aria-hidden="true" className="curtain-transition">
      <div className="curtain-panel curtain-panel--left" />
      <div className="curtain-panel curtain-panel--right" />
    </div>
  );
}
