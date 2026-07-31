import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Erros de tipo devem quebrar o build (o lint roda como passo próprio no CI).
  typescript: { ignoreBuildErrors: false },
  turbopack: {
    // Fixa a raiz do projeto: sem isso o Turbopack pode inferir um diretório
    // ancestral quando existem outros lockfiles acima na árvore.
    root: import.meta.dirname,
  },
};

export default withNextIntl(nextConfig);
