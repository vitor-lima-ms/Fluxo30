import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import type { Body, IBaseApiService } from './IBaseApiService';

function requestUrl(config: InternalAxiosRequestConfig | undefined): string {
  return config?.url ?? '';
}

function isSessionProbeGet(
  config: InternalAxiosRequestConfig | undefined,
): boolean {
  return (
    config?.method?.toLowerCase() === 'get'
    && /\/api\/v1\/user\/?$/.test(requestUrl(config))
  );
}

function isUserLoginPost(
  config: InternalAxiosRequestConfig | undefined,
): boolean {
  return (
    config?.method?.toLowerCase() === 'post'
    && requestUrl(config).includes('/api/v1/user/login')
  );
}

async function handleUnauthorized(): Promise<void> {
  const { useSessionStore } = await import('@/shared/stores/sessionStore.ts');
  const { default: router } = await import('@/shared/router/index.ts');
  const sessionStore = useSessionStore();

  sessionStore.clearSession();

  if (
    !sessionStore.sessionResolved
    || router.currentRoute.value.matched.some((record) => record.meta.public)
  ) {
    return;
  }

  const redirect = router.currentRoute.value.fullPath;

  await router.replace({
    path: '/login',
    query:
      redirect.startsWith('/') && !redirect.startsWith('//') ?
        { redirect }
      : {},
  });
}

export default class BaseAxiosClient implements IBaseApiService {
  public readonly axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });

    this.axiosClient.interceptors.response.use(
      (response) => response,
      async (error: unknown) => {
        if (
          axios.isAxiosError(error)
          && error.response?.status === 401
          && !isUserLoginPost(error.config)
          && !isSessionProbeGet(error.config)
        ) {
          await handleUnauthorized();
        }

        return Promise.reject(error);
      },
    );
  }

  async delete<T = void>(uri: string): Promise<T> {
    return (await this.axiosClient.delete<T>(uri)).data;
  }

  async get<T = void>(uri: string): Promise<T> {
    return (await this.axiosClient.get<T>(uri)).data;
  }

  async patch<T = void>(body: Body, uri: string): Promise<T> {
    return (await this.axiosClient.patch<T>(uri, body)).data;
  }

  async post<T = void>(body: Body, uri: string): Promise<T> {
    return (await this.axiosClient.post<T>(uri, body)).data;
  }

  async put<T = void>(body: Body, uri: string): Promise<T> {
    return (await this.axiosClient.put<T>(uri, body)).data;
  }
}
