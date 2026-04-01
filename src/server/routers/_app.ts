import { publicProcedure, router } from '../trpc';
import { healthRouter } from './health';

export const appRouter = router({
  health: healthRouter,
  healthCheck: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'SwasthyaSync API is up and running!',
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
