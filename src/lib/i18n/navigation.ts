import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

/**
 * APIs de navegação cientes do idioma.
 *
 * Sempre importe `Link`, `useRouter`, `usePathname` e `redirect` daqui — nunca
 * de `next/link` ou `next/navigation` — para que o idioma atual seja preservado
 * automaticamente na navegação.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
