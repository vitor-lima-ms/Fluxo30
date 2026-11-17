<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import type ICredentials from '@/shared/types/ICredentials.ts';
import { useSessionStore } from '@/shared/stores/sessionStore.ts';
import { mapActions, mapState } from 'pinia';

interface ICelebrateBody {
  keys?: string[];
  message?: string;
}

interface ILoginErrorBody {
  message?: string;
  validation?: { body?: ICelebrateBody };
}

export default defineComponent({
  computed: {
    ...mapState(useSessionStore, ['isLoading']),
    canSubmit(): boolean {
      return this.isValid === true && !this.isLoading;
    },
  },
  data(): {
    credentials: ICredentials;
    emailErrors: string[];
    formError: string;
    isValid: boolean | null;
    passwordErrors: string[];
  } {
    return {
      credentials: { email: '', password: '' },
      emailErrors: [],
      formError: '',
      isValid: null,
      passwordErrors: [],
    };
  },
  emits: ['success'],
  methods: {
    ...mapActions(useSessionStore, ['login']),
    applyApiError(caughtError: unknown): void {
      if (!axios.isAxiosError(caughtError)) {
        this.formError = 'Não foi possível entrar. Tente novamente.';
        return;
      }

      const status = caughtError.response?.status;
      const data = caughtError.response?.data as ILoginErrorBody | undefined;

      if (status === 401) {
        this.formError = 'Credenciais inválidas';
        return;
      }

      if (status === 429) {
        this.formError =
          data?.message ?? 'Muitas tentativas. Tente novamente mais tarde.';
        return;
      }

      if (status === 422) {
        const keys = data?.validation?.body?.keys ?? [];
        const fieldMessage =
          data?.validation?.body?.message ?? data?.message ?? 'Dados inválidos';

        if (keys.includes('email')) {
          this.emailErrors = [fieldMessage];
        }

        if (keys.includes('password')) {
          this.passwordErrors = [fieldMessage];
        }

        if (this.emailErrors.length === 0 && this.passwordErrors.length === 0) {
          this.formError = fieldMessage;
        }

        return;
      }

      this.formError = 'Não foi possível entrar. Tente novamente.';
    },
    clearApiErrors(): void {
      this.emailErrors = [];
      this.formError = '';
      this.passwordErrors = [];
    },
    async onSubmit(): Promise<void> {
      if (!this.canSubmit) {
        return;
      }

      this.clearApiErrors();

      try {
        await this.login(this.credentials);
        this.$emit('success');
      } catch (caughtError) {
        this.applyApiError(caughtError);
      }
    },
  },
  name: 'LoginFormOrganism',
});
</script>

<template>
  <v-form
    v-model="isValid"
    class="login-form"
    validate-on="input"
    @submit.prevent="onSubmit"
  >
    <v-text-field
      v-model="credentials.email"
      autocomplete="email"
      :error-messages="emailErrors"
      hide-details="auto"
      inputmode="email"
      label="E-mail"
      name="email"
      :rules="['$required', '$email']"
      type="text"
      @update:model-value="emailErrors = []"
    />
    <v-text-field
      v-model="credentials.password"
      autocomplete="current-password"
      :error-messages="passwordErrors"
      hide-details="auto"
      label="Senha"
      name="password"
      :rules="['$required']"
      type="password"
      @update:model-value="passwordErrors = []"
    />
    <p v-if="formError" class="form-error fluxo30-body" role="alert">
      {{ formError }}
    </p>
    <v-btn
      :disabled="!canSubmit"
      color="primary"
      :loading="isLoading"
      type="submit"
    >
      Entrar
    </v-btn>
  </v-form>
</template>

<style scoped>
.form-error {
  color: rgb(var(--v-theme-error));
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
