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
  /**
   * Como a imagem preenche a moldura.
   *
   * `cover` recorta para preencher — o padrão, e o certo quando a moldura é
   * decorativa. `contain` cabe inteira dentro dela, e é o certo para material
   * de acervo cuja proporção varia: as capas de 2024 vão de 3:5 a 3:2, e
   * forçá-las todas a um mesmo recorte decepa metade das que são horizontais.
   * Uma capa recortada não é a capa — é um pedaço dela.
   */
  readonly fit?: 'cover' | 'contain';
  /**
   * Onde a moldura corta, no formato do `object-position`.
   *
   * Só faz efeito com `fit="cover"`. As fotografias de cena têm rostos acima do
   * centro geométrico com frequência, e um recorte quadrado centrado corta
   * cabeças; subir o ponto de interesse resolve sem editar o arquivo.
   */
  readonly position?: string;
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
  fit = 'cover',
  position,
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
        className={fit === 'contain' ? 'object-contain' : 'object-cover'}
        style={fit === 'cover' && position !== undefined ? { objectPosition: position } : undefined}
      />
    </span>
  );
}
