'use client';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db, schema} from "@/server/db";
import { drizzle } from 'drizzle-orm/mysql2';
import { auth } from "../auth"
import * as z from "zod";
import { userSelectSchema } from "@/server/db/schema";

const player = z.object({
  name: z.string(),
  age: z.number(),
})
type Player = z.infer<typeof player>
const parse:Player = player.parse({
  name: "John",
  age: 30,
})
console.log('验证parse', parse)
// import { Form } from "@/components/ui/form"
export default async function Home() {
  // async function handleClick() {
    const users = await db.select().from(schema.users);
    const rows = await db.select({ id: schema.users.id, name: schema.users.name }).from(schema.users).limit(1);

    // 使用 pick 只验证需要的字段
    const userPartialSchema = userSelectSchema.pick({ id: true, name: true })
    const parsed = userPartialSchema.parse(rows[0]) 
    console.log('Fetched user:', parsed.id, parsed.name);
  //   console.log('Fetched users:', users);

  //   const session = await auth()
  // console.log('Fetched session:', session)
  // if (!session?.user) return null
  // }
  // const db2 = drizzle({ schema: {...schema.posts, ...schema.users} });
  // const users2 = await db.query.users.findMany();
  // console.log('Fetched users 2222:', users2);
  //  const users2 = await db.query.users.findFirst({
  //   with: { posts: true }, // 管理post 表
  //  });
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <form className="flex flex-col gap-4 w-full max-w-sm">

          <Input placeholder="Enter text here" />
          <Button variant="ghost" size="sm" className="font-bold">Click me</Button>
        </form>
        
      </main>
    </div>
  );
}
