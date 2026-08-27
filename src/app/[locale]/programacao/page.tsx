import { getTranslations, setRequestLocale } from 'next-intl/server';

import { ProgramDayNav } from '@/components/sections/program-day-nav';
import { ProgramFilterDisclosure } from '@/components/sections/program-filter-disclosure';
import { ProgramMasthead } from '@/components/sections/program-masthead';
import { ProgramSection } from '@/components/sections/program-section';
import { ProgramStrandNav } from '@/components/sections/program-strand-nav';
import { buttonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Link } from '@/lib/i18n/navigation';
import { festivalDayFromDate } from '@/lib/utils/format';
import { editionScale, programGroups } from '@/lib/utils/program';
import {
  availableDays,
  parseProgramFilters,
  type RawSearchParams,
} from '@/lib/utils/program-query';

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
 * A programação da edição — a vitrine editorial do que há para assistir.
 *
 * **A tela responde "o que eu quero assistir?", e não "quando e onde".** Essa
 * segunda pergunta é da grade diária, e a divisão explica cada decisão daqui: a
 * programação se organiza pelas **frentes** do festival, não pelo relógio; o
 * nome do espetáculo vem antes do horário; e os controles de filtragem entram
 * depois do conteúdo, não antes dele. Quem chega é recebido pela programação, e
 * não por uma parede de filtros.
 *
 * As cinco frentes são reais e vinham de três arquivos diferentes do acervo —
 * espetáculos, oficinas e demonstrações de processo criativo. `lib/utils/program`
 * as reúne; sem isso, "Oficina" e "Processo criativo" continuariam sendo
 * filtros que nunca devolvem nada.
 *
 * Server Component. Os filtros vêm de `searchParams`, nunca de estado: é o que
 * dá link profundo, resultado compartilhável e filtragem sem JavaScript de uma
 * vez só. A página renderiza sob demanda por causa da query, o que aqui é
 * irrelevante — não há I/O, só computação sobre arrays em memória.
 */
export default async function ProgramacaoPage({ params, searchParams }: ProgramacaoPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('programacao');
  const filters = parseProgramFilters(await searchParams);
  const groups = programGroups(filters);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const scale = editionScale(availableDays);

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
      <ProgramMasthead scale={scale} />

      <Container className="pb-stack-lg">
        {/*
         * A navegação editorial vem antes dos filtros e no lugar deles: os dois
         * eixos pelos quais alguém passeia por um programa de festival — o dia
         * e a frente — deixaram de ser chips numa barra de busca.
         */}
        <div className="flex flex-col gap-stack-md border-t border-outline-variant/60 pt-8">
          <ProgramDayNav filters={filters} today={today} />
          <ProgramStrandNav filters={filters} />
        </div>

        <div className="mt-stack-md">
          <ProgramFilterDisclosure filters={filters} total={total} />
        </div>

        {groups.length === 0 ? (
          <EmptyState
            className="mt-stack-md"
            title={t('emptyTitle')}
            description={t('emptyBody')}
            action={
              <Link href="/programacao" className={buttonClassName('primary')}>
                {t('clearFilters')}
              </Link>
            }
          />
        ) : (
          groups.map((group, index) => (
            <ProgramSection key={group.strand} group={group} isFirst={index === 0} />
          ))
        )}
      </Container>
    </main>
  );
}
