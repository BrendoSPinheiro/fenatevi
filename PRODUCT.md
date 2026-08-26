# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primário: o público do festival em Vitória/ES.** Alguém decidindo o que
assistir — descobrir espetáculos, horários, locais e como chegar. Se essa pessoa
sai frustrada, o portal falhou; toda decisão de design empata a favor dela.

Audiências secundárias, reais mas subordinadas: artistas e classe teatral,
patrocinadores e imprensa, pesquisadores que consultam o acervo.

## Product Purpose

Site oficial do **FENATEVI — Festival Nacional de Teatro de Vitória**: divulgar a
edição vigente, apresentar programação, espetáculos, oficinas e espaços,
preservar a memória das edições anteriores e falar com patrocinadores, imprensa e
pesquisadores — em português, inglês e espanhol.

**Estágio atual — protótipo utilizável.** Esta primeira versão existe para ser
**apresentada à diretoria do evento**. É por isso que ela usa o acervo da edição
de 2024 como conteúdo: é dado real no lugar de dado ainda não publicado.
Aprovado o protótipo, o portal evolui para carregar as informações da edição de 2026.

Sucesso hoje = a diretoria consegue navegar o portal como se fosse o site do
festival e entender o que ele será. Sucesso depois = o público de Vitória
encontra o que assistir.

**A home é a peça de divulgação da edição vigente.** Ela deve ser fortemente
focada em apresentar e divulgar a edição atual — não em acervo, não em
institucional. O acervo aparece na home apenas como o conteúdo que preenche
provisoriamente o lugar da programação, e o portal diz que é isso que está
fazendo.

## Positioning

Festival público de teatro de Vitória/ES, de entrada franca, na 22ª edição
(13–21 de outubro de 2026), realizado desde 2004. O que o portal tem e um site
de festival genérico não teria: **acervo real e transcrito** de uma edição
inteira — 20 atividades de 2024, com ficha técnica, release, homenageados,
processos criativos e espaços, tal como o programa impresso os registra.

## Operating Context

- O festival acontece presencialmente em Vitória/ES, em teatros e casas de
  cultura do centro e dos bairros (Casa da Música Sônia Cabral, Teatro SESI
  Jardim da Penha, Teatro Universitário UFES, entre outros).
- A programação é publicada pela organização em bloco, perto do evento. Entre
  edições, o portal fica num estado de espera — e esse estado é a maior parte do
  ano.
- Boa parte do acervo vem de **programa impresso digitalizado**, não de um CMS.
- Realização: Associação Cultural, Circense e Ambiental Uma Floresta. Produção:
  Ratimbum Produções de Artes. Patrocínio: Prefeitura Municipal de Vitória.
  Contato e assessoria de imprensa estão em `src/content/contact.ts`.

## Capabilities and Constraints

- **Não é plataforma transacional.** Sem autenticação, banco, backend,
  formulários, pagamentos ou regras de negócio. O teto de transação é **um botão
  que leva para o Sympla** — link externo, nada acontece dentro do portal.
  _Em aberto:_ se o Sympla é retirada de ingresso gratuito ou venda, e em quais
  telas o botão aparece.
- **Entrada franca.** O festival é gratuito; o portal nunca vende ingresso.
- O conteúdo do festival é **tipado em `src/content/`**, versionado com o código.
  Não há CMS, e introduzir um é decisão de negócio ainda não tomada.
- `currentEdition.hasPublishedProgram` é o interruptor que rege o portal inteiro:
  enquanto for `false`, cada tela de programação mostra o acervo de 2024 e
  declara isso. Quando a programação de 2026 entrar, basta virar o campo.
- Nove telas em três idiomas: home, programação, grade diária, detalhe de
  espetáculo, detalhe de oficina, espaços, espaço, memória, edição e notícias.
- **Trilíngue (pt-BR/en/es)** com `pt-BR` sem prefixo na URL. Texto de acervo
  (título, release, ficha técnica, biografia) permanece em pt-BR marcado com
  `lang`, precedido de aviso traduzido; interface vem de `messages/`.
- Filtros vivem na URL e funcionam sem JavaScript.
- **A experiência precisa continuar completa sem animação e sem WebGL.**
- O "mapa cultural" é um esquema de posições relativas, não cartografia. Não há
  mapa geográfico e o portal declara isso.
- Domínio de produção ainda não contratado (`https://www.fenatevi.com.br` é
  marcador). Sem deploy, sem observabilidade, sem orçamento de performance
  definido — decisões em aberto.

## Brand Commitments

- Nome: **FENATEVI — Festival Nacional de Teatro de Vitória**. Nomes próprios do
  acervo (companhias, homenageados, "7ª Mostra Paralela Vera Viana") não se
  traduzem.
- Lema da associação realizadora: _"Basta uma semente"_. Lema da edição de 2024:
  _"A arte cura!"_ — a edição de 2026 ainda não tem lema.
- Princípio que decide empates, herdado do projeto: **imersão teatral sem
  sacrificar acessibilidade, usabilidade ou performance**.
- Existe design system incumbente, **Nocturne Stage** — escuro, editorial,
  Fraunces + Archivo — nascido do protótipo de alta fidelidade em
  `prototipo-fenatevi/`.

## Evidence on Hand

Real, no repositório:

- `src/content/activities.ts` — 20 atividades de 2024, transcritas do programa
  impresso sem alteração de grafia.
- `src/content/` — oficinas, espaços com endereços reais, homenageados,
  processos criativos, livros, parceiros, créditos da edição, contatos.
- `public/imagens/2024/` — capas extraídas do programa impresso, **baixa
  resolução (≤270px)**, marcadas com `isLowResolution`; nunca exibidas em
  largura de viewport.
- Depoimento real de Beth Caser (atriz, gestora e idealizadora), em
  `src/content/festival.ts`.

Ausências que o trabalho futuro **não pode preencher inventando**:

- **Notícias: a lista está vazia de propósito.** Manchete ou data fictícia num
  portal de festival é lida como informação verdadeira.
- Programação, lema, statement e imagem de capa de 2026 — não publicados.
- Edições de 2004 a 2023: acervo em digitalização; 2025 pendente.
- Sem depoimentos, números de público, métricas de alcance ou cases além do que
  está listado acima.

## Product Principles

1. **A ausência é conteúdo, não buraco.** Quando o dado não existe, o portal diz
   que não existe — nunca preenche com placeholder que parece informação.
2. **O público de Vitória decide os empates.** Encontrar o que assistir, quando e
   onde vence expressão, institucional e acervo.
3. **A home divulga a edição vigente.** É a tela de campanha do festival do ano.
4. **O acervo é dado real, tratado com respeito de acervo:** transcrito, marcado
   no idioma em que foi escrito, apresentado com sua proveniência e seus limites
   (inclusive a baixa resolução das imagens).
5. **Nada é pré-requisito para ler.** Animação, WebGL e JavaScript enriquecem; o
   conteúdo existe sem eles.

## Accessibility & Inclusion

WCAG 2.2 AA é portão de CI, junto com zero erros de hidratação. O festival
declara recursos de acessibilidade nas próprias atividades — audiodescrição,
Libras, acesso para cadeirante. `prefers-reduced-motion` é respeitado
nativamente. O controle "A11y" desenhado no protótipo (alto contraste, aumento
de texto, redução de movimento, Libras) **não existe no portal** e implementá-lo
é trabalho próprio, com decisão própria sobre persistência de preferência.
