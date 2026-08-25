# home-do-portal Specification

## Purpose

A home é a narrativa do festival em atos: abre com a identidade da edição, mostra o que
está em cena neste instante, apresenta o que está em cartaz, distribui os dias, destaca
uma capa editorial, enumera as frentes, mostra a cidade como palco, convida à memória e
credita quem realiza.

## Requirements

### Requirement: Abertura da edição vigente

A home SHALL abrir com uma seção que apresenta o número da edição, o ano, o nome do
festival, sua assinatura, as datas e a cidade, sobre um registro fotográfico de palco.

A seção SHALL oferecer dois destinos: a programação e a página da edição.

Todo o texto da abertura SHALL manter contraste mínimo de 4,5:1 sobre a imagem em
qualquer viewport, garantido por camadas de escurecimento e não por sorte de
enquadramento.

A abertura SHALL permanecer completa e legível se a imagem de fundo não carregar.

#### Scenario: Imagem de fundo indisponível

- **WHEN** a fotografia de palco não carrega
- **THEN** o texto da abertura permanece legível sobre a superfície escura
- **AND** nenhuma informação da edição se perde

#### Scenario: Viewport estreita

- **WHEN** a home é aberta em 375 pixels de largura
- **THEN** o título, as datas, o local e os dois destinos permanecem visíveis e
  acionáveis sem rolagem horizontal

### Requirement: O que está em cena agora

A home SHALL apresentar uma seção que informa quais atividades estão acontecendo no
instante da consulta, derivada do horário de início e da duração de cada atividade no
fuso do festival.

Cada atividade em cena SHALL informar seu horário previsto de término, sua companhia,
seu espaço e seus marcadores, e SHALL oferecer navegação para seu detalhe.

Quando nenhuma atividade estiver em cena, a seção SHALL exibir um estado vazio explícito
e passar a destacar a próxima sessão.

Quando não houver próxima sessão porque a edição terminou, a seção SHALL exibir o estado
de edição encerrada e convidar ao acervo daquela edição.

O estado exibido SHALL ser consistente entre o que o servidor renderiza e o que o
visitante vê após a hidratação: o portal SHALL NOT produzir divergência de hidratação ao
introduzir o relógio.

#### Scenario: Consulta durante uma sessão

- **WHEN** o visitante abre a home enquanto uma atividade está em curso
- **THEN** a atividade aparece como em cena agora
- **AND** informa o horário em que termina

#### Scenario: Consulta fora de qualquer sessão, dentro da edição

- **WHEN** o visitante abre a home em um horário sem atividade em curso, durante a
  edição
- **THEN** a seção declara que nada está em cena
- **AND** apresenta a próxima sessão do dia

#### Scenario: Consulta após o fim da edição

- **WHEN** o visitante abre a home depois do último dia da edição exibida
- **THEN** a seção declara que a edição chegou ao fim
- **AND** oferece navegação para o acervo daquela edição

#### Scenario: Sem divergência de hidratação

- **WHEN** a home é carregada em qualquer horário
- **THEN** o console não registra erro de hidratação

### Requirement: A seguir

A home SHALL listar as próximas atividades a começar, priorizando as do dia corrente e
recorrendo aos próximos dias quando o dia corrente já se esgotou.

Cada item SHALL informar horário, quando acontece, título, espaço e frente de
programação, e SHALL ser um destino de navegação para o detalhe da atividade.

O título da seção SHALL declarar qual dos dois casos está sendo mostrado.

#### Scenario: Dia corrente ainda com sessões

- **WHEN** restam sessões no dia corrente
- **THEN** a lista mostra apenas sessões de hoje
- **AND** o título indica que se trata de hoje

#### Scenario: Dia corrente esgotado

- **WHEN** não restam sessões no dia corrente
- **THEN** a lista mostra as próximas sessões dos dias seguintes
- **AND** cada item informa em que dia acontece

### Requirement: Programação em destaque

A home SHALL apresentar uma seleção da programação composta por um destaque principal em
formato ampliado e cartões secundários.

O destaque principal SHALL informar dia, horário, espaço, título, companhia,
classificação indicativa e os recursos de acessibilidade da sessão.

Cada cartão SHALL informar dia, horário, cidade de origem, título e espaço, e SHALL
declarar a gratuidade da entrada.

A seção SHALL encerrar com navegação para a programação completa e para a grade diária.

#### Scenario: Destaque com acessibilidade

- **WHEN** a atividade em destaque oferece Libras e audiodescrição
- **THEN** os dois recursos aparecem no destaque
- **AND** são apresentados como texto, não apenas por ícone

### Requirement: Os dias da edição

A home SHALL apresentar cada dia da edição como um destino, informando o dia da semana,
o número do dia, o mês, quantas atividades acontecem e em quais espaços.

O dia corrente SHALL ser distinguido por mais de um recurso visual, não apenas por cor.

Acionar um dia SHALL levar à programação já filtrada por aquele dia.

#### Scenario: Escolha de um dia

- **WHEN** o visitante aciona o dia 17
- **THEN** chega à programação filtrada pelo dia 17
- **AND** o filtro está refletido na URL

### Requirement: Capa editorial

A home SHALL apresentar uma seção editorial dedicada a uma única atividade, com seu
título, companhia, cidade, release, data, horário, espaço, duração, classificação e
imagem, e navegação para o detalhe.

A imagem SHALL ser tratada como registro, com texto alternativo descritivo.

#### Scenario: Leitura em espanhol

- **WHEN** a capa editorial é lida em `/es`
- **THEN** os rótulos de data, local e duração aparecem em espanhol
- **AND** o release aparece em português com o idioma declarado

### Requirement: Frentes de programação

A home SHALL enumerar as frentes de programação da edição — mostra oficial, mostra
paralela, oficinas, processos criativos, lançamentos e homenageados — cada uma com
número, nome, descrição e a contagem real de itens que contém.

As contagens SHALL ser derivadas do acervo, nunca escritas manualmente.

Acionar uma frente SHALL levar à programação filtrada por ela, exceto homenageados, que
SHALL levar à página da edição.

#### Scenario: Contagem derivada

- **WHEN** uma atividade é adicionada ao acervo em uma frente
- **THEN** a contagem daquela frente na home aumenta sem alteração de código

### Requirement: A cidade como palco

A home SHALL apresentar uma prévia do mapa cultural com os espaços do festival e
navegação para o mapa completo, ao lado de uma seleção de espaços com número, tipo,
nome, endereço e quantidade de atividades.

A prévia do mapa SHALL ter descrição textual equivalente para quem não a enxerga.

#### Scenario: Prévia do mapa com leitor de tela

- **WHEN** um leitor de tela alcança a prévia do mapa
- **THEN** anuncia uma descrição do que a prévia representa e quantos espaços contém

### Requirement: Convite à memória

A home SHALL apresentar uma seção de memória com uma síntese das edições e uma amostra
delas, cada uma com ano, edição, descrição e estado de acervo, além de navegação para a
linha do tempo e para a edição mais recente com acervo completo.

O estado de acervo SHALL ser apresentado como texto.

#### Scenario: Amostra de edições

- **WHEN** o visitante alcança a seção de memória
- **THEN** vê a edição vigente, as pendentes e a edição com acervo completo
- **AND** cada uma declara textualmente seu estado

### Requirement: Notícias e realizadores na home

A home SHALL apresentar uma chamada para a área de notícias e uma seção de realização e
parceiros com o papel e o nome de cada organização envolvida.

Quando não houver notícia publicada, a chamada SHALL exibir o estado de conteúdo ainda
indisponível, sem inventar manchete.

#### Scenario: Sem notícias publicadas

- **WHEN** nenhuma notícia foi publicada
- **THEN** a chamada declara que ainda não há publicações
- **AND** nenhum título fictício é exibido

### Requirement: Sequência de atos legível sem animação

As seções da home SHALL entrar em cena com uma revelação suave conforme o visitante
rola.

Todo o conteúdo da home SHALL estar presente, visível e acionável mesmo que a animação
de revelação nunca execute — por movimento reduzido, por falha de JavaScript ou por
ausência de suporte.

Nenhuma seção SHALL começar oculta de um modo que dependa de JavaScript para ser
revelada.

#### Scenario: JavaScript desabilitado

- **WHEN** a home é carregada sem JavaScript
- **THEN** todas as seções estão visíveis
- **AND** todos os destinos de navegação funcionam

#### Scenario: Movimento reduzido

- **WHEN** o visitante tem movimento reduzido ativado
- **THEN** as seções aparecem já em seu estado final, sem deslocamento
