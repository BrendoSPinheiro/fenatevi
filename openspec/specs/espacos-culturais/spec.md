# espacos-culturais Specification

## Purpose

Onde o festival acontece: o mapa cultural esquemático que distribui os espaços pela
cidade e a página de cada espaço, com sua identificação, endereço e a programação que
recebe.

## Requirements

### Requirement: Mapa cultural esquemático

O portal SHALL apresentar um mapa dos espaços do festival como **esquema**: uma
representação posicional dos espaços, sem base geográfica, sem tiles e sem biblioteca de
mapa.

O esquema SHALL expor uma descrição textual do que representa e quantos espaços contém.

Cada marcador SHALL ser um destino de navegação para a página do espaço, SHALL ter alvo
de toque de no mínimo 44 por 44 pixels, e SHALL ser alcançável e acionável pelo teclado.

O esquema SHALL NOT ser a única forma de alcançar um espaço.

#### Scenario: Navegação apenas pelo teclado

- **WHEN** o visitante percorre o mapa cultural apenas com o teclado
- **THEN** alcança cada marcador
- **AND** cada marcador anuncia o nome do espaço que representa

#### Scenario: Esquema não renderizado

- **WHEN** o esquema não é apresentado por qualquer motivo
- **THEN** a lista de espaços ao lado dele continua levando a todos os espaços

### Requirement: Lista de espaços

Ao lado do esquema, o portal SHALL listar todos os espaços do festival, cada um com
número, nome, endereço, tipo de espaço e quantidade de atividades que recebe.

Cada item SHALL ser um destino de navegação para a página do espaço.

A quantidade de atividades SHALL ser derivada do acervo.

#### Scenario: Contagem por espaço

- **WHEN** um espaço recebe cinco atividades na edição
- **THEN** a lista informa cinco atividades para aquele espaço

### Requirement: Página de um espaço

A página de um espaço SHALL apresentar seu nome, o espaço maior que o contém quando for
o caso, seu endereço, seu tipo e a quantidade de atividades que recebe.

A página SHALL oferecer navegação para a grade diária e para o mapa cultural.

Quando não houver fotografia do espaço no acervo, o lugar da imagem SHALL receber
tratamento gráfico neutro, sem afirmação endereçada ao visitante sobre a ausência do
material.

#### Scenario: Sala dentro de uma casa maior

- **WHEN** o visitante abre a página de uma sala contida em outro espaço
- **THEN** a página nomeia o espaço que a contém

#### Scenario: Espaço sem fotografia

- **WHEN** o acervo não tem fotografia do espaço
- **THEN** a área da imagem recebe tratamento neutro
- **AND** nenhuma imagem de outro espaço é usada no lugar

### Requirement: Programação de um espaço

A página de um espaço SHALL listar a programação que ele recebe, agrupada por dia, em
ordem cronológica, com horário, título, companhia e frente de programação de cada
atividade.

Cada atividade SHALL ser um destino de navegação para seu detalhe.

Quando o espaço não receber atividade alguma na edição, a página SHALL declarar isso
explicitamente.

#### Scenario: Espaço com programação em vários dias

- **WHEN** um espaço recebe atividades em três dias distintos
- **THEN** a página apresenta três grupos, um por dia, em ordem crescente

#### Scenario: Espaço sem atividades na edição

- **WHEN** um espaço não recebe atividade na edição exibida
- **THEN** a página declara que ele não recebe atividades nesta edição
