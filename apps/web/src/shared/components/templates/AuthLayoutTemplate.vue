<script lang="ts">
import { defineComponent } from 'vue';
import ThemeToggleMolecule from '@/shared/components/molecules/ThemeToggleMolecule.vue';

export default defineComponent({
  components: { ThemeToggleMolecule },
  name: 'AuthLayoutTemplate',
});
</script>

<template>
  <div class="auth-layout">
    <div class="theme-toggle">
      <ThemeToggleMolecule />
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100%;
  position: relative;
}

.theme-toggle {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  z-index: 1;
}
</style>
