import { DrizzleMetricRepository } from "./infrastructure/repositories/DrizzleMetricRepository";
import { DrizzleMedicalRepository } from "./infrastructure/repositories/DrizzleMedicalRepository";
import { DrizzleFitnessRepository } from "../fitness/infrastructure/repositories/DrizzleFitnessRepository";

import { LogMetricUseCase } from "./application/use-cases/LogMetricUseCase";
import { GetMetricsUseCase } from "./application/use-cases/GetMetricsUseCase";
import { GetUnifiedPulseDashboardUseCase } from "./application/use-cases/GetUnifiedPulseDashboardUseCase";

import { eventBus } from "@/lib/events/EventBus";
import { addJob } from "@/lib/queue";
import type { HealthMetric } from "./domain/entities/Metric";

export const createHealthModule = () => {
  // Composition root for the health module.
  // This is the "wiring" file: pick real implementations and connect them together.

  // Repositories (DB)
  const metricRepository = new DrizzleMetricRepository();
  const medicalRepository = new DrizzleMedicalRepository();
  const fitnessRepository = new DrizzleFitnessRepository();

  // When a metric is logged, enqueue a background job for extra processing.
  eventBus.subscribe(
    "health.metric_logged",
    async (event: { payload: { metric: HealthMetric } }) => {
      const metric = event.payload.metric;

      await addJob("process-metric", {
        metricId: metric.id,
        userId: metric.userId,
        type: metric.type,
      });
    }
  );

  // Use-cases (called by the API layer)
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
