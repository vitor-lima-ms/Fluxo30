---
name: Fluxo30
description: Diário fiel de gastos e receitas; o mês na parede é o relógio, e os dois livros nunca compartilham tinta.
colors:
  carimbo: "#c43c2c"
  gasto: "#b85c38"
  receita: "#2a4d8f"
  papel: "#f4efe6"
  ink: "#1c1916"
  filete: "#d9d0c4"
  papel-baixo: "#ebe4d8"
  papel-alto: "#f7f3ec"
  sala: "#1a1612"
  surface-escuro: "#24201b"
  filete-escuro: "#3d362e"
  erro: "#8f2f24"
  sucesso: "#3d5a3d"
typography:
  display:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  title:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0"
    fontFeature: "tnum"
  body:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
    fontFeature: "tnum"
  label:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.02em"
    fontFeature: "tnum"
  figures:
    fontFamily: "Roboto, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0"
    fontFeature: "tnum"
rounded:
  cell: "4px"
spacing:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.carimbo}"
    textColor: "{colors.papel}"
    typography: "{typography.label}"
    rounded: "{rounded.cell}"
    padding: "0 1rem"
    height: "2.25rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.cell}"
    padding: "0 1rem"
    height: "2.25rem"
  button-destructive:
    backgroundColor: "{colors.erro}"
    textColor: "{colors.papel}"
    typography: "{typography.label}"
    rounded: "{rounded.cell}"
    padding: "0 1rem"
    height: "2.25rem"
  field-outlined:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.cell}"
    height: "3.5rem"
  book-gasto:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cell}"
    padding: "1.25rem 1.5rem"
  book-gasto-decoded:
    backgroundColor: "{colors.gasto}"
    textColor: "{colors.papel}"
    rounded: "{rounded.cell}"
    padding: "1.25rem 1.5rem"
  book-receita:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.cell}"
    padding: "1.25rem 1.5rem"
  book-receita-decoded:
    backgroundColor: "{colors.receita}"
    textColor: "{colors.papel}"
    rounded: "{rounded.cell}"
    padding: "1.25rem 1.5rem"
  empty-cell:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.cell}"
    padding: "0.4rem"
  app-bar:
    backgroundColor: "{colors.carimbo}"
    textColor: "{colors.papel}"
    typography: "{typography.title}"
    height: "64px"
---

# Design System: Fluxo30

## Overview

**Creative North Star: "Calendário de parede"**

O Fluxo30 é um app Operate: quem usa tem de achar o controle antes de notar o mundo. O mundo empresta só tipo, paleta, densidade e um movimento-assinatura. O calendário de farmácia/padaria anotado à caneta é esse mundo — papel de mês, célula de hoje pintada, duas tintas que não se misturam.

A cena física é a mesa à noite sob luminária, com o caderno como lugar principal (o telefone existe, mas depois). Isso força um UI claro de papel, não um console grafite nem um internet banking cinza. Roboto permanece a família de trabalho; trocá-la exigiria uma nova decisão de mundo.

Estratégia de cor: **Restrained** — neutros tintados do papel + duas tintas semânticas (gasto e receita) fazendo trabalho real, nunca decoração. O acento de calendário (vermelho do dia) pinta só o hoje e o estado que precisa de urgência. No código, os temas Vuetify se chamam `fluxo30Light` e `fluxo30Dark`.

**Key Characteristics:**

- Papel claro, tinta escura, duas cores de livro, nunca um cinza institucional
- Hoje é a única célula cheia; o resto do mês é grade
- Gastos e receitas são dois territórios; o divisor não mistura os livros
- Densidade de calendário anotado, não de dashboard de cards
- Uma família (Roboto), números tabulares, escala fixa em rem
- Escuro é a sala ao redor do papel, não um console

## Colors

Papel de calendário com tinta de esferográfica e um carimbo vermelho para o dia — duas tintas de livro, zero mint de fintech.

### Primary

- **Carimbo do dia**: pinta o cabeçalho do mês e urgência. Raridade é o ponto. Não é a tinta de gasto.

### Secondary

- **Tinta de gasto**: um território. Vizinho óxido do carimbo, nunca o mesmo hex.

### Tertiary

- **Tinta de receita**: o outro território. Esferográfica. Nunca a mesma tinta nos dois livros.

### Neutral

- **Papel de calendário**: chão de toda superfície clara (`background` e `surface` no tema claro). Também é o `on-*` das tintas cheias.
- **Ink**: texto e ícones em repouso no tema claro.
- **Filete da grade**: linhas de calendário, divisores, bordas em repouso.
- **Papel baixo / papel alto**: um passo abaixo e um passo acima na rampa, para ênfase tonal sem nova cor.
- **Sala**: fundo do tema escuro — a madeira ao redor do caderno, não grafite `#0d1117`.
- **Surface escuro**: um passo acima da sala; o papel ainda visível na mesa.
- **Filete escuro**: grade no tema escuro.
- **Erro / sucesso**: exclusão e confirmação; o erro não substitui o carimbo nem a tinta de gasto.

**The Two-Inks Rule.** Gasto e receita nunca compartilham tinta. Se um swatch servir nos dois livros, está errado.

**The Today-Only Rule.** Só a célula Hoje (e o estado de urgência equivalente) leva o carimbo cheio. O resto é papel e filete.

**The Zone Ramp Rule.** Neutros travam numa rampa fechada de passos; ênfase é número, não mais uma cor.

## Typography

**Display Font:** Roboto (system-ui, sans-serif)
**Body Font:** Roboto
**Label/Mono Font:** Roboto com figuras tabulares (`tnum`)

**Character:** Uma família de trabalho, como o grotesco do calendário de parede — números grandes o bastante para conferir, labels pequenos o bastante para não brigar com o valor.

### Hierarchy

- **Display** (700, 2rem, line-height 1.2, tracking −0.02em): só o mês/hoje, nunca um hero de marketing. Razão ~1.25 a partir do title.
- **Title** (500, 1.25rem, line-height 1.3): cabeçalhos de seção na página de tokens e, depois, no app.
- **Body** (400, 1rem, line-height 1.5): pt-BR corrido, até 75ch quando for prosa.
- **Label** (500, 0.75rem, tracking 0.02em): campos, eixos, metadados, mês no app-bar; sem display face em UI chrome. Sem `text-transform: uppercase`.
- **Figures** (500, 1.25rem, `tnum`): valores monetários na mesma escala das comparações (mês anterior, YoY, média YTD).

**The Fixed-Scale Rule.** Espécimes de comparação compartilham uma baseline e um tamanho. Nada de cards de totais em escalas misturadas.

**The One-Voice Type Rule.** Uma família. Sem serif de display, sem Stolz, sem a lista de faces genéricas de AI (Playfair, Fraunces, Space Grotesk, etc.).

## Layout

Gramática espacial de calendário de parede: grade, célula, faixa de mês. No app isso vira shell padrão da plataforma (nav + área de trabalho) — o mundo não inventa o layout.

- Shell: app-bar de 64px pintado com carimbo; nome do produto à esquerda, mês corrente (`America/Sao_Paulo`, pt-BR) e toggle claro/escuro à direita; `v-main` abaixo.
- A página de tokens abre com display **Hoje**, uma **faixa Hoje de largura total** (dois livros no mesmo quadrado) e, abaixo, o resto do mês em grade de 7 colunas + rampa, tipo e controles.
- Container da página: coluna com `gap` de 2rem, `max-width` 72rem, padding-block 2rem / 4rem.
- Densidade de papel anotado: compacta o bastante para conferir, sem o cinza denso de internet banking.
- Responsivo estrutural (coluna que empilha, não tipo fluido). Notebook primeiro. Em `max-width: 720px` a faixa Hoje e a rampa viram 2 colunas; as células vazias perdem o quadrado e ficam com `min-height` 2.5rem. A grade do mês permanece 7 colunas.

**The Occupied Band Rule.** O movimento-assinatura (célula Hoje / os dois livros) ganha uma banda de largura total, não um tile entre tiles.

## Elevation & Depth

Plano por padrão. Profundidade vem de filete de grade e de um passo tonal na rampa de papel, não de sombra de card fintech. `elevation: 0` em `VBtn`, `VCard` e `VTextField`. Sem `box-shadow` em repouso.

Seleção: o espécime ativo é o único em cor cheia (raise One-Decoded). Foco visível: anel de 2px na cor do carimbo, offset 2px. Seleção de texto: fundo carimbo sobre papel.

Tema escuro: a sala envolve o papel. Fundo quente, surface um passo acima, texto no papel. Não é um console.

**The Flat-By-Default Rule.** Superfícies em repouso são planas. Sem elevação de dashboard.

**The One-Decoded Rule.** Só o espécime selecionado vai a cor cheia; o resto fica em papel e filete.

## Shapes

Célula de calendário: canto brando o bastante para parecer papel recortado (`4px`, `rounded="md"` / `border-radius-root`; no Vuetify 4, `sm` é 2px e `rounded` boolean vira pílula de 24px), nunca pílula de consumer app e nunca o card-sombra da categoria.

A faixa Hoje é um retângulo partido: gasto com raio só à esquerda, receita só à direita; em ≤720px cada livro vira uma célula de 4px em todos os cantos. Células vazias do mês herdam o mesmo raio e 1px de filete.

**The Cell Rule.** Controles e espécimes herdam a lógica da célula (retângulo de grade), não da pílula nem do anel.

## Components

Controles da plataforma (Vuetify) com defaults do mundo: flat, raio de célula, sem uppercase. O movimento-assinatura mora na faixa Hoje, não num átomo de marketing.

### Buttons

- **Shape:** retângulo de célula (4px), `variant="flat"`, `elevation: 0`, sem uppercase.
- **Primary:** fundo carimbo, texto papel. Isolado; só um primário por grupo.
- **Secondary:** outlined, tinta ink, filete de borda.
- **Destructive:** fundo erro, texto papel; separado do grupo principal por espaço extra (não vizinho do Guardar).
- **Disabled:** o mesmo retângulo, opacidade da plataforma; não inventa uma terceira tinta.
- **Hover / Focus:** sem lift. Foco visível é o anel de carimbo. Um botão selecionado na página de tokens segue One-Decoded.

### Cards / Containers

- **Corner Style:** 4px.
- **Background:** papel (claro) ou surface escuro.
- **Shadow Strategy:** nenhuma em repouso.
- **Border:** 1px filete quando a superfície precisa de grade.
- **Internal Padding:** 1.25rem / 1.5rem nos livros; 0.4rem nas células vazias.

### Inputs / Fields

- **Style:** `outlined`, raio 4px, label body, valor sintético rotulado como tal.
- **Focus:** anel de carimbo; o campo focado é o espécime One-Decoded do grupo de controles.
- **Error / Disabled:** erro usa a tinta de exclusão; disabled não ganha cor nova.

### Navigation

- **App-bar:** 64px, fundo carimbo, título title, mês em label, toggle em ícone texto (sol/lua). Sem drawer nesta fase. Não é tela de finanças.

### Faixa Hoje / livros

- Dois botões irmãos em grade 1fr 1fr, largura total.
- Cada livro mostra label do território, figura tabular e categoria · sintético.
- Em repouso: papel + filete. Decodificado: gasto ou receita em cor cheia, texto papel.
- Clique troca o único decodificado. Os dois livros nunca compartilham hex.

### Célula vazia do mês

- Grade de 7 colunas, gap 0.5rem, filete, raio 4px, número em label. Hoje não aparece nessa grade — já está na faixa.

## Do's and Don'ts

### Do:

- **Do** pintar Hoje como a única célula cheia e deixar o resto como grade.
- **Do** tratar gasto e receita como dois territórios de tinta, com nomes visíveis (fidelidade do livro).
- **Do** usar Roboto, figuras tabulares, e a mesma escala em qualquer comparação.
- **Do** deixar o shell e os controles serem os da plataforma (Vuetify); o mundo entra por tipo, paleta, densidade e a faixa Hoje.
- **Do** registrar temas como `fluxo30Light` / `fluxo30Dark`, com `gasto`, `receita` e `filete` como cores custom.

### Don't:

- **Don't** misturar gasto e receita numa lista única ou numa tinta só.
- **Don't** parecer internet banking (cinza institucional, denso, feito para gerente).
- **Don't** copiar Ambtec, Stolz, nem `ambtecLight` / `ambtecDark`.
- **Don't** enviar o padrão da categoria: cards, donut, mint, lista mista de transações.
- **Don't** usar o calendário como fantasia de layout (papel pautado no lugar de tabela, espiral decorativa). Ele empresta tipo, paleta, densidade e a célula Hoje — só isso.
- **Don't** pintar o tema escuro de grafite `#0d1117` nem de console.
