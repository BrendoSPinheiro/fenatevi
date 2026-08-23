## Purpose

As duas páginas de detalhe do portal: a de um espetáculo — release, ficha técnica,
acessibilidade da sessão, companhia, espaço e outras apresentações — e a de uma oficina,
que acrescenta vagas, turmas, requisitos e a inscrição por formulário externo da
organização.

## ADDED Requirements

### Requirement: Identificação do espetáculo

A página de um espetáculo SHALL apresentar seu título, sua companhia, sua cidade de
origem, sua frente de programação e a situação da sessão — programada, em cena agora ou
encerrada.

A situação SHALL ser apresentada textualmente e SHALL ser derivada do horário corrente,
não escrita no acervo.

#### Scenario: Sessão já encerrada

- **WHEN** o visitante abre um espetáculo cuja sessão já passou
- **THEN** a página declara que a sessão está encerrada
- **AND** não sugere comparecimento

### Requirement: Dados essenciais da sessão

A página SHALL apresentar, agrupados e rotulados, a data e o horário da sessão, o dia da
semana, o horário previsto de término, o espaço com seu endereço, a duração e a
classificação indicativa.

O horário de término SHALL ser derivado do início somado à duração.

Quando um dado não constar do acervo, o rótulo SHALL permanecer e o valor SHALL declarar
a ausência.

#### Scenario: Término derivado

- **WHEN** uma sessão começa às 19h30 e dura 55 minutos
- **THEN** a página informa que termina às 20h25

### Requirement: Acessibilidade da sessão em destaque

Quando a sessão oferecer recursos de acessibilidade, a página SHALL destacá-los **acima**
da ficha técnica, em bloco próprio e identificado.

Os recursos SHALL ser apresentados como texto traduzido, e SHALL NOT depender apenas de
ícone ou de cor.

Quando a sessão não oferecer recursos, o bloco SHALL NOT ser exibido, e a ausência SHALL
NOT ser afirmada como indisponibilidade permanente.

#### Scenario: Sessão com Libras e audiodescrição

- **WHEN** a sessão oferece os dois recursos
- **THEN** aparecem em bloco próprio antes da ficha técnica
- **AND** estão traduzidos para o idioma da página

#### Scenario: Sessão sem recursos declarados

- **WHEN** o acervo não declara recursos para a sessão
- **THEN** nenhum bloco de acessibilidade da sessão é exibido

### Requirement: Release e ficha técnica

A página SHALL apresentar o release do espetáculo e sua ficha técnica como pares de
função e nome.

Quando o acervo trouxer uma observação sobre a sessão — abertura oficial, patrocínio,
condição especial — a página SHALL apresentá-la distinguida do release.

A ficha técnica SHALL preservar a ordem e a grafia do programa impresso.

#### Scenario: Observação da sessão

- **WHEN** o acervo registra que a sessão é a abertura oficial do festival
- **THEN** a observação aparece visualmente distinta do release

#### Scenario: Ficha extensa

- **WHEN** uma ficha técnica lista dezenas de nomes em uma única função
- **THEN** todos são exibidos
- **AND** permanecem legíveis em telas estreitas

### Requirement: Companhia, espaço e processo criativo

A página SHALL apresentar a companhia responsável, o espaço com endereço e navegação
para sua página, e — quando houver — a demonstração de trabalho aberta ao público
associada àquela companhia.

A página SHALL oferecer navegação para chegar ao espaço e para localizar a sessão na
grade do dia.

#### Scenario: Companhia com processo criativo

- **WHEN** a companhia do espetáculo realiza demonstração de trabalho na edição
- **THEN** a página apresenta essa demonstração com seu espaço

### Requirement: Outras apresentações da mesma companhia

Quando a mesma companhia tiver mais de uma apresentação na edição, a página SHALL listar
as demais, cada uma com dia, horário, título e espaço, e cada uma como destino de
navegação.

Quando não houver outras, a seção SHALL NOT ser exibida.

#### Scenario: Companhia com duas sessões

- **WHEN** uma companhia se apresenta em dois dias
- **THEN** a página de cada sessão lista a outra

### Requirement: Identificação e descrição da oficina

A página de uma oficina SHALL apresentar seu título, quem a conduz, sua descrição e,
quando houver, os recursos de acessibilidade oferecidos.

A oficina SHALL ser identificada como ação formativa, distinta de um espetáculo.

#### Scenario: Oficina com intérprete de Libras

- **WHEN** a oficina oferece intérprete de Libras
- **THEN** o recurso aparece em bloco identificado, como texto

### Requirement: Inscrição em formulário externo

A página de uma oficina SHALL apresentar, em bloco de destaque, o número de vagas, o
número de turmas, o formato, as datas, o horário, o espaço com endereço, a faixa etária
e o acesso ao formulário de inscrição.

O acesso ao formulário SHALL ser um link para o endereço publicado pela organização,
SHALL abrir em nova aba, SHALL declarar que se trata de formulário externo, e SHALL
usar `rel="noopener"`.

O portal SHALL NOT coletar, transmitir ou armazenar nenhum dado do visitante: não há
formulário de inscrição no portal.

#### Scenario: Acesso à inscrição

- **WHEN** o visitante aciona a inscrição
- **THEN** o formulário externo da organização abre em nova aba
- **AND** a página informa previamente que o formulário é externo

#### Scenario: Nenhum dado coletado

- **WHEN** o visitante percorre toda a página da oficina
- **THEN** nenhum campo de entrada de dados pessoais é apresentado

### Requirement: Informações completas e requisitos da oficina

A página SHALL apresentar, em lista rotulada, professores, datas, horário, formato,
local, público-alvo, faixa etária, número de turmas e vagas; e, em bloco próprio, os
requisitos e observações da oficina.

Quando a oficina estiver ligada a um espetáculo da edição, a página SHALL apresentar
essa ligação com navegação para ele.

#### Scenario: Oficina ligada a espetáculo

- **WHEN** a oficina é conduzida pelos criadores de um espetáculo em cartaz
- **THEN** a página apresenta o espetáculo relacionado com dia, horário e espaço

#### Scenario: Requisitos materiais

- **WHEN** a oficina exige que o participante leve um instrumento
- **THEN** o requisito aparece em bloco próprio, não diluído na descrição

### Requirement: Metadados de compartilhamento das páginas de detalhe

Cada página de detalhe SHALL declarar título e descrição próprios derivados da atividade
e SHALL declarar suas alternativas de idioma.

A descrição SHALL derivar do acervo, e SHALL NOT repetir a descrição genérica do
portal.

#### Scenario: Compartilhamento de um espetáculo

- **WHEN** o endereço de um espetáculo é compartilhado
- **THEN** o título exibido nomeia aquele espetáculo, não o portal
