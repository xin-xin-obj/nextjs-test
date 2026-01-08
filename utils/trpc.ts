import { initTRPC } from '@trpc/server';

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

const appRouter = router({
  greeting: publicProcedure.query(() => 'hello tRPC v10!'),
  hello: publicProcedure.query((ctx) => {
    console.log('Context:', ctx.session);
    return {
      message: 'hello world',
    };
  }),
});
export type AppRouter = typeof appRouter;
export default appRouter;