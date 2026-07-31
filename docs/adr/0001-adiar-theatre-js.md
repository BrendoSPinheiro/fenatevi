# ADR 0001 — Adiar a adoção do Theatre.js

- **Status:** aceito
- **Data:** 2026-07-29
- **Contexto:** bootstrap técnico do frontend

## Contexto

O FENATEVI pretende ter uma abertura cinematográfica — cortinas, holofotes,
iluminação de palco — possivelmente dirigida por sequências 3D. O
[Theatre.js](https://www.theatrejs.com/) é a ferramenta mais óbvia para esse tipo
de direção: permite editar timelines visualmente pelo Studio e exportar o estado
como JSON versionável, integrando-se ao React Three Fiber via
`@theatre/r3f`.

A pergunta do bootstrap era: instalar agora para "deixar pronto"?

## Decisão

**Não instalar o Theatre.js neste momento.**

## Justificativa

1. **Não há uso concreto.** O bootstrap contém uma prova técnica 3D — um sólido
   girando lentamente — que não precisa de direção de timeline. Instalar a
   biblioteca agora criaria exatamente o tipo de dependência não utilizada que
   este projeto se comprometeu a evitar.
2. **A sequência ainda não foi desenhada.** Sem roteiro de abertura definido, não
   há como saber se a direção será feita por timeline visual (Theatre.js), por
   `ScrollTrigger` do GSAP, ou por uma combinação. Escolher a ferramenta antes do
   problema inverte a ordem.
3. **Compatibilidade a reavaliar.** A stack usa React 19, Next.js 16 e React
   Three Fiber 9. A integração `@theatre/r3f` precisa ser verificada contra essas
   versões no momento da adoção, não meses antes.
4. **O custo de adiar é baixo.** O Theatre.js entra em um ponto isolado da
   árvore (a cena 3D), sem exigir mudanças na arquitetura. Adotá-lo depois não
   implica retrabalho.

## Consequências

- A cena atual usa React Three Fiber puro, com animação por `useFrame`.
- A decisão será reavaliada **quando a implementação da abertura teatral
  começar**.
- Se o Theatre.js for adotado, valem as seguintes restrições:
  - o **Studio** só pode ser inicializado em desenvolvimento;
  - o Studio **não pode** entrar no bundle de produção — a inicialização deve ser
    dinâmica e condicional;
  - o restante da aplicação não pode depender do Studio para funcionar;
  - o estado exportado (JSON) deve ser versionado no repositório;
  - a cena precisa continuar respeitando `prefers-reduced-motion` e mantendo
    fallback sem WebGL.

## Alternativas consideradas

| Alternativa                                  | Por que não agora                                                       |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| Instalar o Theatre.js e deixar inativo       | Dependência sem uso, com custo de manutenção e de auditoria             |
| Adotar apenas GSAP + ScrollTrigger para tudo | Continua sendo uma opção real; a decisão depende do roteiro da abertura |
| Escrever uma camada própria de timeline      | Reinventaria uma ferramenta madura sem necessidade demonstrada          |
