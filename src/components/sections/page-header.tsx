import { ArchiveText } from '@/components/ui/archive-text';
import { BackLink } from '@/components/ui/back-link';
import { Container } from '@/components/ui/container';
import { textClassName, Text } from '@/components/ui/text';

import type { ReactNode } from 'react';

interface PageHeaderProps {
  readonly title: string;
  readonly description?: string;
  /** Rótulo curto acima do título — a frente, o estado do acervo, a área. */
  readonly kicker?: ReactNode;
  /** Retorno contextual, quando a tela desce de uma listagem. */
  readonly back?: { readonly href: string; readonly label: string };
  /**
   * O título é acervo em pt-BR?
   *
   * Título de espetáculo, de oficina e de espaço são nome próprio registrado no
   * programa: não se traduzem, e por isso o `<h1>` declara o idioma em que
   * realmente está. Título de tela ("Programação", "Memória") é interface, vem
   * de `messages/`, e não leva marcação nenhuma.
   */
  readonly isArchiveTitle?: boolean;
  readonly children?: ReactNode;
}

/**
 * A abertura de uma tela interna.
 *
 * O `<h1>` mora aqui, uma vez por página: é o que dá a cada tela um título
 * único e o que um leitor de tela usa para saber onde chegou.
 */
export function PageHeader({
  title,
  description,
  kicker,
  back,
  children,
  isArchiveTitle = false,
}: PageHeaderProps) {
  return (
    <Container as="header" className="pt-8 pb-stack-md">
      {back !== undefined && <BackLink href={back.href}>{back.label}</BackLink>}

      {kicker !== undefined && (
        <Text variant="label-md" as="p" className="mt-4 text-secondary">
          {kicker}
        </Text>
      )}

      {isArchiveTitle ? (
        <ArchiveText as="h1" className={textClassName('display-md', 'mt-3 block text-foreground')}>
          {title}
        </ArchiveText>
      ) : (
        <Text variant="display-md" as="h1" className="mt-3 text-foreground">
          {title}
        </Text>
      )}

      {description !== undefined && (
        <Text variant="body-lg" className="mt-4 max-w-prose text-foreground-muted">
          {description}
        </Text>
      )}

      {children}
    </Container>
  );
}
