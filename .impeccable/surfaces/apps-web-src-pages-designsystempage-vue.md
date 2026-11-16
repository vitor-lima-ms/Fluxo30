---
version: 1
slug: "apps-web-src-pages-designsystempage-vue"
primary_target: "apps/web/src/pages/DesignSystemPage.vue"
related_targets: []
---

# Surface: Design system token preview

Visitor mode: Operate
Audience: quem vai implementar e auditar o sistema (e, depois, o usuário do app herda o mundo)
Job: ver o mundo Calendário de parede materializado em tokens, tipo, estados e a faixa Hoje
Action: conferir claro/escuro e os dois livros de tinta antes das telas de produto
Constraints: #37 não implementa home, lançamentos, categorias nem auth; Roboto; sem Ambtec/Stolz; code-first

Memorable moment: a banda Hoje em largura total, duas tintas no mesmo quadrado, o resto do mês como grade.

Unresolved: hex finais de gasto vs carimbo do dia; rampa exata do tema escuro; raios e type scale em rem.

## Direction contract

THESIS: O mês na parede é o relógio honesto — hoje pintado, gasto e receita em tintas distintas. Recusa o dashboard mint (cards, donut, lista mista) e o internet banking cinza.

OWN-WORLD: Papel `#f4efe6`, ink `#1c1916`, carimbo `#c43c2c`, esferográfica `#2a4d8f`, filete `#d9d0c4`. Roboto tabular. Plano, grade de células, só o selecionado em cor cheia.

STORY: Quem entra entende que o sistema tem um hoje, dois livros e nenhum fluxo misturado, e pode conferir os tokens.

FIRST VIEWPORT: Shell com cabeçalho de mês pintado; faixa Hoje full-width (duas tintas); abaixo rampa, type, botões e campos. Notebook primeiro.

FORM: Calendário de parede (5/7 na lista grounded). Seed key `5ce0a996`.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
