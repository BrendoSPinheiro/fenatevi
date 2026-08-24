import { type VenueId } from '@/content/venues';

import type { Workshop } from '@/types/festival';

/**
 * As ações formativas da edição 2024.
 *
 * Título, descrição, público e requisitos são acervo em pt-BR. A inscrição
 * acontece em formulário externo: o portal não coleta nenhum dado e nunca
 * apresenta campo de entrada.
 */
interface FestivalWorkshop extends Workshop {
  readonly venueId: VenueId;
}

export const workshops: readonly FestivalWorkshop[] = [
  {
    id: 'ws-corpo',
    title: 'O Corpo Que Habitamos',
    sessions: [
      { startsAt: '2024-10-14T14:00:00-03:00', endsAt: '2024-10-14T18:30:00-03:00' },
      { startsAt: '2024-10-15T14:00:00-03:00', endsAt: '2024-10-15T18:30:00-03:00' },
    ],
    venueId: 'estrelas',
    teachers: 'Alessandro Brandão e Sueli Guerra',
    format: 'presencial-gratuito',
    audience: 'Atores, artistas, estudantes de arte e teatro e interessados',
    minimumAge: 16,
    classCount: 1,
    seatsPerClass: 25,
    registrationUrl: 'https://forms.gle/8fN23XfnN5Ua1iV6A',
    description:
      'Imersão de dois dias conduzida pelos criadores de “O Corpo Que Eu Habito”, ligando pesquisa de corpo, memória e presença cênica.',
    requirements:
      'É importante que o participante compareça aos 2 dias de oficina. Ao final do trabalho os participantes que quiserem estarão em cena, no espetáculo “O Corpo que Eu Habito”, juntamente com a Cia da Ideia.',
    accessibility: ['signLanguage'],
    image: {
      src: '/imagens/2024/corpo-que-eu-habito.png',
      altKey: 'corpo',
      provenance: 'programa-impresso-2024',
      isLowResolution: true,
    },
    relatedActivityId: 'corpo16',
  },
  {
    id: 'ws-disso',
    title: 'Dissociando o Corpo',
    sessions: [{ startsAt: '2024-10-16T14:00:00-03:00', endsAt: '2024-10-16T16:30:00-03:00' }],
    venueId: 'estrelas',
    teachers: 'André Forecchi — OsViajero',
    format: 'presencial-gratuito',
    audience: 'Músicos, educadores, poetas, atores, artistas, estudantes e interessados',
    minimumAge: 12,
    classCount: 1,
    seatsPerClass: 20,
    registrationUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfIoONOJLCdMOS_3q3Tf3YOFS1d8GrxN1l3Uj12AGJELsckJQ/viewform',
    description:
      'Imersão na arte do Homem-banda, focada na dissociação rítmica e na aplicação prática do ritmo em diferentes contextos, especialmente na cultura popular e na pedagogia com crianças e adolescentes. A oficina oferece teoria e exercícios práticos que exploram o controle rítmico e a independência dos movimentos corporais.',
    requirements:
      'Roupa confortável e levar algum instrumento de percussão. Exemplo: pandeiro, tambor, repenique, chocalho.',
    accessibility: [],
    image: {
      src: '/imagens/2024/homem-banda.png',
      altKey: 'homembanda',
      provenance: 'programa-impresso-2024',
      isLowResolution: true,
    },
    relatedActivityId: 'homembanda',
  },
];

/** A oficina de um id, ou `undefined` quando o id não existe. */
export function findWorkshop(id: string): FestivalWorkshop | undefined {
  return workshops.find((workshop) => workshop.id === id);
}
