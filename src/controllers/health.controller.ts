import { type NextFunction, type Request, type Response } from "express";
import { HealthService } from "../services/health.service";

export class HealthController {
  constructor(public healthService: HealthService) {}

  public healthCheck = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dbHealth = await this.healthService.healthCheckDatabase();
      const redisHealth = await this.healthService.healthCheckRedis();
      const allHealthy = dbHealth && redisHealth;

      const healthData = {
        database: dbHealth ? "healthy" : "unhealthy",
        redis: redisHealth ? "healthy" : "unhealthy",
      };
      
      if (allHealthy) {
        res.status(200).json({ data: healthData, message: "healthy" });
      } else {
        res.status(503).json({ data: healthData, message: "unhealthy" });
      }
    } catch (error) {
      next(error);
    }
  };
}
