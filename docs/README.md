# Documentação técnica

| Documento                                        | Para quê                                                     |
| ------------------------------------------------ | ------------------------------------------------------------ |
| [`architecture.md`](./architecture.md)           | Arquitetura em detalhe: decisões e justificativas            |
| [`riscos-conhecidos.md`](./riscos-conhecidos.md) | Inconsistências e pontos em aberto, registrados de propósito |
| [`adr/`](./adr/)                                 | Decisões arquiteturais datadas (ADRs)                        |

## Guias operacionais (`guides/`)

Regras aplicáveis a mudanças de código. Indexados por
[`CLAUDE.md`](../CLAUDE.md) / [`AGENTS.md`](../AGENTS.md), que os agentes leem sob
demanda.

| Guia                                                                  | Leia antes de                                        |
| --------------------------------------------------------------------- | ---------------------------------------------------- |
| [`arquitetura-e-convencoes.md`](./guides/arquitetura-e-convencoes.md) | criar arquivo, mover código, criar abstração         |
| [`nextjs-e-react.md`](./guides/nextjs-e-react.md)                     | rotas, `'use client'`, dados, hidratação, metadata   |
| [`typescript.md`](./guides/typescript.md)                             | declarar tipos, lidar com dado externo               |
| [`estilos-e-design-tokens.md`](./guides/estilos-e-design-tokens.md)   | escrever classes, criar componente visual            |
| [`i18n.md`](./guides/i18n.md)                                         | qualquer texto visível, rota nova, idioma            |
| [`animacao-e-webgl.md`](./guides/animacao-e-webgl.md)                 | animar, mexer no scroll, tocar na cena 3D            |
| [`acessibilidade.md`](./guides/acessibilidade.md)                     | elemento interativo, foco, ARIA, semântica           |
| [`seguranca-e-configuracao.md`](./guides/seguranca-e-configuracao.md) | entrada externa, variável de ambiente, HTML dinâmico |
| [`performance.md`](./guides/performance.md)                           | biblioteca no caminho crítico, imagem, lista longa   |
| [`testes.md`](./guides/testes.md)                                     | escrever teste, decidir o que cobrir                 |
| [`erros-e-observabilidade.md`](./guides/erros-e-observabilidade.md)   | tratar falha, escrever log, integração remota        |
| [`dependencias-e-mudancas.md`](./guides/dependencias-e-mudancas.md)   | instalar pacote, atualizar versão, mexer no Git      |
