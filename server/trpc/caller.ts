import { auth } from '@/auth';
import { createCallerFactory } from './trpc';
import { appRouter } from './app';

const createCaller = createCallerFactory(appRouter);

/**
 * 获取当前登录用户的 caller
 * 用于 Server Component、Server Action、API Route 中调用 TRPC
 */
export async function getServerCaller() {
  const session = await auth();
  return createCaller({
    session,
    req: null as any,
  });
}

/**
 * 获取公开接口的 caller（无需登录）
 */
export function getPublicCaller() {
  return createCaller({
    session: null,
    req: null as any,
  });
}

/**
 * 创建指定用户的 caller（用于后台任务、定时任务等）
 */
export function createUserCaller(user: {
  id: string;
  email: string;
  name?: string;
  role?: string;
}) {
  return createCaller({
    session: {
      user,
      expires: new Date(Date.now() + 86400000).toISOString(),
    },
    req: null as any,
  });
}