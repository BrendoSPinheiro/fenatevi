import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Hero } from '@/components/sections/hero';
import { StageIntro } from '@/components/sections/stage-intro';
import { StageScene } from '@/components/sections/stage-scene';
import { Container } from '@/components/ui/container';
import { MAIN_CONTENT_ID } from '@/components/ui/skip-link';
import { currentEdition } from '@/content/festival';
import { formatFestivalDate } from '@/lib/utils/format';

const ABOUT_SECTION_ID = 'sobre';

interface HomePageProps {
  readonly params: Promise<{ locale: string }>;
}

/**
 * Página mínima de validação.
 *
 * Não representa o design final: existe para provar que roteamento por idioma,
 * traduções, tokens, GSAP, Lenis, React Three Fiber, fallback de WebGL e
 * acessibilidade funcionam juntos.
 */
export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const tIntro = await getTranslations('intro');
  const tFeatures = await getTranslations('accessibilityFeatures');

  const dates = t('dates', {
    start: formatFestivalDate(currentEdition.startDate, locale),
    end: formatFestivalDate(currentEdition.endDate, locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  });

  return (
    <>
      {/*
       * Irmã de `<main>`, não do layout: quem chegar de um link para uma rota
       * futura não deve assistir à abertura. O posicionamento é `fixed`, então
       * a ordem no DOM não afeta a cobertura da tela.
       */}
      <StageIntro line={tIntro('line')} hint={tIntro('hint')} />

      <main id={MAIN_CONTENT_ID} tabIndex={-1}>
        <Container as="section">
          <Hero
            eyebrow={t('eyebrow', { edition: currentEdition.edition })}
            title={t('title')}
            subtitle={t('subtitle')}
            tagline={t('tagline')}
            dates={dates}
            city={t('city')}
            ctaLabel={t('cta')}
            ctaHref={`#${ABOUT_SECTION_ID}`}
          />
        </Container>

        <Container as="section" aria-labelledby="titulo-cena" className="py-8">
          <h2 id="titulo-cena" className="text-2xl font-semibold">
            {t('sceneTitle')}
          </h2>
          <p className="mt-2 max-w-2xl text-muted">{t('sceneDescription')}</p>
          <div className="mt-6">
            <StageScene description={t('sceneDescription')} fallbackText={t('sceneFallback')} />
          </div>
        </Container>

        <Container
          as="section"
          id={ABOUT_SECTION_ID}
          aria-labelledby="titulo-sobre"
          className="py-16 sm:py-24"
        >
          <h2 id="titulo-sobre" className="text-2xl font-semibold">
            {t('aboutTitle')}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">{t('aboutBody')}</p>

          <h3 className="mt-12 text-xl font-semibold">{t('accessibilityTitle')}</h3>
          <p className="mt-2 text-muted">{t('accessibilityIntro')}</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {currentEdition.accessibility.map((feature) => (
              <li
                key={feature}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm"
              >
                {tFeatures(feature)}
              </li>
            ))}
          </ul>
        </Container>
      </main>
    </>
  );
}
