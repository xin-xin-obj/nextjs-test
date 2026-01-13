import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../server/trpc/app';

// 创建 tRPC React 客户端（带 hooks）
export const trpc = createTRPCReact<AppRouter>();
