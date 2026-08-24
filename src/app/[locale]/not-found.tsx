import { getTranslations } from 'next-intl/server';

import { buttonClassName } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { Link } from '@/lib/i18n/navigation';

export default async function NotFoundPage() {
  const t = await getTranslations('notFound');

  return (
    <Container as="main" id={MAIN_CONTENT_ID} tabIndex={-1} className="py-24">
      <h1 className="text-4xl font-semibold">{t('title')}</h1>
      <p className="mt-4 max-w-xl text-lg text-foreground-muted">{t('description')}</p>
      <p className="mt-8">
        <Link href="/" className={buttonClassName('ghost')}>
          {t('backHome')}
        </Link>
      </p>
    </Container>
  );
}
