'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState, useSyncExternalStore } from 'react';

import { Dialog } from '@/components/ui/dialog';
import { Link } from '@/lib/i18n/navigation';
import {
  getA11yPreferences,
  getServerA11yPreferences,
  resetA11yPreferences,
  restoreA11yPreferences,
  setA11yPreference,
  subscribeToA11yPreferences,
  type A11yPreferences,
} from '@/lib/a11y/preferences';

/**
 * Os grupos do painel, na ordem em que são apresentados.
 *
 * Cada opção existe porque **está implementada**: alto contraste troca os
 * tokens de cor, o texto maior aumenta a base do documento, e o movimento
 * reduzido desliga animação e rolagem suave — os três por atributo no `<html>`,
 * lidos pelo CSS.
 */
const GROUPS = [
  { key: 'contrast', options: ['padrao', 'alto'] },
  { key: 'textSize', options: ['padrao', 'grande'] },
  { key: 'motion', options: ['sistema', 'reduzido'] },
] as const satisfies readonly {
  readonly key: keyof A11yPreferences;
  readonly options: readonly string[];
}[];

/** As preferências correntes, observadas do store do módulo. */
function useA11yPreferences(): A11yPreferences {
  return useSyncExternalStore(
    subscribeToA11yPreferences,
    getA11yPreferences,
    getServerA11yPreferences,
  );
}

/**
 * O painel de acessibilidade do cabeçalho.
 *
 * **Não é um estado de demonstração.** O protótipo desenha este controle com
 * quatro opções rotuladas "integração real na implementação", uma delas Libras.
 * Aqui há três, e as três funcionam: quem escolher alto contraste sai desta
 * página com alto contraste, e a escolha sobrevive à navegação e ao
 * recarregamento. Libras ficou de fora porque exigiria intérprete em vídeo ou
 * serviço de terceiros — anunciá-la sem entregá-la seria enganar exatamente
 * quem depende dela. Em compensação o painel leva ao lugar onde Libras e
 * audiodescrição são informação de verdade: o filtro de acessibilidade da
 * programação, que diz **quais sessões** têm cada recurso.
 *
 * Client Component de folha: é o único trecho do cabeçalho com estado, e ele
 * não arrasta a marca nem a navegação para o bundle.
 */
export function A11yMenu() {
  const t = useTranslations('acessibilidade');
  const [isOpen, setIsOpen] = useState(false);
  const preferences = useA11yPreferences();

  /*
   * A restauração acontece na montagem, e não na abertura do painel: quem já
   * escolheu alto contraste precisa recebê-lo ao chegar, sem abrir nada.
   */
  useEffect(() => {
    restoreA11yPreferences();
  }, []);

  const isDefault =
    preferences.contrast === 'padrao' &&
    preferences.textSize === 'padrao' &&
    preferences.motion === 'sistema';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-outline-variant px-2 font-sans text-xs font-semibold tracking-[0.16em] text-foreground uppercase transition-colors hover:border-outline sm:px-3"
      >
        {/* O pictograma é decorativo: quem lê a tela recebe o rótulo ao lado. */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
          <circle cx="12" cy="3.8" r="2" />
          <path d="M21 7.2a1 1 0 0 1-.75 1.2l-4.9 1.1v3l2.2 8.2a1 1 0 0 1-1.93.52L13.7 14h-3.4l-1.92 7.2a1 1 0 1 1-1.93-.52l2.2-8.2v-3l-4.9-1.1A1 1 0 0 1 4.2 6.4L9.8 7.7a10 10 0 0 0 4.4 0l5.6-1.3a1 1 0 0 1 1.2.8Z" />
        </svg>
        {/*
         * Em telas estreitas sobra o pictograma, e o rótulo continua no nome
         * acessível: a barra do cabeçalho não cabe em 375px com a palavra
         * inteira, e um cabeçalho que empurra o documento de lado é pior do que
         * um controle sem rótulo visível.
         */}
        <span className="sr-only lg:not-sr-only">{t('trigger')}</span>
        {/* O ponto avisa que há preferência ativa sem depender só de cor. */}
        {!isDefault && (
          <span className="text-secondary">
            <span aria-hidden="true">•</span>
            <span className="sr-only"> — {t('activeNotice')}</span>
          </span>
        )}
      </button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('title')}>
        <div className="mx-auto w-full max-w-(--container-max) px-margin-mobile py-10 lg:px-margin-desktop">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-serif text-4xl text-foreground">{t('title')}</p>
              <p className="mt-2 max-w-prose font-sans text-base text-foreground-muted">
                {t('description')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="min-h-11 shrink-0 rounded-sm border border-outline-variant px-4 font-sans text-xs font-semibold tracking-[0.16em] text-foreground uppercase"
            >
              {t('close')}
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-8">
            {GROUPS.map((group) => (
              <fieldset key={group.key} className="border-0 p-0">
                <legend className="font-sans text-xs font-bold tracking-[0.16em] text-secondary uppercase">
                  {t(`${group.key}.label`)}
                </legend>
                <p className="mt-2 max-w-prose font-sans text-sm text-foreground-subtle">
                  {t(`${group.key}.hint`)}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {group.options.map((option) => {
                    const isActive = preferences[group.key] === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => {
                          setA11yPreference(group.key, option as A11yPreferences[typeof group.key]);
                        }}
                        className={
                          isActive
                            ? 'inline-flex min-h-11 items-center rounded-sm border border-secondary bg-secondary px-4 font-sans text-sm font-semibold text-on-secondary'
                            : 'inline-flex min-h-11 items-center rounded-sm border border-outline-variant px-4 font-sans text-sm text-foreground transition-colors hover:border-outline'
                        }
                      >
                        {t(`${group.key}.${option}`)}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-outline-variant/60 pt-6">
            <button
              type="button"
              onClick={resetA11yPreferences}
              className="inline-flex min-h-11 items-center font-sans text-sm text-foreground-muted underline underline-offset-4 hover:text-foreground"
            >
              {t('reset')}
            </button>
          </div>

          {/*
           * Libras e audiodescrição não são preferências do portal: são
           * recursos de sessões específicas. O painel manda quem procura por
           * eles para o lugar onde a informação existe de verdade.
           */}
          <div className="mt-8 border-l border-secondary pl-4">
            <p className="max-w-prose font-sans text-base text-foreground-muted">
              {t('sessionsNotice')}
            </p>
            <Link
              href="/programacao?acessibilidade=signLanguage"
              onClick={() => setIsOpen(false)}
              className="mt-2 inline-flex min-h-11 items-center font-sans text-sm font-semibold tracking-[0.1em] text-foreground uppercase underline decoration-secondary decoration-2 underline-offset-[6px]"
            >
              {t('sessionsCta')}
            </Link>
          </div>
        </div>
      </Dialog>
    </>
  );
}
