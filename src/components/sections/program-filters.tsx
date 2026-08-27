import { getTranslations } from 'next-intl/server';

import { ArchiveText } from '@/components/ui/archive-text';
import { Chip } from '@/components/ui/chip';
import { venues } from '@/content/venues';
import { accessibilityFilters, programHref } from '@/lib/utils/program-query';

import type { ActivityFilters } from '@/lib/utils/schedule';

interface ProgramFiltersProps {
  readonly filters: ActivityFilters;
}

/**
 * Os filtros que **não** são a navegação principal da tela.
 *
 * Dia e frente saíram desta barra: eles deixaram de ser filtros de catálogo e
 * viraram a navegação editorial da página — a tira de dias e o índice de
 * frentes. O que sobra aqui é o recorte mais específico, o que alguém procura
 * depois de já estar passeando pela programação: o espaço da cidade e o recurso
 * de acessibilidade de que precisa.
 *
 * Todos os controles continuam sendo links que alteram a query. É isso que dá
 * de uma vez o link profundo, o compartilhamento do resultado filtrado e a
 * filtragem funcionando **sem JavaScript**.
 *
 * Cada grupo é anunciado por `aria-labelledby`, para que o leitor de tela diga
 * "Espaço" antes de ler os oito espaços — sem isso, seriam links soltos sem
 * contexto.
 */
export async function ProgramFilters({ filters }: ProgramFiltersProps) {
  const t = await getTranslations('programacao');
  const tFeatures = await getTranslations('accessibilityFeatures');

  const groups = [
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
    /*
     * A acessibilidade só vira filtro se a edição exibida declarar algum
     * recurso. Oferecer "audiodescrição" numa edição que não a tem seria
     * prometer um recorte que só devolve vazio.
     */
    ...(accessibilityFilters.length === 0
      ? []
      : [
          {
            id: 'acessibilidade',
            label: t('accessibilityLabel'),
            allLabel: t('allAccessibility'),
            allHref: programHref(filters, { accessibility: null }),
            isAllActive: filters.accessibility === undefined,
            options: accessibilityFilters.map((feature) => ({
              key: feature,
              label: tFeatures(feature),
              href: programHref(filters, { accessibility: feature }),
              isActive: filters.accessibility === feature,
              isArchive: false,
            })),
          },
        ]),
  ];

  return (
    <div aria-label={t('filtersLabel')} className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.id} role="group" aria-labelledby={`filtro-${group.id}`}>
          <p
            id={`filtro-${group.id}`}
            className="font-sans text-xs font-semibold tracking-[0.16em] text-foreground-subtle uppercase"
          >
            {group.label}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
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
