'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { scrollToTop } from '@/lib/animation/lenis/lenis-instance';

/**
 * Ação de voltar ao topo.
 *
 * Usa o Lenis quando ele está ativo e o scroll nativo quando não está — por isso
 * continua funcionando com movimento reduzido, quando o provider não monta.
 */
export function BackToTop() {
  const t = useTranslations('common');

  return (
    <Button variant="ghost" onClick={scrollToTop}>
      {t('backToTop')}
    </Button>
  );
}
