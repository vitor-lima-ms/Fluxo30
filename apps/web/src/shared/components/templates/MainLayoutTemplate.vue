<script lang="ts">
import BrandLogoAtom from '@/shared/components/atoms/BrandLogoAtom.vue';
import { defineComponent } from 'vue';
import ThemeToggleMolecule from '@/shared/components/molecules/ThemeToggleMolecule.vue';
import { useSessionStore } from '@/shared/stores/sessionStore.ts';
import { mapActions, mapState } from 'pinia';

export default defineComponent({
  components: { BrandLogoAtom, ThemeToggleMolecule },
  computed: {
    ...mapState(useSessionStore, ['user']),
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
    firstName(): string {
      return this.user?.firstName ?? '';
    },
  },
  methods: { ...mapActions(useSessionStore, ['logout']) },
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
    <span class="fluxo30-label user-name">{{ firstName }}</span>
    <v-btn aria-label="Sair" class="logout-btn" variant="text" @click="logout">
      Sair
    </v-btn>
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

.logout-btn {
  color: rgb(var(--v-theme-on-primary));
}

.month-label,
.user-name {
  margin-inline-end: 0.75rem;
  text-transform: none;
}
</style>
