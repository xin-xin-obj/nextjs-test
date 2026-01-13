import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';
import { EventEmitter, on } from 'events';
// 创建路由实例
const t = initTRPC.context<Context>().create({
  transformer: superjson, // 自动转换数据，如 Date 转为字符串
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

/**
 * 日志中间件 - 记录请求信息和耗时
 */
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  console.log(`[TRPC] ${type} ${path} - ${duration}ms - ${result.ok ? '成功' : '失败'}`);

  return result;
});

/**
 * 计时中间件 - 检测慢请求
 */
const timingMiddleware = t.middleware(async ({ path, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;

  // 超过 1 秒的请求警告
  if (duration > 1000) {
    console.warn(`[TRPC] 慢请求警告: ${path} 耗时 ${duration}ms`);
  }

  return result;
});

/**
 * 授权中间件 - 检查用户是否登录
 */
const authMiddleware = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: '请先登录',
    });
  }

  return next({
    ctx: {
      // 确保 session 和 user 非空
      session: ctx.session,
      user: ctx.session.user,
    },
  });
});

/**
 * 角色权限中间件 - 检查用户角色
 */
const createRoleMiddleware = (allowedRoles: string[]) => {
  return t.middleware(async ({ ctx, next }) => {
    const userRole = (ctx.session?.user as any)?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: '权限不足',
      });
    }

    return next();
  });
};

// 公开接口 - 带日志
export const publicProcedure = t.procedure
  .use(loggerMiddleware);

// 需要登录的接口 - 带日志 + 授权
export const protectedProcedure = t.procedure
  .use(loggerMiddleware)
  .use(timingMiddleware)
  .use(authMiddleware);

// 管理员接口 - 带日志 + 授权 + 角色检查
export const adminProcedure = t.procedure
  .use(loggerMiddleware)
  .use(timingMiddleware)
  .use(authMiddleware)
  .use(createRoleMiddleware(['admin']));


//  SSE 接口 - 带日志 订阅
const ee = new EventEmitter();
export const appRouter = router({
  onPostAdd: publicProcedure.subscription(async function* (opts) {
    // listen for new events
    for await (const [data] of on(ee, 'add', {
      // Passing the AbortSignal from the request automatically cancels the event emitter when the request is aborted
      signal: opts.signal,
    })) {
      const post = data
      yield post;
    }
  }),
});

