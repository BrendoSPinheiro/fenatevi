## Purpose

O portal é também o arquivo permanente do festival: a linha do tempo que apresenta cada
edição e o estado do seu acervo, e a página completa de uma edição encerrada — a de 2024
— com sua identidade, apresentação, homenageados, mostras, formação, processos criativos
e ficha técnica.

## ADDED Requirements

### Requirement: Linha do tempo das edições

O portal SHALL apresentar uma linha do tempo com as edições do festival, cada uma com
ano, número da edição, período, estado do acervo, uma descrição e uma indicação de
quanto do acervo está disponível.

O estado do acervo SHALL ser apresentado como texto e SHALL NOT ser comunicado apenas
por cor.

A indicação de completude SHALL ter equivalente textual para quem não a enxerga.

Edições ainda não digitalizadas SHALL ser apresentadas como um período agrupado, não
inventadas uma a uma.

#### Scenario: Estados distintos na mesma lista

- **WHEN** o visitante percorre a linha do tempo
- **THEN** distingue edição vigente, acervo completo, acervo pendente e em digitalização
- **AND** cada estado é legível como texto

#### Scenario: Indicador de completude com leitor de tela

- **WHEN** um leitor de tela alcança a indicação de completude de uma edição
- **THEN** o estado é anunciado como texto, e a barra não é anunciada como conteúdo

### Requirement: Destino de cada edição na linha do tempo

Cada edição na linha do tempo SHALL oferecer uma ação coerente com seu estado: acervo
completo leva à página da edição; edição vigente leva ao acompanhamento da edição; sem
acervo, a ação leva a informação sobre o acervo.

Nenhuma ação SHALL levar a uma página de edição que não existe.

#### Scenario: Edição com acervo completo

- **WHEN** o visitante aciona a edição de 2024
- **THEN** chega à página completa daquela edição

#### Scenario: Edição sem acervo

- **WHEN** o visitante aciona uma edição pendente
- **THEN** não chega a uma página de edição inexistente

### Requirement: Identidade de uma edição encerrada

A página de uma edição SHALL apresentar seu ano, seu número, seu período, sua condição
de entrada, seu mote, a capa do programa impresso e um resumo numérico da edição por
frente de programação.

Os números do resumo SHALL ser derivados do acervo.

A página SHALL declarar que a edição está encerrada e SHALL oferecer retorno à linha do
tempo.

#### Scenario: Resumo derivado

- **WHEN** o acervo registra treze espetáculos na mostra oficial
- **THEN** o resumo da edição informa treze

### Requirement: Apresentação e núcleos da edição

A página de uma edição SHALL apresentar o texto de apresentação assinado pela
organização, com atribuição de autoria, e a lista dos núcleos daquela edição com a
contagem de itens de cada um.

O texto de apresentação SHALL seguir a política de idioma do acervo histórico.

#### Scenario: Apresentação atribuída

- **WHEN** o visitante lê a apresentação da edição
- **THEN** vê quem a assina e em que papel

### Requirement: Homenageados da edição

A página de uma edição SHALL apresentar seus homenageados, cada um com retrato, nome,
papel no teatro e biografia.

O retrato SHALL ter texto alternativo que identifique a pessoa retratada.

Quando a edição não tiver homenageados registrados, a seção SHALL NOT ser exibida.

#### Scenario: Retrato com leitor de tela

- **WHEN** um leitor de tela alcança o retrato de um homenageado
- **THEN** anuncia de quem é o retrato

### Requirement: Mostras, formação e lançamentos da edição

A página de uma edição SHALL listar separadamente as atividades de cada mostra, com dia,
horário, título, companhia, cidade e espaço, cada uma como destino de navegação para seu
detalhe.

A página SHALL apresentar as ações formativas da edição, cada uma com datas, horário,
quem conduz, vagas e faixa etária, como destino de navegação para seu detalhe; e os
lançamentos de livros, com título, autoria, descrição e a sessão em que aconteceram.

#### Scenario: Mostras distinguidas

- **WHEN** o visitante percorre a página da edição de 2024
- **THEN** a Mostra Oficial e a 7ª Mostra Paralela Vera Viana aparecem como listas
  distintas e nomeadas

### Requirement: Processos criativos e ficha técnica da edição

A página de uma edição SHALL apresentar as demonstrações de trabalho por dia, com as
companhias e os espaços de cada uma, e a ficha técnica da edição como pares de função e
nome.

A ficha técnica SHALL preservar a grafia do programa impresso.

#### Scenario: Processos por dia

- **WHEN** um dia tem quatro demonstrações de trabalho
- **THEN** as quatro aparecem agrupadas naquele dia, cada uma com sua companhia e espaço
