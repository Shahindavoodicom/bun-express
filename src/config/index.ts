import { config } from "dotenv";
config({ path: ".env" });

export const PORT = process.env.PORT || 3000;
export const ORIGIN = process.env.ORIGIN || "http://localhost:3000";
export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const LOG_DIR = process.env.LOG_DIR || "../logs";
export const LOG_FORMAT = process.env.LOG_FORMAT || "dev";
