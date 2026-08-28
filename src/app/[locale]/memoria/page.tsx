import { getTranslations, setRequestLocale } from 'next-intl/server';

import { EditionTimelineRail } from '@/components/sections/edition-timeline-rail';
import { EditionTimelineSpine } from '@/components/sections/edition-timeline-spine';
import { PageHeader } from '@/components/sections/page-header';
import { Container } from '@/components/ui/container';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Text } from '@/components/ui/text';
import { editionTimeline } from '@/content/editions';
import { stagePhotos } from '@/content/images';
import { previewStations, TIMELINE_PREVIEW_ENABLED } from '@/content/mock/timeline-preview';
import { parseTimelineVariant, realStations } from '@/lib/utils/timeline';

import type { RawSearchParams } from '@/lib/utils/timeline';
import type { Metadata } from 'next';

interface MemoriaPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({
  params,
}: Pick<MemoriaPageProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'memoria' });

  return { title: t('title'), description: t('description') };
}

/**
 * A linha do tempo das edições — uma estação por edição, da 1ª à vigente.
 *
 * Cada estação oferece **a ação coerente com o seu estado de acervo**, e o
 * portal nunca oferece um caminho para uma página de edição que não existe:
 * quando não há página, a estação diz isso em texto e não vira link. A regra
 * vale igualmente para as estações de prévia, que jamais têm destino.
 *
 * **A nota de prévia foi retirada da tela nesta branch de demonstração.** As
 * edições de 2005 a 2023 continuam sendo conteúdo ilustrativo — o que mudou é
 * que a tela deixou de dizer isso ao visitante, a pedido de quem apresenta a
 * demo. Nenhuma estação de prévia vira link, e nada dela alimenta contagem,
 * resumo ou página, então a tela não afirma nada falso; ela apenas não mais
 * ressalva. Antes de publicar para o público, ou a nota volta, ou
 * `TIMELINE_PREVIEW_ENABLED` vira `false`. Registrado em
 * `docs/riscos-conhecidos.md`.
 *
 * **Duas variantes vivem lado a lado**, escolhidas por `?linha=`, enquanto a
 * decisão visual não é tomada; a que não for escolhida é apagada por inteiro,
 * junto com a leitura de `searchParams` — que é o que hoje tira esta rota da
 * geração estática. O plano de deleção está em
 * `openspec/changes/redesenhar-linha-do-tempo-da-memoria/design.md`.
 */
export default async function MemoriaPage({ params, searchParams }: MemoriaPageProps) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);

  const t = await getTranslations('memoria');
  const variant = parseTimelineVariant(await searchParams);

  const stations = TIMELINE_PREVIEW_ENABLED ? previewStations : realStations(editionTimeline);

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      {/*
       * `stagePhotos.memoria` foi declarado para esta área desde o portal e
       * nunca havia sido consumido. É atmosfera, não informação: `aria-hidden`,
       * sob duas camadas de escurecimento, e o fundo sólido embaixo já é a
       * superfície do tema — a abertura continua legível se a imagem não
       * carregar.
       */}
      <div className="relative overflow-hidden">
        <span aria-hidden="true" className="absolute inset-0 bg-surface" />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-[position:50%_40%] opacity-25"
          style={{ backgroundImage: `url(${stagePhotos.memoria})` }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,19,18,0.86)_0%,rgba(19,19,18,0.95)_65%,var(--color-surface)_100%)]"
        />

        <div className="relative">
          <PageHeader title={t('title')} description={t('description')} />
        </div>
      </div>

      {variant === 'trilho' ? (
        <EditionTimelineRail stations={stations} />
      ) : (
        <EditionTimelineSpine stations={stations} />
      )}

      <Container className="pt-stack-md pb-stack-lg">
        <Text variant="caption" className="max-w-prose text-foreground-subtle">
          {t('scopeNote')}
        </Text>
      </Container>
    </main>
  );
}
