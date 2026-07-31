import { Container } from '@/components/ui/container';

/**
 * Estado de carregamento do segmento de idioma.
 *
 * Deliberadamente silencioso: reserva a altura da dobra para evitar deslocamento
 * de layout (CLS) quando o conteúdo chega, sem introduzir um spinner animado que
 * precisaria respeitar `prefers-reduced-motion`.
 */
export default function Loading() {
  return (
    <Container aria-hidden="true" className="min-h-[60dvh] py-24">
      <div className="h-12 w-48 rounded-md bg-surface" />
    </Container>
  );
}
