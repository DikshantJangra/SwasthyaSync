import { DrizzleMetricRepository } from "./infrastructure/repositories/DrizzleMetricRepository";
import { LogMetricUseCase } from "./application/use-cases/LogMetricUseCase";
import { GetMetricsUseCase } from "./application/use-cases/GetMetricsUseCase";
import { eventBus } from "@/lib/events/EventBus";
import { addJob } from "@/lib/queue";
import { MetricLoggedEvent } from "./domain/events/MetricLoggedEvent";

export const createHealthModule = () => {
  // Infrastructure
  const metricRepository = new DrizzleMetricRepository();

  // Wire up Domain Events to Infrastructure side-effects (BullMQ)
  eventBus.subscribe('health.metric_logged', async (event: any) => {
    const { metric } = event.payload;
    await addJob('process-metric', { 
        metricId: metric.id, 
        userId: metric.userId, 
        type: metric.type 
    });
  });

  // Application Use Cases
  const logMetricUseCase = new LogMetricUseCase(metricRepository, eventBus);
  const getMetricsUseCase = new GetMetricsUseCase(metricRepository);

  return {
    logMetricUseCase,
    getMetricsUseCase,
  };
};

// Singleton instance of the module
export const healthModule = createHealthModule();
