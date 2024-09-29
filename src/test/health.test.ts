import request from "supertest";
import { App } from "../app";
import { HealthRoute } from "../routes/health.route";
import { jest, it, describe, afterAll } from "bun:test";

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
});

describe("Testing Health", () => {
  it("response should have the message 'healthy'", async () => {
    const healthRoute = new HealthRoute();
    const healthService = healthRoute.healthController.healthService;

    healthService.healthCheckDatabase = jest.fn().mockReturnValue(true);
    healthService.healthCheckRedis = jest.fn().mockReturnValue(true);

    const app = new App([healthRoute]);
    return request(app.getServer())
      .get(`${healthRoute.path}health`)
      .expect(200, {
        data: { database: "healthy", redis: "healthy" },
        message: "healthy",
      });
  });
  it("response should indicate unhealthy when one service is down", async () => {
    const healthRoute = new HealthRoute();
    const healthService = healthRoute.healthController.healthService;

    healthService.healthCheckDatabase = jest.fn().mockReturnValue(false);
    healthService.healthCheckRedis = jest.fn().mockReturnValue(true);

    const app = new App([healthRoute]);

    return request(app.getServer())
      .get(`${healthRoute.path}health`)
      .expect(503, {
        data: { database: "unhealthy", redis: "healthy" },
        message: "unhealthy",
      });
  });
});
