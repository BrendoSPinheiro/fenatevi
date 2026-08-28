import { getTranslations } from 'next-intl/server';

import { ArchiveText } from '@/components/ui/archive-text';
import {
  CENTRO_MAP,
  isInsideLayer,
  projectToLayer,
  VITORIA_MAP,
  type CityMapLayer,
} from '@/content/city-map';
import { mappedVenues, venues } from '@/content/venues';
import { Link } from '@/lib/i18n/navigation';
import { countsByVenue } from '@/lib/utils/program';

interface VenueMapProps {
  readonly className?: string;
}

/** Comprimento da barra de escala de cada camada, em quilômetros. */
const SCALE_BAR_KM = { cidade: 1, centro: 0.2 } as const;

interface Marker {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly count: number;
  readonly latitude: number;
  readonly longitude: number;
}

/**
 * Uma camada do mapa, com os seus marcadores.
 *
 * O SVG carrega o desenho; os alvos de toque ficam **fora** dele, posicionados
 * em porcentagem por cima: dentro, um `<a>` de 44px teria de ser dimensionado
 * em unidades do `viewBox` e encolheria junto com o mapa em telas estreitas.
 * Aqui os 44px são 44px em qualquer largura.
 *
 * **Desenhar e ser clicável são coisas separadas**, e é o que `targetIds`
 * resolve. No mapa geral, os cinco espaços do Centro caem dentro de quatro
 * quarteirões: os alvos de 44px se sobrepõem, e alvo sobreposto é violação de
 * tamanho de alvo (WCAG 2.5.8) — além de ser impossível de acertar com o
 * polegar. Ali eles são desenho; quem os torna alcançáveis é o detalhe do
 * Centro, onde estão separados por quarteirões de verdade.
 */
async function MapLayer({
  layer,
  markers,
  targetIds,
  label,
  scaleKm,
  inset,
}: {
  readonly layer: CityMapLayer;
  readonly markers: readonly Marker[];
  /** Quais marcadores desta camada recebem alvo de toque. */
  readonly targetIds: ReadonlySet<string>;
  readonly label: string;
  readonly scaleKm: number;
  /** Camada cujo recorte assinalar dentro desta — o quadro do detalhe. */
  readonly inset?: CityMapLayer;
}) {
  const t = await getTranslations('espacos');
  const scaleBar = layer.pixelsPerKm * scaleKm;

  const points = markers.map((marker) => ({
    marker,
    point: projectToLayer(layer, marker.latitude, marker.longitude),
  }));

  const insetBox =
    inset === undefined
      ? null
      : {
          topLeft: projectToLayer(layer, inset.frame.north, inset.frame.west),
          bottomRight: projectToLayer(layer, inset.frame.south, inset.frame.east),
        };

  return (
    <div className="relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
      <svg
        viewBox={`0 0 ${layer.viewBox.width} ${layer.viewBox.height}`}
        role="img"
        aria-label={label}
        className="block h-auto w-full"
      >
        {/*
         * A trama vai do traço mais fino ao mais grosso: ruas, arteriais,
         * litoral. A ordem de pintura é a hierarquia.
         */}
        <g
          fill="none"
          stroke="var(--color-surface-container-high)"
          strokeWidth={4}
          strokeLinecap="round"
        >
          {layer.streets.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g
          fill="none"
          stroke="var(--color-surface-container-highest)"
          strokeWidth={6}
          strokeLinecap="round"
        >
          {layer.arterialRoads.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g fill="none" stroke="var(--color-outline)" strokeWidth={3.5} strokeOpacity={0.8}>
          {layer.coastline.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        {/* O recorte do detalhe, assinalado no mapa geral. */}
        {insetBox !== null && (
          <rect
            x={insetBox.topLeft.x}
            y={insetBox.topLeft.y}
            width={insetBox.bottomRight.x - insetBox.topLeft.x}
            height={insetBox.bottomRight.y - insetBox.topLeft.y}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={4}
            strokeDasharray="14 10"
            strokeOpacity={0.75}
          />
        )}

        {/*
         * A barra de escala é o que separa este mapa de um desenho: sem ela,
         * "perto" e "longe" ficam por conta da imaginação de quem olha.
         */}
        <g transform={`translate(30 ${layer.viewBox.height - 32})`}>
          <path
            d={`M0,0 L0,-13 M0,-6.5 L${scaleBar},-6.5 M${scaleBar},0 L${scaleBar},-13`}
            fill="none"
            stroke="var(--color-foreground-subtle)"
            strokeWidth={3}
          />
          <text
            x={scaleBar / 2}
            y={22}
            textAnchor="middle"
            fill="var(--color-foreground-subtle)"
            className="font-sans"
            fontSize={24}
          >
            {scaleKm < 1
              ? t('scaleBarMeters', { m: scaleKm * 1000 })
              : t('scaleBar', { km: scaleKm })}
          </text>
        </g>

        {points.map(({ marker, point }) => (
          <g key={marker.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={19}
              fill="var(--color-secondary)"
              stroke="var(--color-surface)"
              strokeWidth={5}
            />
            <text
              x={point.x}
              y={point.y + 8}
              textAnchor="middle"
              fill="var(--color-on-secondary)"
              className="font-sans"
              fontSize={23}
              fontWeight={700}
            >
              {marker.order}
            </text>
          </g>
        ))}
      </svg>

      <ul className="absolute inset-0">
        {points
          .filter(({ marker }) => targetIds.has(marker.id))
          .map(({ marker, point }) => (
            <li
              key={marker.id}
              className="absolute"
              style={{
                left: `${(point.x / layer.viewBox.width) * 100}%`,
                top: `${(point.y / layer.viewBox.height) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Link
                href={`/espacos/${marker.id}`}
                className="flex size-11 items-center justify-center rounded-full no-underline"
              >
                <span className="sr-only">
                  {marker.order}
                  {'. '}
                  <ArchiveText>{marker.name}</ArchiveText>
                  {` — ${t('activityCount', { count: marker.count })}`}
                </span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

/**
 * O mapa dos espaços do festival em Vitória.
 *
 * **É um mapa de verdade, e não um esquema.** A linha de costa e a malha viária
 * vêm do OpenStreetMap, congeladas em `content/city-map.ts`; cada marcador é
 * projetado da coordenada real do espaço, que por sua vez veio do endereço
 * publicado no programa. As distâncias e as direções entre os espaços são as
 * verdadeiras — e é justamente por serem verdadeiras que existem dois mapas:
 * cinco dos sete espaços cabem em quatro quarteirões do Centro, e num único
 * enquadramento eles seriam um borrão de marcadores empilhados.
 *
 * A numeração é a de `mappedVenues`, a mesma que a lista de espaços ao lado
 * usa: o número no mapa e o número na lista são o mesmo espaço, sempre.
 *
 * **Sem biblioteca de mapa e sem requisição a terceiros.** São dois `<svg>`
 * inline: funcionam sem JavaScript, não pedem tiles, não observam ninguém e
 * entram no HTML do servidor como qualquer outro conteúdo.
 *
 * O mapa é ilustração de uma informação que **não depende dele**: a lista de
 * espaços traz o endereço completo de cada um, e é ela que responde "como eu
 * chego lá".
 */
export async function VenueMap({ className }: VenueMapProps) {
  const t = await getTranslations('espacos');

  const counts = countsByVenue(
    {},
    venues.map((venue) => venue.id),
  );

  /*
   * Só os espaços de primeiro nível ganham marcador. Uma sala dentro de uma
   * casa tem o endereço da casa — e, literalmente, a mesma coordenada: dois
   * marcadores no mesmo pixel seriam dois alvos sobrepostos. O marcador da casa
   * carrega a contagem das salas que ela abriga.
   */
  const markers: readonly Marker[] = mappedVenues.map((venue, index) => ({
    id: venue.id,
    name: venue.name,
    order: index + 1,
    count: venues
      .filter((other) => other.id === venue.id || other.parentVenueId === venue.id)
      .reduce((total, other) => total + (counts[other.id] ?? 0), 0),
    latitude: venue.coordinates.latitude,
    longitude: venue.coordinates.longitude,
  }));

  const centroMarkers = markers.filter((marker) =>
    isInsideLayer(CENTRO_MAP, marker.latitude, marker.longitude),
  );
  const centroIds = new Set(centroMarkers.map((marker) => marker.id));
  const hasInset = centroMarkers.length > 1;

  /*
   * No mapa geral, os espaços do Centro só ganham alvo quando **não** há
   * detalhe para recebê-los. Com o detalhe presente, eles são desenho ali e
   * alvo lá embaixo — nunca um monte de alvos empilhados.
   */
  const wideTargetIds = new Set(
    markers.filter((marker) => !hasInset || !centroIds.has(marker.id)).map((marker) => marker.id),
  );

  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        <MapLayer
          layer={VITORIA_MAP}
          markers={markers}
          targetIds={wideTargetIds}
          label={t('mapLabel')}
          scaleKm={SCALE_BAR_KM.cidade}
          inset={CENTRO_MAP}
        />

        {hasInset && (
          <figure className="m-0">
            <figcaption className="mb-2 font-sans text-xs font-semibold tracking-[0.14em] text-secondary uppercase">
              {t('mapInsetTitle')}
            </figcaption>
            <MapLayer
              layer={CENTRO_MAP}
              markers={centroMarkers}
              targetIds={centroIds}
              label={t('mapInsetLabel')}
              scaleKm={SCALE_BAR_KM.centro}
            />
          </figure>
        )}
      </div>

      <p className="mt-3 max-w-prose font-sans text-sm text-foreground-subtle">{t('mapNotice')}</p>
      {/* Atribuição exigida pela ODbL: os dados do mapa são do OpenStreetMap. */}
      <p className="mt-1 font-sans text-xs text-foreground-subtle">{t('mapAttribution')}</p>
    </div>
  );
}
