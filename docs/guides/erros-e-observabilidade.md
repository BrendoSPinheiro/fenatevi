# Tratamento de erros e observabilidade

Leia antes de: tratar falha, escrever log ou adicionar integração remota.

**Fato:** não há serviço de observabilidade, logging estruturado nem
monitoramento no projeto. O error boundary em `src/app/[locale]/error.tsx`
registra o erro com `console.error`, e a regra `no-console` permite apenas `warn`
e `error`.

## Regras

- Erro **esperado** (locale inválido, rota inexistente) é fluxo de interface:
  resolva com `notFound()` e a página `not-found.tsx`, sem lançar exceção.
- Erro **inesperado** sobe até o error boundary mais próximo, que oferece
  `reset()` e uma mensagem traduzida.
- A mensagem ao usuário nunca expõe stack trace, caminho de arquivo ou detalhe
  interno; ela diz o que aconteceu e o que fazer em seguida.
- O contexto de diagnóstico (mensagem original, `digest`) fica no log, não na
  tela.
- Nunca registre token, credencial, cookie ou dado pessoal.
- Se um fetch remoto entrar: defina timeout explícito, trate a falha de rede como
  estado de interface (não como tela branca), e só faça retry em operação
  idempotente, com backoff e limite de tentativas.
- Ao adotar um serviço de observabilidade, registre a decisão em um ADR e
  substitua o `console.error` do boundary por uma chamada única e centralizada —
  não espalhe o SDK pelos componentes.
