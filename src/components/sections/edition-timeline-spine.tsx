import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { buttonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Tag } from '@/components/ui/tag';
import { Text } from '@/components/ui/text';
import { previewPhotoAltKey, previewPhotoUrl } from '@/content/mock/timeline-preview';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { formatFestivalDate } from '@/lib/utils/format';
import { stationHasDestination, stationYearLabel } from '@/lib/utils/timeline';

import type { TimelineStation } from '@/lib/utils/timeline';

interface EditionTimelineSpineProps {
  readonly stations: readonly TimelineStation[];
}

/**
 * A linha do tempo em **espinha**: as edições descendo por um eixo vertical.
 *
 * O que faz isto se ler como linha do tempo não é a rolagem — é a espinha
 * contínua ligando os marcos, o numeral do ano como instrumento de ritmo, e o
 * eixo fixo ao pé da tela dizendo onde se está entre as vinte e duas edições.
 *
 * **Duplicação deliberada.** Este componente repete marcação e classes de
 * `edition-timeline-rail.tsx` de propósito: as duas variantes existem apenas
 * para a decisão visual, e a que não for escolhida é apagada por inteiro.
 * ponytail: extrair um `<TimelineAxis>` comum deixaria, no dia da deleção, um
 * componente meio-usado que alguém defende manter "porque já existe" — o custo
 * de manter a duplicação até lá é menor que o custo de desfazer a abstração.
 *
 * Server Component: não há estado, não há observador de rolagem e não há
 * bundle. A posição no eixo vem de uma `view()` timeline em CSS, e onde o
 * navegador não a suporta o eixo simplesmente não tem marcador — nenhuma
 * informação depende dele.
 */
export async function EditionTimelineSpine({ stations }: EditionTimelineSpineProps) {
  const locale = await getLocale();
  const t = await getTranslations('memoria');
  const tImages = await getTranslations('imagens');

  /* O eixo lê da edição mais antiga para a mais recente, como se lê uma régua
   * de tempo; a lista lê da mais recente para a mais antiga, como se consulta
   * um arquivo. Por isso o marcador percorre o eixo da direita para a esquerda
   * conforme a página desce. */
  const axisStations = [...stations].reverse();

  return (
    <section className="timeline-spine">
      <Container>
        {/*
         * Coluna editorial centrada, não largura total: a 1440px o índice
         * ocuparia a metade esquerda e deixaria a outra vazia, que é desenho
         * por omissão. Centrado, o vazio fica simétrico e a página lê como
         * documento.
         */}
        <ol
          aria-label={t('timelineLabel')}
          className="timeline-spine__list relative mx-auto max-w-4xl"
        >
          {/* A espinha: uma linha contínua ligando os marcos. Decorativa — a
            sequência já é a de uma `<ol>`. */}
          <span
            aria-hidden="true"
            className="absolute top-3 bottom-3 left-[7px] w-px bg-outline-variant"
          />

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
              /*
               * `scroll-mt` é o que impede o salto de parar debaixo do
               * cabeçalho fixo: sem ele o ano de destino chega encoberto, e o
               * visitante conclui que o link errou a edição.
               */
              <li
                key={station.id}
                id={`edicao-${station.id}`}
                className="relative scroll-mt-28 pt-1 pb-stack-md pl-8 md:pl-12"
              >
                {/*
                 * O marco distingue-se por **forma e cor**, nunca só por cor: a
                 * estação que leva a algum lugar é um disco cheio, a que ainda
                 * não tem acervo é um contorno vazado. É o mesmo princípio do
                 * `✓` do chip ativo.
                 */}
                <span
                  aria-hidden="true"
                  className={
                    hasDestination
                      ? 'absolute top-[0.55rem] left-0 size-3.5 rounded-full bg-secondary ring-4 ring-surface'
                      : 'absolute top-[0.55rem] left-0 size-3.5 rounded-full border border-outline bg-surface ring-4 ring-surface'
                  }
                />

                <div className="md:grid md:grid-cols-[8rem_minmax(0,1fr)] md:gap-gutter">
                  <Text
                    variant="display-md"
                    as="h2"
                    className="text-foreground tabular-nums md:text-right"
                  >
                    {stationYearLabel(station)}
                  </Text>

                  <div className="mt-2 md:mt-[0.35rem]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
                      <Tag
                        tone={station.archiveState === 'acervo-completo' ? 'primary' : 'neutral'}
                      >
                        {t(`states.${station.archiveState}`)}
                      </Tag>
                    </div>

                    <Text variant="caption" as="p" className="mt-2 text-foreground-subtle">
                      {period}
                    </Text>

                    <Text variant="body-md" className="mt-3 max-w-prose text-foreground-muted">
                      {station.isPreview
                        ? t(station.summaryKey, {
                            edition: station.edition ?? station.editionCount,
                            year: station.firstYear,
                          })
                        : t(station.summaryKey)}
                    </Text>

                    {station.imageId !== null && (
                      <span className="relative mt-5 block aspect-[16/9] w-full max-w-sm overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
                        <Image
                          src={previewPhotoUrl(station.imageId)}
                          alt={tImages(previewPhotoAltKey(station.imageId))}
                          fill
                          sizes="(min-width: 768px) 24rem, 100vw"
                          className="object-cover"
                        />
                      </span>
                    )}

                    <div className="mt-5 max-w-sm">
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
                    </div>

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
                </div>
              </li>
            );
          })}
        </ol>
      </Container>

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
        className="sticky bottom-0 z-[var(--z-content)] mt-stack-sm border-t border-outline-variant bg-surface pt-1 pb-24 md:pb-1"
      >
        <div className="timeline-spine__axis-scroll scroll-x px-margin-mobile lg:px-margin-desktop">
          <div className="timeline-spine__axis relative flex min-w-full gap-px">
            <span
              aria-hidden="true"
              className="timeline-spine__marker pointer-events-none absolute inset-y-0 w-px -translate-x-px bg-secondary"
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
