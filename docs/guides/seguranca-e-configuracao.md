# Segurança e configuração

Leia antes de: introduzir entrada externa, variável de ambiente, HTML dinâmico ou
integração de terceiros.

O projeto tem superfície pequena — site estático, sem autenticação, sem banco,
sem entrada de usuário — e a regra principal é **mantê-la pequena**.

## Segurança

- **Nenhum segredo no repositório.** `.env*` está no `.gitignore`.
- O prefixo `NEXT_PUBLIC_` **expõe o valor no bundle do navegador**. Use-o apenas
  para valores realmente públicos, nunca para chaves, tokens ou credenciais.
- Segredo é lido apenas em código de servidor (Server Component, Route Handler,
  `proxy.ts`) e **nunca** importado por um módulo `'use client'`.
- Todo dado que vem da URL é entrada externa: valide antes de usar — é o que o
  layout faz com `hasLocale` + `notFound()`.
- **Não use `dangerouslySetInnerHTML`.** Se conteúdo rico (CMS) exigir HTML,
  sanitize no servidor com uma allowlist e registre a decisão em um ADR.
- Redirecionamentos só para destinos internos conhecidos; nunca monte um redirect
  a partir de valor de query string sem validar contra uma lista.
- Links externos com `target="_blank"` levam `rel="noopener noreferrer"`.
- Não registre em log token, credencial, cookie ou dado pessoal.
- Se autorização vier a existir, ela é decidida **no servidor**. Esconder um
  elemento na interface não é controle de acesso.
- `poweredByHeader: false` já está ativo. Ao configurar deploy, defina cabeçalhos
  de segurança (CSP, `Referrer-Policy`, `X-Content-Type-Options`) — atenção: uma
  CSP restritiva precisa considerar Three.js/WebGL e os estilos inline do
  Next.js.
- Rode `pnpm audit` antes de adicionar dependência nova e ao revisar alertas.

## Variáveis de ambiente

**Fato:** a aplicação **não usa nenhuma variável de ambiente**. A única leitura de
`process.env` no repositório é `process.env.CI` no `playwright.config.ts`. Não
existem `.env`, `.env.example` nem módulo de validação de env.

Quando a primeira variável for necessária:

1. Nome em `SCREAMING_SNAKE_CASE`; prefixo `NEXT_PUBLIC_` **somente** para
   valores públicos.
2. Nunca hardcode um valor secreto no código, nem o versione.
3. Crie um `.env.example` com **chaves e valores vazios ou fictícios**, e
   documente cada variável no README (para que serve, quem a define, se é
   obrigatória).
4. Valide as variáveis em um único módulo, no startup, falhando cedo e com
   mensagem clara — não espalhe `process.env` pelo código nem confie em `!` ou em
   fallback silencioso.
5. Atualize `.env.example`, README e os guias no mesmo commit.

Configuração que não é segredo (idiomas, tokens visuais, dados do festival) fica
no código, versionada: `src/lib/i18n/routing.ts`, `src/styles/globals.css`,
`src/content/`.
