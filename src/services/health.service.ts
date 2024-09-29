export class HealthService {
  public async healthCheckDatabase(): Promise<boolean> {
    return true;
  }
  public async healthCheckRedis(): Promise<boolean> {
    return true;
  }
}
