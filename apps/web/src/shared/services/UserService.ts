import BaseAxiosClient from '@/shared/services/BaseAxiosClient.ts';
import type ICredentials from '@/shared/types/ICredentials.ts';
import type IUser from '@/shared/types/IUser.ts';

const USER_PATH = '/api/v1/user';

export default class UserService extends BaseAxiosClient {
  async fetchCurrentUser(): Promise<IUser> {
    return this.get<IUser>(USER_PATH);
  }

  async login(credentials: ICredentials): Promise<void> {
    await this.post<void>(
      { email: credentials.email, password: credentials.password },
      `${USER_PATH}/login`,
    );
  }

  async logout(): Promise<void> {
    await this.post<void>({}, `${USER_PATH}/logout`);
  }
}
