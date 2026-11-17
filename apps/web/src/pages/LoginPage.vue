<script lang="ts">
import BrandLogoAtom from '@/shared/components/atoms/BrandLogoAtom.vue';
import { defineComponent } from 'vue';
import LoginFormOrganism from '@/shared/components/organisms/LoginFormOrganism.vue';

function resolvePostLoginPath(redirect: unknown): string {
  if (
    typeof redirect === 'string'
    && redirect.startsWith('/')
    && !redirect.startsWith('//')
  ) {
    return redirect;
  }

  return '/';
}

export default defineComponent({
  components: { BrandLogoAtom, LoginFormOrganism },
  methods: {
    onSuccess(): void {
      void this.$router.replace(
        resolvePostLoginPath(this.$route.query.redirect),
      );
    },
  },
  name: 'LoginPage',
});
</script>

<template>
  <div class="login-page">
    <div class="login-column">
      <div class="login-brand">
        <BrandLogoAtom decorative :size="48" />
        <h1 class="fluxo30-title">Fluxo30</h1>
      </div>
      <LoginFormOrganism @success="onSuccess" />
    </div>
  </div>
</template>

<style scoped>
.login-brand {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-column {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 24rem;
  width: 100%;
}

.login-page {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100dvh;
  padding: 2rem 0.75rem;
}

.fluxo30-title {
  color: rgb(var(--v-theme-on-background));
  margin: 0;
  text-align: center;
}
</style>
