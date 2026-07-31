/**
 * Tipos de conteúdo do festival.
 *
 * São descrições de dados, não entidades de domínio: apenas tipos, uniões e
 * objetos imutáveis. Quando o conteúdo migrar para um CMS, estes tipos passam a
 * ser o contrato de saída do adaptador — a interface não precisa mudar.
 *
 * Textos exibidos ao usuário não moram aqui: o conteúdo guarda *chaves de
 * tradução* (ver `accessibilityFeatures` em `messages/*.json`).
 */

/** Data no formato ISO 8601 (`YYYY-MM-DD`). */
export type IsoDate = string;

export type AccessibilityFeatureId =
  'audioDescription' | 'signLanguage' | 'captions' | 'wheelchairAccess' | 'relaxedPerformance';

export interface AccessibilityFeature {
  readonly id: AccessibilityFeatureId;
  /** Chave dentro do namespace `accessibilityFeatures` das mensagens. */
  readonly translationKey: AccessibilityFeatureId;
}

export interface Venue {
  readonly id: string;
  readonly name: string;
  readonly neighborhood: string;
  readonly city: string;
  readonly accessibility: readonly AccessibilityFeatureId[];
}

export interface Show {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly venueId: Venue['id'];
  readonly startsAt: IsoDate;
  readonly durationInMinutes: number;
  readonly accessibility: readonly AccessibilityFeatureId[];
}

export interface TimelineItem {
  readonly id: string;
  readonly year: number;
  /** Chave de tradução do rótulo; o texto vive nos arquivos de mensagens. */
  readonly translationKey: string;
}

export interface FestivalEdition {
  readonly id: string;
  /** Número da edição, exibido como "Edição 12". */
  readonly edition: number;
  readonly year: number;
  readonly startDate: IsoDate;
  readonly endDate: IsoDate;
  readonly city: string;
  readonly accessibility: readonly AccessibilityFeatureId[];
}
