import { getTranslations } from 'next-intl/server';
import { ImageResponse } from 'next/og';

import { routing } from '@/lib/i18n/routing';
import { OG_COLORS, OG_IMAGE_SIZE } from '@/lib/seo/site';

/**
 * Imagem de compartilhamento (`og:image`), gerada em build para cada idioma.
 *
 * Gerar em vez de versionar um PNG evita manter três arquivos binários em
 * sincronia com o texto traduzido. O layout é deliberadamente sóbrio: esta é a
 * infraestrutura de compartilhamento, não a identidade visual definitiva.
 *
 * Restrição do `next/og`: a renderização é feita pelo Satori, que suporta um
 * subconjunto de CSS (flexbox, sem Grid, sem CSS Custom Properties). Por isso o
 * estilo é inline e as cores vêm de `OG_COLORS`, não das classes do Tailwind.
 */
export const contentType = 'image/png';
export const size = OG_IMAGE_SIZE;

interface OpenGraphImageProps {
  readonly params: Promise<{ locale: string }>;
}

/** Pré-gera a imagem dos três idiomas em build, sem renderizar sob demanda. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Sem `og:image:alt`.
 *
 * O texto alternativo só poderia ser declarado por `generateImageMetadata`, e o
 * Next a executa para enumerar os ids da imagem **antes** de resolver `[locale]`
 * — `params` chega vazio ali, então o `getTranslations` não tem idioma. Um alt
 * fixo resolveria o build, mas mentiria em dois dos três idiomas. Preferimos
 * omitir a meta tag a emiti-la errada; o restante do card já é traduzido.
 */
export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '96px',
        backgroundColor: OG_COLORS.background,
        // Luz de palco: um brilho quente descendo do topo.
        backgroundImage: `radial-gradient(circle at 50% -20%, ${OG_COLORS.accent}33, transparent 60%)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '120px',
          height: '6px',
          marginBottom: '48px',
          backgroundColor: OG_COLORS.accent,
        }}
      />
      <div
        style={{
          fontSize: '140px',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: OG_COLORS.foreground,
        }}
      >
        {tCommon('festivalName')}
      </div>
      <div
        style={{
          marginTop: '32px',
          fontSize: '44px',
          lineHeight: 1.2,
          color: OG_COLORS.muted,
        }}
      >
        {tCommon('festivalFullName')}
      </div>
      <div style={{ marginTop: '20px', fontSize: '32px', color: OG_COLORS.accent }}>
        {t('ogImageLocation')}
      </div>
    </div>,
    size,
  );
}
