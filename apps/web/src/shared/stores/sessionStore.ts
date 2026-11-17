import axios from 'axios';
import { defineStore } from 'pinia';
import errorHandler from '@/shared/utils/ErrorHandler.ts';
import type ICredentials from '@/shared/types/ICredentials.ts';
import type IError from '@/shared/types/IError.ts';
import type IUser from '@/shared/types/IUser.ts';
import UserService from '@/shared/services/UserService.ts';
import { computed, ref } from 'vue';

const userService = new UserService();

function emptyError(): IError {
  return { code: undefined, message: undefined, statusCode: undefined };
}

export const useSessionStore = defineStore('session', () => {
  const error = ref<IError>(emptyError());
  const isLoading = ref(false);
  const sessionResolved = ref(false);
  const user = ref<IUser | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  function clearSession(): void {
    error.value = emptyError();
    user.value = null;
  }

  async function fetchCurrentUser(): Promise<void> {
    isLoading.value = true;

    try {
      error.value = emptyError();
      user.value = await userService.fetchCurrentUser();
    } catch (caughtError) {
      user.value = null;

      if (!(
        axios.isAxiosError(caughtError) && caughtError.response?.status === 401
      )) {
        errorHandler(error.value, caughtError);
      }
    } finally {
      isLoading.value = false;
      sessionResolved.value = true;
    }
  }

  async function login(credentials: ICredentials): Promise<void> {
    isLoading.value = true;
    error.value = emptyError();

    try {
      await userService.login(credentials);
      await fetchCurrentUser();

      if (user.value === null) {
        throw new Error('Não foi possível entrar. Tente novamente.');
      }
    } catch (caughtError) {
      errorHandler(error.value, caughtError);
      throw caughtError;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout(): Promise<void> {
    try {
      await userService.logout();
    } catch {
      // Falha de rede no logout não deve prender a sessão local.
    }

    clearSession();

    const { default: router } = await import('@/shared/router/index.ts');

    await router.replace('/login');
  }

  return {
    clearSession,
    error,
    fetchCurrentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    sessionResolved,
    user,
  };
});
