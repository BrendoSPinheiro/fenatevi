import type { IsoDate, IsoDateTime } from '@/types/festival';

/**
 * O fuso do festival.
 *
 * Toda formatação de horário o declara explicitamente: sem isso, o horário
 * exibido dependeria de onde a página é renderizada, e servidor e navegador
 * chegariam a resultados diferentes.
 */
export const FESTIVAL_TIME_ZONE = 'America/Sao_Paulo';

/**
 * Converte uma data ISO (`YYYY-MM-DD`) em `Date` no fuso UTC.
 *
 * Datas de conteúdo são dias de calendário, não instantes. Interpretá-las em UTC
 * evita que o fuso do servidor ou do navegador desloque o dia exibido — a causa
 * clássica de divergência entre o HTML do servidor e o do cliente.
 */
export function parseIsoDate(value: IsoDate): Date {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Data ISO inválida: "${value}"`);
  }

  return date;
}

/**
 * Formata um dia de calendário para o locale informado.
 *
 * Sempre em UTC, pelo mesmo motivo de `parseIsoDate`.
 */
export function formatFestivalDate(
  value: IsoDate,
  locale: string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' },
): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(
    parseIsoDate(value),
  );
}

/**
 * Formata o horário de uma sessão no idioma corrente.
 *
 * O protótipo guarda `time: '19h30'`, que só funciona em português — em inglês
 * o mesmo horário é "7:30 PM". Aqui o acervo guarda o instante e a apresentação
 * é do `Intl`: "19h30" em pt-BR, "7:30 PM" em en, "19:30" em es.
 *
 * Em pt-BR o separador vira "h", como o programa impresso escreve; o `Intl`
 * devolve "19:30", que ninguém usa num cartaz de teatro.
 */
export function formatSessionTime(value: IsoDateTime, locale: string): string {
  const formatted = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: FESTIVAL_TIME_ZONE,
  }).format(new Date(value));

  return locale === 'pt-BR' ? formatted.replace(':', 'h') : formatted;
}

/**
 * Formata um dia curto, do jeito que cabe num chip: "13 OUT", "OCT 13".
 *
 * O `Intl` decide a ordem dos campos por idioma; a caixa alta é aplicada pelo
 * CSS de quem apresenta, não aqui — assim o texto lido por leitor de tela
 * continua sendo o original.
 */
export function formatShortDay(value: IsoDate, locale: string): string {
  return formatFestivalDate(value, locale, { day: 'numeric', month: 'short' });
}

/** O dia da semana por extenso: "domingo", "Sunday", "domingo". */
export function formatWeekday(value: IsoDate, locale: string): string {
  return formatFestivalDate(value, locale, { weekday: 'long' });
}

/*
 * As três partes de uma data, separadas.
 *
 * A composição editorial da programação empilha o número, o mês e o dia da
 * semana em escalas diferentes — o número grande, o resto em rubrica —, e para
 * isso precisa de cada parte isolada. Continuam vindo do `Intl`: em inglês o
 * mês abreviado é "Oct" e em português é "out.", e nenhuma das duas é montada
 * à mão. A caixa alta fica com o CSS, para que o leitor de tela receba o texto
 * como o idioma o escreve.
 */

/** Só o número do dia: "13". */
export function formatDayNumber(value: IsoDate, locale: string): string {
  return formatFestivalDate(value, locale, { day: 'numeric' });
}

/** Só o mês abreviado: "out.", "Oct", "oct". */
export function formatMonthShort(value: IsoDate, locale: string): string {
  return formatFestivalDate(value, locale, { month: 'short' });
}

/** Só o dia da semana abreviado: "dom.", "Sun", "dom". */
export function formatWeekdayShort(value: IsoDate, locale: string): string {
  return formatFestivalDate(value, locale, { weekday: 'short' });
}

/**
 * Formata uma duração em minutos: "50 min", "1 h 40 min".
 *
 * Usa `Intl.NumberFormat` com a unidade, e não uma string montada à mão, para
 * que a abreviação e o espaçamento sejam os do idioma.
 */
export function formatDuration(minutes: number, locale: string): string {
  const unit = (value: number, name: 'hour' | 'minute') =>
    new Intl.NumberFormat(locale, {
      style: 'unit',
      unit: name,
      unitDisplay: 'short',
    }).format(value);

  if (minutes < 60) {
    return unit(minutes, 'minute');
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder === 0
    ? unit(hours, 'hour')
    : `${unit(hours, 'hour')} ${unit(remainder, 'minute')}`;
}

/**
 * O dia de calendário, no fuso do festival, de um instante.
 *
 * Complementa `festivalDayOf` de `schedule.ts`: aquela lê o dia da string do
 * acervo; esta converte um `Date` qualquer — o relógio do visitante, por
 * exemplo — para o dia correspondente em Vitória.
 */
export function festivalDayFromDate(date: Date): IsoDate {
  // `en-CA` produz exatamente `YYYY-MM-DD`, que é o formato do acervo.
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: FESTIVAL_TIME_ZONE,
  }).format(date);
}
