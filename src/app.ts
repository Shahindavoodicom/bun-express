import express, { type Express } from "express";
import type { Routes } from "./interfaces/routes.interface";
import cors from "cors";
import { CREDENTIALS, LOG_FORMAT, ORIGIN } from "./config";
import morgan from "morgan";
import hpp from "hpp";
import { stream } from "./utils/logger";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { ErrorMiddleware } from "./middlewares/error.middleware";

export class App {
    public app: Express;
    public env: string;
    public port: string | number;

    constructor(routes: Routes[]) {
        this.app = express();
        this.env = process.env.NODE_ENV || "development";
        this.port = process.env.PORT || 3000;
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(morgan(LOG_FORMAT, { stream }));
        this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use("/", route.router);
        });
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: { 
                info: {
                    title: "REST API",
                    version: "1.0.0",
                    description: "Example docs",
                },
            },
            apis: ["swagger.yaml"],
        };

        const swaggerSpec = swaggerJSDoc(options);
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    private initializeErrorHandling() {
        this.app.use(ErrorMiddleware);
    }
    
}