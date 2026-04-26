import { protectedProcedure, router } from '../trpc';
import { CreateMetricSchema } from '@/modules/health/application/validators/metric.validator';
import { healthModule } from '@/modules/health/health.composition';
import { logger } from '@/lib/logger';

export const healthRouter = router({
  // API layer for health-related endpoints.

  getMetrics: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.session.user.id }, 'Fetching metrics via tRPC');

      // Delegate to the use-case (application layer).
      return await healthModule.getMetricsUseCase.execute(ctx.session.user.id);
    } catch (error) {
      console.error('tRPC getMetrics failed:', error);
      throw error;
    }
  }),

  getTodayHydration: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.session.user.id }, 'Fetching today hydration via tRPC');

      return await healthModule.getTodayHydrationUseCase.execute(ctx.session.user.id);
    } catch (error) {
      console.error('tRPC getTodayHydration failed:', error);
      throw error;
    }
  }),

  getHealthInsights: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.session.user.id }, 'Fetching health insights via tRPC');

      // Delegate to the new use-case (application layer).
      return await healthModule.getHealthInsightsUseCase.execute(ctx.session.user.id);
    } catch (error) {
      console.error('tRPC getHealthInsights failed:', error);
      throw error;
    }
  }),

  // Master Pulse Dashboard Query
  getUnifiedPulse: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.session.user.id }, 'Fetching unified health pulse via tRPC');

      // This use-case aggregates data from multiple sources.
      return await healthModule.getUnifiedPulseUseCase.execute(ctx.session.user.id);
    } catch (error) {
      console.error('tRPC getUnifiedPulse failed:', error);
      throw error;
    }
  }),

  logMetric: protectedProcedure
    .input(CreateMetricSchema)
    .mutation(async ({ input, ctx }) => {
      logger.info({ userId: ctx.session.user.id, type: input.type }, 'Logging metric via tRPC');

      // Input is validated by the zod schema above, then we persist via the use-case.
      return await healthModule.logMetricUseCase.execute(ctx.session.user.id, input);
    }),
});
