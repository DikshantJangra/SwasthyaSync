import { MetricRepository } from "../../domain/repositories/MetricRepository";
import { MetricMapper } from "../mappers/metric.mapper";
import { MetricDTO } from "../dtos/metric.dto";

export class GetMetricsUseCase {
  constructor(private metricRepository: MetricRepository) {}

  async execute(userId: string): Promise<MetricDTO[]> {
    const metrics = await this.metricRepository.findByUserId(userId);
    return MetricMapper.toDTOs(metrics);
  }
}
