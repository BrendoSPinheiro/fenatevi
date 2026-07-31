type ClassValue = string | false | null | undefined;

/**
 * Junta classes CSS ignorando valores falsos.
 *
 * Deliberadamente mínimo: o projeto não tem variantes suficientes para
 * justificar `clsx`/`tailwind-merge`. Como não há mesclagem de conflitos, evite
 * passar duas classes que disputem a mesma propriedade.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
