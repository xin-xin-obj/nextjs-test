import { defineConfig } from "drizzle-kit";
import "dotenv/config";
export default defineConfig({
  dialect: "mysql", //选 MySQL 这套 SQL 规则
  schema: "./server/db/schema.ts",
  out: "./drizzle",
  breakpoints: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  //     dbCredentials: {
  //       host: "host",
  //       port: 3306,
  //       user: "user",
  //       password: "password",
  //       database: "dbname",
  //     ssl: "...", // can be: string | SslOptions (ssl options from mysql2 package)
  //   },
  strict: true,
  verbose: true,
});