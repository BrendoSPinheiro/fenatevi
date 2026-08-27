import createNextIntlPlugin from 'next-intl/plugin';

import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Erros de tipo devem quebrar o build (o lint roda como passo próprio no CI).
  typescript: { ignoreBuildErrors: false },
  /*
   * Fotografias de **prévia** da linha do tempo da memória, no Unsplash.
   *
   * Autorizado explicitamente pelo mantenedor. Sai junto com
   * `src/content/mock/timeline-preview.ts` no dia em que o acervo real de 2005
   * a 2023 for digitalizado — é o passo 4 do plano de deleção em
   * `openspec/changes/redesenhar-linha-do-tempo-da-memoria/design.md`.
   *
   * Consequência aceita: `src/content/images.test.ts` garante que toda imagem
   * referenciada existe em `public/`, e essas URLs remotas ficam fora dessa
   * garantia.
   */
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }],
  },
  turbopack: {
    // Fixa a raiz do projeto: sem isso o Turbopack pode inferir um diretório
    // ancestral quando existem outros lockfiles acima na árvore.
    root: import.meta.dirname,
  },
};

export default withNextIntl(nextConfig);
