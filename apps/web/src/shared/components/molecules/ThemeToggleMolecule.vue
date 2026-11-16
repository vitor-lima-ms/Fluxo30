<script lang="ts">
import { defineComponent } from 'vue';
import { mdiWeatherNight, mdiWeatherSunny } from '@mdi/js';

export default defineComponent({
  computed: {
    icon(): string {
      return this.isDark ? mdiWeatherSunny : mdiWeatherNight;
    },
    isDark(): boolean {
      return this.$vuetify.theme.global.name === 'fluxo30Dark';
    },
    label(): string {
      return this.isDark ? 'Ativar tema claro' : 'Ativar tema escuro';
    },
  },
  methods: {
    toggleTheme(): void {
      this.$vuetify.theme.change(this.isDark ? 'fluxo30Light' : 'fluxo30Dark');
    },
  },
  name: 'ThemeToggleMolecule',
});
</script>

<template>
  <v-btn :aria-label="label" :icon="icon" variant="text" @click="toggleTheme" />
</template>
