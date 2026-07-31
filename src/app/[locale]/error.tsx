'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

/** Error boundary do segmento de idioma. Obrigatoriamente um Client Component. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('error');

  useEffect(() => {
    // Sem serviço de observabilidade ainda; o console mantém o erro rastreável.
    console.error(error);
  }, [error]);

  return (
    <Container as="main" id={MAIN_CONTENT_ID} tabIndex={-1} className="py-24">
      <h1 className="text-4xl font-semibold">{t('title')}</h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{t('description')}</p>
      <p className="mt-8">
        <Button onClick={reset}>{t('retry')}</Button>
      </p>
    </Container>
  );
}
