import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2"; // 选择的driver类型
import  * as schema  from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, {
    casing: 'snake_case',
});
console.log('Database connection established', db);
// const response = await db.select().from('users');
export { schema }