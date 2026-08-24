import { getTranslations, setRequestLocale } from 'next-intl/server';

import { DayProgram } from '@/components/sections/day-program';
import { PageHeader } from '@/components/sections/page-header';
import { MobileFilterPanel } from '@/components/sections/mobile-filter-panel';
import { ProgramFilters } from '@/components/sections/program-filters';
import { buttonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { DemoContentNotice } from '@/components/ui/demo-content-notice';
import { EmptyState } from '@/components/ui/empty-state';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { activities } from '@/content/activities';
import { Link } from '@/lib/i18n/navigation';
import { festivalDayFromDate } from '@/lib/utils/format';
import {
  availableDays,
  hasActiveFilters,
  parseProgramFilters,
  type RawSearchParams,
} from '@/lib/utils/program-query';
import { filterActivities, groupByDay } from '@/lib/utils/schedule';

import type { Metadata } from 'next';

interface ProgramacaoPageProps {
  readonly params: Promise<{ locale: string }>;
  readonly searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({
  params,
}: Pick<ProgramacaoPageProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'programacao' });

  return { title: t('title'), description: t('description') };
}

/**
 * A programação completa, filtrável e agrupada por dia.
 *
 * Server Component: os filtros vêm de `searchParams`, não de estado. A página
 * renderiza sob demanda por causa da query, o que aqui é irrelevante — não há
 * I/O, só computação sobre um array em memória.
 */
export default async function ProgramacaoPage({ params, searchParams }: ProgramacaoPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('programacao');
  const filters = parseProgramFilters(await searchParams);
  const results = filterActivities(activities, filters);
  const days = groupByDay(results);

  /*
   * O dia de hoje só interessa se ele cair dentro da edição exibida. Como esta
   * rota já renderiza sob demanda (ela lê `searchParams`), ler o relógio aqui
   * não custa estaticidade — e como nada neste trecho hidrata, não há risco de
   * o cliente discordar do servidor.
   */
  const todayInFestival = festivalDayFromDate(new Date());
  const today = availableDays.includes(todayInFestival) ? todayInFestival : null;

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <PageHeader title={t('title')} description={t('description')} />

      <Container>
        <DemoContentNotice className="mb-stack-md" />

        {/*
         * Uma única barra de filtros, apresentada de dois jeitos: inline a
         * partir de `md`, e dentro do painel abaixo de `md`. O painel recebe a
         * mesma árvore já renderizada no servidor — nada é reimplementado, e
         * sem JavaScript a barra inline continua sendo a resposta.
         */}
        <div className="hidden md:block">
          <ProgramFilters filters={filters} today={today} />
        </div>

        <MobileFilterPanel resultLabel={t('resultCount', { count: results.length })}>
          <ProgramFilters filters={filters} today={today} />
        </MobileFilterPanel>

        {/*
         * Sem JavaScript o painel não abre — então o controle que o abriria
         * desaparece, e a barra completa toma o seu lugar. Ver o par
         * `.js-only` / `.no-js-only` em `globals.css`.
         */}
        <noscript>{'<style>.js-only{display:none}.no-js-only{display:block}</style>'}</noscript>

        <div className="no-js-only mt-5 md:hidden">
          <ProgramFilters filters={filters} today={today} />
        </div>

        <div className="mt-stack-md flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/60 pt-6">
          {/*
           * A contagem é `aria-live="polite"`: sem JavaScript ela é apenas o
           * texto da página nova, e com JavaScript quem navega por teclado ouve
           * quantos resultados o filtro deixou, sem precisar procurar.
           */}
          <p aria-live="polite" className="font-sans text-sm text-foreground-muted">
            {t('resultCount', { count: results.length })}
          </p>

          {hasActiveFilters(filters) && (
            <Link href="/programacao" className={buttonClassName('secondary')}>
              {t('clearFilters')}
            </Link>
          )}
        </div>

        {days.length === 0 ? (
          <EmptyState
            className="mt-stack-md mb-stack-lg"
            title={t('emptyTitle')}
            description={t('emptyBody')}
            action={
              <Link href="/programacao" className={buttonClassName('primary')}>
                {t('clearFilters')}
              </Link>
            }
          />
        ) : (
          <div className="pb-stack-lg">
            {days.map((day) => (
              <DayProgram key={day.date} day={day} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
