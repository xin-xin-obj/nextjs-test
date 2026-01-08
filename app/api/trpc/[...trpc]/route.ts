 import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { NextRequest } from 'next/server';
import appRouter from '@/utils/trpc';
import { auth } from '@/auth';


const handler = (opts: NextRequest) => fetchRequestHandler({
  endpoint: '/api/trpc', // 路由url
    req: opts,
    router: appRouter, // 上面定义的
    createContext: async() => {
      const session = await auth()
      return { session }
    }
});
export { handler as GET, handler as POST };
