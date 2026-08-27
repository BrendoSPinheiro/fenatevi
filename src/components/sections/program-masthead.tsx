import { getTranslations } from 'next-intl/server';

import { Container } from '@/components/ui/container';
import { DemoContentNotice } from '@/components/ui/demo-content-notice';
import { Text } from '@/components/ui/text';
import { Link } from '@/lib/i18n/navigation';

import type { EditionScale } from '@/lib/utils/program';

interface ProgramMastheadProps {
  readonly scale: EditionScale;
}

/**
 * A abertura da programação.
 *
 * A tela começa por conteúdo, não por controles: o nome da área, o que ela
 * reúne, a escala da edição e — enquanto a edição vigente não publicar a sua
 * programação — a nota que diz de que edição é o que está sendo mostrado.
 *
 * A nota de acervo aparece aqui como **marginália de programa impresso**, com
 * um filete âmbar e sem superfície própria: ela precisa ser lida, não
 * interrompida como um alerta de painel. A regra que a faz aparecer continua
 * sendo `currentEdition.hasPublishedProgram`, e não uma decisão desta tela.
 *
 * A ponte para a grade diária mora na abertura de propósito. As duas telas têm
 * papéis diferentes — aqui se descobre o que assistir, lá se planeja o dia — e
 * a diferença se ensina no começo, quando ainda dá para escolher o caminho.
 */
export async function ProgramMasthead({ scale }: ProgramMastheadProps) {
  const t = await getTranslations('programacao');

  return (
    <Container as="header" className="pt-10 pb-stack-md lg:pt-16">
      <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <Text variant="display-lg" as="h1" className="text-foreground">
            {t('title')}
          </Text>

          <Text variant="body-lg" className="mt-6 max-w-prose text-foreground-muted">
            {t('description')}
          </Text>

          <Text variant="label-md" as="p" className="mt-8 text-foreground-subtle">
            {[
              t('scaleActivities', { count: scale.items }),
              t('scaleDays', { count: scale.days }),
              t('scaleVenues', { count: scale.venues }),
              t('scaleStrands', { count: scale.strands }),
            ].join(' · ')}
          </Text>
        </div>

        <div className="flex flex-col gap-8 lg:pt-4">
          <DemoContentNotice variant="editorial" />

          <div className="border-l border-outline-variant pl-4">
            <Text variant="body-md" className="text-foreground-muted">
              {t('gridBridge')}
            </Text>
            <Link
              href="/programacao/grade"
              className="mt-1 inline-flex min-h-11 items-center font-sans text-sm font-semibold tracking-[0.1em] text-foreground uppercase underline decoration-secondary decoration-2 underline-offset-[6px] hover:decoration-foreground"
            >
              {t('gridCta')}
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
