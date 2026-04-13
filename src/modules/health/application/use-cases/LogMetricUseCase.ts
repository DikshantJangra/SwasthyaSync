import { MetricRepository } from "../../domain/repositories/MetricRepository";
import { CreateMetricDTO } from "../validators/metric.validator";
import { EventBus } from "@/lib/events/EventBus";
import { MetricLoggedEvent } from "../../domain/events/MetricLoggedEvent";
import { MetricMapper } from "../mappers/metric.mapper";
import { MetricDTO } from "../dtos/metric.dto";

export class LogMetricUseCase {
  constructor(
    private metricRepository: MetricRepository,
    private eventBus: EventBus
  ) {}

  async execute(userId: string, data: CreateMetricDTO): Promise<MetricDTO> {
    // Logs a new metric for the user.
    // Request comes from UI via tRPC, we persist it, then emit an event for any side-effects.

    // Step 1: Save to DB via the repository
    const savedMetric = await this.metricRepository.save({
      userId,
      type: data.type,
      value: data.value,
      unit: data.unit,
      timestamp: new Date(),
    });

    // Step 2: Publish an event (subscribers can enqueue jobs, analytics, etc.)
    this.eventBus.publish(new MetricLoggedEvent({ metric: savedMetric }));

    // Step 3: Return DTO for the API response
    return MetricMapper.toDTO(savedMetric);
  }
}
