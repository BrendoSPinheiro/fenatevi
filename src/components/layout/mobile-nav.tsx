import { getTranslations } from 'next-intl/server';

import { mobileAreas } from '@/components/layout/portal-areas';
import { Link } from '@/lib/i18n/navigation';

/**
 * Navegação inferior permanente, em telas estreitas.
 *
 * É o que a tela "Experiência mobile" do protótipo especifica: durante o
 * festival, quem está na rua consulta o portal com o polegar, e os quatro
 * destinos que importam ficam ao alcance dele — não atrás de um menu.
 *
 * Cada alvo tem 44px de altura e ao menos 44px de largura útil (WCAG 2.2 —
 * 2.5.8). Server Component: são links, não precisam de estado.
 */
export async function MobileNav() {
  const t = await getTranslations('nav');

  return (
    <nav
      aria-label={t('mobileLabel')}
      className="sticky bottom-0 z-[var(--z-header)] border-t border-outline-variant bg-surface-container-lowest md:hidden"
    >
      <ul className="grid grid-cols-4">
        {mobileAreas.map((area) => (
          <li key={area.id}>
            <Link
              href={area.href}
              className="flex min-h-14 flex-col items-center justify-center gap-1 px-2 py-2 text-center font-sans text-[0.6875rem] font-semibold tracking-[0.08em] text-foreground-muted uppercase no-underline transition-colors hover:text-foreground"
            >
              <span aria-hidden="true" className="font-serif text-sm text-secondary">
                {area.number}
              </span>
              {t(area.id)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
