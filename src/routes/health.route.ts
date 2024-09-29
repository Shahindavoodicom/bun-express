import { Router } from "express";
import { HealthController } from "../controllers/health.controller";
import { HealthService } from "../services/health.service";
import type { Routes } from "../interfaces/routes.interface";

export class HealthRoute implements Routes {
  public path = "/";
  public router = Router();
  public healthController: HealthController;

  constructor() {
    const healthService = new HealthService();
    this.healthController = new HealthController(healthService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}health`, this.healthController.healthCheck);
  }
}