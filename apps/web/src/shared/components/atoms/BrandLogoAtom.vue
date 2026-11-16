<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  computed: {
    accessibleAlt(): string {
      return this.decorative ? '' : this.alt;
    },
    sizePx(): string {
      return `${this.size}px`;
    },
  },
  name: 'BrandLogoAtom',
  props: {
    alt: { default: 'Logo do Fluxo30', type: String },
    decorative: { default: false, type: Boolean },
    size: { default: 32, type: Number },
  },
});
</script>

<template>
  <img
    :alt="accessibleAlt"
    :aria-hidden="decorative ? 'true' : undefined"
    class="brand-logo-atom"
    :height="size"
    src="/logo-fluxo30-icon.png"
    :style="{ height: sizePx, width: sizePx }"
    :width="size"
  />
</template>

<style scoped>
.brand-logo-atom {
  border: 1px solid rgba(28, 25, 22, 0.25);
  border-radius: var(--fluxo30-radius, 4px);
  display: block;
  flex-shrink: 0;
  object-fit: cover;
}
</style>
