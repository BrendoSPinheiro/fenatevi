import { getTranslations } from 'next-intl/server';

import { BackToTop } from '@/components/layout/back-to-top';
import { portalAreas } from '@/components/layout/portal-areas';
import { ArchiveText } from '@/components/ui/archive-text';
import { Container } from '@/components/ui/container';
import { contactHref, contacts, pressContact, realizationMotto } from '@/content/contact';
import { currentEdition } from '@/content/festival';
import { partners } from '@/content/partners';
import { Link } from '@/lib/i18n/navigation';

/**
 * Rodapé institucional: identificação, navegação secundária, contatos e quem
 * realiza o festival.
 *
 * Os contatos são **acionáveis**: cada e-mail é um `mailto:` e cada telefone um
 * `tel:`, com o `href` derivado do próprio valor exibido. Num festival, o
 * rodapé é onde uma companhia procura com quem falar — deixá-lo como texto solto
 * transformaria isso em copiar e colar à mão.
 */
export async function SiteFooter() {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');
  const tPartners = await getTranslations('parceiros');

  const realization = partners.find((partner) => partner.role === 'realizacao');
  const production = partners.find((partner) => partner.role === 'producao');

  return (
    <footer className="mt-stack-lg border-t border-outline-variant/60">
      <Container className="grid gap-stack-md py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl font-bold tracking-[0.14em] text-foreground">
            FENATEVI
          </p>
          <p className="mt-1 font-sans text-sm text-foreground-muted">{t('identification')}</p>
          <p className="mt-4 font-sans text-sm text-foreground-subtle">{t('description')}</p>
        </div>

        <nav aria-label={t('navigationLabel')}>
          <p className="font-sans text-xs font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
            {tNav('primaryLabel')}
          </p>
          <ul className="mt-4 flex flex-col gap-1">
            {portalAreas.map((area) => (
              <li key={area.id}>
                <Link
                  href={area.href}
                  className="inline-flex min-h-11 min-w-11 items-center font-sans text-sm text-foreground-muted no-underline transition-colors hover:text-foreground"
                >
                  {tNav(area.id)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-sans text-xs font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
            {t('contactTitle')}
          </p>
          <ul className="mt-4 flex flex-col gap-1">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <a
                  href={contactHref(contact)}
                  className="inline-flex min-h-11 items-center font-sans text-sm text-foreground-muted underline underline-offset-4 transition-colors hover:text-foreground"
                >
                  {contact.value}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-sans text-sm text-foreground-subtle">
            {t('pressLabel')}:{' '}
            <ArchiveText>
              {pressContact.name} — {pressContact.organization}
            </ArchiveText>{' '}
            ·{' '}
            <a
              href={`tel:+55${pressContact.phone.replaceAll(/\D/g, '')}`}
              className="underline underline-offset-4 transition-colors hover:text-foreground"
            >
              {pressContact.phone}
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {realization !== undefined && (
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                {tPartners('roles.realizacao')}
              </p>
              <ArchiveText as="p" className="mt-2 block font-sans text-sm text-foreground-muted">
                {realization.name}
              </ArchiveText>
              <ArchiveText as="p" className="mt-1 block font-serif text-base text-secondary italic">
                {realizationMotto}
              </ArchiveText>
            </div>
          )}
          {production !== undefined && (
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.16em] text-foreground-subtle uppercase">
                {tPartners('roles.producao')}
              </p>
              <ArchiveText as="p" className="mt-2 block font-sans text-sm text-foreground-muted">
                {production.name}
              </ArchiveText>
            </div>
          )}
        </div>
      </Container>

      <Container className="flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/60 py-6">
        <p className="font-sans text-sm text-foreground-subtle">
          {t('copyright', { year: currentEdition.year })}
        </p>
        <BackToTop />
      </Container>
    </footer>
  );
}
