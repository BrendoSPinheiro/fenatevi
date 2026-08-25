import { getLocale, getTranslations } from 'next-intl/server';

import { ArchiveText } from '@/components/ui/archive-text';
import { Chip } from '@/components/ui/chip';
import { venues } from '@/content/venues';
import { formatShortDay } from '@/lib/utils/format';
import { availableDays, programHref, STRANDS } from '@/lib/utils/program-query';

import type { ActivityFilters } from '@/lib/utils/schedule';

interface ProgramFiltersProps {
  readonly filters: ActivityFilters;
  /**
   * O dia de hoje, **quando ele cai dentro da edição exibida**; `null` quando
   * não cai.
   *
   * Os chips de momento (hoje, amanhã) só existem enquanto significam alguma
   * coisa. A edição exibida hoje é a de 2024, inteiramente no passado: um chip
   * "hoje" ali levaria a um dia sem programação e a um estado vazio — pior do
   * que não oferecer o atalho. Quando a edição vigente publicar sua
   * programação, os chips aparecem sozinhos.
   */
  readonly today?: string | null;
}

/**
 * A barra de filtros da programação.
 *
 * Server Component inteiro, e **todos os controles são links**. Cada chip
 * aponta para a mesma rota com a query alterada, o que dá de uma vez: o link
 * profundo que a home usa, o compartilhamento do resultado filtrado, e a
 * filtragem funcionando com o JavaScript desligado.
 *
 * Cada grupo é um `fieldset`-como-grupo anunciado por `aria-labelledby`, para
 * que o leitor de tela diga "Dia" antes de ler os treze chips de dia — sem
 * isso, seriam trinta links soltos sem contexto.
 */
export async function ProgramFilters({ filters, today = null }: ProgramFiltersProps) {
  const locale = await getLocale();
  const t = await getTranslations('programacao');
  const tAcervo = await getTranslations('acervo');

  const todayIndex = today === null ? -1 : availableDays.indexOf(today);
  const tomorrow = todayIndex >= 0 ? (availableDays[todayIndex + 1] ?? null) : null;

  const momentOptions = [
    ...(today === null
      ? []
      : [
          {
            key: 'hoje',
            label: t('momentToday'),
            href: programHref(filters, { day: today }),
            isActive: filters.day === today,
            isArchive: false,
          },
        ]),
    ...(tomorrow === null
      ? []
      : [
          {
            key: 'amanha',
            label: t('momentTomorrow'),
            href: programHref(filters, { day: tomorrow }),
            isActive: filters.day === tomorrow,
            isArchive: false,
          },
        ]),
  ];

  const groups = [
    ...(momentOptions.length === 0
      ? []
      : [
          {
            id: 'momento',
            label: t('momentLabel'),
            allLabel: t('momentAll'),
            allHref: programHref(filters, { day: null }),
            isAllActive: filters.day === undefined,
            options: momentOptions,
          },
        ]),
    {
      id: 'dia',
      label: t('dayLabel'),
      allLabel: t('allDays'),
      allHref: programHref(filters, { day: null }),
      isAllActive: filters.day === undefined,
      options: availableDays.map((day) => ({
        key: day,
        label: formatShortDay(day, locale),
        href: programHref(filters, { day }),
        isActive: filters.day === day,
        isArchive: false,
      })),
    },
    {
      id: 'frente',
      label: t('strandLabel'),
      allLabel: t('allStrands'),
      allHref: programHref(filters, { strand: null }),
      isAllActive: filters.strand === undefined,
      options: STRANDS.map((strand) => ({
        key: strand,
        label: tAcervo(`strands.${strand}`),
        href: programHref(filters, { strand }),
        isActive: filters.strand === strand,
        isArchive: false,
      })),
    },
    {
      id: 'espaco',
      label: t('venueLabel'),
      allLabel: t('allVenues'),
      allHref: programHref(filters, { venueId: null }),
      isAllActive: filters.venueId === undefined,
      options: venues.map((venue) => ({
        key: venue.id,
        label: venue.name,
        href: programHref(filters, { venueId: venue.id }),
        isActive: filters.venueId === venue.id,
        // Nome próprio de espaço é acervo: não se traduz, e leva `lang`.
        isArchive: true,
      })),
    },
  ];

  return (
    <div aria-label={t('filtersLabel')} className="flex flex-col gap-5">
      {groups.map((group) => (
        <div key={group.id} role="group" aria-labelledby={`filtro-${group.id}`}>
          <p
            id={`filtro-${group.id}`}
            className="font-sans text-xs font-semibold tracking-[0.16em] text-foreground-subtle uppercase"
          >
            {group.label}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            <li>
              <Chip href={group.allHref} isActive={group.isAllActive}>
                {group.allLabel}
              </Chip>
            </li>
            {group.options.map((option) => (
              <li key={option.key}>
                <Chip href={option.href} isActive={option.isActive}>
                  {option.isArchive ? <ArchiveText>{option.label}</ArchiveText> : option.label}
                </Chip>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
