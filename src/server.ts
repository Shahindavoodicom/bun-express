import { App } from "./app";
import { HealthRoute } from "./routes/health.route";
import { ValidateEnv } from "./utils/validateEnv";

ValidateEnv();

const app = new App([new HealthRoute()]);

app.listen();
