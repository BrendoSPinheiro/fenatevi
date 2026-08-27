## MODIFIED Requirements

### Requirement: Linha do tempo das edições

O portal SHALL apresentar uma linha do tempo com as edições do festival, **uma estação
por edição**, cada uma com ano, número da edição, período, estado do acervo, uma
descrição e uma indicação de quanto do acervo está disponível.

A linha do tempo SHALL cobrir todas as edições realizadas, da primeira à vigente, sem
comprimir períodos inteiros em uma única entrada.

O estado do acervo SHALL ser apresentado como texto e SHALL NOT ser comunicado apenas
por cor.

A indicação de completude SHALL ter equivalente textual para quem não a enxerga.

Uma edição sem acervo digitalizado SHALL aparecer como estação própria e SHALL declarar
que seu acervo não está disponível — a ausência de acervo SHALL NOT ser motivo para
omitir a edição da linha do tempo.

#### Scenario: Estados distintos na mesma lista

- **WHEN** o visitante percorre a linha do tempo
- **THEN** distingue edição vigente, acervo completo, acervo pendente e em digitalização
- **AND** cada estado é legível como texto

#### Scenario: Indicador de completude com leitor de tela

- **WHEN** um leitor de tela alcança a indicação de completude de uma edição
- **THEN** o estado é anunciado como texto, e a barra não é anunciada como conteúdo

#### Scenario: Toda edição tem sua estação

- **WHEN** o visitante percorre a linha do tempo do início ao fim
- **THEN** encontra uma estação para cada edição realizada, da primeira à vigente
- **AND** as edições sem acervo aparecem, cada uma com seu ano e seu número

### Requirement: Destino de cada edição na linha do tempo

Cada edição na linha do tempo SHALL oferecer uma ação coerente com seu estado: acervo
completo leva à página da edição; edição vigente leva ao acompanhamento da edição; sem
acervo, a ação leva a informação sobre o acervo.

Nenhuma ação SHALL levar a uma página de edição que não existe.

Esta regra SHALL valer igualmente para estações apresentadas com conteúdo de prévia:
conteúdo de prévia SHALL NOT criar destino de navegação.

#### Scenario: Edição com acervo completo

- **WHEN** o visitante aciona a edição de 2024
- **THEN** chega à página completa daquela edição

#### Scenario: Edição sem acervo

- **WHEN** o visitante aciona uma edição pendente
- **THEN** não chega a uma página de edição inexistente

#### Scenario: Estação de prévia não navega

- **WHEN** a linha do tempo apresenta uma estação com conteúdo de prévia
- **THEN** essa estação não oferece link para uma página de edição

## ADDED Requirements

### Requirement: Eixo persistente da linha do tempo

A linha do tempo SHALL apresentar um eixo persistente, visível enquanto o visitante a
percorre, com um marco por edição e a indicação de qual estação está em foco.

O eixo SHALL permanecer utilizável sem JavaScript e sem animação: SHALL NOT ser a única
forma de alcançar uma estação, e o conteúdo de todas as estações SHALL permanecer
acessível pela rolagem normal do documento.

Cada marco do eixo SHALL ser um caminho para a sua edição, de modo que o visitante possa
ir direto a um ano em vez de percorrer a linha inteira. Esse caminho SHALL funcionar sem
JavaScript e SHALL ser compartilhável como URL.

A edição alcançada por esse caminho SHALL ficar legível ao chegar, e SHALL NOT chegar
encoberta por elemento fixo da interface.

#### Scenario: Eixo sem JavaScript

- **WHEN** o visitante carrega a tela de memória com JavaScript desabilitado
- **THEN** vê o eixo e todas as estações
- **AND** alcança o conteúdo de qualquer edição rolando a página

#### Scenario: Ir direto a um ano

- **WHEN** o visitante aciona o marco de 2012 no eixo
- **THEN** chega à edição de 2012
- **AND** a edição chega legível, não encoberta pelo cabeçalho

#### Scenario: O ano vira endereço

- **WHEN** o visitante compartilha a URL que o eixo produziu
- **THEN** quem a abre chega direto naquela edição

### Requirement: Variante de percurso da linha do tempo

O portal SHALL oferecer duas formas de percorrer a linha do tempo — estações empilhadas
na vertical e painéis em trilho horizontal — e a escolha SHALL viver na URL.

O valor vindo da URL SHALL ser validado antes do uso, e qualquer valor não reconhecido
SHALL resultar na variante padrão em vez de erro.

A variante SHALL NOT depender de JavaScript, de estado de cliente nem de armazenamento
no navegador.

A variante em trilho SHALL manter o percurso horizontal em qualquer largura de tela, e
SHALL NOT exigir rolagem em duas direções para ler o conteúdo de uma estação.

A variante em trilho MAY converter o gesto de rolagem vertical em avanço horizontal da
tira. Quando o fizer, o gesto SHALL ser devolvido à página assim que a tira alcançar
qualquer uma das suas pontas, de modo que a rolagem da página nunca fique presa; e a
conversão SHALL ser enriquecimento, de modo que a tira permaneça percorrível sem ela.

Esta capacidade é **temporária**: existe para decidir entre as duas formas, e a variante
não escolhida SHALL ser removida por inteiro junto com sua chave de URL.

#### Scenario: Valor inválido na URL

- **WHEN** o visitante acessa a linha do tempo com um valor de variante não reconhecido
- **THEN** vê a variante padrão
- **AND** a página responde normalmente

#### Scenario: A rolagem vertical avança a tira

- **WHEN** o visitante rola para baixo com o ponteiro sobre a tira, e ainda há estações à
  frente
- **THEN** a tira avança para o lado
- **AND** a página permanece onde está

#### Scenario: A ponta da tira devolve o gesto

- **WHEN** a tira chega ao seu fim e o visitante continua rolando no mesmo sentido
- **THEN** a página volta a rolar normalmente

#### Scenario: Trilho em tela estreita

- **WHEN** o visitante percorre a variante em trilho numa tela de 320px
- **THEN** avança pelas estações no sentido horizontal
- **AND** lê o conteúdo de cada estação sem rolar horizontalmente dentro do texto

### Requirement: Conteúdo de prévia declarado

O portal SHALL declarar de forma visível na própria tela, ao visitante, quando a linha
do tempo apresentar conteúdo de prévia no lugar do acervo real.

O conteúdo de prévia SHALL viver separado do acervo real, de modo que sua substituição
pelos dados verdadeiros não altere o acervo já publicado.

Conteúdo de prévia SHALL NOT ser apresentado como registro do acervo nem alimentar
contagens, resumos ou páginas de edição.

#### Scenario: Prévia declarada

- **WHEN** o visitante abre a tela de memória com conteúdo de prévia ativo
- **THEN** lê, na tela, que as edições e imagens exibidas são ilustrativas

#### Scenario: Acervo real não é afetado

- **WHEN** a linha do tempo apresenta conteúdo de prévia
- **THEN** a página da edição de 2024 continua apresentando somente o acervo real
- **AND** os números derivados do acervo permanecem inalterados
