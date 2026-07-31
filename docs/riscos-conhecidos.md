# Riscos e inconsistências conhecidos

Registrados para transparência. **Não os corrija espontaneamente** — este
documento é descritivo; cada item vira tarefa quando for pedido.

1. **Tipos de domínio ainda sem uso.** `Venue`, `Show`, `TimelineItem` e
   `AccessibilityFeature` existem em `src/types/festival.ts` mas nenhum é
   importado hoje (só `IsoDate`, `AccessibilityFeatureId` e `FestivalEdition`
   são). Eles antecipam domínios futuros, o que fica em tensão com a regra de não
   preparar o futuro. Ao implementar programação ou linha do tempo, valide-os
   contra a necessidade real em vez de assumi-los corretos.
2. **Chaves de tradução sem consumidor:** `header.navigationLabel`,
   `header.about`, `common.festivalFullName` e `metadata.localeLabel` existem nos
   três arquivos de `messages/` e não são usadas.
3. **Ids de âncora em português fixo** (`conteudo-principal`, `sobre`) valem para
   os três idiomas. É consistente e testável, mas ao criar rotas traduzidas
   decida conscientemente se os ids acompanham o idioma.
4. **`cn` não resolve conflitos de Tailwind** — sobrescrever classe por prop pode
   não ter o efeito esperado. Ver
   [`guides/estilos-e-design-tokens.md`](./guides/estilos-e-design-tokens.md).
5. **`metadataBase` não está definido**; defina-o antes de publicar, junto com
   Open Graph e, se aplicável, `sitemap`/`robots`.
6. **Sem deploy, sem observabilidade e sem orçamento de performance** — decisões
   ainda abertas.
