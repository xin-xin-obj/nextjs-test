import { auth } from '@/auth';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

/**
 * Creates context for an incoming request
 * @see https://trpc.nodejs.cn/docs/v11/context   上下文
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await auth();
  return {
    session,
    req: opts.req,  // 标准 Request 对象
  };
}
 
export type Context = Awaited<ReturnType<typeof createContext>>;