# stage-intro Specification

## Purpose

A abertura teatral que recebe o visitante na página inicial do FENATEVI: um momento
narrativo curto — escuro de palco, luz, a frase da semente e a abertura das cortinas —
que estabelece a identidade do festival antes do conteúdo, sem jamais se tornar um
obstáculo para chegar até ele.

## Requirements

### Requirement: Exibição na entrada da página inicial

A abertura SHALL ser exibida a cada carregamento completo da página inicial, em qualquer
um dos três idiomas, e SHALL ocupar todo o viewport enquanto durar.

A abertura SHALL NOT ser exibida em qualquer outra rota, e SHALL NOT ser reexibida
quando o visitante navegar dentro da aplicação sem recarregar a página.

#### Scenario: Primeira chegada à página inicial

- **WHEN** o visitante carrega a página inicial em qualquer idioma
- **THEN** a abertura cobre todo o viewport desde o primeiro conteúdo pintado
- **AND** nenhum trecho da página fica visível ao redor dela

#### Scenario: Troca de idioma sem recarregar a página

- **WHEN** o visitante já assistiu à abertura e troca de idioma pelo seletor
- **THEN** a abertura não é exibida novamente
- **AND** o conteúdo do novo idioma aparece imediatamente

#### Scenario: Rota que não é a página inicial

- **WHEN** o visitante carrega qualquer rota que não seja a página inicial
- **THEN** a abertura não é exibida

### Requirement: Sequência narrativa

A abertura SHALL apresentar, nesta ordem: um ambiente escuro com as cortinas fechadas,
o surgimento gradual de luz dirigida ao centro, a frase da semente no centro da tela, e
a abertura lateral das cortinas revelando a página.

A sequência completa SHALL concluir em no máximo **5 segundos** contados a partir do
primeiro conteúdo pintado, de modo que a abertura não se qualifique como conteúdo em
movimento que exige controle de pausa (WCAG 2.2.2).

A frase SHALL permanecer legível por tempo suficiente para ser lida antes de as cortinas
começarem a abrir.

#### Scenario: Sequência até o fim, sem interrupção

- **WHEN** o visitante não interage durante a abertura
- **THEN** a tela escura dá lugar à luz, a luz revela a frase, a frase é sustentada, as
  cortinas se abrem lateralmente e a abertura desaparece
- **AND** o conteúdo da página fica interativo em no máximo 5 segundos

#### Scenario: Frase visível antes da abertura das cortinas

- **WHEN** a abertura chega ao ponto em que as cortinas começam a se separar
- **THEN** a frase já esteve visível e estática por pelo menos 1 segundo

### Requirement: Encerramento garantido sem JavaScript

A abertura SHALL se encerrar sozinha e liberar o conteúdo mesmo quando o JavaScript
estiver desabilitado, falhar ao carregar ou nunca executar.

Não SHALL existir nenhuma condição em que o visitante fique permanentemente impedido de
alcançar o conteúdo por causa da abertura.

#### Scenario: JavaScript desabilitado no navegador

- **WHEN** o visitante carrega a página inicial com o JavaScript desabilitado
- **THEN** a abertura acontece e se encerra dentro do mesmo limite de 5 segundos
- **AND** a página inicial fica integralmente legível e navegável depois disso

#### Scenario: Falha no carregamento do JavaScript da aplicação

- **WHEN** o JavaScript da aplicação não chega ao navegador ou lança erro antes de
  assumir o controle
- **THEN** a abertura ainda assim se encerra e revela o conteúdo

### Requirement: Dispensa pelo visitante

O visitante SHALL poder encerrar a abertura a qualquer momento por meio de qualquer
interação — teclado, clique, toque ou rolagem — sem precisar localizar um controle
específico.

A abertura SHALL indicar visualmente que pode ser dispensada.

Após a dispensa, o conteúdo SHALL ficar acessível em no máximo **300 milissegundos**.

#### Scenario: Dispensa por teclado

- **WHEN** o visitante pressiona qualquer tecla durante a abertura
- **THEN** a abertura se encerra e o conteúdo fica acessível em até 300 ms

#### Scenario: Dispensa por clique ou toque

- **WHEN** o visitante clica ou toca em qualquer ponto da tela durante a abertura
- **THEN** a abertura se encerra e o conteúdo fica acessível em até 300 ms

#### Scenario: Dispensa por rolagem

- **WHEN** o visitante rola a página durante a abertura
- **THEN** a abertura se encerra e o conteúdo fica acessível em até 300 ms

#### Scenario: Indicação de que é possível pular

- **WHEN** a abertura está em cena
- **THEN** existe uma indicação visual de que qualquer interação a encerra

### Requirement: Ausência sob movimento reduzido

Quando o visitante tiver declarado preferência por movimento reduzido, a abertura
SHALL NOT ser exibida: o conteúdo da página inicial SHALL estar disponível
imediatamente, sem qualquer cortina, escurecimento ou movimento intermediário.

#### Scenario: Preferência por movimento reduzido ativa

- **WHEN** o visitante carrega a página inicial com `prefers-reduced-motion: reduce`
- **THEN** nenhuma cortina, escurecimento ou facho de luz é exibido
- **AND** o conteúdo da página está visível e interativo em no máximo 300 ms

### Requirement: Transparência para tecnologias assistivas

A abertura é decorativa: ela SHALL NOT ser exposta na árvore de acessibilidade, SHALL NOT
receber foco, SHALL NOT prender o foco do teclado e SHALL NOT alterar a ordem de
tabulação da página.

O conteúdo da página inicial SHALL estar completo e anunciável por leitores de tela
desde o primeiro momento, independentemente do estágio da abertura.

#### Scenario: Navegação por leitor de tela durante a abertura

- **WHEN** um leitor de tela percorre a página enquanto a abertura está em cena
- **THEN** ele anuncia o conteúdo da página inicial
- **AND** não anuncia nenhum elemento da abertura

#### Scenario: Primeiro elemento focável durante a abertura

- **WHEN** o visitante pressiona `Tab` pela primeira vez
- **THEN** o foco vai para o link "Pular para o conteúdo", como em qualquer outra
  situação
- **AND** a abertura não retém o foco

### Requirement: A frase da semente pertence à abertura

A frase "Basta uma semente..." SHALL ser exibida exclusivamente na abertura e SHALL NOT
aparecer em nenhuma outra parte da página inicial.

A frase SHALL estar disponível nos três idiomas do site e SHALL ser exibida no idioma
corrente.

#### Scenario: A frase não é repetida na página

- **WHEN** a abertura termina e o visitante lê a página inicial
- **THEN** a frase da semente não aparece em nenhuma seção da página

#### Scenario: A frase acompanha o idioma

- **WHEN** o visitante carrega a página inicial em inglês ou espanhol
- **THEN** a frase exibida na abertura está no idioma correspondente

### Requirement: A abertura não interfere no layout nem no scroll

A abertura SHALL NOT provocar deslocamento de layout: nenhum elemento da página pode
mudar de posição ou de tamanho por causa de sua entrada ou de sua saída.

A abertura SHALL NOT impedir a rolagem da página nem descartar a posição de scroll
restaurada pelo navegador ou definida por uma âncora na URL.

#### Scenario: Nenhum deslocamento de layout

- **WHEN** a abertura termina e revela o conteúdo
- **THEN** nenhum elemento da página muda de posição em relação a onde já estava
- **AND** o deslocamento cumulativo de layout atribuível à abertura é zero

#### Scenario: Chegada por âncora na URL

- **WHEN** o visitante carrega a página inicial com uma âncora de seção na URL
- **THEN** ao término da abertura a página está posicionada na seção indicada

### Requirement: Segurança visual

A abertura SHALL NOT produzir piscadas, estroboscopia ou variações bruscas de
luminosidade: todas as mudanças de luz SHALL ser graduais.

A frase exibida SHALL ter contraste mínimo de **4,5:1** contra o fundo sobre o qual
aparece, em todos os quadros em que estiver legível.

#### Scenario: Ausência de piscadas

- **WHEN** a abertura é reproduzida do início ao fim
- **THEN** não ocorre nenhuma transição de luminosidade abrupta ou repetitiva

#### Scenario: Contraste da frase

- **WHEN** a frase está visível sobre a cortina
- **THEN** o contraste entre o texto e o fundo é de pelo menos 4,5:1

### Requirement: Cobertura em qualquer viewport

As cortinas SHALL cobrir integralmente o viewport em qualquer proporção, orientação ou
tamanho de tela, sem frestas, bordas expostas ou faixas do conteúdo aparecendo entre
elas ou nas extremidades.

A cobertura SHALL se manter correta quando o viewport mudar de tamanho ou de orientação
durante a abertura.

#### Scenario: Proporções extremas

- **WHEN** a página inicial é carregada em celular na vertical, celular na horizontal,
  tablet, notebook ou monitor ultrawide
- **THEN** as cortinas cobrem todo o viewport, sem fresta entre elas nem borda exposta

#### Scenario: Mudança de viewport durante a abertura

- **WHEN** o visitante gira o dispositivo ou redimensiona a janela enquanto a abertura
  está em cena
- **THEN** as cortinas continuam cobrindo o viewport inteiro, sem deformação evidente
- **AND** a sequência prossegue sem reiniciar
