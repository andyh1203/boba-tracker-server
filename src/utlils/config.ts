import * as dotenv from "dotenv";
dotenv.config();

let path;
switch (process.env.NODE_ENV) {
  case "production":
    path = `${__dirname}/../../.env.production`;
    break;
  default:
    path = `${__dirname}/../../.env.development`;
}
dotenv.config({ path });

export const MONGODB_URI: string = String(process.env.MONGODB_URI);
