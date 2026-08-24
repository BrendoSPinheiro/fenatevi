import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

import { PageHeader } from '@/components/sections/page-header';
import { ArchiveText } from '@/components/ui/archive-text';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { EmptyState } from '@/components/ui/empty-state';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Tag } from '@/components/ui/tag';
import { newsNewestFirst } from '@/content/news';
import { formatFestivalDate } from '@/lib/utils/format';

import type { Metadata } from 'next';

interface NoticiasPageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NoticiasPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'noticias' });

  return { title: t('title'), description: t('description') };
}

/**
 * A área editorial do festival.
 *
 * A listagem já está pronta para categoria, título, data, imagem e corpo, e
 * **omite cada campo ausente** em vez de exibir um espaço reservado. Enquanto
 * não houver nenhuma notícia publicada, a tela diz exatamente isso — sem
 * manchete nem data fictícias, e sem os "slots editoriais" do protótipo, que
 * são anotação de design e não conteúdo.
 */
export default async function NoticiasPage({ params }: NoticiasPageProps) {
  const { locale: routeLocale } = await params;
  setRequestLocale(routeLocale);

  const locale = await getLocale();
  const t = await getTranslations('noticias');

  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      <PageHeader title={t('title')} description={t('description')} />

      <Container className="pb-stack-lg">
        {newsNewestFirst.length === 0 ? (
          <EmptyState title={t('emptyTitle')} description={t('emptyBody')} />
        ) : (
          <ol aria-label={t('listLabel')} className="flex flex-col gap-4">
            {newsNewestFirst.map((item) => (
              <li key={item.id}>
                <Card as="article" className="p-6">
                  <Tag tone="primary">{t(`categories.${item.category}`)}</Tag>
                  <h2 className="mt-3 font-serif text-2xl text-foreground">
                    <ArchiveText>{item.title}</ArchiveText>
                  </h2>
                  <p className="mt-1 font-sans text-sm text-foreground-subtle">
                    <time dateTime={item.publishedAt}>
                      {formatFestivalDate(item.publishedAt, locale)}
                    </time>
                  </p>
                  {item.body !== null && (
                    <ArchiveText
                      as="p"
                      className="mt-3 block max-w-prose font-sans text-base text-foreground-muted"
                    >
                      {item.body}
                    </ArchiveText>
                  )}
                </Card>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </main>
  );
}
