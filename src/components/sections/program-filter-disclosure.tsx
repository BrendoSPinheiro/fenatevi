import { getLocale, getTranslations } from 'next-intl/server';

import { ProgramFilters } from '@/components/sections/program-filters';
import { ArchiveText } from '@/components/ui/archive-text';
import { buttonClassName } from '@/components/ui/button';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { findVenue } from '@/content/venues';
import { Link } from '@/lib/i18n/navigation';
import { formatShortDay } from '@/lib/utils/format';
import { programHref } from '@/lib/utils/program-query';

import type { ActivityFilters } from '@/lib/utils/schedule';
import type { ReactNode } from 'react';

interface ProgramFilterDisclosureProps {
  readonly filters: ActivityFilters;
  /** Quantas atividades os filtros vigentes deixaram. */
  readonly total: number;
}

/** Um filtro aplicado, e o link que o retira. */
interface AppliedFilter {
  readonly key: string;
  readonly field: string;
  readonly value: ReactNode;
  readonly href: string;
}

/**
 * O painel "Filtrar programação".
 *
 * É um `<details>` nativo, e a escolha é técnica: ele abre, fecha, responde ao
 * teclado e anuncia o próprio estado **sem uma linha de JavaScript** — o que um
 * painel montado em React só consegue depois da hidratação, e não consegue de
 * jeito nenhum se o bundle falhar. Um modal também seria demais: escolher um
 * espaço não precisa interromper a leitura nem prender o foco.
 *
 * Ele começa aberto quando algum dos seus filtros está aplicado. Sem isso, quem
 * escolhesse um espaço veria o painel se fechar a cada navegação — o preço de
 * não guardar estado de cliente, pago com uma linha de HTML em vez de um
 * `useState`.
 *
 * O resumo dos filtros aplicados fica **fora** do painel, visível mesmo com ele
 * fechado: um filtro que se esconde é um filtro que alguém esquece de ter
 * ligado, e passa a achar que a programação encolheu.
 */
export async function ProgramFilterDisclosure({ filters, total }: ProgramFilterDisclosureProps) {
  const t = await getTranslations('programacao');
  const tAcervo = await getTranslations('acervo');
  const tFeatures = await getTranslations('accessibilityFeatures');

  const venue = filters.venueId === undefined ? undefined : findVenue(filters.venueId);

  const locale = await getLocale();

  const applied: readonly AppliedFilter[] = [
    ...(filters.day === undefined
      ? []
      : [
          {
            key: 'dia',
            field: t('dayLabel'),
            value: formatShortDay(filters.day, locale),
            href: programHref(filters, { day: null }),
          },
        ]),
    ...(filters.strand === undefined
      ? []
      : [
          {
            key: 'frente',
            field: t('strandLabel'),
            value: tAcervo(`strands.${filters.strand}`),
            href: programHref(filters, { strand: null }),
          },
        ]),
    ...(venue === undefined
      ? []
      : [
          {
            key: 'espaco',
            field: t('venueLabel'),
            value: <ArchiveText>{venue.name}</ArchiveText>,
            href: programHref(filters, { venueId: null }),
          },
        ]),
    ...(filters.accessibility === undefined
      ? []
      : [
          {
            key: 'acessibilidade',
            field: t('accessibilityLabel'),
            value: tFeatures(filters.accessibility),
            href: programHref(filters, { accessibility: null }),
          },
        ]),
  ];

  return (
    <div className="flex flex-col gap-5">
      <details
        className="group border-t border-outline-variant/60"
        open={filters.venueId !== undefined || filters.accessibility !== undefined}
      >
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 py-3 font-sans text-sm font-semibold tracking-[0.1em] text-foreground uppercase marker:content-none [&::-webkit-details-marker]:hidden">
          {/*
           * Seta desenhada, não glifo: ela gira para dizer que o painel abriu,
           * e sob movimento reduzido apenas troca de posição sem animar.
           */}
          <svg
            aria-hidden="true"
            viewBox="0 0 12 12"
            className="h-3 w-3 shrink-0 text-secondary group-open:rotate-90 motion-safe:transition-transform motion-safe:duration-200"
          >
            <path
              d="M4 2l5 4-5 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
          {t('openAdvancedFilters')}
          <span className="font-normal tracking-normal text-foreground-subtle normal-case">
            {t('advancedFiltersHint')}
          </span>
        </summary>

        <div className="pt-2 pb-6">
          <ProgramFilters filters={filters} />
        </div>
      </details>

      {/*
       * Resultado, filtros aplicados e saída numa linha só. Os filtros ficam
       * **fora** do painel, visíveis mesmo com ele fechado: um filtro que se
       * esconde é um filtro que alguém esquece de ter ligado, e passa a achar
       * que a programação encolheu.
       */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {/*
           * A contagem é `aria-live="polite"`: sem JavaScript ela é apenas o
           * texto da página nova, e com JavaScript quem navega por teclado ouve
           * quantas atividades o filtro deixou, sem precisar procurar.
           */}
          <p aria-live="polite" className="font-sans text-sm text-foreground-muted">
            {t('resultCount', { count: total })}
          </p>

          {applied.length > 0 && (
            <ul aria-label={t('activeFiltersLabel')} className="flex flex-wrap gap-2">
              {applied.map((filter) => (
                <li key={filter.key}>
                  {/*
                   * O nome acessível começa por "Remover o filtro" e continua
                   * com exatamente o texto visível — o que mantém o rótulo
                   * dentro do nome (WCAG 2.5.3) sem repetir a instrução na tela.
                   */}
                  <Link
                    href={filter.href}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-outline-variant px-4 py-2 font-sans text-sm text-foreground-muted no-underline transition-colors hover:border-outline hover:text-foreground"
                  >
                    <VisuallyHidden>{t('removeFilter')} </VisuallyHidden>
                    <span className="text-foreground-subtle">{filter.field}:</span>
                    {filter.value}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5 shrink-0 text-foreground-subtle transition-colors group-hover:text-secondary"
                    >
                      <path
                        d="M2 2l8 8M10 2l-8 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {applied.length > 0 && (
          <Link href="/programacao" className={buttonClassName('ghost')}>
            {t('clearFilters')}
          </Link>
        )}
      </div>
    </div>
  );
}
