import type { FestivalEdition } from '@/types/festival';

/**
 * Conteúdo da edição vigente.
 *
 * Dados de demonstração para o bootstrap — os valores definitivos virão da
 * organização do festival (ou, futuramente, de um CMS). O formato já é o
 * definitivo, portanto os componentes que consomem este objeto não precisarão
 * mudar quando a origem dos dados mudar.
 */
export const currentEdition: FestivalEdition = {
  id: 'fenatevi-2026',
  edition: 12,
  year: 2026,
  startDate: '2026-09-11',
  endDate: '2026-09-20',
  city: 'Vitória',
  accessibility: ['audioDescription', 'signLanguage', 'wheelchairAccess'],
};
