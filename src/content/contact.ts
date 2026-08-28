/**
 * Como falar com a organização do festival.
 *
 * Acervo: endereços e telefones são dados do festival, não texto de interface —
 * os rótulos que os acompanham é que vêm de `messages/`. Cada contato é
 * acionável (`mailto:`, `tel:`), com o `href` derivado do próprio valor para
 * que nunca haja um número exibido diferente do número discado.
 */
export interface FestivalContact {
  readonly id: string;
  readonly kind: 'email' | 'phone';
  readonly value: string;
}

export const contacts: readonly FestivalContact[] = [
  { id: 'ratimbum', kind: 'email', value: 'ratimbum@terra.com.br' },
  { id: 'uma-floresta', kind: 'email', value: 'umafloresta@terra.com.br' },
  { id: 'fixo', kind: 'phone', value: '(27) 3222-0869' },
  { id: 'celular', kind: 'phone', value: '(27) 99698-0869' },
];

/** Assessoria de imprensa — acervo em pt-BR */
export const pressContact = {
  name: 'Márcia Almeida',
  organization: 'Golden Assessoria de Comunicação',
  phone: '(27) 99925-3818',
} as const;

/** Lema da associação realizadora — acervo em pt-BR, não traduzido. */
export const realizationMotto = '“Basta uma semente”';

/**
 * O `href` de um contato.
 *
 * Telefone vira `tel:` com apenas dígitos e o código do país, que é o formato
 * que os discadores entendem; o texto exibido continua sendo o formatado.
 */
export function contactHref(contact: FestivalContact): string {
  if (contact.kind === 'email') {
    return `mailto:${contact.value}`;
  }

  return `tel:+55${contact.value.replaceAll(/\D/g, '')}`;
}
