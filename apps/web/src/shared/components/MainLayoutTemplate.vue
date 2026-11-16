<script lang="ts">
import BrandLogoAtom from '@/shared/components/atoms/BrandLogoAtom.vue';
import { defineComponent } from 'vue';
import ThemeToggleMolecule from '@/shared/components/molecules/ThemeToggleMolecule.vue';

export default defineComponent({
  components: { BrandLogoAtom, ThemeToggleMolecule },
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
    <template #prepend>
      <BrandLogoAtom class="brand-logo" decorative :size="32" />
    </template>
    <v-app-bar-title class="fluxo30-title">Fluxo30</v-app-bar-title>
    <span class="fluxo30-label month-label">{{ capitalizedMonth }}</span>
    <ThemeToggleMolecule />
  </v-app-bar>
  <v-main>
    <router-view />
  </v-main>
</template>

<style scoped>
.brand-logo {
  margin-inline-start: 0.5rem;
}

.month-label {
  margin-inline-end: 0.75rem;
  text-transform: none;
}
</style>
