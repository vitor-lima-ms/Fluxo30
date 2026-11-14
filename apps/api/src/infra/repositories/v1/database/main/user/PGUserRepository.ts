import { DataSource } from 'typeorm';
import { inject, injectable } from 'tsyringe';

import AppError from '#app/errors/AppError';
import AppHttpError from '#app/errors/AppHttpError';
import type {
  IFetchUserByIdInput,
  IFetchUserByIdOutput,
  IFetchUserForLoginInput,
  IFetchUserForLoginOutput,
  IPGUserRepository,
} from '#app/repositories/v1/database/main/user/PGUserRepository';
import PGFluxo30DataSource from '#infra/database/typeorm/PGFluxo30DataSource';

@injectable()
export default class PGUserRepository implements IPGUserRepository {
  private readonly pgConnection: DataSource;

  constructor(
    @inject('PGFluxo30DataSource') pgFluxo30DataSource: PGFluxo30DataSource,
  ) {
    this.pgConnection = pgFluxo30DataSource.getConnection();
  }

  public async fetchUserById({
    id,
  }: IFetchUserByIdInput): Promise<IFetchUserByIdOutput> {
    try {
      const qb = this.pgConnection.createQueryBuilder();
      qb.select('u.first_name', 'firstName');
      qb.addSelect('u.last_name', 'lastName');
      qb.addSelect('u.email', 'email');
      qb.from('users', 'u');
      qb.where('u.id = :id', { id });
      qb.andWhere('u.deleted_at IS NULL');
      const existingUser = await qb.getRawOne<IFetchUserByIdOutput>();
      if (!existingUser) {
        throw new AppHttpError({
          errorCode: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado',
          statusCode: 404,
          errors: undefined,
          internalMessage: undefined,
        });
      }

      return existingUser;
    } catch (error) {
      if (error instanceof AppError || error instanceof AppHttpError)
        throw error;

      throw new AppError({
        errorCode: 'ERROR_ON_FETCH_BY_ID',
        message: 'Erro ao buscar o usuário por id',
        internalMessage: error,
      });
    }
  }

  public async fetchUserForLogin({
    email,
  }: IFetchUserForLoginInput): Promise<IFetchUserForLoginOutput | null> {
    try {
      const qb = this.pgConnection.createQueryBuilder();
      qb.select('u.id', 'id');
      qb.addSelect('u.email', 'email');
      qb.addSelect('u.password_hash', 'passwordHash');
      qb.from('users', 'u');
      qb.where('lower(u.email) = lower(:email)', { email });
      qb.andWhere('u.deleted_at IS NULL');

      return (await qb.getRawOne<IFetchUserForLoginOutput>()) ?? null;
    } catch (error) {
      if (error instanceof AppError || error instanceof AppHttpError)
        throw error;

      throw new AppError({
        errorCode: 'ERROR_ON_FETCH_FOR_LOGIN',
        message: 'Erro ao buscar o usuário para o login',
        internalMessage: error,
      });
    }
  }
}
