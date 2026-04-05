import { protectedProcedure, router } from '../trpc';
import { CreateMetricSchema } from '@/modules/health/application/validators/metric.validator';
import { healthModule } from '@/modules/health/health.composition';
import { logger } from '@/lib/logger';

export const healthRouter = router({
  getMetrics: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.session.user.id }, 'Fetching metrics via tRPC');
      return await healthModule.getMetricsUseCase.execute(ctx.session.user.id);
    } catch (error) {
      console.error('❌ tRPC getMetrics failed:', error);
      throw error;
    }
  }),

  // Master Pulse Dashboard Query
  getUnifiedPulse: protectedProcedure.query(async ({ ctx }) => {
    try {
      logger.info({ userId: ctx.session.user.id }, 'Fetching unified health pulse via tRPC');
      return await healthModule.getUnifiedPulseUseCase.execute(ctx.session.user.id);
    } catch (error) {
      console.error('❌ tRPC getUnifiedPulse failed:', error);
      throw error;
    }
  }),

  logMetric: protectedProcedure
    .input(CreateMetricSchema)
    .mutation(async ({ input, ctx }) => {
      logger.info({ userId: ctx.session.user.id, type: input.type }, 'Logging metric via tRPC');
      return await healthModule.logMetricUseCase.execute(ctx.session.user.id, input);
    }),
});
