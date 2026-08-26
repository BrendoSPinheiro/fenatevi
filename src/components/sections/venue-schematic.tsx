import { getTranslations } from 'next-intl/server';

import { ArchiveText } from '@/components/ui/archive-text';
import { venues } from '@/content/venues';
import { activities } from '@/content/activities';
import { Link } from '@/lib/i18n/navigation';
import { countByVenue } from '@/lib/utils/schedule';

interface VenueSchematicProps {
  readonly className?: string;
}

/**
 * O esquema dos espaços do festival na cidade.
 *
 * **Não é um mapa geográfico.** As posições são porcentagens dentro do
 * container, herdadas do protótipo: elas mostram os espaços em relação uns aos
 * outros, e nada mais. Não há base cartográfica, nem biblioteca de mapa, nem
 * coordenada — introduzir qualquer uma delas exige pedido explícito.
 *
 * Por isso o esquema declara textualmente o que é, e por isso a lista de
 * espaços ao lado (com endereço de verdade) **não depende dele**: quem não vê o
 * esquema, ou para quem ele não carrega, continua com a informação completa.
 *
 * Cada marcador é um link de 44×44px com o nome do espaço no nome acessível —
 * alcançável por teclado, na ordem da lista.
 */
export async function VenueSchematic({ className }: VenueSchematicProps) {
  const t = await getTranslations('espacos');
  const counts = countByVenue(activities);

  /*
   * Só os espaços de primeiro nível ganham marcador. Uma sala dentro de uma
   * casa tem o endereço da casa, e no protótipo as duas posições distam 6% —
   * dois círculos de 44px que se sobrepõem em qualquer viewport. O marcador da
   * casa carrega a contagem das salas que ela abriga.
   */
  const markers = venues
    .filter((venue) => venue.parentVenueId === null)
    .map((venue) => ({
      venue,
      count: venues
        .filter((other) => other.id === venue.id || other.parentVenueId === venue.id)
        .reduce((total, other) => total + (counts[other.id] ?? 0), 0),
    }));

  return (
    <div className={className}>
      {/*
       * Retrato no mobile. As posições são porcentagens: numa caixa 4:3 de
       * 350px de largura, os espaços do Centro ficam a menos de 44px uns dos
       * outros e os marcadores se sobrepõem. Alongar a caixa afasta o eixo Y
       * sem tocar no acervo e sem encolher o alvo de toque abaixo de 44px.
       */}
      <div
        role="group"
        aria-label={t('schemaLabel')}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest sm:aspect-[4/3]"
      >
        {/* Traços de cidade: decoração, sem informação — daí `aria-hidden`. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_45%_60%,var(--color-curtain-fold)_0%,transparent_60%)]"
        />

        <ul className="absolute inset-0">
          {markers.map(({ venue, count }) => (
            <li
              key={venue.id}
              className="absolute"
              style={{
                left: `${venue.position.x}%`,
                top: `${venue.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Link
                href={`/espacos/${venue.id}`}
                className="flex size-11 items-center justify-center rounded-full border border-secondary bg-surface-container font-sans text-xs font-bold text-secondary no-underline transition-colors hover:bg-secondary hover:text-on-secondary"
              >
                <span aria-hidden="true">{count}</span>
                <span className="sr-only">
                  <ArchiveText>{venue.name}</ArchiveText>
                  {` — ${t('activityCount', { count })}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 max-w-prose font-sans text-sm text-foreground-subtle">
        {t('schemaNotice')}
      </p>
    </div>
  );
}
