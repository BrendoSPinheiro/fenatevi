# FENATEVI

O portal do Festival Nacional de Teatro de Vitória é, ao mesmo tempo, o site da edição
vigente e o **arquivo permanente** das edições anteriores. Quase todo conflito de
linguagem neste projeto nasce dessa dupla natureza: um mesmo termo costuma significar
uma coisa para a edição que vai acontecer e outra para o acervo do que já aconteceu.

## Language

### Edição e tempo

**Edição**:
Uma realização anual do festival, identificada por um número ordinal e por um ano.
_Avoid_: ano, temporada, evento

**Edição vigente**:
A edição que ainda vai acontecer ou está acontecendo — hoje, a 22ª, em 2026.
_Avoid_: edição atual, próxima edição

**Edição exibida**:
A edição cuja programação o portal apresenta agora — a vigente quando ela já publicou
programação, a última edição encerrada com acervo completo enquanto não publicou.
_Avoid_: edição em destaque

**Ano de fundação**:
2004, o ano em que o festival foi criado. **Não houve edição em 2004**: a 1ª edição é de
2005, e a contagem segue sem lacunas até a 22ª, em 2026.
_Avoid_: primeira edição, ano zero

### Acervo

**Acervo**:
O material documental de uma edição encerrada — programa impresso, cartazes,
fotografias, registros em vídeo, ficha técnica.
_Avoid_: arquivo, histórico, memória

**Estado do acervo**:
Em que ponto de disponibilização o acervo de uma edição está. Assume exatamente quatro
valores: **edição vigente**, **acervo pendente**, **em digitalização** e **acervo
completo**.
_Avoid_: status, situação

**Completude do acervo**:
Quanto do acervo de uma edição já está publicado, de 0 a 1. É sempre acompanhada de
equivalente textual — nunca comunicada só por cor ou só por barra.
_Avoid_: progresso, percentual de conclusão

**Texto de acervo**:
Texto que veio do material original do festival — título, release, ficha técnica,
biografia. Fica em pt-BR nos três idiomas do portal, porque é registro, não interface.
_Avoid_: conteúdo, texto original

**Conteúdo de prévia**:
Conteúdo ilustrativo, não verdadeiro, exibido para avaliar layout enquanto o acervo real
não existe. É sempre declarado como tal na tela e nunca vira destino de navegação nem
alimenta contagem ou resumo.
_Avoid_: mock, dado fake, placeholder, conteúdo de demonstração

**Linha do tempo**:
A apresentação de todas as edições em sequência cronológica, uma por edição, cada uma
com seu estado de acervo.
_Avoid_: histórico, timeline, lista de edições

**Estação**:
O lugar de uma edição na linha do tempo — o que apresenta seu ano, seu número, seu
estado de acervo e o que se pode fazer a partir dela.
_Avoid_: item, card, entrada, parada

## Relationships

- Uma **Edição** tem exatamente um **Estado do acervo** e uma **Completude do acervo**
- Só uma **Edição** com estado **acervo completo** tem página própria
- A **Linha do tempo** apresenta uma **Estação** por **Edição**, da 1ª à **Edição vigente**
- A **Edição exibida** é a **Edição vigente** se ela publicou programação; senão, é a
  última **Edição** com **acervo completo**
- **Conteúdo de prévia** ocupa o lugar do **Acervo** de uma **Edição**, e nunca o altera

## Example dialogue

> **Dev:** "A linha do tempo começa em 2004, então?"
>
> **Especialista:** "Começa em 2005. 2004 é quando o festival foi criado, mas a **1ª
> edição** só aconteceu no ano seguinte."
>
> **Dev:** "E as edições de 2005 a 2023 — elas aparecem mesmo sem acervo?"
>
> **Especialista:** "Aparecem, cada uma com seu ano e seu número. O **estado do acervo**
> delas é _em digitalização_, e é isso que a estação diz. Sumir com a edição porque ela
> não tem foto seria apagar duas décadas de festival."
>
> **Dev:** "Se eu puser uma foto ilustrativa em 2011 para a tela não ficar vazia?"
>
> **Especialista:** "Aí é **conteúdo de prévia**, e a tela precisa dizer isso em voz
> alta. Foto de banco de imagem sob o número de uma edição real, sem aviso, é o portal
> mentindo sobre o próprio acervo."

## Flagged ambiguities

- **"2004" era usado como se fosse a 1ª edição.** PRODUCT.md diz "realizado desde 2004",
  `festival.ts` fixa 2024 como 20ª edição e `editions.ts` declara 19 edições em
  2004–2023 — as três afirmações só fecham se 2004 for o **ano de fundação** e a 1ª
  edição for 2005. Resolvido: são conceitos distintos.
- **"memória" era usado tanto para a tela quanto para o material.** Resolvido: o material
  é **acervo**; "memória" é só o nome da área do portal que o apresenta.
- **"linha do tempo" tinha granularidade indefinida** — ora quatro entradas agregadas,
  ora uma por edição. Resolvido: **uma estação por edição**, sem comprimir períodos.
