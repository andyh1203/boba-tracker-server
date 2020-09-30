import * as dotenv from "dotenv-safe";

if (process.env.NODE_ENv !== "production") {
  dotenv.config({ path: `${__dirname}/../../.env.development` });
}

export const MONGO_URL: string = String(process.env.MONGO_URL);
export const REDIS_URL: string = String(process.env.REDIS_URL);
export const PORT: string = String(process.env.PORT);
export const SESSION_SECRET: string = String(process.env.SESSION_SECRET);