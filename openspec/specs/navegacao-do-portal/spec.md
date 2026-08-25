# navegacao-do-portal Specification

## Purpose

A moldura permanente do portal: as rotas nos três idiomas, o cabeçalho que se condensa
na rolagem, o menu de áreas em tela cheia, o rodapé institucional, o retorno contextual
de cada tela interna e a cortina que marca a passagem entre páginas sem nunca atrasar a
chegada a elas.

## Requirements

### Requirement: Rotas do portal nos três idiomas

O portal SHALL oferecer as rotas: home, programação, grade diária, detalhe de
espetáculo, detalhe de oficina, mapa cultural, espaço cultural, linha do tempo, página
de edição e notícias.

Cada rota SHALL existir nos três idiomas, com pt-BR sem prefixo e `en`/`es` prefixados,
mantendo a estratégia `as-needed` já em vigor. Os segmentos de caminho SHALL ser os
mesmos em todos os idiomas.

Cada rota SHALL declarar título e descrição próprios, traduzidos, e SHALL declarar suas
alternativas de idioma.

Uma rota de detalhe cujo identificador não exista no acervo SHALL responder como não
encontrada.

#### Scenario: Troca de idioma em uma tela interna

- **WHEN** o visitante está em `/espetaculos/corpo16` e troca para espanhol
- **THEN** chega em `/es/espetaculos/corpo16`
- **AND** permanece no mesmo espetáculo

#### Scenario: Identificador inexistente

- **WHEN** o visitante acessa um espetáculo cujo identificador não está no acervo
- **THEN** recebe a página de conteúdo não encontrado no idioma corrente

#### Scenario: Título da aba por rota

- **WHEN** o visitante abre a grade diária em inglês
- **THEN** o título do documento descreve a grade diária em inglês, não a home

### Requirement: Cabeçalho persistente

O cabeçalho SHALL estar presente em todas as rotas e SHALL conter: a marca do festival
como retorno à home, a navegação principal para programação, festival, linha do tempo e
notícias, o seletor de idioma e o acesso ao menu de áreas.

O cabeçalho SHALL começar sobre o conteúdo sem fundo próprio e SHALL adquirir fundo
opaco com desfoque e borda inferior depois que o visitante rolar para além do início da
página, revertendo ao voltar ao topo.

A transição do cabeçalho SHALL ser puramente visual: nenhum item de navegação muda de
posição, de rótulo ou de disponibilidade em função da rolagem.

Sob `prefers-reduced-motion: reduce`, o cabeçalho SHALL alternar entre os dois estados
sem transição.

#### Scenario: Rolagem a partir do topo

- **WHEN** o visitante rola a home para além do início
- **THEN** o cabeçalho ganha fundo opaco e desfoque
- **AND** todos os itens de navegação continuam nas mesmas posições

#### Scenario: Navegação sem JavaScript

- **WHEN** o JavaScript não executa
- **THEN** o cabeçalho permanece visível e todos os seus destinos permanecem acessíveis

### Requirement: Menu de áreas em tela cheia

O acesso ao menu SHALL abrir um diálogo em tela cheia listando as áreas do portal, cada
uma com número, nome e uma frase que descreve o que ela contém.

Enquanto aberto, o diálogo SHALL receber o foco, SHALL manter o foco preso em seu
interior, SHALL ser fechável por `Escape` e pelo controle de fechar, e SHALL devolver o
foco ao controle que o abriu.

O menu SHALL listar apenas áreas que existem. Uma área anunciada SHALL levar a uma tela
real.

#### Scenario: Abertura e fechamento pelo teclado

- **WHEN** o visitante aciona o menu pelo teclado e pressiona `Escape`
- **THEN** o diálogo fecha
- **AND** o foco retorna ao controle de menu

#### Scenario: Tabulação dentro do diálogo

- **WHEN** o diálogo está aberto e o visitante tabula até o último item
- **THEN** o foco seguinte volta ao primeiro elemento focável do diálogo
- **AND** nunca alcança o conteúdo por trás

### Requirement: Rodapé institucional

O rodapé SHALL estar presente em todas as rotas e SHALL apresentar a identificação do
festival, a navegação secundária para as áreas do portal, os contatos publicados pela
organização e a identificação de quem realiza e produz o festival.

Endereços de e-mail e telefones SHALL ser acionáveis nos protocolos correspondentes.

#### Scenario: Contato acionável

- **WHEN** o visitante aciona um e-mail no rodapé
- **THEN** o cliente de e-mail é aberto com o endereço preenchido

### Requirement: Retorno contextual em telas internas

Toda tela que não seja a home SHALL oferecer, antes de seu título, um retorno explícito
ao lugar de onde ela é alcançada: programação retorna à home, espetáculo retorna à
programação, oficina retorna às ações formativas, espaço retorna ao mapa cultural,
edição retorna à linha do tempo.

Esse retorno SHALL ser um destino de navegação real, e SHALL NOT depender do histórico
do navegador.

#### Scenario: Chegada por link direto

- **WHEN** o visitante abre a página de um espaço por um link externo, sem histórico
- **THEN** o retorno ao mapa cultural funciona

### Requirement: Transição de cortina entre páginas

Ao navegar entre rotas do portal, o portal SHALL exibir uma cortina bordô que se recolhe
revelando a página de destino, marcando a passagem como uma troca de cena.

A cortina SHALL NOT atrasar a navegação: a página de destino SHALL começar a ser
apresentada no mesmo instante em que seria sem a cortina, e a cortina SHALL ser
puramente decorativa sobre ela.

A cortina SHALL NOT capturar ponteiro nem foco em nenhum momento, e SHALL NOT ser
exibida sob `prefers-reduced-motion: reduce`.

Se o JavaScript não executar, a navegação SHALL continuar funcionando sem cortina
alguma.

#### Scenario: Navegação entre duas rotas

- **WHEN** o visitante navega da home para a programação
- **THEN** a programação é apresentada sem espera adicional
- **AND** a cortina se recolhe sobre ela

#### Scenario: Movimento reduzido

- **WHEN** o visitante tem movimento reduzido ativado e navega entre rotas
- **THEN** nenhuma cortina é pintada

#### Scenario: Interação durante a cortina

- **WHEN** o visitante clica em um elemento da nova página enquanto a cortina se recolhe
- **THEN** o clique alcança o elemento

### Requirement: Comportamento mobile da navegação

Em telas estreitas, o portal SHALL oferecer navegação permanente entre as áreas centrais
— programação, grade, mapa e memória — acessível sem rolar até o rodapé.

Todo alvo de toque SHALL ter no mínimo 44 por 44 pixels CSS.

Nenhuma tela SHALL produzir rolagem horizontal do documento. Conteúdo intrinsecamente
largo SHALL rolar dentro do próprio container.

#### Scenario: Largura de 375 pixels

- **WHEN** o portal é aberto em uma viewport de 375 pixels de largura
- **THEN** nenhuma rota produz rolagem horizontal do documento
- **AND** a navegação entre as áreas centrais está sempre alcançável
