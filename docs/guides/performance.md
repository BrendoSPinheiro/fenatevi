# Performance

Leia antes de: adicionar biblioteca ao caminho crítico, provider global, imagem
ou lista longa.

- Server Components por padrão; Client Components pequenos e nas folhas.
- Um único provider global hoje, que não renderiza DOM. Não adicione outro sem
  necessidade real.
- Renderização estática das três variantes de idioma no build.
- Bibliotecas pesadas fora do caminho crítico: Three.js entra por `next/dynamic`
  com `ssr: false`; GSAP nunca é avaliado no servidor.
- Animação pausada quando o elemento está fora da viewport (`useInViewport` +
  `frameloop="demand"`).
- `next/image` para imagens relevantes; reserve altura para evitar layout shift.
- Sem vídeo com autoplay, sem imagem remota desnecessária.
- Zero erros de hidratação — ver [`nextjs-e-react.md`](./nextjs-e-react.md).
- Listas longas (programação, memória de edições): pagine ou segmente por dia/ano
  antes de considerar virtualização.
- **Meça antes de otimizar.** Web Vitals — LCP, INP, CLS — são os alvos; o
  julgamento é "isto melhora um número observado?", não "isto parece mais
  rápido". Não introduza memoização, `dynamic` ou cache sem problema
  identificado. Ainda não há orçamento de performance configurado no CI.
