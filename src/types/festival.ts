/**
 * Tipos de conteúdo do festival.
 *
 * São descrições de dados, não entidades de domínio: apenas tipos, uniões e
 * objetos imutáveis. Quando o conteúdo migrar para um CMS, estes tipos passam a
 * ser o contrato de saída do adaptador — a interface não precisa mudar.
 *
 * **Dois regimes de idioma convivem aqui, e a fronteira é deliberada.** Texto de
 * interface (rótulos, estados, descrições de seção) não mora no conteúdo: mora
 * em `messages/`, nos três idiomas, e o conteúdo guarda apenas a *chave*. Texto
 * de acervo (título, release, ficha técnica, biografia) mora aqui, em pt-BR, e é
 * renderizado por `ui/archive-text.tsx`, que marca o idioma real do trecho. Cada
 * campo abaixo diz a qual regime pertence.
 */

/** Data no formato ISO 8601 (`YYYY-MM-DD`). */
export type IsoDate = string;

/**
 * Instante no formato ISO 8601 com deslocamento explícito
 * (`YYYY-MM-DDTHH:mm:ss-03:00`).
 *
 * O deslocamento é obrigatório: sem ele, `new Date()` interpreta a string no
 * fuso de quem executa, e servidor e navegador chegam a horários diferentes —
 * a causa clássica de erro de hidratação. O festival acontece em
 * `America/Sao_Paulo`, que não observa horário de verão desde 2019.
 */
export type IsoDateTime = string;

export type AccessibilityFeatureId =
  'audioDescription' | 'signLanguage' | 'captions' | 'wheelchairAccess' | 'relaxedPerformance';

export interface AccessibilityFeature {
  readonly id: AccessibilityFeatureId;
  /** Chave dentro do namespace `accessibilityFeatures` das mensagens. */
  readonly translationKey: AccessibilityFeatureId;
}

/**
 * As frentes de programação do festival.
 *
 * São enum traduzida, não nome próprio: "Mostra Oficial" tem tradução legítima
 * em inglês e espanhol. O nome cerimonial de uma frente numa edição específica
 * ("7ª Mostra Paralela Vera Viana", que homenageia uma pessoa) é acervo e vive
 * na própria edição, em pt-BR.
 */
export type ProgramStrand =
  'mostra-oficial' | 'mostra-paralela' | 'oficina' | 'lancamento' | 'processo-criativo';

/** Tipo de espaço — chave do namespace `espacos.kinds`. */
export type VenueKind =
  | 'teatro'
  | 'teatro-casa-de-musica'
  | 'teatro-universitario'
  | 'teatro-formacao'
  | 'sala'
  | 'ar-livre'
  | 'espaco-independente';

/** Classificação indicativa — chave do namespace `acervo.ratings`. */
export type AgeRating = 'livre' | '10' | '12' | '14' | '16' | '18';

/**
 * De onde veio o arquivo de imagem.
 *
 * É campo, não comentário: levantar o que ainda precisa de arquivo original
 * vira um `filter`, e não uma caçada pelo JSX.
 */
export type ImageProvenance = 'programa-impresso-2024' | 'registro-original';

export interface ImageAsset {
  /** Caminho a partir de `public/`, começando com `/`. */
  readonly src: string;
  /** Chave dentro do namespace `imagens` das mensagens — o texto alternativo. */
  readonly altKey: string;
  readonly provenance: ImageProvenance;
  /**
   * Extração de baixa resolução: a largura renderizada é limitada ao que o
   * arquivo sustenta, e a imagem nunca ocupa a largura inteira do viewport.
   */
  readonly isLowResolution: boolean;
}

/**
 * Uma linha de ficha técnica: função e quem a exerce.
 *
 * Acervo em pt-BR, ordem e grafia preservadas como no programa impresso.
 */
export interface CreditLine {
  readonly label: string;
  readonly value: string;
}

/** Posição no esquema de espaços — porcentagens, não coordenadas geográficas. */
export interface SchematicPosition {
  readonly x: number;
  readonly y: number;
}

export interface Venue {
  readonly id: string;
  /** Acervo, pt-BR: nome próprio do espaço. */
  readonly name: string;
  /** Espaço que abriga este, quando é uma sala dentro de outro espaço. */
  readonly parentVenueId: string | null;
  /** Acervo, pt-BR: endereço como consta no programa. */
  readonly address: string;
  readonly kind: VenueKind;
  /**
   * Posição no esquema da cidade, em porcentagem do container.
   *
   * **Não é geolocalização.** O esquema do protótipo organiza os espaços em
   * relação uns aos outros; uma base geográfica de verdade é outra change.
   */
  readonly position: SchematicPosition;
  readonly image: ImageAsset | null;
  readonly accessibility: readonly AccessibilityFeatureId[];
}

/**
 * Uma apresentação da programação.
 *
 * Uma atividade é uma *sessão*: o mesmo espetáculo em dois dias são duas
 * atividades, como o programa impresso as lista.
 */
export interface Activity {
  readonly id: string;
  /** Acervo, pt-BR. */
  readonly title: string;
  readonly strand: ProgramStrand;
  readonly startsAt: IsoDateTime;
  /** Duração em minutos; `null` quando o programa não a declara. */
  readonly durationInMinutes: number | null;
  readonly venueId: string;
  /** Acervo, pt-BR: nome da companhia. */
  readonly company: string;
  /** Sigla da unidade federativa de origem da companhia. */
  readonly stateCode: string;
  /** Acervo, pt-BR; `null` quando o programa não declara autoria. */
  readonly author: string | null;
  /** Acervo, pt-BR; `null` quando o programa não declara direção. */
  readonly director: string | null;
  readonly rating: AgeRating | null;
  /** Acervo, pt-BR: o release como a companhia o escreveu. */
  readonly release: string;
  readonly technicalSheet: readonly CreditLine[];
  /** Acervo, pt-BR: observação da sessão (patrocínio, abertura, horário). */
  readonly note: string | null;
  readonly accessibility: readonly AccessibilityFeatureId[];
  readonly image: ImageAsset | null;
}

/** Uma janela de trabalho da oficina — um dos dias em que ela acontece. */
export interface WorkshopSession {
  readonly startsAt: IsoDateTime;
  readonly endsAt: IsoDateTime;
}

export interface Workshop {
  readonly id: string;
  /** Acervo, pt-BR. */
  readonly title: string;
  readonly sessions: readonly WorkshopSession[];
  readonly venueId: string;
  /** Acervo, pt-BR: quem conduz. */
  readonly teachers: string;
  /** Chave do namespace `oficina.formats`. */
  readonly format: 'presencial-gratuito';
  /** Acervo, pt-BR: a quem a oficina se dirige. */
  readonly audience: string;
  /** Idade mínima em anos; `null` quando não há restrição declarada. */
  readonly minimumAge: number | null;
  readonly classCount: number;
  readonly seatsPerClass: number;
  /** Formulário externo de inscrição — o portal não coleta dados. */
  readonly registrationUrl: string;
  /** Acervo, pt-BR. */
  readonly description: string;
  /** Acervo, pt-BR: requisitos e recomendações aos participantes. */
  readonly requirements: string | null;
  readonly accessibility: readonly AccessibilityFeatureId[];
  readonly image: ImageAsset | null;
  /** Espetáculo do qual a oficina deriva, quando houver. */
  readonly relatedActivityId: string | null;
}

/** Uma demonstração de processo criativo, ao fim de um dia de programação. */
export interface CreativeProcessItem {
  /** Acervo, pt-BR: companhia e origem, como no programa. */
  readonly company: string;
  readonly venueId: string;
}

export interface CreativeProcessDay {
  readonly date: IsoDate;
  readonly items: readonly CreativeProcessItem[];
}

export interface Honoree {
  readonly id: string;
  /** Acervo, pt-BR: nome da pessoa homenageada. */
  readonly name: string;
  /** Acervo, pt-BR: ofício pelo qual é homenageada. */
  readonly role: string;
  /** Acervo, pt-BR. */
  readonly biography: string;
  readonly portrait: ImageAsset | null;
}

export interface Book {
  readonly id: string;
  /** Acervo, pt-BR. */
  readonly title: string;
  readonly author: string;
  readonly description: string;
}

/** Papel de um parceiro — chave do namespace `parceiros.roles`. */
export type PartnerRole = 'realizacao' | 'producao' | 'patrocinio' | 'promocao' | 'apoio';

export interface Partner {
  readonly id: string;
  readonly role: PartnerRole;
  /** Acervo, pt-BR: razão social ou nome da instituição. */
  readonly name: string;
  /** Chave do namespace `parceiros.notes`; `null` quando não há nota. */
  readonly noteKey: string | null;
}

/**
 * Estado do acervo de uma edição — chave do namespace `memoria.states`.
 *
 * É o que decide o que cada entrada da linha do tempo oferece: só
 * `acervo-completo` tem página própria.
 */
export type ArchiveState =
  'edicao-vigente' | 'acervo-pendente' | 'acervo-completo' | 'em-digitalizacao';

/** Uma entrada da linha do tempo — uma edição, ou um bloco de edições. */
export interface EditionTimelineEntry {
  readonly id: string;
  readonly firstYear: number;
  readonly lastYear: number;
  /** Número da edição; `null` quando a entrada agrupa várias. */
  readonly edition: number | null;
  /** Quantas edições a entrada representa. */
  readonly editionCount: number;
  readonly startDate: IsoDate | null;
  readonly endDate: IsoDate | null;
  readonly archiveState: ArchiveState;
  /** Completude do acervo, de 0 a 1 — o indicador tem equivalente textual. */
  readonly completeness: number;
  /** Existe página de edição para esta entrada? Só `acervo-completo` tem. */
  readonly hasEditionPage: boolean;
}

/** A apresentação assinada de uma edição. */
export interface EditionStatement {
  /** Acervo, pt-BR: o texto, como assinado. */
  readonly quote: string;
  readonly author: string;
  /** Acervo, pt-BR: como quem assina se identifica. */
  readonly authorRole: string;
}

export interface FestivalEdition {
  readonly id: string;
  /** Número da edição, exibido como "22ª edição". */
  readonly edition: number;
  readonly year: number;
  readonly startDate: IsoDate;
  readonly endDate: IsoDate;
  readonly city: string;
  /** Toda a edição é de entrada franca? */
  readonly freeEntry: boolean;
  /** Acervo, pt-BR: o mote da edição; `null` quando não houver. */
  readonly motto: string | null;
  /**
   * A edição já teve sua programação publicada pela organização?
   *
   * Enquanto for `false`, o portal apresenta o acervo da última edição
   * completa e **diz que é isso que está fazendo**. Quando a organização
   * publicar, o aviso desaparece sem mudança de código.
   */
  readonly hasPublishedProgram: boolean;
  readonly statement: EditionStatement | null;
  /** Acervo, pt-BR: nome cerimonial da mostra paralela desta edição. */
  readonly parallelShowcaseName: string | null;
  readonly coverImage: ImageAsset | null;
  readonly accessibility: readonly AccessibilityFeatureId[];
}
