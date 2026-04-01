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
    // 1. Persist Entity
    const metric = await this.metricRepository.save({
      userId,
      type: data.type,
      value: data.value,
      unit: data.unit,
      timestamp: new Date(),
    });

    // 2. Publish Domain Event (Side effects handled by subscribers)
    this.eventBus.publish(new MetricLoggedEvent({ metric }));

    // 3. Return DTO
    return MetricMapper.toDTO(metric);
  }
}
