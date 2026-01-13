import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2/promise";
import * as schema from "./schema";

// 创建 mysql2 连接池
const pool = createPool(process.env.DATABASE_URL!);

export const db = drizzle(pool, {
    schema,
    casing: 'snake_case',
    mode: "default",
});
console.log('Database connection established', db);
// const response = await db.select().from('users');
export { schema }