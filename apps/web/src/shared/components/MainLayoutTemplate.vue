<script lang="ts">
import { defineComponent } from 'vue';
import ThemeToggleMolecule from '@/shared/components/molecules/ThemeToggleMolecule.vue';

export default defineComponent({
  components: { ThemeToggleMolecule },
  computed: {
    capitalizedMonth(): string {
      const monthLabel = new Intl.DateTimeFormat('pt-BR', {
        month: 'long',
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
      }).format(new Date());

      return (
        monthLabel.charAt(0).toLocaleUpperCase('pt-BR') + monthLabel.slice(1)
      );
    },
  },
  name: 'MainLayoutTemplate',
});
</script>

<template>
  <v-app-bar color="primary" elevation="0" height="64">
    <v-app-bar-title class="fluxo30-title">Fluxo30</v-app-bar-title>
    <v-spacer />
    <span class="fluxo30-label month-label">{{ capitalizedMonth }}</span>
    <ThemeToggleMolecule />
  </v-app-bar>
  <v-main>
    <router-view />
  </v-main>
</template>

<style scoped>
.month-label {
  margin-inline-end: 0.75rem;
  text-transform: none;
}
</style>
