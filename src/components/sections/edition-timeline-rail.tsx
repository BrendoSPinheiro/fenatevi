import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { EditionTimelineRailWheel } from '@/components/sections/edition-timeline-rail-wheel';
import { buttonClassName } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import { Text } from '@/components/ui/text';
import { previewPhotoAltKey, previewPhotoUrl } from '@/content/mock/timeline-preview';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { formatFestivalDate } from '@/lib/utils/format';
import { stationHasDestination, stationYearLabel } from '@/lib/utils/timeline';

import type { TimelineStation } from '@/lib/utils/timeline';

/** O trilho é achado por `id` pelo ouvinte de roda, que não o renderiza. */
const RAIL_ID = 'timeline-rail-track';

interface EditionTimelineRailProps {
  readonly stations: readonly TimelineStation[];
}

/**
 * A linha do tempo em **trilho**: as edições lado a lado, separadas por fio.
 *
 * São colunas de uma tira contínua, não cartões: a separação é uma linha de 1px
 * e a superfície é a mesma do palco, de modo que a tira se leia como um índice
 * impresso e não como uma grade de blocos.
 *
 * **O trilho continua trilho em 320px.** Mesma marcação, mesmo CSS, sem
 * `@media` de layout: no celular, o gesto horizontal é o de um carrossel
 * nativo. Cada painel rola verticalmente por dentro quando o texto excede a
 * altura, então nenhum conteúdo exige rolagem em duas direções (WCAG 1.4.10).
 *
 * **Duplicação deliberada.** Este componente repete marcação e classes de
 * `edition-timeline-spine.tsx` de propósito: as duas variantes existem apenas
 * para a decisão visual, e a que não for escolhida é apagada por inteiro.
 * ponytail: extrair um `<TimelineAxis>` comum deixaria, no dia da deleção, um
 * componente meio-usado que alguém defende manter "porque já existe".
 *
 * Server Component, com uma única folha de cliente:
 * `edition-timeline-rail-wheel.tsx`, que faz a rolagem vertical avançar a tira
 * na horizontal. Ela não renderiza nada e o trilho funciona sem ela.
 *
 * Cada painel recebe `tabIndex` porque é uma região rolável
 * (WCAG 2.1.1): dezenove das vinte e duas estações não têm link nenhum, e sem
 * isso o seu conteúdo ficaria inalcançável para quem não usa mouse. O `h2` do
 * ano dá nome a essa parada, de modo que tabular pelo trilho anuncie o ano em
 * vez de "artigo".
 */
export async function EditionTimelineRail({ stations }: EditionTimelineRailProps) {
  const locale = await getLocale();
  const t = await getTranslations('memoria');
  const tImages = await getTranslations('imagens');

  /* O eixo lê da edição mais antiga para a mais recente, como se lê uma régua
   * de tempo; o trilho lê da mais recente para a mais antiga, como se consulta
   * um arquivo. Por isso o marcador percorre o eixo da direita para a esquerda
   * conforme o trilho avança. */
  const axisStations = [...stations].reverse();

  return (
    <section className="timeline-rail">
      {/*
       * A rolagem vertical avança a tira na horizontal. É a única folha de
       * cliente desta tela, e é enriquecimento: o trilho abaixo continua sendo
       * um contêiner rolável comum, e roda sem ela.
       */}
      <EditionTimelineRailWheel targetId={RAIL_ID} />

      <div
        id={RAIL_ID}
        role="region"
        aria-label={t('timelineLabel')}
        className="timeline-rail__track scroll-x flex snap-x snap-mandatory border-y border-outline-variant pl-margin-mobile lg:pl-margin-desktop"
      >
        {stations.map((station) => {
          const hasDestination = stationHasDestination(station);
          const percent = Math.round(station.completeness * 100);

          const period =
            station.startDate === null || station.endDate === null
              ? t('periodUnknown')
              : `${formatFestivalDate(station.startDate, locale)} — ${formatFestivalDate(
                  station.endDate,
                  locale,
                )}`;

          return (
            <article
              key={station.id}
              id={`edicao-${station.id}`}
              data-station=""
              aria-labelledby={`estacao-${station.id}`}
              tabIndex={0}
              /*
               * `scroll-mt` vale para a rolagem **vertical** do documento: o
               * salto do eixo também traz a tira para a tela, e sem a folga o
               * topo do painel chega encoberto pelo cabeçalho fixo.
               */
              className="flex h-[min(72vh,40rem)] w-[85vw] max-w-96 shrink-0 snap-start scroll-mt-28 flex-col overflow-y-auto border-r border-outline-variant px-5 pt-6 pb-24 md:pb-6"
            >
              {/*
               * O marco distingue-se por **forma e cor**, nunca só por cor: a
               * estação que leva a algum lugar é um disco cheio, a que ainda
               * não tem acervo é um contorno vazado.
               */}
              <span
                aria-hidden="true"
                className={
                  hasDestination
                    ? 'block size-3.5 shrink-0 rounded-full bg-secondary'
                    : 'block size-3.5 shrink-0 rounded-full border border-outline'
                }
              />

              <Text
                variant="display-md"
                as="h2"
                id={`estacao-${station.id}`}
                className="mt-4 shrink-0 text-foreground tabular-nums"
              >
                {stationYearLabel(station)}
              </Text>

              <div className="mt-3 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
                <Text variant="label-md" as="p" className="text-foreground-subtle">
                  {station.edition === null
                    ? t('editionsCount', { count: station.editionCount })
                    : t('editionLabel', { edition: station.edition })}
                </Text>

                {/*
                 * O estado do acervo é **texto**, não uma bolinha colorida:
                 * "Acervo completo" e "Em digitalização" precisam ser lidos,
                 * não deduzidos de uma cor.
                 */}
                <Tag tone={station.archiveState === 'acervo-completo' ? 'primary' : 'neutral'}>
                  {t(`states.${station.archiveState}`)}
                </Tag>
              </div>

              <Text variant="caption" as="p" className="mt-2 shrink-0 text-foreground-subtle">
                {period}
              </Text>

              {station.imageId !== null && (
                <span className="relative mt-5 block aspect-[3/2] w-full shrink-0 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
                  <Image
                    src={previewPhotoUrl(station.imageId)}
                    alt={tImages(previewPhotoAltKey(station.imageId))}
                    fill
                    sizes="(min-width: 768px) 24rem, 85vw"
                    className="object-cover"
                  />
                </span>
              )}

              <Text variant="body-md" className="mt-4 text-foreground-muted">
                {station.isPreview
                  ? t(station.summaryKey, {
                      edition: station.edition ?? station.editionCount,
                      year: station.firstYear,
                    })
                  : t(station.summaryKey)}
              </Text>

              <div className="mt-auto shrink-0 pt-6">
                <Text variant="caption" as="p" className="text-foreground-subtle">
                  {t('completeness', { percent })}
                </Text>
                {/*
                 * A barra é decorativa: o número acima já é o dado, e um
                 * `role="progressbar"` faria o leitor de tela anunciar duas
                 * vezes a mesma informação.
                 */}
                <span
                  aria-hidden="true"
                  className="mt-2 block h-0.5 w-full overflow-hidden rounded-full bg-surface-container-high"
                >
                  <span
                    className="block h-full bg-foreground-subtle"
                    style={{ width: `${percent}%` }}
                  />
                </span>

                <div className="mt-5">
                  {station.hasEditionPage ? (
                    <Link
                      href={`/edicoes/${station.firstYear}`}
                      className={buttonClassName('secondary')}
                    >
                      {t('actions.acervo-completo')}
                    </Link>
                  ) : station.archiveState === 'edicao-vigente' ? (
                    <Link href="/programacao" className={buttonClassName('secondary')}>
                      {t('actions.edicao-vigente')}
                    </Link>
                  ) : (
                    <Text variant="caption" as="p" className="text-foreground-subtle">
                      {t('noPageNotice')}
                    </Text>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/*
       * O eixo persistente — que é também **como se viaja**.
       *
       * Cada marco é uma âncora para a sua edição, e por isso o eixo deixou de
       * ser `aria-hidden`: ele não repete mais a lista, ele navega nela. São
       * links de fragmento, então o salto funciona sem JavaScript, é
       * compartilhável, e o navegador cuida da rolagem — inclusive dentro de um
       * contêiner que rola de lado.
       *
       * Todos os vinte e dois anos ficam rotulados: rótulo condicional era o
       * jeito de caber uma régua decorativa, e um navegador com metade dos
       * destinos sem nome não é um navegador. Cada alvo tem 44×44px, o que em
       * 375px soma mais que a tela — o eixo então rola dentro de si, no mesmo
       * idioma `.scroll-x` das tiras de dias da grade.
       *
       * O respiro inferior no mobile é generoso de propósito: a navegação
       * inferior do portal ocupa a base da tela e a sua altura muda com o
       * idioma (rótulos que quebram em duas linhas). Em vez de perseguir essa
       * altura com um número exato, a faixa desce até o fim da tela na cor da
       * própria superfície — a navegação assenta dentro dela, e nenhuma fresta
       * de conteúdo aparece entre as duas.
       */}
      <nav
        aria-label={t('axisLabel')}
        className="sticky bottom-0 z-[var(--z-content)] border-t border-outline-variant bg-surface pt-1 pb-24 md:pb-1"
      >
        <div className="timeline-rail__axis-scroll scroll-x px-margin-mobile lg:px-margin-desktop">
          <div className="timeline-rail__axis relative flex min-w-full gap-px">
            <span
              aria-hidden="true"
              className="timeline-rail__marker pointer-events-none absolute inset-y-0 w-px -translate-x-px bg-secondary"
            />

            {axisStations.map((station) => (
              <a
                key={station.id}
                href={`#edicao-${station.id}`}
                className="group flex min-h-11 min-w-11 flex-1 flex-col items-center justify-end gap-1.5 py-2 no-underline"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'block w-px transition-colors',
                    stationHasDestination(station)
                      ? 'h-4 bg-secondary'
                      : 'h-2 bg-outline group-hover:bg-foreground',
                  )}
                />
                <Text
                  variant="caption"
                  as="span"
                  className="block text-foreground-subtle tabular-nums transition-colors group-hover:text-foreground"
                >
                  {station.firstYear}
                </Text>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </section>
  );
}
