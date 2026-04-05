import { DrizzleMetricRepository } from "./infrastructure/repositories/DrizzleMetricRepository";
import { DrizzleMedicalRepository } from "./infrastructure/repositories/DrizzleMedicalRepository";
import { DrizzleFitnessRepository } from "../fitness/infrastructure/repositories/DrizzleFitnessRepository";

import { LogMetricUseCase } from "./application/use-cases/LogMetricUseCase";
import { GetMetricsUseCase } from "./application/use-cases/GetMetricsUseCase";
import { GetUnifiedPulseDashboardUseCase } from "./application/use-cases/GetUnifiedPulseDashboardUseCase";

import { eventBus } from "@/lib/events/EventBus";
import { addJob } from "@/lib/queue";

export const createHealthModule = () => {
  // Infrastructure
  const metricRepository = new DrizzleMetricRepository();
  const medicalRepository = new DrizzleMedicalRepository();
  const fitnessRepository = new DrizzleFitnessRepository();

  // Side Effects
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
  const getUnifiedPulseUseCase = new GetUnifiedPulseDashboardUseCase(
    fitnessRepository,
    metricRepository,
    medicalRepository
  );

  return {
    logMetricUseCase,
    getMetricsUseCase,
    getUnifiedPulseUseCase,
  };
};

export const healthModule = createHealthModule();
