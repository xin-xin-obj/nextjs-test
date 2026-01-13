import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/trpc/app';
import { NextRequest } from 'next/server';
import { createContext } from '@/server/trpc/context';
// 适配器
const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: req,
    router: appRouter,
    createContext,
  });
};

export const GET = handler;
export const POST = handler;