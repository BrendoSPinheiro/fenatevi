# programacao Specification

## Purpose

As duas formas de consultar a programação do festival: a listagem filtrável por momento,
dia, frente e espaço, agrupada por dia; e a grade diária, que cruza dia, horário e
espaço em três leituras — por espaço, por horário e a semana inteira.

## Requirements

### Requirement: Listagem completa da programação

A programação SHALL listar todas as atividades da edição exibida — espetáculos,
oficinas, lançamentos e processos criativos — agrupadas por dia, em ordem cronológica
dentro de cada dia.

Cada grupo SHALL declarar o número do dia, o dia da semana e quantas atividades contém.

Cada atividade SHALL informar horário, situação, título, companhia, espaço, frente de
programação e seus marcadores, e SHALL ser um destino de navegação para seu detalhe.

Atividades cujo horário não é um relógio — processos criativos, que acontecem após a
sessão — SHALL declarar isso textualmente e SHALL ser ordenadas ao fim do dia.

#### Scenario: Ordenação dentro do dia

- **WHEN** um dia tem atividades às 14h, às 19h30 e um processo criativo após a sessão
- **THEN** aparecem nessa ordem
- **AND** o processo criativo declara que acontece após a sessão

### Requirement: Filtros na URL

A programação SHALL ser filtrável por momento (agora, hoje, amanhã, todos os dias), por
dia específico da edição, por frente de programação e por espaço cultural.

O estado dos filtros SHALL residir na URL. Duas visitas à mesma URL SHALL produzir o
mesmo conjunto de resultados, na mesma ordem.

Os filtros SHALL funcionar sem JavaScript: cada controle de filtro SHALL ser um destino
de navegação.

Um valor de filtro desconhecido na URL SHALL ser ignorado, e a página SHALL responder
normalmente com os filtros válidos restantes.

#### Scenario: Link profundo com filtros

- **WHEN** o visitante abre uma URL de programação com dia e frente definidos
- **THEN** os dois filtros aparecem selecionados
- **AND** os resultados correspondem a eles

#### Scenario: Compartilhamento de resultado

- **WHEN** o visitante aplica filtros e copia a URL
- **THEN** outra pessoa que abra essa URL vê o mesmo resultado

#### Scenario: Filtro inválido

- **WHEN** a URL traz um espaço que não existe no acervo
- **THEN** a página responde normalmente
- **AND** o filtro de espaço é tratado como não aplicado

#### Scenario: Filtragem sem JavaScript

- **WHEN** o visitante aciona um filtro com o JavaScript desabilitado
- **THEN** chega à programação filtrada

### Requirement: Contagem e limpeza de filtros

A programação SHALL declarar quantas atividades o conjunto de filtros corrente retornou,
e SHALL oferecer um retorno ao estado sem filtros.

O estado de cada filtro SHALL ser perceptível por mais de um recurso além da cor, e SHALL
ser exposto programaticamente como pressionado ou não pressionado.

#### Scenario: Contagem visível

- **WHEN** os filtros correntes retornam sete atividades
- **THEN** a página declara textualmente que foram encontradas sete atividades

#### Scenario: Estado anunciado

- **WHEN** um leitor de tela alcança um filtro selecionado
- **THEN** anuncia que ele está pressionado

### Requirement: Resultado vazio da programação

Quando nenhuma atividade satisfizer os filtros correntes, a programação SHALL exibir um
estado vazio que declara a ausência, sugere o que fazer e oferece a limpeza dos filtros.

O estado vazio SHALL NOT ser uma lista em branco nem um indicador de carregamento
permanente.

#### Scenario: Combinação sem resultados

- **WHEN** o visitante combina um dia e um espaço sem atividades em comum
- **THEN** vê a declaração de que nada está em cena com esses filtros
- **AND** pode limpar os filtros em um único acionamento

### Requirement: Grade diária em três visões

A grade SHALL oferecer três leituras da programação: por espaço, por horário e a semana
inteira.

Nas visões por espaço e por horário, a grade SHALL operar sobre um único dia,
selecionável entre os dias da edição, e SHALL declarar qual dia está sendo mostrado.

A visão da semana SHALL cruzar todos os dias da edição com todos os espaços.

A visão corrente e o dia corrente SHALL residir na URL.

#### Scenario: Troca de visão

- **WHEN** o visitante alterna da visão por espaço para a visão por horário
- **THEN** o mesmo dia permanece selecionado
- **AND** a URL reflete a nova visão

#### Scenario: Seleção de dia

- **WHEN** o visitante seleciona outro dia na visão por espaço
- **THEN** a grade passa a mostrar aquele dia
- **AND** a URL reflete o dia

### Requirement: Espaço sem programação no dia

Na visão por espaço, todo espaço do festival SHALL aparecer, inclusive os que não têm
atividade no dia selecionado.

Um espaço sem atividade no dia SHALL declarar essa ausência textualmente.

#### Scenario: Dia sem atividade em um espaço

- **WHEN** um espaço não recebe atividade no dia selecionado
- **THEN** aparece na grade
- **AND** declara que não há programação naquele dia

### Requirement: Semana inteira sem rolagem horizontal do documento

A visão da semana SHALL apresentar uma matriz de espaços por dias.

Quando a matriz for mais larga que a viewport, a rolagem horizontal SHALL acontecer
dentro do próprio container, nunca no documento, e SHALL ser alcançável pelo teclado.

O portal SHALL informar ao visitante, antes da matriz, que em telas estreitas ele pode
rolar horizontalmente ou usar as visões por dia.

#### Scenario: Semana em tela estreita

- **WHEN** a visão da semana é aberta em 375 pixels de largura
- **THEN** o documento não rola horizontalmente
- **AND** a matriz rola dentro de seu próprio container

#### Scenario: Rolagem pelo teclado

- **WHEN** o visitante navega pela matriz apenas com o teclado
- **THEN** o container rola para trazer o elemento focado à vista

### Requirement: Comportamento mobile da programação

Em telas estreitas, a programação SHALL manter visível uma barra com a atividade em cena
no momento, SHALL apresentar os dias em rolagem horizontal dentro de seu container, e
SHALL agrupar os demais filtros em um painel acionável a partir de um controle
persistente.

O painel de filtros SHALL prender o foco enquanto aberto, SHALL ser fechável por
`Escape` e SHALL devolver o foco ao controle que o abriu.

#### Scenario: Filtros em tela estreita

- **WHEN** o visitante abre o painel de filtros em uma viewport estreita e pressiona
  `Escape`
- **THEN** o painel fecha
- **AND** o foco retorna ao controle que o abriu
