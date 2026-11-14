import { container } from 'tsyringe';
import type { Request, Response } from 'express';

import { cookieOptions } from '#infra/http/utils/cookieOptions';
import User_FetchByIdUC from '#app/useCases/v1/user/User_FetchByIdUC';
import User_LoginUC from '#app/useCases/v1/user/User_LoginUC';

export default class UserController {
  public async fetchById(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(User_FetchByIdUC);

    return res.status(200).json(await useCase.execute({ id: req.user.id }));
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(User_LoginUC);
    const { accessToken } = await useCase.execute(req.body);

    res.cookie('accessToken', accessToken, cookieOptions);

    return res.status(204).send();
  }

  public async logout(_: Request, res: Response): Promise<Response> {
    res.clearCookie('accessToken', cookieOptions);

    return res.status(204).send();
  }
}
