import type { Request, Response } from 'express';

export default class HealthCheckController {
  async healthCheck(_: Request, res: Response): Promise<Response> {
    return res.status(200).json({ health: true });
  }
}
