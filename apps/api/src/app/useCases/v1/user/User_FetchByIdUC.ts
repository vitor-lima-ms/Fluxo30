import { inject, injectable } from 'tsyringe';

import type { IPGUserRepository } from '#app/repositories/v1/database/main/user/PGUserRepository';

interface IInput {
  id: string;
}
interface IOutput {
  firstName: string;
  lastName: string;
  email: string;
}

@injectable()
export default class User_FetchByIdUC {
  constructor(
    @inject('PGUserRepository')
    private readonly pgUserRepository: IPGUserRepository,
  ) {}

  public async execute({ id }: IInput): Promise<IOutput> {
    return await this.pgUserRepository.fetchUserById({ id });
  }
}
