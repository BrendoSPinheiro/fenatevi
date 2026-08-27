import { getTranslations } from 'next-intl/server';

import { Text } from '@/components/ui/text';
import { Link } from '@/lib/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { countsByStrand, programCount } from '@/lib/utils/program';
import { programHref, STRANDS } from '@/lib/utils/program-query';

import type { ActivityFilters } from '@/lib/utils/schedule';

interface ProgramStrandNavProps {
  readonly filters: ActivityFilters;
}

/**
 * As frentes da edição — o índice curatorial da programação.
 *
 * Não são chips e não deveriam ser: um filtro em forma de cápsula diz "recorte
 * este catálogo", e uma frente de festival não é um recorte de catálogo — é uma
 * decisão de curadoria, com nome próprio traduzido e um número de atividades
 * atrás. Por isso o índice é tipográfico: a Fraunces dá a elas a mesma voz que
 * o programa impresso lhes dá, e o filete que se acende embaixo diz qual está
 * aberta.
 *
 * Cada item continua sendo um `<a>` que altera a query — o estado vive na URL,
 * a filtragem funciona sem JavaScript, e o resultado é compartilhável.
 *
 * As contagens ignoram o filtro de frente e respeitam todos os outros: o número
 * ao lado de "Mostra Paralela" diz o que **aquele** caminho devolve com o dia e
 * o espaço já escolhidos.
 */
export async function ProgramStrandNav({ filters }: ProgramStrandNavProps) {
  const t = await getTranslations('programacao');
  const tAcervo = await getTranslations('acervo');

  const counts = countsByStrand(filters);
  const total = programCount({ ...filters, strand: undefined });

  const options = [
    {
      key: 'todas',
      label: t('allStrands'),
      count: total,
      href: programHref(filters, { strand: null }),
      isActive: filters.strand === undefined,
    },
    ...STRANDS.filter((strand) => counts[strand] > 0).map((strand) => ({
      key: strand,
      label: tAcervo(`strands.${strand}`),
      count: counts[strand],
      href: programHref(filters, { strand }),
      isActive: filters.strand === strand,
    })),
  ];

  return (
    <nav aria-labelledby="programa-frentes">
      <Text variant="label-md" as="h2" id="programa-frentes" className="text-foreground-subtle">
        {t('strandsTitle')}
      </Text>

      <ul className="mt-4 flex flex-wrap items-baseline gap-x-7 gap-y-1">
        {options.map((option) => (
          <li key={option.key}>
            <Link
              href={option.href}
              aria-current={option.isActive ? 'true' : undefined}
              className="group inline-flex min-h-11 items-baseline gap-2 no-underline"
            >
              {/*
               * O filete acompanha o texto, não a altura do alvo de toque: é
               * ele — e não a cor — que distingue a frente aberta, e ele
               * precisa parecer um sublinhado de programa, não uma borda de
               * botão.
               */}
              <span
                className={cn(
                  'border-b-2 pb-1 font-serif text-xl transition-colors sm:text-2xl',
                  option.isActive
                    ? 'border-secondary text-foreground'
                    : 'border-transparent text-foreground-muted group-hover:border-outline group-hover:text-foreground',
                )}
              >
                {option.label}
              </span>
              <span
                className={cn(
                  'font-sans text-xs tabular-nums transition-colors',
                  option.isActive ? 'text-secondary' : 'text-foreground-subtle',
                )}
              >
                {option.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
