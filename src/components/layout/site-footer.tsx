import { getTranslations } from 'next-intl/server';

import { BackToTop } from '@/components/layout/back-to-top';
import { Container } from '@/components/ui/container';
import { currentEdition } from '@/content/festival';

export async function SiteFooter() {
  const t = await getTranslations('footer');

  return (
    <footer className="mt-24 border-t border-border/60">
      <Container className="flex flex-wrap items-center justify-between gap-6 py-10">
        <div className="text-sm text-muted">
          <p>
            © {currentEdition.year} {t('rights')}
          </p>
          <p>{t('note')}</p>
        </div>
        <BackToTop />
      </Container>
    </footer>
  );
}
