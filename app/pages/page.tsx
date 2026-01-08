
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db, schema, } from "@/server/db";
import { drizzle } from 'drizzle-orm/mysql2';
import { auth } from "../../auth"
import { redirect } from "next/navigation";
import { trpcClient } from "@/utils/api";
// import { Form } from "@/components/ui/form"
export default async function Home() {
  // async function handleClick() {
    const users = await db.select().from(schema.users);
    console.log('Fetched users:', users);

    const session = await auth()
  console.log('Fetched session:', session)
  if (!session?.user) return redirect('/api/auth/signin')

  // }
  // const db2 = drizzle({ schema: {...schema.posts, ...schema.users} });
  // const users2 = await db2.query.users.findMany();
  // console.log('Fetched users 2222:', users2);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <form className="flex flex-col gap-4 w-full max-w-sm">

          <Input placeholder="Enter text here" />
          <Button variant="ghost" size="sm" className="font-bold">Click me</Button>
        </form>
        ----------
        {
          users.map(user => (
            <div key={user.id}>
              <p>{user.name}</p>
            </div>
          ))
        }
      </main>
    </div>
  );
}
