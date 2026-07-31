import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
    ],
  },

  // Regras recomendadas do Next.js: Core Web Vitals, React, React Hooks e jsx-a11y.
  ...nextCoreWebVitals,
  // Regras recomendadas do typescript-eslint aplicadas aos arquivos .ts/.tsx.
  ...nextTypescript,

  {
    rules: {
      // Variáveis intencionalmente não usadas devem ser prefixadas com "_".
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // `any` esconde problemas reais: prefira `unknown` e refine o tipo.
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // Testes e scripts de apoio podem escrever no console.
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'e2e/**/*.ts', 'src/test/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // Deve permanecer por último: desativa regras estilísticas que conflitam com o Prettier.
  eslintConfigPrettier,
];

export default config;
