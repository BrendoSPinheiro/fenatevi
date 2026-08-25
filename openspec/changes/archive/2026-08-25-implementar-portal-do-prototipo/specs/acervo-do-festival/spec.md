## Purpose

O acervo é a matéria-prima de todo o portal: as edições do festival, seus espaços,
atividades, oficinas, processos criativos, homenageados e créditos. Esta capability
define o que o acervo garante a quem o lê — integridade referencial, idioma declarado,
proveniência de imagem e um comportamento honesto quando o conteúdo ainda não existe.

## ADDED Requirements

### Requirement: Acervo da edição 2024 disponível ao portal

O portal SHALL dispor do acervo completo da 20ª edição (2024) transcrito do programa
impresso: os 7 espaços culturais, as atividades da Mostra Oficial e da 7ª Mostra
Paralela Vera Viana, as 2 oficinas, os processos criativos de cada dia, os 2
homenageados, os 3 lançamentos de livros, os créditos da edição e os parceiros.

Cada atividade SHALL declarar título, companhia, cidade de origem, dia, horário,
duração, espaço, frente de programação e classificação indicativa; e MAY declarar
release, ficha técnica, recursos de acessibilidade da sessão, imagem e observação.

O acervo SHALL NOT conter dado inventado. Quando o programa impresso não informa um
valor, o portal exibe a ausência como ausência — nunca um valor plausível.

#### Scenario: Atividade sem classificação indicativa no material original

- **WHEN** o portal exibe uma atividade cuja classificação não consta do programa
  impresso
- **THEN** o campo aparece como "a confirmar"
- **AND** nenhuma classificação é atribuída por inferência

#### Scenario: Atividade sem imagem no material original

- **WHEN** o portal exibe uma atividade sem imagem no acervo
- **THEN** o espaço da imagem recebe um tratamento gráfico neutro
- **AND** nenhuma imagem de outra atividade é reaproveitada no lugar

### Requirement: Integridade referencial do acervo

Toda atividade SHALL referenciar um espaço existente no acervo. Toda oficina SHALL
referenciar um espaço existente e MAY referenciar atividades relacionadas, que SHALL
existir. Todo processo criativo SHALL referenciar um dia dentro do período da edição.

Uma referência quebrada SHALL impedir o build, não produzir uma página com um campo
vazio em produção.

#### Scenario: Referência a espaço inexistente

- **WHEN** uma atividade aponta para um identificador de espaço que não existe no acervo
- **THEN** a verificação de tipos falha
- **AND** o build não é concluído

### Requirement: Idioma declarado do acervo histórico

O acervo histórico — títulos de espetáculo, releases, fichas técnicas, biografias de
homenageados, créditos e descrições de livros — SHALL ser servido no idioma original
(pt-BR) em todos os três idiomas do portal, e SHALL ser marcado com `lang="pt-BR"` no
elemento que o contém sempre que o idioma da página não for pt-BR.

Quando o visitante estiver em `en` ou `es`, o portal SHALL exibir, antes do primeiro
bloco de acervo da página, um aviso **traduzido** informando que o registro histórico
está no idioma original.

Toda a interface ao redor do acervo — rótulos, filtros, estados vazios, navegação,
rodapé, nomes de frentes de programação, dias da semana e formatos de data — SHALL estar
traduzida nos três idiomas.

#### Scenario: Espetáculo lido em inglês

- **WHEN** o visitante abre a página de um espetáculo em `/en`
- **THEN** os rótulos "Date and time", "Venue", "Technical credits" aparecem em inglês
- **AND** o release e a ficha técnica aparecem em português
- **AND** o bloco que os contém declara `lang="pt-BR"`
- **AND** um aviso em inglês explica que o registro está no idioma original

#### Scenario: Espetáculo lido em português

- **WHEN** o visitante abre a mesma página em pt-BR
- **THEN** nenhum aviso de idioma é exibido
- **AND** nenhum atributo `lang` redundante é aplicado ao acervo

### Requirement: Proveniência declarada das imagens

Cada imagem do acervo SHALL declarar sua proveniência e se é material definitivo ou
extração de baixa resolução do programa impresso.

Imagens de baixa resolução SHALL NOT ser ampliadas além da dimensão em que ainda se
sustentam, e SHALL ser servidas com texto alternativo descritivo em cada idioma do
portal.

A proveniência SHALL ser um dado do acervo, consultável em um único lugar, e SHALL NOT
aparecer como texto endereçado ao visitante.

#### Scenario: Levantamento de imagens a substituir

- **WHEN** a organização pergunta quais imagens precisam de arquivo original
- **THEN** a lista é derivável do acervo sem inspecionar componentes

#### Scenario: Imagem de baixa resolução em destaque

- **WHEN** uma imagem marcada como baixa resolução é usada em uma área de destaque
- **THEN** ela é servida dentro do limite de dimensão que o material suporta

### Requirement: Edição vigente sem programação publicada

Enquanto a edição vigente não tiver programação publicada no acervo, o portal SHALL
apresentar a identidade e as datas da edição vigente e SHALL exibir, como programação, o
acervo da edição mais recente que tenha programação completa.

Nesse estado o portal SHALL exibir um aviso traduzido, visível antes da primeira lista
de programação de cada tela que a apresente, informando qual edição está sendo mostrada
e que ela será substituída pelos dados da edição vigente.

Quando a edição vigente passar a ter programação publicada, o aviso SHALL deixar de ser
exibido e a programação exibida SHALL passar a ser a dela, **sem alteração de código**.

#### Scenario: Home antes da publicação da edição vigente

- **WHEN** o visitante abre a home e a edição vigente não tem programação
- **THEN** o cabeçalho da edição mostra a 22ª edição e as datas de 2026
- **AND** um aviso informa que a programação exibida é a da edição 2024
- **AND** a programação listada é a de 2024

#### Scenario: Programação da edição vigente publicada

- **WHEN** o acervo passa a conter a programação da edição vigente
- **THEN** o aviso deixa de aparecer em todas as telas
- **AND** a programação exibida passa a ser a da edição vigente

### Requirement: Estado de acervo por edição

Cada edição do festival SHALL declarar seu estado de acervo — vigente, acervo completo,
acervo pendente ou em digitalização — e o portal SHALL derivar desse estado o que é
possível fazer com ela.

Uma edição sem acervo completo SHALL NOT oferecer navegação para uma página de edição
que não existe.

#### Scenario: Edição com acervo completo

- **WHEN** o visitante encontra a edição 2024 na linha do tempo
- **THEN** ela é apresentada como acervo completo
- **AND** oferece navegação para sua página de edição

#### Scenario: Edição sem acervo

- **WHEN** o visitante encontra uma edição marcada como pendente ou em digitalização
- **THEN** seu estado é apresentado textualmente, não apenas por cor
- **AND** nenhuma navegação leva a uma página de edição inexistente
