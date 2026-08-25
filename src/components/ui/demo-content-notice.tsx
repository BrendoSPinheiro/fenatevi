import { getTranslations } from 'next-intl/server';

import { currentEdition, displayedEdition } from '@/content/festival';
import { cn } from '@/lib/utils/cn';

interface DemoContentNoticeProps {
  readonly className?: string;
}

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
export async function DemoContentNotice({ className }: DemoContentNoticeProps) {
  if (currentEdition.hasPublishedProgram) {
    return null;
  }

  const t = await getTranslations('acervo');

  return (
    <aside
      className={cn(
        'rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3',
        className,
      )}
    >
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
