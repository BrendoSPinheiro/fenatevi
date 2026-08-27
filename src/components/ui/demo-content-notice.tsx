import { getTranslations } from 'next-intl/server';

import { currentEdition, displayedEdition } from '@/content/festival';
import { cn } from '@/lib/utils/cn';

interface DemoContentNoticeProps {
  readonly className?: string;
  /**
   * Como o aviso se apresenta.
   *
   * `card` é o bloco elevado usado nas telas em que o aviso interrompe uma
   * listagem. `editorial` é a mesma informação como nota de rodapé de programa
   * impresso — filete âmbar à esquerda, sem superfície própria —, para quando o
   * aviso mora na abertura da tela e não deve parecer alerta de painel.
   *
   * O texto e a regra que o faz aparecer são os mesmos nos dois: quando a
   * edição vigente publicar sua programação, os dois somem juntos.
   */
  readonly variant?: 'card' | 'editorial';
}

const VARIANT_CLASSES = {
  card: 'rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3',
  editorial: 'border-l border-secondary pl-4',
} as const;

/**
 * Aviso de que a programação exibida é acervo, não a edição vigente.
 *
 * **É comportamento, não texto fixo.** Enquanto a edição vigente não tiver
 * programação publicada, o portal apresenta o acervo da última edição completa
 * e diz qual é. No dia em que a organização publicar a edição vigente, este
 * aviso desaparece sozinho — sem mudança de código, sem alguém lembrar de
 * apagá-lo.
 *
 * Fica acima da primeira lista de cada tela que apresenta programação, não só
 * na home: o risco real não é o aviso faltar, é ele passar despercebido.
 */
export async function DemoContentNotice({ className, variant = 'card' }: DemoContentNoticeProps) {
  if (currentEdition.hasPublishedProgram) {
    return null;
  }

  const t = await getTranslations('acervo');

  return (
    <aside className={cn(VARIANT_CLASSES[variant], className)}>
      <p className="font-sans text-sm font-semibold tracking-[0.05em] text-secondary uppercase">
        {t('demoNoticeTitle', { year: displayedEdition.year })}
      </p>
      <p className="mt-1 font-sans text-sm text-foreground-muted">
        {t('demoNoticeBody', {
          edition: currentEdition.edition,
          year: displayedEdition.year,
        })}
      </p>
    </aside>
  );
}
