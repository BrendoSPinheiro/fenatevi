'use client';

/**
 * As preferências de acessibilidade que o visitante escolhe no portal.
 *
 * **Só existe aqui o que o portal realmente faz.** O protótipo desenha um
 * controle "A11y" com quatro opções, uma delas Libras — que exigiria um
 * intérprete em vídeo ou um serviço de terceiros, e não existe. Anunciar um
 * recurso que não funciona é pior do que não anunciá-lo, sobretudo neste
 * controle: quem o abre depende dele. As três preferências abaixo estão
 * implementadas de ponta a ponta; a informação sobre Libras e audiodescrição
 * **nas sessões** é outra coisa, é acervo, e vive no filtro da programação.
 *
 * Cada preferência vira um atributo no `<html>`, e é o CSS que reage — nenhum
 * componente recalcula estilo em JavaScript. O estado mora neste módulo, num
 * store externo com assinantes, para que `use-reduced-motion.ts` possa observar
 * a escolha do visitante junto com a do sistema operacional.
 *
 * **A aplicação acontece depois da hidratação.** Ler `localStorage` antes do
 * primeiro quadro exigiria um script inline, que o guia de segurança proíbe.
 * Na prática o visitante que escolheu alto contraste vê o tema padrão por um
 * quadro; é o custo aceito para não abrir exceção na política de scripts.
 */

export type ContrastPreference = 'padrao' | 'alto';
export type TextSizePreference = 'padrao' | 'grande';
/** `sistema` respeita `prefers-reduced-motion`; `reduzido` desliga sempre. */
export type MotionPreference = 'sistema' | 'reduzido';

export interface A11yPreferences {
  readonly contrast: ContrastPreference;
  readonly textSize: TextSizePreference;
  readonly motion: MotionPreference;
}

export const DEFAULT_A11Y_PREFERENCES: A11yPreferences = {
  contrast: 'padrao',
  textSize: 'padrao',
  motion: 'sistema',
};

const STORAGE_KEY = 'fenatevi:acessibilidade';

let current: A11yPreferences = DEFAULT_A11Y_PREFERENCES;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

/**
 * Escreve as preferências no `<html>`.
 *
 * O atributo só existe quando difere do padrão: assim o seletor de CSS é
 * `[data-contrast='alto']`, e não uma regra que precisa desfazer a si mesma.
 */
function apply(preferences: A11yPreferences): void {
  const root = document.documentElement;

  if (preferences.contrast === 'padrao') {
    delete root.dataset.contrast;
  } else {
    root.dataset.contrast = preferences.contrast;
  }

  if (preferences.textSize === 'padrao') {
    delete root.dataset.textSize;
  } else {
    root.dataset.textSize = preferences.textSize;
  }

  if (preferences.motion === 'sistema') {
    delete root.dataset.motion;
  } else {
    root.dataset.motion = preferences.motion;
  }
}

/** Uma preferência válida, ou o padrão — nada aqui confia no que foi lido. */
function parse(raw: string | null): A11yPreferences {
  if (raw === null) {
    return DEFAULT_A11Y_PREFERENCES;
  }

  try {
    const value: unknown = JSON.parse(raw);

    if (typeof value !== 'object' || value === null) {
      return DEFAULT_A11Y_PREFERENCES;
    }

    const record = value as Record<string, unknown>;

    return {
      contrast: record.contrast === 'alto' ? 'alto' : 'padrao',
      textSize: record.textSize === 'grande' ? 'grande' : 'padrao',
      motion: record.motion === 'reduzido' ? 'reduzido' : 'sistema',
    };
  } catch {
    /* Conteúdo corrompido é o mesmo que ausência de preferência. */
    return DEFAULT_A11Y_PREFERENCES;
  }
}

export function subscribeToA11yPreferences(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getA11yPreferences(): A11yPreferences {
  return current;
}

/** No servidor não há preferência escolhida — o HTML sai sempre no padrão. */
export function getServerA11yPreferences(): A11yPreferences {
  return DEFAULT_A11Y_PREFERENCES;
}

/**
 * Lê o que ficou guardado e aplica.
 *
 * `localStorage` pode lançar (janela privada, cookies bloqueados). Uma
 * preferência que não pôde ser lida não é erro: é o padrão.
 */
export function restoreA11yPreferences(): void {
  try {
    current = parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    current = DEFAULT_A11Y_PREFERENCES;
  }

  apply(current);
  emit();
}

export function setA11yPreference<Key extends keyof A11yPreferences>(
  key: Key,
  value: A11yPreferences[Key],
): void {
  current = { ...current, [key]: value };
  apply(current);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    /* Sem persistência a escolha ainda vale nesta página, que é o essencial. */
  }

  emit();
}

export function resetA11yPreferences(): void {
  current = DEFAULT_A11Y_PREFERENCES;
  apply(current);

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* Idem: a escolha desta página já foi desfeita. */
  }

  emit();
}

/** Existe para os testes: o módulo é um singleton e não volta atrás sozinho. */
export function resetA11yPreferencesForTesting(): void {
  current = DEFAULT_A11Y_PREFERENCES;
  listeners.clear();
}
