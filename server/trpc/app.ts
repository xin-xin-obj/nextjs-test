import { router, publicProcedure } from './trpc'
import { userRouter } from './routers/user';
import { postRouter } from './routers/post';

// 主路由实例
export const appRouter = router({
  user: userRouter,
  post: postRouter,
  hello: publicProcedure
    .query(() => {
      return {
        greeting: `Hello`,
      }
    }),
  goodbye: publicProcedure.mutation(async () => {
    return {
      message: 'goodbye!',
    };
  }),
})

export type AppRouter = typeof appRouter