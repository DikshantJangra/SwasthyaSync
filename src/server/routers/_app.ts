import { publicProcedure, router } from '../trpc';
import { healthRouter } from './health';
import { fitnessRouter } from './fitness';

export const appRouter = router({
  health: healthRouter,
  fitness: fitnessRouter,
  healthCheck: publicProcedure.query(() => {
    return {
      status: 'ok',
      message: 'SwasthyaSync API is up and running!',
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
