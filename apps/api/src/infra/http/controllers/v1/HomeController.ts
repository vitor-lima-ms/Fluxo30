import { container } from 'tsyringe';
import Home_FetchSummaryUC from '#app/useCases/v1/home/Home_FetchSummaryUC';
import type { Request, Response } from 'express';

export default class HomeController {
  public async fetchSummary(req: Request, res: Response): Promise<Response> {
    const useCase = container.resolve(Home_FetchSummaryUC);

    return res.status(200).json(await useCase.execute({ userId: req.user.id }));
  }
}
