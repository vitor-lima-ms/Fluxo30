<script lang="ts">
import { defineComponent } from 'vue';

type SpecimenId = 'campo' | 'gasto' | 'primario' | 'receita';

function saoPauloPart(type: Intl.DateTimeFormatPartTypes): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
  }).formatToParts(new Date());

  return Number(parts.find((item) => item.type === type)?.value);
}

export default defineComponent({
  data() {
    const money = new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      style: 'currency',
    });
    const today = saoPauloPart('day');
    const month = saoPauloPart('month');
    const year = saoPauloPart('year');
    const daysInMonth = new Date(year, month, 0).getDate();

    return {
      emptyDays: Array.from(
        { length: daysInMonth },
        (_, index) => index + 1,
      ).filter((day) => day !== today),
      money,
      ramp: [
        { hex: '#1c1916', name: 'Ink' },
        { hex: '#3d362e', name: 'Sala' },
        { hex: '#d9d0c4', name: 'Filete' },
        { hex: '#ebe4d8', name: 'Papel baixo' },
        { hex: '#f4efe6', name: 'Papel' },
        { hex: '#f7f3ec', name: 'Papel alto' },
      ],
      selected: 'gasto' as SpecimenId,
      today,
      typeScale: [
        {
          className: 'fluxo30-display',
          sample: 'Novembro',
          token: 'Display 2rem/700',
        },
        {
          className: 'fluxo30-title',
          sample: 'Alimentação',
          token: 'Title 1.25rem/500',
        },
        {
          className: 'fluxo30-body',
          sample: 'Cada lançamento com valor, data e categoria.',
          token: 'Body 1rem/400',
        },
        {
          className: 'fluxo30-label',
          sample: 'Sintético',
          token: 'Label 0.75rem/500',
        },
        {
          className: 'fluxo30-figures',
          sample: money.format(1964.94),
          token: 'Figuras tabulares',
        },
      ],
    };
  },
  methods: {
    isSelected(id: SpecimenId): boolean {
      return this.selected === id;
    },
    selectSpecimen(id: SpecimenId): void {
      this.selected = id;
    },
  },
  name: 'DesignSystemPage',
});
</script>

<template>
  <v-container class="page" fluid>
    <h1 class="fluxo30-display">Hoje</h1>
    <p class="fluxo30-body intro">
      Espécimes sintéticos do sistema Calendário de parede. Não são lançamentos
      reais.
    </p>

    <section aria-labelledby="hoje-band-title" class="hoje-band">
      <h2 id="hoje-band-title" class="fluxo30-title">Dia {{ today }}</h2>
      <div class="hoje-split">
        <button
          class="book-cell"
          :class="{ decoded: isSelected('gasto') }"
          type="button"
          @click="selectSpecimen('gasto')"
        >
          <span class="fluxo30-label">Gasto</span>
          <span class="fluxo30-figures">{{ money.format(47.9) }}</span>
          <span class="fluxo30-label">Alimentação · sintético</span>
        </button>
        <button
          class="book-cell receita"
          :class="{ decoded: isSelected('receita') }"
          type="button"
          @click="selectSpecimen('receita')"
        >
          <span class="fluxo30-label">Receita</span>
          <span class="fluxo30-figures">{{ money.format(1200) }}</span>
          <span class="fluxo30-label">Salário · sintético</span>
        </button>
      </div>
    </section>

    <section aria-labelledby="grade-title" class="month-grid-section">
      <h2 id="grade-title" class="fluxo30-title">Resto do mês</h2>
      <div class="month-grid">
        <div
          v-for="day in emptyDays"
          :key="day"
          class="empty-cell fluxo30-label"
        >
          {{ day }}
        </div>
      </div>
    </section>

    <section aria-labelledby="rampa-title">
      <h2 id="rampa-title" class="fluxo30-title">Rampa de neutros</h2>
      <div class="ramp">
        <div v-for="step in ramp" :key="step.hex" class="ramp-step">
          <div class="ramp-swatch" :style="{ background: step.hex }" />
          <span class="fluxo30-label">{{ step.name }} {{ step.hex }}</span>
        </div>
      </div>
    </section>

    <section aria-labelledby="tipo-title">
      <h2 id="tipo-title" class="fluxo30-title">Tipo</h2>
      <ul class="type-list">
        <li v-for="row in typeScale" :key="row.token">
          <p :class="row.className">{{ row.sample }}</p>
          <p class="fluxo30-label">{{ row.token }}</p>
        </li>
      </ul>
    </section>

    <section aria-labelledby="controles-title">
      <h2 id="controles-title" class="fluxo30-title">Controles</h2>
      <div class="controls">
        <v-btn
          :class="{ decoded: isSelected('primario') }"
          color="primary"
          @click="selectSpecimen('primario')"
        >
          Guardar
        </v-btn>
        <v-btn variant="outlined">Cancelar</v-btn>
        <v-btn disabled>Desativado</v-btn>
      </div>
      <div class="destructive">
        <v-btn color="error">Excluir</v-btn>
      </div>
      <v-text-field
        :class="{ decoded: isSelected('campo') }"
        class="field"
        hide-details
        label="Descrição"
        model-value="Almoço · sintético"
        @focus="selectSpecimen('campo')"
      />
    </section>
  </v-container>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 72rem;
  padding-block: 2rem 4rem;
}

.intro {
  margin-block-start: 0.5rem;
}

h1,
h2,
.fluxo30-body,
.fluxo30-display,
.fluxo30-figures,
.fluxo30-label,
.fluxo30-title {
  color: rgb(var(--v-theme-on-surface));
}

.book-cell.decoded,
.book-cell.decoded .fluxo30-figures,
.book-cell.decoded .fluxo30-label {
  color: rgb(var(--v-theme-on-gasto));
}

.book-cell.receita.decoded,
.book-cell.receita.decoded .fluxo30-figures,
.book-cell.receita.decoded .fluxo30-label {
  color: rgb(var(--v-theme-on-receita));
}

h1,
h2 {
  margin-block-end: 0.5rem;
}

.hoje-band {
  width: 100%;
}

.hoje-split {
  display: grid;
  gap: 0;
  grid-template-columns: 1fr 1fr;
  width: 100%;
}

.book-cell {
  align-items: flex-start;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-filete));
  border-radius: 4px 0 0 4px;
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-height: 8rem;
  padding: 1.25rem 1.5rem;
  text-align: start;
}

.book-cell.receita {
  border-radius: 0 4px 4px 0;
}

.book-cell.decoded {
  background: rgb(var(--v-theme-gasto));
  border-color: rgb(var(--v-theme-gasto));
  color: rgb(var(--v-theme-on-gasto));
}

.book-cell.receita.decoded {
  background: rgb(var(--v-theme-receita));
  border-color: rgb(var(--v-theme-receita));
  color: rgb(var(--v-theme-on-receita));
}

.month-grid {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.empty-cell {
  align-items: flex-start;
  aspect-ratio: 1;
  border: 1px solid rgb(var(--v-theme-filete));
  border-radius: 4px;
  color: rgb(var(--v-theme-on-surface));
  display: flex;
  padding: 0.4rem;
}

.ramp {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.ramp-step {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ramp-swatch {
  aspect-ratio: 1.6;
  border: 1px solid rgb(var(--v-theme-filete));
  border-radius: 4px;
}

.type-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.destructive {
  margin-block: 2.5rem 1.5rem;
}

.field {
  max-width: 24rem;
}

@media (max-width: 720px) {
  .hoje-split,
  .ramp {
    grid-template-columns: 1fr 1fr;
  }

  .empty-cell {
    aspect-ratio: auto;
    min-height: 2.5rem;
  }

  .book-cell,
  .book-cell.receita {
    border-radius: 4px;
  }
}
</style>
