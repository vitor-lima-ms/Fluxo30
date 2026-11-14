import { compare } from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import jwt from 'jsonwebtoken';

import AppError from '#app/errors/AppError';
import AppHttpError from '#app/errors/AppHttpError';
import type { IPGUserRepository } from '#app/repositories/v1/database/main/user/PGUserRepository';

interface IInput {
  email: string;
  password: string;
}
interface IOutput {
  accessToken: string;
}

@injectable()
export default class User_LoginUC {
  constructor(
    @inject('PGUserRepository')
    private readonly pgUserRepository: IPGUserRepository,
  ) {}

  public async execute({ email, password }: IInput): Promise<IOutput> {
    const jwtSecret = process.env['JWT_SECRET'];
    const jwtExpiresInRaw = process.env['JWT_EXPIRES_IN'];
    const jwtExpiresIn = Number(jwtExpiresInRaw);
    if (
      !jwtSecret
      || !jwtExpiresInRaw
      || !Number.isInteger(jwtExpiresIn)
      || jwtExpiresIn < 1
    ) {
      throw new AppError({
        errorCode: 'JWT_UNDEFINED',
        message: 'JWT Secret ou JWT Expires In não foi definido',
      });
    }

    const existingUser = await this.pgUserRepository.fetchUserForLogin({
      email,
    });
    const isPasswordValid =
      existingUser !== null
      && (await compare(password, existingUser.passwordHash));
    if (!isPasswordValid) {
      throw new AppHttpError({
        errorCode: 'INVALID_CREDENTIALS',
        message: 'Credenciais inválidas',
        statusCode: 401,
        errors: undefined,
        internalMessage: undefined,
      });
    }

    const accessToken = jwt.sign(
      { email: existingUser.email, sub: existingUser.id },
      jwtSecret,
      { expiresIn: jwtExpiresIn },
    );

    return { accessToken };
  }
}
