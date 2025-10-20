import { Request, Response } from 'express'

export class HealthController {
  /**
   * Get health status
   */
  getHealth(req: Request, res: Response): void {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  }
}
