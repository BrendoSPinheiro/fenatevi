import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

import { cn } from '@/lib/utils/cn';

import type { ImageAsset } from '@/types/festival';

interface ProvenancedImageProps {
  readonly image: ImageAsset;
  /**
   * Larguras que a imagem ocupa por breakpoint, no formato do atributo `sizes`.
   *
   * Obrigatório: sem ele o navegador assume 100vw e baixa o maior arquivo
   * disponível em qualquer tela, que é o oposto do que estas imagens pedem.
   */
  readonly sizes: string;
  /** Classes do container — proporção, raio, borda. */
  readonly className?: string;
  /**
   * Teto de largura renderizada para material de baixa resolução, em pixels.
   *
   * As capas vêm do programa impresso e não passam de 270px de largura real;
   * apresentá-las maiores só amplia o borrão. O teto padrão é conservador e
   * pode subir quando a imagem sustentar (a capa do programa, por exemplo).
   */
  readonly maxRenderedWidth?: number;
  readonly priority?: boolean;
}

/**
 * Uma imagem do acervo, com sua proveniência respeitada.
 *
 * Duas coisas acontecem aqui, e as duas são regra do projeto:
 *
 * 1. O texto alternativo vem de `messages/`, pela chave que a própria imagem
 *    carrega — nunca de texto solto no JSX, e nunca ausente.
 * 2. Material de baixa resolução não é esticado. `isLowResolution` limita a
 *    largura renderizada ao que o arquivo sustenta.
 *
 * A anotação de proveniência **não é apresentada ao visitante**: ela é recado
 * para quem implementa (qual arquivo original ainda precisa ser pedido), e vive
 * no dado, não na tela.
 */
export async function ProvenancedImage({
  image,
  sizes,
  className,
  maxRenderedWidth = 320,
  priority = false,
}: ProvenancedImageProps) {
  const t = await getTranslations('imagens');

  return (
    <span
      className={cn('relative block overflow-hidden bg-surface-container-lowest', className)}
      style={image.isLowResolution ? { maxWidth: `${maxRenderedWidth}px` } : undefined}
    >
      <Image
        src={image.src}
        alt={t(image.altKey)}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </span>
  );
}
