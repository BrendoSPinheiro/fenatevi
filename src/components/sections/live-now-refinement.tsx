'use client';

import { useEffect, useState } from 'react';

import { festivalDayFromDate } from '@/lib/utils/format';

interface LiveNowRefinementProps {
  /** Ids das sessões, com a janela de cada uma em milissegundos desde a época. */
  readonly sessions: readonly {
    readonly id: string;
    readonly startsAt: number;
    readonly endsAt: number | null;
  }[];
  /** O que anunciar quando alguma sessão estiver em cena. */
  readonly liveLabel: string;
  /** O que anunciar quando a edição está correndo e nada está em cena agora. */
  readonly emptyLabel: string;
}

/**
 * O refino de "em cena agora", depois da montagem.
 *
 * Esta é a única peça da home que depende do relógio, e ela é deliberadamente
 * mínima. **No primeiro render ela não desenha nada** — exatamente como o
 * servidor a renderizou. Só depois da montagem, e só se alguma sessão contiver
 * o instante corrente, é que o distintivo aparece. Sem `suppressHydrationWarning`,
 * sem divergência entre servidor e cliente.
 *
 * O componente só é montado quando a edição exibida contém o instante corrente
 * (ver `edition-phase.ts`): numa edição encerrada não há o que refinar, e o
 * servidor já gravou a resposta definitiva no HTML.
 *
 * Sem JavaScript, o visitante não vê o distintivo — vê a programação completa
 * do dia, com todos os horários. É informação completa, não degradada.
 */
export function LiveNowRefinement({ sessions, liveLabel, emptyLabel }: LiveNowRefinementProps) {
  const [liveIds, setLiveIds] = useState<readonly string[]>([]);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    function refresh() {
      const now = Date.now();

      setLiveIds(
        sessions
          .filter(
            (session) =>
              now >= session.startsAt && (session.endsAt === null || now <= session.endsAt),
          )
          .map((session) => session.id),
      );
      setHasChecked(true);
    }

    refresh();

    /*
     * Um minuto é a menor granularidade que a informação tem: os horários são
     * dados em minutos, e um intervalo mais curto só gastaria bateria para
     * recalcular o mesmo resultado.
     */
    const timer = window.setInterval(refresh, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, [sessions]);

  /*
   * Antes da primeira verificação, nada é dito: é o mesmo que o servidor
   * renderizou. Depois dela, ou há sessão em cena, ou o silêncio vira uma
   * resposta — "nada em cena neste momento" — e o visitante para de procurar.
   */
  if (!hasChecked) {
    return null;
  }

  if (liveIds.length === 0) {
    return (
      <p aria-live="polite" className="font-sans text-base text-foreground-muted">
        {emptyLabel}
      </p>
    );
  }

  return (
    <p
      // `polite`: o distintivo é uma cortesia, não interrompe quem está lendo.
      aria-live="polite"
      className="inline-flex items-center gap-2 rounded-full border border-secondary px-3 py-1 font-sans text-xs font-bold tracking-[0.14em] text-secondary uppercase"
    >
      <span aria-hidden="true" className="size-2 rounded-full bg-secondary" />
      {liveLabel}
      <span className="sr-only"> — {festivalDayFromDate(new Date())}</span>
    </p>
  );
}
