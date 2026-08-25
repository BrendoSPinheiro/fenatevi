# noticias Specification

## Purpose

A área editorial que a organização usa durante os dias de festival — alterações de
programação, bastidores, registros do dia e chamadas — e o estado honesto que ela
apresenta enquanto nada foi publicado.

## Requirements

### Requirement: Área editorial de notícias

O portal SHALL oferecer uma área de notícias que apresenta as publicações da organização
em ordem cronológica decrescente.

Cada notícia SHALL ser capaz de apresentar categoria, título, data de publicação, imagem
e corpo de texto; os campos ausentes em uma publicação SHALL ser omitidos sem quebrar a
apresentação.

A área SHALL descrever, para o visitante, que tipo de publicação ela recebe.

#### Scenario: Notícia sem imagem

- **WHEN** uma publicação não tem imagem
- **THEN** ela é apresentada sem espaço de imagem vazio
- **AND** os demais campos permanecem legíveis

### Requirement: Estado de conteúdo ainda indisponível

Enquanto nenhuma notícia da edição vigente tiver sido publicada, a área SHALL exibir um
estado de conteúdo ainda indisponível que declara, em texto traduzido, que ainda não há
publicações.

O estado SHALL NOT apresentar manchete, data ou corpo de texto fictícios, e SHALL NOT
ser uma página em branco nem um carregamento permanente.

Quando a primeira notícia for publicada, a área SHALL passar a listá-la **sem alteração
de código**.

#### Scenario: Nenhuma publicação

- **WHEN** o visitante abre a área de notícias e nada foi publicado
- **THEN** vê a declaração de que ainda não há publicações
- **AND** nenhuma manchete inventada é exibida

#### Scenario: Primeira publicação

- **WHEN** a primeira notícia entra no acervo
- **THEN** a área passa a listá-la
- **AND** o estado de conteúdo indisponível deixa de aparecer

### Requirement: Notícias nos três idiomas

Os rótulos, categorias e o estado vazio da área SHALL estar traduzidos nos três idiomas.

O corpo de uma notícia publicada SHALL seguir a política de idioma do acervo: servido no
idioma em que a organização o publicou, com o idioma declarado quando divergir do idioma
da página.

#### Scenario: Estado vazio em espanhol

- **WHEN** o visitante abre a área de notícias em `/es` sem publicações
- **THEN** a declaração de ausência aparece em espanhol
